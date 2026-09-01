import jwt from 'jsonwebtoken'
import { is_paid } from './get_paid_address.js'
import fs from 'node:fs'
import { InlineKeyboard } from 'grammy'
import {check_jwt_expiration,generate_jwt} from "../control/dont_waste_time.js"
import { trasaction,user_cart,ConnectToDB,order,cart_items } from '../model/db.js'
import { Api } from 'grammy'   
async function funx() {
    const ctx = new Api(`${process.env.BOT_TOKEN}`)
      const g= await trasaction.find({$or:[
        {'status':'waitingforpayment'},
        {'status':'partially paid'}
    ]})

    g.forEach(async(t)=>{
let token_expired =  await check_jwt_expiration(t.expiration_token)
       const get_tx = await trasaction.findOne({'index':t.index})
       let paid =  await is_paid(t.index)
       console.log(t.index)
 if(token_expired == true && paid == 'not paid'){
    console.log('t')
    await trasaction.updateOne({'index':t.index},{'status':'not paid'})
    await order.updateOne({'cart_id':t.cart_id},{"status":'cancelled'})
    const get_id = await user_cart.findOne({'cart_id':t.cart_id})
    await ctx.sendMessage(get_id.id,`order cancelled(payment address expired)`)
}
 if(token_expired==false && paid=='fully paid'){
    let keyboard = new InlineKeyboard()
    console.log('ttt')
    const get_id = await user_cart.findOne({'cart_id':t.cart_id})
    const order_details = await order.findOne({'cart_id':t.cart_id})
    let message = ""
    const get_items = await cart_items.find({'cart_id':get_id.cart_id})
    await trasaction.updateOne({'cart_id':t.cart_id},{'status':'paid'})
    await order.updateOne({'cart_id':t.cart_id},{"status":'packaging'})
    await ctx.sendMessage(order_details.user_id,'funds detected!, we will contact you soon!')
    message += `New order!,ID: ${order_details.order_id}\n=====================`   
    get_items.forEach((r)=>{
        if(r.quantity!=0){
        message += `\n${r.name} x${r.quantity} price:${r.quantity * r.price}\n`
            
        }
    })
    message +='=====================\n'
    message += `customer telegram id is @${get_id.user_name}`
     keyboard.text('sent to delivery',`${order_details.order_id}🛵`)
    await ctx.sendMessage(process.env.ADMIN_TELEGRAM_ID,message,{reply_markup:keyboard})

}
if(paid == 'partially paid'&& token_expired == false&&t.NotifiedParitiallyPayment == false){
    await trasaction.updateOne({'cart_id':t.cart_id},{'status':'partially paid','NotifiedParitiallyPayment':true})
        const get_id = await user_cart.findOne({'cart_id':t.cart_id})

    const tx = await trasaction.findOne({'cart_id':t.cart_id})
    const token = await generate_jwt('1h')
    await tx.updateOne({"expiration_token":token})
    const price_margin = Number(tx.amount) - Number(tx.detected_amount)
    await ctx.sendMessage(get_id.id,`only ${t.detected_amount.toString()} been detected there is still ${price_margin.toFixed(5)} to be paid, payment address expiration will be extended to 1 hour!`)
    return
}
if(token_expired == true && paid == 'partially paid'||token_expired == true && paid == 'fully paid'){
        await trasaction.updateOne({'cart_id':t.cart_id},{'status':'dumped'})
            await order.updateOne({'cart_id':t.cart_id},{"status":'cancelled'})

}
})
fs.writeFileSync('/home/u/Downloads/xmr_store/g.txt',"executed!")

}

ConnectToDB().then(async()=>{
funx()
}).catch((err)=>{
    console.log(err)   
})
export{funx}