import { status } from "init";
import { config } from "dotenv";
import process from 'node:process'

import mongoose,{Schema,model} from "mongoose";

const ConnectToDB =async () => {
    console.log(process.env.PORT)
await mongoose.connect(process.env.DB_STRING)
}
const ticket = new Schema({
    ticket_id:String,
    user_id:Number,
    order_id:{type:String,default:null},
    the_problem:String,
    date:{type:Date,default:Date.now()},
    status:{default:'open',type:String}
})
const cart = new Schema({
user_name:String,
id:Number,
cart_id:String,
IsLocked:{type:Boolean,default:false}
})


const cart_item = new Schema({
name:String,
cart_id:String,
price:Number,
quantity:Number
})

const item = new Schema({
    name:String,
    price:Number,
    quantity_in_stock:Number,
    description:String,
    media_path:String,
    units_sold:{default:0,type:Number},
    category:String,
    id:String
})
const trasactions = new Schema({
    amount:Number,
    refresh_times:{default:0,type:Number},
    address:String,
    expiration_token:String,
    cart_id:String,
    index:Number,
    date:{type:Date,default:Date.now()},
    status:String,
    detected_amount:{type:Number,default:0},
    NotifiedParitiallyPayment:{type:Boolean,default:false}
}) 


const orders = new Schema({
    user_id:Number,
    order_id:String,
    cart_id:String,
    status:String,
    order_date:{type:Date,default:Date.now()}
})
const tickets = model('ticket',ticket)
const items = model("items",item)
const cart_items = model("cart_items",cart_item)
const user_cart = model("cart",cart)
const order = model("order",orders)
const trasaction = model("transaction",trasactions)
export{items,ConnectToDB,user_cart,trasaction,order,tickets,cart_items}