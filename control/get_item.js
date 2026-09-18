import { items } from "../model/db.js"
import { json_reply } from "./dont_waste_time.js"
const fetch_categories=async (res) => {
     const cat = await items.find({'quantity_in_stock':{$gt:0}},{category:1}).distinct("category")
    if(cat.length >0){
     json_reply(res,cat)
    }else{
        json_reply(res,{"IsThereCategories":false,'message':'We are out of everything !'})
    }
}
const fetch_items_by_category = async (res,data) => {
    const find = await items.find({'category':data,"quantity_in_stock":{$gt:0}})
    console.log(find)
    if(find.length == false){
        json_reply(res,'no such category')
    }else{
    json_reply(res,find)
}}
const fetch_item = async (res,id) => {
 const find = await items.findOne({'id':id})
 console.log(find)   
 if(find == null || find.quantity_in_stock == 0){
    json_reply(res,'no such item!')
 }else{
    json_reply(res,find)
 }
}
export{fetch_categories,fetch_items_by_category,fetch_item}