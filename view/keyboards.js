import { InlineKeyboard } from "grammy";
const keyboard_start = new InlineKeyboard()
.text('listings 🛒','listing')
.text("Cart 🧺",'cart')
.row()
.text("My orders 🕒",'orders list')

const admin_keyboard = new InlineKeyboard()
.text("restock or Outstock an item",'listing')
.text("Add a new item",'🪖')

export{keyboard_start,admin_keyboard}    