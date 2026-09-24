import { re_stocking,add_item } from "./admin.js"
const restock_convo = async (conversation,ctx,answer,config) => {
    await ctx.reply("Enter quantity:")
    let {message}= await conversation.waitFor("message:text")    
    await re_stocking(ctx,config.id,message.text,conversation)
}
const insert_item_convo = async (conversation,ctx) => {
    await ctx.reply("Enter item name:")
    let item_name= await conversation.form.text()    
    await ctx.reply("Enter item price in XMR")
    let item_price= await conversation.form.text()    
    await ctx.reply("Enter the item available quantity")
    let item_stock_amount= await conversation.form.text()    
    await ctx.reply("Enter a brief description about the product:")
    let item_description= await conversation.form.text()    
    await ctx.reply("Enter which category can the product suit.")
    let item_category= await conversation.form.text()
console.log(item_name)
    let data = {'name':item_name
                 ,'price':item_price
                 ,'quantity_in_stock':item_stock_amount
                 ,'category':item_category
                 ,'description':item_description
                }
    await add_item(ctx,data)
}
export{restock_convo,insert_item_convo}