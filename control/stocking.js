import { items } from "../model/db.js";
import { json_reply } from "./dont_waste_time.js";


const OutOfStock = async (res,data) => {
const find = await items.findOne({'name':data.name,'category':data.category})
if(find == null){
    json_reply(res,'no such item in the database!')
}else{
    await find.updateOne({'quantity_in_stock':0})
    json_reply(res,'The item is out of stock now!')
}    
}
const ReStocking = async (res,data) => {
    if(data.stock_amount <=0){
        json_reply(res,'must be a positive number!')
    }else{
 const find = await items.findOne({'name':data.name,'category':data.category})
if(find == null){
    json_reply(res,'no such item in the database!')
}else{
    await find.updateOne({'quantity_in_stock':find.quantity_in_stock+ data.stock_amount})
    json_reply(res,'restocked again!')
}}
}
export{ReStocking,OutOfStock}