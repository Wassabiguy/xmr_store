import { order } from "../model/db.js"
import { json_reply } from "./dont_waste_time.js"
const mark_to_be_sent = async (req,res) => {
    const get_order = await order.findOne({'order_id':req.body.order_id})
   console.log(get_order)
    if(get_order ==null){
      json_reply(res,null)
    }else{
        let status ="sent out to delivery"
        await get_order.updateOne({'status':status})
        json_reply(res,{'order_id':get_order.order_id,'response':`order ID: ${get_order.order_id} is marked as ( ${status} )`,'user_id':get_order.user_id,'response_cus':`Your order is out for delivery!, ID: ${get_order.order_id}`})
    }
}
export{mark_to_be_sent}