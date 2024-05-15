import {create} from 'zustand'
import api from '../utils/api';
import uiStore from './uiStore'

const cartStore =create((set,state)=>({
	error:'',
	cart:{},
	cartCount:0,
	zeroCartCount:()=>set({cartCount:0}),
	zeroCart:()=>set({cart:{}}),
	addToCart: async({id,size}) => {
		try{
			const resp = await api.post('/cart',{productId:id,size:size})
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 cart데이터:', resp.data.data)
			console.log('성공한 cartItemQty:', resp.data.cartItemQty)
			uiStore.getState().showToastMessage('카트에 추가했습니다.', 'success');

			set({
				cart: resp.data.data,
				cartCount: resp.data.cartItemQty
			})
		}catch(e){
			console.log('에러객체:', e)
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error'); 
		}
	},
	getCart:async()=>{
		try{
			const resp = await api.get('/cart')
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 cart데이터:', resp.data.data)
			console.log('성공한 cartItemQty:', resp.data.cartItemQty)
			// uiStore.getState().showToastMessage('카트리스트를 받아왔습니다.', 'success');

			set({
				cart: resp.data.data,
				cartCount: resp.data.cartItemQty
			})
		}catch(e){
			console.log('에러객체:', e)
			console.log('e.error:', e.error)
			set({error: e.error})
			// uiStore.getState().showToastMessage(e.error, 'error');  로그인시에 불필요한 에러메시지 안나오도록
		}
	},
	
	deleteCartItem:async(productId,size)=>{
		try{
			const resp = await api.post('/cart/'+productId,{size:size})
			if(resp.status !==200) throw new Error(resp.error)
			set({
				cart: resp.data.data,
				cartCount: resp.data.cartItemQty
			})
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	updateQty:async(productId,size, qty)=>{
		try{
			const resp = await api.put('/cart/'+productId, {size:size, qty:qty})
			if(resp.status !==200) throw new Error(resp.error)
			console.log('업데이트되어 온 Cart데이터:', resp.data.data)
			set({
				cart: resp.data.data
			})
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	emptyCart:async()=>{
		try{
			const resp = await api.delete('/cart')
			if(resp.status !==200) throw new Error('cart 삭제 실패')
			set({
				// cart:{},보류
				cartCount:0
			})
			console.log(resp.data.message)
		}catch(e){
			console.log(e.message)
		}	
	}
}))

export default cartStore;