import {create} from 'zustand'
import api from '../utils/api'
import uiStore from './uiStore'
import cartStore from './cartStore'

const orderStore =create((set, state)=>({
	totalPrice:0,
	ship:{},
	payment:{},
	orderNum:'임시123',
	selectedOrder:{},
	orderList:[],
	totalPageNum:1,
	totalCount:1,
	itemsList:[],
	nameList:[],
	imageList:[],
	setTotalPrice:(val)=>set({totalPrice: val}),
	setShip:(val)=>set({ship: val}),
	setPayment:(val)=>set({payment: val}),
	setSelectedOrder:(orderValue)=> set({selectedOrder: orderValue}),
	updateOrder: async(orderId, newStatus) => {
		try{
			const resp = await api.put('/order', {orderId, newStatus})
			if(resp.status !==200){
				throw new Error(resp.error)
			}
			console.log('업데이트되어 프론트로 온 order:', resp.data.updatedOrder)
			set({selectedOrder: resp.data.updatedOrder})
			// awa)it state.getOrderList(); //orderList 갱신하려 하지만..안된다.

		}catch(e){
			console.log(e.error)
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},

	addOrder:(val)=>set({orderList:{...val}}),
	// createOrder:async(data, navigate)=>{
	// 	try{
	// 		const resp = await api.post('/order', data)
	// 		if(resp.status !==200){
	// 			throw new Error(resp.error)
	// 		}
	// 		console.log('오더넘버:',resp.data.orderNum)
	// 		set({orderNum: resp.data.orderNum})
	// 		await cartStore.getState().emptyCart()
	// 		// console.log('비우기 성공')
	// 		//성공메시지는 생략하고, 결제성공 페이지로 이동
	// 		navigate('/payment/success')
			
	// 	}catch(e){
	// 		console.log(e.error)
	// 		uiStore.getState().showToastMessage(e.error, 'error'); 
	// 	}
	// },
	createOrder:async(data2, navigate)=>{
		try{
			const resp = await api.post('/order', data2)
			if(resp.status !==200){
				throw new Error(resp.error)
			}
			console.log('오더넘버:',resp.data.orderNum)
			set({orderNum: resp.data.orderNum})
			await cartStore.getState().emptyCart()
			// console.log('비우기 성공')
			//성공메시지는 생략하고, 결제성공 페이지로 이동
			navigate('/payment/success')
			
		}catch(e){
			console.log(e.error)
			uiStore.getState().showToastMessage(e.error, 'error'); 
		}
	},
	// getOrderList:async(searchQuery)=>{
	// 	if(searchQuery.orderNum ===""){
	// 		delete searchQuery.orderNum
	// 	}
	// 	try{
	// 		const resp = await api.get('/order')
	// 		if(resp.status !==200) throw new Error(resp.error)
	// 		console.log('order목록:', resp.data.data)
	// 		console.log('page 정보:', resp.data.totalPageNum)
	// 		console.log('itemsList :', resp.data.itemsList)
	// 		console.log('nameList :', resp.data.nameList)
	// 		console.log('imageList :', resp.data.imageList)
	// 		set({
	// 			orderList: resp.data.data,
	// 			totalPageNum: resp.data.totalPageNum,
	// 			itemsList: resp.data.itemsList,
	// 			nameList: resp.data.nameList,
	// 			imageList: resp.data.imageList
	// 		})	
	// 	}catch(e){
	// 		console.log('e.error:', e.error)
	// 		set({error: e.error})
	// 	}
	// },
	getOrderList:async(searchQuery)=>{
		if(searchQuery?.orderNum ===""){
			delete searchQuery.orderNum
		}
		console.log('서치쿼리', searchQuery)
		console.log('입력orderNum :', searchQuery?.orderNum )
		try{
			const resp = await api.get('/order',{params:searchQuery})
			if(resp.status !==200) throw new Error(resp.error)
			console.log('order목록:', resp.data.orderList)
			console.log('page 정보:', resp.data.totalPageNum)
			set({
				orderList: resp.data.orderList,
				totalPageNum: resp.data.totalPageNum,
			})	
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
		}
	},
	getAllUserOrderList:async(searchQuery)=>{
		console.log('getAllUserOrderList 시작됨!!!!!!!!!!!!!!!!!!!!!!!!!!!');

		if(searchQuery?.orderNum ===""){
				delete searchQuery.orderNum
			}
			console.log('getAllUserOrderList 서치쿼리', searchQuery)
			console.log('all user에 입력된 orderNum :', searchQuery?.orderNum )
			try{
				const resp = await api.get('/order/all',{params:searchQuery})
				if(resp.status !==200) throw new Error(resp.error)
				console.log('resp.data:', resp.data)
				console.log('order목록:', resp.data.orderList)
				console.log('page 정보:', resp.data.totalPageNum)
				set({
					orderList: resp.data.orderList,
					totalPageNum: resp.data.totalPageNum,
					totalCount: resp.data.totalCount
				})	
			}catch(e){
				console.log('e.error:', e.error)
				set({error: e.error})
			}
		},
}))

export default orderStore;