import { items } from "../model/db.js"
import { json_reply } from "./dont_waste_time.js"
const fetch_categories=async (res,value) => {
      if(value == process.env.ADMIN_TELEGRAM_ID){
        const get_categories = await items.find({},{category:1}).distinct("category")
        console.log(get_categories)
        if(get_categories.length == 0){
        json_reply(res,{'IsThereCategories':false,'message':'we have nothing in stock !'})
        }else{
        json_reply(res,get_categories)
    }
    }else{
        const get_categories = await items.find({quantity_in_stock:{$gt:0}},{category:1}).distinct("category")
        console.log(get_categories)
        if(get_categories.length == 0){
        json_reply(res,{'IsThereCategories':false,'message':'we have nothing in stock !'})
        }else{
        json_reply(res,get_categories)
    }
}
}
const fetch_items_by_category = async (res,value,data) => {
    if(value == process.env.ADMIN_TELEGRAM_ID){
  const find = await items.find({'category':data})
    console.log(find)
    if(find.length == false){
        json_reply(res,'no such category')
    }else{
    json_reply(res,find)
}
    }else{
          const find = await items.find({'category':data,"quantity_in_stock":{$gt:0}})
    console.log(find)
    if(find.length == false){
        json_reply(res,'no such category')
    }else{
    json_reply(res,find)
}
    }
  }
const fetch_item = async (res,id) => {
 const find = await items.findOne({'id':id})
 console.log(find)
 if(find == null){
    json_reply(res,'no such item!')
 }else{
 if(find.quantity_in_stock >0){
    json_reply(res,{"item_info":find,"in_stock":true})
 }else{
    json_reply(res,{"item_info":find,"in_stock":false})
 }
}
}
export{fetch_categories,fetch_items_by_category,fetch_item}