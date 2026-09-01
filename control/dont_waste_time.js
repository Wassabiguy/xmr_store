import { v7 } from "uuid";
import jwt from 'jsonwebtoken'
const json_reply =async (res,text) => {
    return res.json({'message':text})
}
const CheckIdIfOccupied =async(collecion) => {
    let random_id = ""

    while(true){   
    random_id = v7().toString()
    const collec = await collecion.findOne({'id':random_id}) 
    if(collec == null){
        break
    }
}
console.log(random_id)
return random_id
}
const generate_jwt = async (exp) => {
 let token =jwt.sign({'ok':'w'},process.env.secret_key,{"expiresIn":exp})
     return token
}
const check_jwt_expiration = async (token) => {
    try{
  const ra =await jwt.verify(token,process.env.secret_key)  
  return false
}catch(err){
return true
}
}
export{json_reply,CheckIdIfOccupied,generate_jwt,check_jwt_expiration}