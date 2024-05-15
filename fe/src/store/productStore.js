import {create} from 'zustand'
import api from '../utils/api';
import api2 from '../utils/api2';
import uiStore from './uiStore'
import { isEqual } from 'lodash';

// const {showToastMessage} =uiStore() 이러면 useRef()에러 난다.

const productStore =create((set,state)=>({
	error:'',
	selectedProduct:null,
	productList:[],
	initialProductList:[],
	totalPage:1,
	newProductList:[], // 신상 공개용 리스트 
	emptyNewProductList:()=>set({newProductList:[]}), 
	setProducts:(results)=>{
		set({
			productList: results
		})
		// console.log('productList:', state.productList)
		// 희안하게도 콘솔로 찍으면 undefined
		// 그래서 여기서 계산못한다.
		// const results = tempList.filter(product=>product.price <= pr)
		// console.log('results list: ', results)
		// set({productList: results})
	},
	getProductList:async(searchQuery)=>{
		if(searchQuery?.name === ''){
			delete searchQuery.name;
		}
		try{
			const resp= await api.get('/product', {params: {...searchQuery}})
			if(resp.status !==200) throw new Error(resp.error)
			console.log('product목록:',resp.data.data)
			console.log('page 정보 : ',resp.data.totalPageNum)
			set({totalPage: resp.data.totalPageNum})
			const list = resp.data.data
			console.log('list :', list)
			// productList와 list가 동일한지를 판별하는 조건 추가
      		// if (JSON.stringify(state.productList) === JSON.stringify(list)) {
			// 	return;
			// }
			// productList와 list가 동일한지를 lodash의 isEqual 함수를 사용하여 판별


			//무한 반복을 없애려고 했던 건게... 무의미할수도 있다.
			// if (isEqual(state.productList, list)) {
			// 	return;
			// }

			set({
				productList: [...list],    	initialProductList:[...list]})	
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			// uiStore.getState().showToastMessage(e.error, 'error');
			// payment페이지처럼 페이지네이션 안된 곳에서 에러메시지 안나오도록
		}
	},
	createProduct:async(formData, navigate)=>{
		console.log('store로 받은 formData :', formData)
		try{
			const resp = await api.post('/product', formData)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			uiStore.getState().showToastMessage('상품가입을 완료했습니다.', 'success');

			set((state)=>({
				productList: [...state.productList, resp.data.data],
				newProductList:[...state.newProductList, resp.data.data]
			}))
			navigate('/admin/product')
			//이렇게 productList를 업데이트하면, 새로만든 물폼이 화면에 반영된다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	batchCreateProducts:async(formData,navigate)=>{
		console.log('store로 받은 formData :', formData)
		try{
			const resp = await api2.post('/product/batch', formData)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			uiStore.getState().showToastMessage('상품 일괄가입을 완료했습니다.', 'success');

			set((state)=>({
				productList: [...state.productList, ...resp.data.data],
				newProductList:[...state.newProductList, ...resp.data.data]
			}))
			navigate('/admin/product')
			//이렇게 productList를 업데이트하면, 새로만든 물폼이 화면에 반영된다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	setSelectedProduct:(product)=>{
		set({selectedProduct: product})
	},

	editProduct:async(formData,navigate)=>{
		console.log('store로 받은 formData :', formData)
		try{
			const resp = await api.put('/product/'+formData._id, formData)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			set({selectedProduct: resp.data.data})
			uiStore.getState().showToastMessage('상품수정을 완료했습니다.', 'success');

			// set((state)=>({productList: [...state.productList, resp.data.data]})) 이건 안된다.
			//추가하면 뒤에 추가될 뿐이다.
			
			
			navigate('/admin/product')
			//이렇게 하면, 페이지가 열리면서 자연스럽게 새로운 productList를 받아오게 된다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	deleteProduct:async(id,navigate)=>{
		console.log('store로 받은 id :', id)
		try{
			const resp = await api.delete('/product/'+id)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 메시지:', resp.data.message)
			uiStore.getState().showToastMessage('상품이 삭제되었습니다.', 'success');			
			
			navigate('/admin/product')
			//이렇게 하면, 페이지가 열리면서 자연스럽게 새로운 productList를 받아오게 된다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	getProduct:async(id)=>{
		console.log('store로 받은 id :', id)
		try{
			const resp = await api.get('/product/'+id)
			if(resp.status !==200) throw new Error(resp.error)
			console.log('성공한 데이터:', resp.data.data)
			set({selectedProduct: resp.data.data})
			// uiStore.getState().showToastMessage('상품 정보 획득.', 'success'); 과잉메시지라서 

			// navigate('/product/'+id) 현재페이지 url이 바뀔 필요없다.

		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	}
}))

export default productStore;