const {usersCollection, productsCollection, cartsCollection} = require('../firebaseConfig')

const cartController={}

cartController.createCartItem = async(req, res)=>{
	try{
		const {productId, size} = req.body;
		const userId = req.userId
		console.log('userId : ', userId)

		// userId로 부터 사용자 정보 가져오기
        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ status: 'fail', error: '사용자를 찾을 수 없습니다.' });
        }
		const userData = userDoc.data()

		// productId로 부터 상품정보 가져오기
		const productDocSnapshot = await productsCollection.doc(productId).get()
		if(!productDocSnapshot.exists){
			throw new Error('상품을 찾을 수 없습니다.')
		} 
		const productData = productDocSnapshot.data()

		// 유저의 카트 정보 가져오기
        // const userCartRef = cartsCollection.doc(userId);   doc에 cartId를 넣어야 된다. 하지만 그건 알 수 없다. 그러므로 where('userId','==',userId)로 찾아야 된다.

		const userCartQuery = cartsCollection.where('userId', '==', userId);
		const userCartSnapshot = await userCartQuery.get();

		if (!userCartSnapshot.empty) {
			const userCartDoc = userCartSnapshot.docs[0];
			console.log('이미 유저가 있습니다. userCart 정보 userCart:', userCartDoc.data().user.email);
			
			const cartData = userCartDoc.data();
			console.log('그래서 userCartData를 사용합니다.:', cartData)

			// 이미 해당 제품과 사이즈의 아이템이 있는지 확인
			const existingItemIndex = cartData.items.findIndex(item => item.productId === productId && item.size === size);
			// find와 findIndex는 속도차가 있다.  find는 요소를 추가로 찾기 위해 모든 배열항목을 다시 확인하는 작업을 추가로 한다.
			if (existingItemIndex !== -1) {
				return res.status(400).json({ status: 'fail', error: '카트 안에 이미 해당 제품과 size의 아이템이 있습니다.' });
			}
			// 동일상품이 존재하지 않으면, 새로운 아이템 추가
			cartData.items.push({
				productId,  // 필요하다.
				product: productData, 
				size, 
				qty:1 
			});

			//저장을 위해 cartDoc의 id를 받아오고, cartRef를 찾는다.
			// userCartDoc의 ID를 사용하여 문서 참조를 생성
      		const userCartRef = cartsCollection.doc(userCartDoc.id);
			
			await userCartRef.set(cartData); //변화된 값을 db에 반영저장

			res.status(200).json({ status: 'ok', data: cartData, cartItemQty: cartData.items.length });
			
		} else {
			console.log('해당 userId를 가진 카트 문서가 없어, 새롭게 cart를 생성합니다.');
			// 새로운 카트 생성하고 아이템 추가
            const newCartData = {
				userId,
				user: userData, 
				items: [
					{ 
						productId,
						product: productData,
						size,
						qty:1
					 }
					] 
				};
            await cartsCollection.add(newCartData)
			console.log('새롭게 cart생성 완료:', newCartData)
            res.status(200).json({ status: 'ok', data: newCartData, cartItemQty: 1 });
		}
	}catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}

cartController.getAllUserCart =async(req,res)=>{
	try{
		// admin만 가능하게 한다.  이것은 admin페이지에서 사용할 것
		// userId로 찾는 조건은 없앤다.
	} catch(e){

	}
}
cartController.getCart=async(req, res)=>{
	try{
		const userId = req.userId
		const cartSnapshot = await cartsCollection.where('userId','==', userId).get()
		const cartDoc = cartSnapshot.docs[0]
		const cart = cartDoc.data()

		console.log('cart :', cart)
		console.log('cart.items :', cart.items)

		res.status(200).json({status:'success', data:cart, cartItemQty:cart?.items.length })
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}

cartController.emptyCart = async(req, res)=>{
	try{
		const userId = req.userId
		const userCartSnapshot = await cartsCollection.where('userId','==', userId).get();
		if (userCartSnapshot.empty) {
			throw new Error('Cart not found for the user');
		}
		const userCartDoc = userCartSnapshot.docs[0];
		await userCartDoc.ref.delete();
		// ref는 문서의 참조를 나타내는 프로퍼티입니다. 파이어베이스에서 문서를 삭제할 때는 해당 문서의 참조를 사용하여 삭제를 수행합니다.
		res.status(200).json({ status: 'ok', message: 'Cart emptied successfully' });
	}catch(e){
		res.status(400).json({ status: 'error', error: e.message });
	}
}
cartController.deleteCartItem = async(req,res)=>{
	try{
		const userId = req.userId
		const productId = req.params.id
		const {size} = req.body

		const cartSnapshot = await cartsCollection.where('userId','==', userId).get();
		const cartDoc = cartSnapshot.docs[0];
		const cart = cartDoc.data()
		console.log('user의 cart :', cart)
		console.log('userCart.items :', cart.items)

		const newItems = cart.items.filter(item =>
			!(item.productId === productId && item.size === size)
		);
		console.log('삭제를 하고 난 나머지 items :', newItems)
		
		const cartRef = cartDoc.ref; // 문서에 대한 참조 가져오기
		await cartRef.update({ items: newItems }); // 문서 업데이트

		// 업데이트된 카트 정보 다시 가져오기
        const updatedCart = (await cartDoc.ref.get()).data();
		res.status(200).json({status:'ok', data: updatedCart, cartItemQty: newItems.length })
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}

cartController.updateItemQty =async(req,res)=>{
	try {
        const userId = req.userId;
        const productId = req.params.id;
        const { size, qty } = req.body;

        // 해당 유저의 카트 가져오기
        const cartSnapshot = await cartsCollection.where('userId', '==', userId).get();
        if (cartSnapshot.empty) {
            return res.status(404).json({ status: 'fail', error: '사용자의 카트를 찾을 수 없습니다.' });
        }

        // 첫 번째 카트 문서 가져오기
        const cartDoc = cartSnapshot.docs[0];
        let cart = cartDoc.data();

        // 업데이트할 아이템 찾기
        const updatedItems = cart.items.map(item => {
            if (item.productId === productId && item.size === size) {
                return { ...item, qty };
            }
            return item;
        });

        // 카트 문서 업데이트
        await cartDoc.ref.update({ items: updatedItems });

        // 업데이트된 카트 정보 다시 가져오기
        cart = (await cartDoc.ref.get()).data();

        res.status(200).json({ status: 'success', data: cart });
    } catch (e) {
        res.status(400).json({ status: 'fail', error: e.message });
    }
}

module.exports = cartController;