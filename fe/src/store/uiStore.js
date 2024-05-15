import {create} from 'zustand'
import productStore from './productStore'
//status는 success, error,info,warning

const uiStore =create((set)=>({
	toastMessage:{message:'', status:''},
	isFullyLoaded:true, 
	popupContent:{message:''},
	showPopup:()=>{
		const list = productStore.getState().newProductList
		const message = `
			[신상 출시] 
			${list.map((product,i)=> {
				return (product.name +" ;")
				})
			} 
			=> ${list.length} 종
		`
		set({popupContent: {message}})
	}, 
	showToastMessage: (message, status) => {
    set({ toastMessage: { message, status } });
 	},
}))


export default uiStore;