import { Bot } from "grammy";
import { keyboard_start} from "./keyboards.js";
import { fetch_categories,get_specific_items,get_the_item_itself } from "./listings.js";
import { add_to_cart,remove_from_cart,get_cart_items,check_out,refresh_tx} from "./cart.js";
import { get_orderss,get_specific_order,markedToDe } from "./orders.js";
const bot = new Bot(`${process.env.BOT_TOKEN}`)
let category_regex = /🧺/
let item_regex = /🦖/
let cart_regex_add = /➕/
let cart_regex_minus = /➖/
let checkOut_regex = /💳/
let refresh_regex = /🗘/
let get_tx_details= /⏰/
let sent_to_mail_regex = /🛵/

bot.callbackQuery(sent_to_mail_regex,async (ctx) => {
const id = ctx.callbackQuery.data.replace('🛵','') 
 
markedToDe(ctx,id)
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
 bot.command("start",async(ctx,next)=>{
  await ctx.reply("choosee",{reply_markup:keyboard_start}) 
  await next()
})
bot.callbackQuery("main_menu",async (ctx) => {
  await ctx.editMessageText("choose",{reply_markup:keyboard_start})   
  
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