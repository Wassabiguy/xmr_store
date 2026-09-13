import axios from "axios";
import { trasaction,ConnectToDB } from "../model/db.js";
import { connect } from "mongoose";
const is_paid = async (index) => {
        let result =''
try{
const req =await axios.post(`${process.env.RPC_URL}`,{
        "jsonrpc":"2.0","id":"0",
        "method":"get_balance",
        "params":{"account_index":0,"address_indices":[index]}
})
const getTx = await trasaction.findOne({'index':index})
    let amo = Number(req.data.result.per_subaddress[0].balance * 1e-12).toFixed(5)
    if(amo>=getTx.amount){
        await trasaction.updateOne({'index':Number(index)},{'detected_amount':amo})
        return 'fully paid'
    
}
if(amo > 0 && amo < getTx.amount){
    await trasaction.updateOne({'index':index},{'detected_amount':amo})
    return 'partially paid'
}
else{
    return 'not paid'
}
}catch(err){
console.log(err)
return
}
}






export{is_paid}