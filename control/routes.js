import express from 'express'
import { Ban_user } from './admin.js'
import { CheckIfUserIsbanned } from '../middleware/check_user.js'
import { ConnectToDB } from '../model/db.js'
import { add_item } from './add_item.js'
import { mark_to_be_sent } from './admin.js'
import { create_ticket } from './ticket.js'
import { CheckOut,get_left_time,get_orders,get_specific_tx } from './order.js'
import { AddItemToCart,decrease_amount,get_cart_items } from './cart.js'
import { OutOfStock,ReStocking } from './stocking.js'
import { fetch_categories,fetch_items_by_category,fetch_item } from './get_item.js'
import process from 'node:process'
const app = express() 
app.use(express.urlencoded())
app.use(express.json())
app.get("/get_items/:category/:user_id",async(req,res)=>{
fetch_items_by_category(res,req.params.user_id,req.params.category)
})
app.get("/get_categories/:user_id",async(req,res)=>{
fetch_categories(res,req.params.user_id)
})
app.get("/get_item/:id",async(req,res)=>{
fetch_item(res,req.params.id)
})
app.post('/add_item',async(req,res)=>{
    const data = req.body
    const {name,price,quantity_in_stock,category,description,username} = data
    await add_item(res,data)
})
app.post("/stocking_out",async (req,res) => {
  let data = req.body
  let {id} = data  
  OutOfStock(res,data)
})
app.post("/stocking_in",async (req,res) => {
     let data = req.body
  let {id,stock_amount} = data  
  ReStocking(res,data)
})
app.post("/add_to_cart",async (req,res) => {
let data = req.body
let {id,items_array,name,price,quantity} =data
data.items_array = {
product_name:data.name,
product_price:data.price,
quantity:1
}
AddItemToCart(res,data)
})
app.post('/delete_from_cart',async (req,res) => {
    let data = req.body
    let {id,name} = data
    decrease_amount(res,data)
})
app.post("/check_out",(req,res,next)=>{CheckIfUserIsbanned(req,res,next)},async (req,res) => {
    let data = req.body
    let {id} = data
    CheckOut(res,data) 
})

app.post("/submit_ticket",async(req,res)=>{
let data = req.body
let {id,order_id,description} =data
create_ticket(res,data)
})
app.get("/get_cart/:id",async(req,res)=>{
await get_cart_items(res,req.params.id)
})
app.get("/refresh/:cart",async(req,res)=>{
await get_left_time(req,res)
})
app.get('/get_orders/:id',async(req,res) => {
 await get_orders(req,res)
})
app.get("/get_tx/:id",async(req,res)=>{
await get_specific_tx(req,res)
})
app.post("/mark_sent",async (req,res) => {
    let data = req.body
    let {order_id} = data
await mark_to_be_sent(req,res)   
})
app.post("/ban_user",async(req,res)=>{
    let data = req.body
    let {user_name,reason} = data
    await Ban_user(req,res)
})


ConnectToDB().then(()=>{
    try{
    app.listen(process.env.PORT)
}catch(err){
console.log(err)
}
}).catch((err)=>{
    console.log(err)
})