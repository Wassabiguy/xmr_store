import { items } from "../model/db.js";
import { json_reply,CheckIdIfOccupied } from "./dont_waste_time.js";
import { v7 } from "uuid";
const add_item = async (res,data) => {
    const get_item = await items.findOne({'name':data.name})
    if(get_item != null){
        json_reply(res,'item name is already taken!')
    }else{
        let id_a =await CheckIdIfOccupied(items)
        console.log(id_a)
    let item_obj ={
     name:data.name,
     price:Number(data.price),
     quantity_in_stock:Number(data.quantity_in_stock),
     category: data.category,
     id: `${id_a}`,
     description:data.description
    }
    await items.insertOne(item_obj)
    json_reply(res,"The item were saved successfully in the database !")
    }
}
export{add_item}