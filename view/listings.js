import axios from "axios";
import {InlineKeyboard} from "grammy"
const fetch_categories = async (ctx) => {
try{
 let keyboard = new InlineKeyboard()
 let counter = 0
 let request =await axios.get(`${process.env.API_url}/get_categories`)
 if(request.data.message.IsThereCategories ==false){
  await ctx.editMessageText(request.data.message.message)
  return 
}
 request.data.message.forEach(async(element) => {
    counter++

if(counter % 2 == 1){
  keyboard.text(element,`${element}🧺`)
}else{
  keyboard.text(element,`${element}🧺`).row()
}})  
 await ctx.editMessageText("categories:",{reply_markup:keyboard})
}catch(err){
console.log(err)
ctx.editMessageText("error!")
}}
///////////////////////////
const return_items = async () => {
   let keyboard = new InlineKeyboard()
 let counter = 0
 let arr = []
 try{
 let request =await axios.get(`${process.env.API_url}/get_categories`)
 request.data.message.forEach(async(element) => {
  arr.push(element)
})  
return arr
}catch(err){
console.log(err)
}}
//////
const get_specific_items = async (ctx,category) => {
  let keyboard = new InlineKeyboard()
let p = null
let counter = 0
let arr = await axios.get(`${process.env.API_url}/get_items/${category}`)
.then(async(er)=>{
let item_array = er.data.message
console.log(er.data)
console.log("TYghjjjjjjjjjj")

item_array.forEach(async(r)=>{
   counter++
if(counter % 2 == 1){
  keyboard.text(r.name,`${r.id}🦖`)
}else{
  keyboard.text(r.name,`${r.id}🦖 `).row()
}
})
await ctx.editMessageText("available items:",{reply_markup:keyboard})
return null
})
.catch((err)=>{
  console.log(err)
})
return keyboard

}
////////////////
const get_the_item_itself = async (ctx,item) => {
  let keyboard = new InlineKeyboard()
  let length =ctx.callbackQuery.data.length
   item = ctx.callbackQuery.data.replace('🦖','')

  let req = await axios.get(`${process.env.API_url}/get_item/${item}`).then(async(r)=>{
  if(ctx.chat.id == process.env.ADMIN_TELEGRAM_ID){
  keyboard.text("out of stock",`${r.data.message.id}🤖`)
await ctx.editMessageText(`
${r.data.message.name} per unit price is ${r.data.message.price} xmr

${r.data.message.description}
`,{reply_markup:keyboard})  
}else{
   keyboard.text(`add to 🛒`,`${r.data.message.id}➕`)
   keyboard.text(`remove from 🛒`,`${r.data.message.id}➖`).row()
   keyboard.text('main menu',"main_menu")
  await ctx.editMessageText(`
${r.data.message.name} per unit price is ${r.data.message.price} xmr

${r.data.message.description}
`,{reply_markup:keyboard})
}


  }).catch((err)=>{
console.log(err)
})
}

export{fetch_categories,get_specific_items,get_the_item_itself}