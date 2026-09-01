import { get } from "mongoose"
import { tickets,order } from "../model/db.js"
import { json_reply } from "./dont_waste_time.js"
import { v7 } from "uuid"
const create_ticket = async(res,data) => {
    const get_order = await order.findOne({'order_id':data.order_id})
if(get_order == null){
    json_reply(res,'no such order!')
}else{
const get_ticket = await tickets.findOne({'user_id':data.id,'status':'open','order_id':data.order_id})
if(get_ticket == null){
    let random_uuid = v7().toString()
    await tickets.insertOne({'ticket_id':random_uuid.toString(),'order_id':data.order_id,'user_id':Number(data.id),'the_problem':String(data.description)})
    json_reply(res,random_uuid)
}else{
    json_reply(res,"there is already an open ticket for this order!!!")
}
}
}

const close_ticket = async(res,data) => {
    const get_ticket = await tickets.findOne({'ticket_id':data.ticket_id,'user_id':data.id})
    if(get_ticket == null){
        json_reply(res,"no such ticket to close!")
    }else{
        await get_ticket.updateOne({'status':'closed'})
        json_reply(res,"ticket closed!")
    }
}
export{create_ticket}