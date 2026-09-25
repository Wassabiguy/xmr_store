import { user_cart,cart_items } from "../model/db.js"
import { generate_jwt,json_reply } from "./dont_waste_time.js"
import { v7 } from "uuid"

const AddItemToCart = async (res,data) => {
    console.log(data.id)
    const get_cart = await user_cart.findOne({'id':data.id,'IsLocked':false})
    
    if(get_cart == null){
        let id = await v7()
        const obj = {
            'id':data.id,
            "cart_id": "",
            "user_name":data.user_name,
            "cart_id":id
        }

        await user_cart.insertOne(obj)
        await cart_items.insertOne({'name':data.items_array.product_name,'price':data.items_array.product_price,'cart_id':obj.cart_id,'quantity':1})
        await json_reply(res,'added to cart!')
    }else{
        const add_item = await cart_items.findOne({'name':data.items_array.product_name,'cart_id':get_cart.cart_id})
        console.log(add_item)
        if(add_item == null){
            await cart_items.insertOne({'cart_id':get_cart.cart_id,'name':data.items_array.product_name,'price':data.items_array.product_price,'quantity':1})
        }else{
            await add_item.updateOne({$inc:{quantity:1}})
        }

    json_reply(res,'added to cart!')

}
}

const decrease_amount = async (res,data) => {
 const get_cart = await user_cart.findOne({'id':data.id,'IsLocked':false})
console.log(get_cart)
    if(get_cart == null){
                json_reply(res,'minimum amount to order this item is 1')

    }else{
    const get_item = await cart_items.findOne({'cart_id':get_cart.cart_id,'name':data.name})
    if(get_item == null){
        json_reply(res,'minimum amount to order this item is 1')
    }
    else if(get_item.quantity > 1){
        await get_item.updateOne({$inc:{quantity:-1}})
        json_reply(res,`quantity decreased to ${get_item.quantity - 1 }`)
    }else if(get_item.quantity == 1){
        await get_item.updateOne({quantity:0})
        json_reply(res,'deleted from cart')
    }    
    }
}

const get_cart_items = async (res,data) => {
const get_cart = await user_cart.findOne({'id':Number(data),'IsLocked':false})
if(get_cart != null){
const gather_items = await cart_items.find({'cart_id':get_cart.cart_id})
console.log(gather_items)
if(gather_items.length ==0){
json_reply(res,null)
}else{
    
    let items_list = ''
    let total = 0
    items_list += 'In cart:\n'
    gather_items.forEach(async(item)=>{
        if(item.quantity >0){
    let price =  item.quantity * item.price 
    console.log(price)
    total += price
items_list += `${item.name} x${item.quantity}  ${price.toFixed(5)}\n`
}
}
)

json_reply(res,{'list':items_list,'cart_id':get_cart.cart_id,'cart_total':total.toFixed(5)})
}
}else{
    json_reply(res,null)
}

}





export{AddItemToCart,decrease_amount,get_cart_items}