import {create} from 'zustand'
import api from '../utils/api'
import uiStore from './uiStore'
import cartStore from './cartStore'

const userStore =create((set)=>({
	user:null,
	error:'',
	// loading:true,
	setError:(val)=>set({error:val}),
	loginWithToken: async ()=> {
		// const token= sessionStorage.getItem('token') 이것 필요없다. api에서 알아서 해더에 넣도록 설정해 두었다.
		try{
			const resp = await api.get('/user/me')
			if(resp.status !==200){
				throw new Error(resp.error)
			}
			const u = await resp.data.user
			set({user: u})
		} catch(e){
			console.log('e.error:', e.error)
			// set({error:e.message}) 이걸 안해야 Login페이지에 쓸데없는 에러메시지가 안나온다.
			set({error: ''})
			// this.logout()  zustand this사용 못한다.
			// invalid한 토큰삭제,user null로
			sessionStorage.clear()
			set({user:null})
		}
	},
	loginWithEmail: async ({email,password})=>{
		try{
			const resp = await api.post('/user/login', {email,password})
			if(resp.status !== 200){
				throw new Error(resp.error)
			}
			console.log('resp', resp)
			const u = await resp.data.user
			const t = await resp.data.token
			set({user: u })
			sessionStorage.setItem('token',t)
		} catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	logout:()=> {
		sessionStorage.clear()
		set({user:null})
		cartStore.getState().zeroCartCount()
	},
	loginWithGoogle: async (token)=>{
		try{
			const resp = await api.post('/user/google', {token})
			if(resp.status !==200) throw new Error(resp.error)
			const u = await resp.data.user
			const t = await resp.data.token
			set({user: u })
			sessionStorage.setItem('token',t)
		}catch(e){
			console.log('e.error:', e.error)
			set({error: e.error})
			uiStore.getState().showToastMessage(e.error, 'error');
		}
	},
	registerUser: async({name,email,password}, navigate, showToastMessage)=>{
		try{
			const resp = await api.post('/user', {email,password,name})
			if(resp.status !==200) throw new Error(resp.error)
			console.log('회원등록 성공', resp.data.data)
			set({user: resp.data.data})
		
			await showToastMessage('회원가입을 완료했습니다.', 'success')
			navigate('/login')

		}catch(e){
			console.log(e.error)
			showToastMessage('회원가입실패','error')
		}
	},


}))

export default userStore;