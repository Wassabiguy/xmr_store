import axios from "axios"
import { InlineKeyboard } from "grammy"
const OutOfStock = async (ctx,value) => {
    const data = {id:value}
try{
    let keyboard = new InlineKeyboard()
    keyboard.text("Main menu","main_menu")
const req = await axios.post(`${process.env.API_url}/stocking_out`,data)
   await ctx.editMessageText(`${req.data.message}`,{reply_markup:keyboard})
}catch(err){
console.log(err)
}
}
const re_stocking = async(ctx,value,quantity,convo)=>{
try{
    let data = {id:value,stock_amount:quantity}
const req = await axios.post(`${process.env.API_url}/stocking_in`,data)
console.log(req.data)
await ctx.reply(req.data.message)


}catch(err){
console.log(err)
}
}
export{OutOfStock,re_stocking}