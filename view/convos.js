import { re_stocking } from "./admin.js"
const restock_convo = async (conversation,ctx,answer,config) => {
    await ctx.reply("Enter quantity:")
    let {message}= await conversation.waitFor("message:text")    
    await re_stocking(ctx,config.id,message.text,conversation)
}
export{restock_convo}