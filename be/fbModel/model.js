export const User = {
	email: '',
	password:'',
	name:'',
	level:'' // default 값을 넣어줄 수 없나?
}

export const Product ={
	sku:'',
	name:'',
	image:'',
	price: 100,
	description:'',
	category: ['top', 'dress'],
	stock: {s:20, m:30},
	status:'active',
	isDeleted: false
}

export const Cart ={
	user: {
		name:'',
		email:'',
		password:'',
		level:''
	},
	items: [
		{
			product:{},
			size: 's',
			qty: 1
			getProductName:function(){
				return this.product.name
			}
		}
	],
}

export const Order ={
	user: {},
	userName: '',
	email:'',
	status:'shipping',
	shipTo:{},
	contact:{},
	totalPrice:0,
	orderNum: '',
	items:[
		product:{},
		price:0,
		size:'s',
		qty:1,
		sku:'',
		name:'',
		image:''
	]
}