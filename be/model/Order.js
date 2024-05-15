const mongoose =require('mongoose')
const User = require('./User')
const Product = require('./Product')
const Cart = require('./Cart')

const Schema = mongoose.Schema
const orderSchema = Schema({
	userId:{type:mongoose.ObjectId, ref:User},
	status:{type:String, default:'배송준비중'},
	shipTo:{type:Object, required:true},
	contact:{type:Object, required:true},
	totalPrice:{type:Number, default:0},
	orderNum:{type: String},
	items:[{
		productId:{type:mongoose.ObjectId, ref:Product},
		price:{type:Number, required:true},
		size:{type:String, required:true},
		qty:{type:Number, default:1, required:true}		
	}]
},{timestamps:true})

orderSchema.methods.toJSON =function(){
	const obj = this._doc
	delete obj.__v
	delete obj.createdAt
	// delete obj.updatedAt  가장 최근에 업데이트된 날짜 필요
	return obj
}
// orderSchema.post("save", async function(){
// 	const cart = await Cart.findOne({userId: this.userId})
// 	cart.items =[]
// 	await cart.save()
// })

const Order = mongoose.model("Order", orderSchema)

module.exports = Order;