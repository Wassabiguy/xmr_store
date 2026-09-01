import { items } from "../model/db.js"
import { json_reply } from "./dont_waste_time.js"
const fetch_categories=async (res) => {
     const cat = await items.find({},{category:1}).distinct("category")
return json_reply(res,cat)

}
const fetch_items_by_category = async (res,data) => {
    const find = await items.find({'category':data})
    console.log(find)
    if(find.length == false){
        json_reply(res,'no such category')
    }else{
    json_reply(res,find)
}}
const fetch_item = async (res,id) => {
 const find = await items.findOne({'id':id})
 console.log(find)   
 if(find == null){
    json_reply(res,'no such item!')
 }else{
    json_reply(res,find)
 }
}
export{fetch_categories,fetch_items_by_category,fetch_item}