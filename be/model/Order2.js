const mongoose =require('mongoose')
const User = require('./User')
const Product = require('./Product')
const Cart = require('./Cart')

const Schema = mongoose.Schema
const order2Schema = Schema({
	userId:{type:mongoose.ObjectId, ref:User},
	email:{type:String},
	status:{type:String, default:'배송준비중'},
	shipTo:{type:Object, required:true},
	contact:{type:Object, required:true},
	totalPrice:{type:Number, default:0},
	orderNum:{type: String},
	items:[{
		productId:{type:mongoose.ObjectId, ref:Product},
		price:{type:Number, required:true},
		size:{type:String, required:true},
		qty:{type:Number, default:1, required:true},
		sku: {type:String, required:true},
		name: {type:String, required:true},
		image: {type:String,required:true},	
	}]
},{timestamps:true})

order2Schema.methods.toJSON =function(){
	const obj = this._doc
	delete obj.__v
	delete obj.createdAt
	// delete obj.updatedAt   가장 최근에 업데이트된 날짜 필요
	return obj
}
// orderSchema.post("save", async function(){
// 	const cart = await Cart.findOne({userId: this.userId})
// 	cart.items =[]
// 	await cart.save()
// })

const Order2 = mongoose.model("Order2", order2Schema)

module.exports = Order2;