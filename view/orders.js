import axios from "axios";
import { InlineKeyboard,Api } from 'grammy';
import { keyboard_start } from "./keyboards.js";
let api = new Api(process.env.BOT_TOKEN)
const get_orderss =async (ctx) => {
    let keyboard = new InlineKeyboard()
    console.log("fdgg")
try{
    let data =await axios.get(`${process.env.API_url}/get_orders/${ctx.chatId}`)
    console.log(data.data)
     await data.data.message.forEach(async(x) => {
    console.log(x)
if(x.status == 'waiting for payment'){
   await keyboard.text(`${x.order_id}[🕰️]      `,`${x.cart_id}⏰`).row()
}
if(x.status == 'packaging'){
   await keyboard.text(`${x.order_id}[📦]    `,`${x.cart_id}⏰`).row()
}
if(x.status == 'sent out to delivery'){
    await keyboard.text(`${x.order_id}[🛵]     `,`${x.cart_id}⏰`).row()
}
}
)
await ctx.editMessageText("  w ",{reply_markup:keyboard})
return null
}catch(err){
console.log(err)
}}

const markedToDe = async (ctx,order_id) => {
    try{
        let obj = {order_id:order_id}
        const req = await axios.post(`${process.env.API_url}/mark_sent`,obj)
        const data = req.data.message
        console.log(data)
        await ctx.editMessageText(data.response)
        await api.sendMessage(data.user_id,data.response_cus)
    }catch(err){
        console.log(err)
    }
}



const get_specific_order = async (ctx,cart_id) => {
    let keyboard = new InlineKeyboard()
    console.log("dfgdf")
console.log("gff[[[[")
   console.log(":gfhgf")
   try{
    const req =await axios.get(`${process.env.API_url}/get_tx/${cart_id}`)
   const data = req.data
   console.log(data)
   if(data.message.paid == true){
     keyboard.text("main menu",'main_menu')
     await ctx.editMessageText(data.message.message,{reply_markup:keyboard})
     return
   }else{
 const message = `total xmr to pay ${data.message.total}
xmr address is: ${data.message.payment_address}
left time for payment address is ${data.message.remaining_time}
`
 keyboard.text("refresh 🗘",`${data.message.cart}🗘`)
 keyboard.copyText("📋copy payment address",data.message.payment_address).row()
 await ctx.editMessageText(message,{reply_markup:keyboard})
    
   
}
}catch(err){
    console.log(err)
}
}
export{get_orderss,get_specific_order,markedToDe}