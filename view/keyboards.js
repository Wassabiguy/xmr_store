import { InlineKeyboard } from "grammy";
const keyboard_start = new InlineKeyboard()
.text('listings 🛒','listing')
.text("Cart 🧺",'cart')
.row()
.text("My orders 🕒",'orders list')
export{keyboard_start}    