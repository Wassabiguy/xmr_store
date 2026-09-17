import { json_reply } from "../control/dont_waste_time.js";
import { ban } from "../model/db.js";

const CheckIfUserIsbanned = async (req,res,next) => {
const serser = await ban.find({})
console.log(serser)
 const get_user = await ban.findOne({user_id:req.body.id})   
 console.log("_-------------------")
 console.log(req.body)
 console.log(get_user)
 if(get_user == null){
    next()
 }else{
    json_reply(res,{"IsBanned":true})
 }
}
export{CheckIfUserIsbanned}