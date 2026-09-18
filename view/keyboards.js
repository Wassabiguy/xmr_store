import { InlineKeyboard } from "grammy";
const keyboard_start = new InlineKeyboard()
.text('listings 🛒','listing')
.text("Cart 🧺",'cart')
.row()
.text("My orders 🕒",'orders list')

const admin_keyboard = new InlineKeyboard()
.text("Add item ➕",'Add item +').row()
.text("Outstock an item",'listing')


export{keyboard_start,admin_keyboard}    