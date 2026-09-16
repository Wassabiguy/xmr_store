import { json_reply } from "../control/dont_waste_time.js";
import { ban } from "../model/db.js";

const CheckIfUserIsbanned = async (req,res,next) => {
 const get_user = await ban.findOne({"user_name":req.body})   
 if(get_user == null){
    next()
 }else{
    json_reply(res,{"IsBanned":true})
 }
}