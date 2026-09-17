import axios from "axios"
import { InlineKeyboard, InputFile } from "grammy"
const add_to_cart = async (ctx) => {
    let item_id =ctx.callbackQuery.data.replace('➕','')
    if(ctx.chat.username == undefined){
        await ctx.editMessageText('You must have a username @ !')
        return 
    }
    const get_item = await axios.get(`${process.env.API_url}/get_item/${item_id}`)
    .then(async(resp)=>{

    let data = {name:resp.data.message.name,price:Number(resp.data.message.price),id:Number(ctx.chatId),user_name:ctx.chat.username}
    const add_item = await axios.post(`${process.env.API_url}/add_to_cart`,data)
    .then(async(r)=>{
    await ctx.answerCallbackQuery(r.data.message)

    }).catch((err)=>{
        console.log(err)
    })

}).catch(async(err)=>{
console.log(err)
    })
}
const remove_from_cart = async (ctx) => {
    let item_id =ctx.callbackQuery.data.replace('➖','')
    console.log(item_id) 
    const get_item = await axios.get(`${process.env.API_url}/get_item/${item_id}`)
    .then(async(resp)=>{

    let data = {name:resp.data.message.name,id:Number(ctx.chatId)}
console.log(data)
    const add_item = await axios.post(`${process.env.API_url}/delete_from_cart`,data)
    .then(async(r)=>{
await ctx.answerCallbackQuery(r.data.message)

    }).catch((err)=>{
        console.log(err)
    })
return null

}).catch(async(err)=>{
console.log(err)
    })
}
//////////
const get_cart_items = async (ctx) => {
    let keyboard = new InlineKeyboard()
 const req = await axios.get(`${process.env.API_url}/get_cart/${ctx.chatId}`)
  .then(async(r)=>{
        let resp = r.data
        if(resp.message == null){
            keyboard.text("main menu",'main_menu')
          await  ctx.editMessageText("cart empty",{reply_markup:keyboard})
        }else{
keyboard.text("check out",'💳')
keyboard.text("main menu",'main_menu')
await ctx.editMessageText(`${resp.message.list}\n total price is:${resp.message.cart_total}`,{reply_markup:keyboard})
        }

  })
  .catch((err)=>{
console.log(err)
  })
}

const check_out = async (ctx) => {
let keyboard = new InlineKeyboard()
try{
let data = {id:ctx.chatId}
const r = await axios.post(`${process.env.API_url}/check_out`,data)


if(r.data.message.IsBanned == true){
await ctx.editMessageText("you are banned from using the shop!")
return
}
let message = `total xmr to pay ${r.data.message.total}
xmr address is: ${r.data.message.payment_address}
left time for payment address is ${r.data.message.remaining_time}
`
 keyboard.text("refresh 🗘",`${r.data.message.cart}🗘`)
 keyboard.copyText("📋copy payment address",r.data.message.payment_address).row()
 keyboard.copyText("📋copy order ID",r.data.message.order_id)

await ctx.editMessageText(message,{reply_markup:keyboard})
await ctx.replyWithPhoto(new InputFile(`../images/${r.data.message.cart}.png`))
}catch(err){
console.log(err)
}    
}

const refresh_tx = async (ctx,cart) => {

const r = await axios.get(`${process.env.API_url}/refresh/${cart}`)
try{
if(r.data.message == null){
    await ctx.editMessageText("payment address expired!")
    return 
}
if(r.data.message == true){
    await ctx.editMessageText("paid successfully!")
    return 
}if(r.data.message.paid == false){
       let keyboard = new InlineKeyboard()

let message = `refresh times:${r.data.message.refresh_times}
total xmr to pay ${r.data.message.total}
xmr address is: ${r.data.message.payment_address}
left time for payment address is ${r.data.message.remaining_time}
`
keyboard.text("refresh 🗘",`${r.data.message.cart}🗘`)
 keyboard.copyText("📋copy payment address",r.data.message.payment_address).row()
 keyboard.copyText("📋copy order ID",r.data.message.cart)
await ctx.editMessageText(message,{reply_markup:keyboard})

}
}catch(err){
console.log(err)
}   
}


export{add_to_cart,remove_from_cart,get_cart_items,check_out,refresh_tx}