import { Bot } from "grammy";
import { keyboard_start,admin_keyboard} from "./keyboards.js";
import { fetch_categories,get_specific_items,get_the_item_itself } from "./listings.js";
import { add_to_cart,remove_from_cart,get_cart_items,check_out,refresh_tx} from "./cart.js";
import { get_orderss,get_specific_order,markedToDe } from "./orders.js";
import { OutOfStock } from "./admin.js";
import { restock_convo,insert_item_convo } from "./convos.js";
import { conversations,createConversation } from "@grammyjs/conversations";
const bot = new Bot(`${process.env.BOT_TOKEN}`)
let category_regex = /🧺/
let add_item_regex = /🪖/
let item_regex = /🦖/
let cart_regex_add = /➕/
let cart_regex_minus = /➖/
let checkOut_regex = /💳/
let refresh_regex = /🗘/
let get_tx_details= /⏰/
let in_stocking_regex = /👍/
let sent_to_mail_regex = /🛵/
let outof_stock_regex = /🤖/
bot.use(conversations())
bot.use(createConversation(restock_convo))
bot.use(createConversation(insert_item_convo))
console.log("app is running")

bot.callbackQuery(add_item_regex,async (ctx) => {
  await ctx.conversation.enter('insert_item_convo')
})

bot.callbackQuery(sent_to_mail_regex,async (ctx) => {
 const id = ctx.callbackQuery.data.replace('🛵','') 
 await markedToDe(ctx,id)
})

bot.callbackQuery(in_stocking_regex,async (ctx) => {
  const id = ctx.callbackQuery.data.replace('👍','')
 await ctx.conversation.enter("restock_convo",'',{id:id})
})

bot.callbackQuery(get_tx_details,async (ctx) => {
  let ree = ctx.callbackQuery.data.replace("⏰",'')
  console.log(ree)
  await get_specific_order(ctx,ree)
  
})
bot.callbackQuery(cart_regex_add,async(ctx) => {
  add_to_cart(ctx)
  
})
bot.callbackQuery(refresh_regex,async(ctx)=>{
  let ref = ctx.callbackQuery.data.replace("🗘",'')
refresh_tx(ctx,ref)

})
bot.callbackQuery('orders list',async(ctx)=>{
  get_orderss(ctx)
})
bot.callbackQuery('cart',async (ctx) => {  
  await get_cart_items(ctx)
})
bot.callbackQuery(checkOut_regex,async (ctx) => {
  check_out(ctx)
})
bot.callbackQuery(refresh_regex,async (ctx) => {
  let ref = ctx.callbackQuery.data.replace('🗘','')
  refresh_tx(ctx,ref)
})
bot.callbackQuery(cart_regex_minus,async (ctx) => {
  remove_from_cart(ctx)
})
 bot.command("start",async(ctx)=>{
  if(ctx.chat.id == process.env.ADMIN_TELEGRAM_ID){
  await ctx.reply("hello big G!",{reply_markup:admin_keyboard})
}
else{
  await ctx.reply("choosee",{reply_markup:keyboard_start})
} 
})
bot.callbackQuery("main_menu",async (ctx) => {
    if(ctx.chat.id == process.env.ADMIN_TELEGRAM_ID){
  await ctx.editMessageText("hello big G!",{reply_markup:admin_keyboard})
}
else{
  await ctx.editMessageText("choose",{reply_markup:keyboard_start})
}   
})
bot.callbackQuery(outof_stock_regex,async (ctx) => {
  let value = ctx.callbackQuery.data.replace(outof_stock_regex,"")
  console.log(value)
 await OutOfStock(ctx,value)
})
 bot.callbackQuery("listing",async (ctx) => {
  await fetch_categories(ctx)
  
})
bot.callbackQuery(category_regex,async (ctx) => {
  let items = ctx.callbackQuery.data.replace('🧺','')
  await get_specific_items(ctx,items)
  
})
bot.callbackQuery(item_regex,async (ctx) => {
  await get_the_item_itself(ctx)
  
})


bot.start()
export{bot}