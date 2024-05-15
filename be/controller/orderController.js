const Order = require('../model/Order')
const Order2 = require('../model/Order2')
const Product = require('../model/Product')
const User = require('../model/User')
const { randomStringGenerator } = require('../utils/randomStringGenerator')
const productController = require('./productController')
const cartController = require('./cartController')

const orderController={}
const PAGE_SIZE =5


orderController.createOrder = async(req, res)=>{
	try{
		const userId = req.userId
		const {shipTo, contact, totalPrice, items} = req.body;
		// 재고확인 & 재고 업데이트
		const insufficientStockItems = await productController.checkItemsStock(items)

		// 재고가 충분하지 않은 아이템이 있으면 -> 에러
		if(insufficientStockItems.length >0){
			const errorMessage = insufficientStockItems.reduce((total, item)=> total += `${item.message} \n;`, '')
			throw new Error(errorMessage)
		}
		const orderNum = randomStringGenerator()
		const user = await User.findOne({userId})
		const email = user.email

		const newOrder = new Order({
			userId, email, shipTo, contact,totalPrice, items,
			orderNum: orderNum,
		})
		await newOrder.save()
		//save후에 cart를 비워준다.
		//await cartController.emptyCart() 그런데 바로 비우면 프론트엔드에서 getCart()하고, 화면구성할 때 에러가 나올 수 있다. 
		// cart비우는 것은, 프론트엔드에서 필요할 때 요청하게 만든다.
		// // await로 기다리게 하지 않고 비동기로 작업하게 놔둘수도 있지만, 
		// //제대로 비워줘야 화면에 반영되므로 await을 사용한다.

		return res.status(200).json({status:'ok', orderNum: orderNum})
	}catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}
orderController.createOrder2 = async(req, res)=>{
	try{
		const userId = req.userId
		const {shipTo, contact, totalPrice, items} = req.body;

		// 재고확인 & 재고 업데이트
		const insufficientStockItems = await productController.checkItemsStock(items)

		// 재고가 충분하지 않은 아이템이 있으면 -> 에러
		if(insufficientStockItems.length >0){
			const errorMessage = insufficientStockItems.reduce((total, item)=> total += `${item.message} \n;`, '')
			throw new Error(errorMessage)
		}
		const orderNum = randomStringGenerator()

		const user = await User.findById(userId)
		const email = user.email

		const newOrder = new Order2({
			userId, email, shipTo, contact,totalPrice, items,
			orderNum: orderNum,
		})
		await newOrder.save()
		console.log('Order2 생성됨')
		//save후에 cart를 비워준다.
		//await cartController.emptyCart() 그런데 바로 비우면 프론트엔드에서 getCart()하고, 화면구성할 때 에러가 나올 수 있다. 
		// cart비우는 것은, 프론트엔드에서 필요할 때 요청하게 만든다.
		// // await로 기다리게 하지 않고 비동기로 작업하게 놔둘수도 있지만, 
		// //제대로 비워줘야 화면에 반영되므로 await을 사용한다.

		return res.status(200).json({status:'ok', orderNum: orderNum})
	}catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}


