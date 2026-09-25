import { v7 } from "uuid"
import axios from "axios"
import jwt from 'jsonwebtoken'
import qrcode from 'qrcode'
import fs from 'fs'
import moment from "moment"
import { json_reply,generate_jwt } from "./dont_waste_time.js"
import { user_cart,order,trasaction,cart_items} from "../model/db.js"
const CheckOut = async (res,data) => {
const get_cart = await user_cart.findOne({'id':Number(data.id),'IsLocked':false})
console.log(get_cart)
if(get_cart == null){
     json_reply(res,get_cart)
}else{
let total_value = 0
const get_cart_items = await cart_items.find({'cart_id':get_cart.cart_id})
get_cart_items.forEach((r)=>{
  total_value += r.quantity * r.price
})
await axios.post(`${process.env.RPC_URL}`,{"jsonrpc":"2.0","id":"0","method":"create_address","params":{"account_index":0,"label":"new-subs","count":1}})
.then(async(r)=>{ 
await axios.post(`${process.env.RPC_URL}`,{"jsonrpc":"2.0","id":"0","method":"store"}).then(async()=>{

let to =await generate_jwt('3h')
let create_tx = await trasaction.insertOne({'status':"waitingforpayment",'cart_id':get_cart.cart_id.toString(),"amount":total_value.toFixed(5),"expiration_token":to,"index":r.data.result.address_index,'address':r.data.result.address})
const order_id = v7()

let create_order = await order.insertOne({'user_id':data.id,'cart_id':get_cart.cart_id,'status':'waiting for payment','order_id':order_id})
fs.access('../images',(err)=>{
  if(err){
    fs.mkdir('../images',(err)=>{
     if(err){
      console.log(err)
     }else{
      console.log("dir created!")
     }
    })
  }else{
    console.log("already exists!")
  }
})





qrcode.toFile(`./images/${get_cart.cart_id.toString()}.png`,`monero:${r.data.result.address}?tx_amount=${total_value.toFixed(5)}`).then(async(err,r)=>{
if(err){
      json_reply(res,'error generating the Qr code')
}else{
    await get_cart.updateOne({'IsLocked':true})

  console.log("done")
const get_tx = await trasaction.findOne({'cart_id':get_cart.cart_id})
console.log(get_tx)
let jwt_decode =await jwt.decode(get_tx.expiration_token)
console.log(jwt_decode)
let date1 = new Date(jwt_decode.exp*1000)

let start_time = moment(new Date())
let end_time = moment(date1)


json_reply(res,{'order_id':order_id,'cart':get_cart.cart_id,'remaining_time':end_time.from(start_time,true),'payment_address':create_tx.address,'total':total_value.toFixed(5)})
}
})

}).catch((err)=>{
    console.log(err)
    json_reply(res,err)
})

    
}).catch((err)=>{
json_reply(res,err)
})

}  
}

const get_left_time = async (req,res) => {
const get_tx = await trasaction.findOne({'cart_id':req.params.cart})
const get_order = await order.findOne({'cart_id':get_tx.cart_id})
console.log(req.params.cart)
console.log("yeak")
if(get_tx == null){
  json_reply(res,'no such tx!')
}else{
await jwt.verify(get_tx.expiration_token,process.env.secret_key,async(err,token)=>{
  if(err){
    console.log(err)
    json_reply(res,null)
  }
  else{
 if(get_tx.status=='paid'){
  json_reply(res,true)
 }else{

  const get_items = await cart_items.find({'cart_id':get_tx.cart_id})
  await get_tx.updateOne({$inc:{'refresh_times':1}})
  let total =0
  get_items.forEach((r)=>{
  total += r.price * r.quantity
  })

     let jwt_decode = await jwt.decode(get_tx.expiration_token)
      let start_time = moment(new Date())  
      let end_time = moment(new Date(jwt_decode.exp*1000))

     json_reply(res,{'order_id':get_order.order_id,'paid':false,'refresh_times':get_tx.refresh_times+1,'cart':get_tx.cart_id,'remaining_time':end_time.from(start_time,true),'payment_address':get_tx.address,'total':total.toFixed(5)})
}
}})}  
}

const get_orders = async(req,res) =>{
  const get_orders = await order.find({'user_id':req.params.id,$or:[
    {'status':'waiting for payment'},
    {'status':'packaging'},
    {'status':'sent out to delivery'}
  ]})
  if(get_orders == null){
  json_reply(res,null)
  }else{
  json_reply(res,get_orders)
  }
}

const get_specific_tx = async(req,res)=>{
  console.log("rger")
const get_tx = await trasaction.findOne({'cart_id':req.params.id})
const get_order = await order.findOne({'cart_id':req.params.id})
console.log(get_tx)
if(get_tx == null){
  json_reply(res,null)
}else{
  const get_cart_items = await cart_items.find({'cart_id':req.params.id.trim()})
  if(get_tx.status =='waitingforpayment'){
  let total_value =0
  get_cart_items.forEach((r)=>{
  total_value += r.quantity * r.price
})
console.log(total_value)
let jwt_decode =await jwt.decode(get_tx.expiration_token)
let date1 = new Date(jwt_decode.exp*1000)

let start_time = moment(new Date())
let end_time = moment(date1)

  json_reply(res,{'cart':get_tx.cart_id,'remaining_time':end_time.from(start_time,true),'payment_address':get_tx.address,'total':total_value.toFixed(5)})
}

if(get_order.status=='packaging'){
json_reply(res,{'message':'order is still under preparing it will be sent to mail soon, you will be notified when it will be sent.','paid':true})
}
if(get_order.status=='sent out to delivery'){
json_reply(res,{'message':'order sent to mail, we will contact you soon to deliver the order to you.','paid':true})
}

}
}

export{CheckOut,get_left_time,get_orders,get_specific_tx}