orderController.getOrderList=async(req, res)=>{
	function summarizeItems(itemsList) {
		const summary = [];

		// 각 항목을 반복하며 요약 정보 생성
		itemsList.forEach((items, index) => {
			// 각 항목의 상품 ID 및 수량을 추출하여 요약 정보 생성
			const productIds = items.map(item => item.productId);
			const count = productIds.length; // count를 productIds 배열의 길이로 설정

			// 요약 정보를 객체에 추가
			const itemSummary = {
			item: index + 1,
			count: count,
			productIds: productIds
			};

			// 최종 요약 정보 배열에 추가
			summary.push(itemSummary);
		});

		return summary;
	}

	async function fetchProducts(itemsInfo) {
		const newItemsInfo = [];

		// 각 항목을 반복하며 제품 검색
		for (const itemInfo of itemsInfo) {
			const { item, count, productIds } = itemInfo;

			// productIds 배열 내 각 제품에 대해 findOne 수행
			const productList = await Promise.all(
			productIds.map(async (productId) => {
				// MongoDB에서 해당 제품 검색
				return await Product.findOne({ _id: productId });
			})
			);

			// 새로운 구조로 변환하여 newItemsInfo에 추가
			newItemsInfo.push({
			item,
			count,
			productList,
			});
		}

		return newItemsInfo;
		}


	try{
		const userId = req.userId
		const {page, orderNum} = req.body
		const cond = orderNum? { orderNum:{$regex:orderNum, $options:'i'}}:{}
		let query = Order.find(cond)
		let response = {status: "success"}
		if(page){
			query.skip((page-1)*PAGE_SIZE).limit(PAGE_SIZE)
			const totalItemNum = await Order.find(cond).countDocuments()
			const totalPages = Math.ceil(totalItemNum /PAGE_SIZE)
			response.totalPageNum = totalPages
		}
		const orderList = await query.exec()
		response.data = orderList
		

		const itemsList = orderList.map((order)=>{
			return order.items
		})
		// console.log('itemsList : ', itemsList)
		const itemsInfo = summarizeItems(itemsList);
		// console.log('itemsInfo :', itemsInfo);

		const newItemsInfo = await fetchProducts(itemsInfo);
		console.log('newItemsInfo: ', newItemsInfo);

		// newItemsInfo[0].productList.forEach((item)=> console.log(item.name))  이렇게 꺼낼 수 있다.
		//첫번째 상품이름, 이미지를 얻어내야 된다.
		// 이것을 OrderList = [ {}, {} ] 안의 객체에
		// { firstItemName, firstItemImage,   }로 추가해준다.
		const itemNames =[]
		const itemImages =[]
		const itemCountList=[]
		console.log('시작')
		newItemsInfo.forEach((item)=>{
			itemCountList.push(item.count)
			item.productList.forEach((product)=>{
				itemNames.push(product.name);
				itemImages.push(product.image)
			})
		})
		console.log('itemNames :', itemNames)
		console.log('itemImages :', itemImages)
		console.log('itemCountList:', itemCountList)

		// 결과를 담을 배열
		const nameList =[]
		const imageList = [];

		// 각 이미지를 itemCountList에 따라 그룹화하여 groupedImages에 추가
		let currentIndex = 0;
		itemCountList.forEach(count => {
			const imageGroup = itemImages.slice(currentIndex, currentIndex + count);
			const nameGroup = itemNames.slice(currentIndex, currentIndex + count);
			imageList.push(imageGroup);
			nameList.push(nameGroup);
			currentIndex += count;
		});

		console.log('imageList:', imageList);
		console.log('nameList:', nameList);



		// orderList 배열을 순회하면서 itemCount 필드를 추가
		const jsonString = JSON.stringify(orderList);

		// JSON.parse()를 사용하여 문자열을 객체로 변환
		const orderList2= JSON.parse(jsonString);
		const orderList3 = orderList2.map((order, i) => {
			const itemCount = itemCountList[i];
			const firstImage = imageList[i][0]
			const firstName = nameList[i][0]
		    return {  //  새 객체를 만듬
				...order, // 기존의 주문 객체의 모든 속성을 복사
				itemCount, // itemCount 필드 추가
				firstImage,
				firstName
			};
		});

		console.log('orderList3[0] :',orderList3[0]);



		// const totalItemNum = await Order.find({userId}).count()     count deprecated
		// const totalItemNum = await Order.find({userId}).countDocuments()
		// console.log('totalITemNum:', totalItemNum)
		// console.log('orderList.length:', orderList.length)
		// const totalPages = Math.ceil(totalItemNum / PAGE_SIZE)
		// console.log('totalPages :', totalPages)

		response.itemsList = newItemsInfo
		response.nameList = nameList
		response.imageList = imageList

		res.status(200).json(response)
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}
orderController.getOrderList2=async(req, res)=>{
	try{
		const {page, orderNum} = req.query
		const userId =  req.userId
		console.log('다음 유저의 orderList검색: ', userId)

		let cond ={}  // condition 객체
		if (userId.level !== 'admin'){
			cond = { userId: userId };
		}

		if (orderNum) {
			cond.orderNum = { $regex: orderNum, $options: 'i' };
		}
		// const cond = orderNum? {
		// 	orderNum:{$regex: orderNum, $options:'i'}
		// 	} 
		// 	:{}
		console.log('cond : ', cond)
		console.log('백엔드 page', page)

		let query = Order2.find(cond)
		let response = {status:'success'}

		if(page){
			query.skip((page-1)*PAGE_SIZE).limit(PAGE_SIZE)
			const totalItemNum = await Order2.find(cond).countDocuments()
			const totalPages = Math.ceil(totalItemNum / PAGE_SIZE)
			response.totalPageNum = totalPages
		}

		const orderList = await query.exec()
		response.orderList = orderList
		console.log('찾은 orderList', orderList)

		res.status(200).json(response)
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}

orderController.updateOrder2 = async (req, res) => {
    try {
        const { orderId, newStatus } = req.body;
        const updatedOrder = await Order2.findOneAndUpdate(
            { _id: orderId }, // 검색 조건
            { status: newStatus }, // 수정 내용
            { new: true } // 수정된 문서를 반환하도록 설정
        );
		console.log('업데이트된 order :', updatedOrder)
        if (!updatedOrder) {
            throw new Error("주문을 찾을 수 없습니다.")
        }
        // 수정된 주문을 클라이언트로 응답
        res.status(200).json({status:'ok', updatedOrder: updatedOrder});
    } catch (error) {
        console.error("주문 업데이트 오류:", error);
        res.status(500).json({ status:'fail', error: "주문을 업데이트하는 동안 오류가 발생했습니다." });
    }
};


module.exports = orderController;