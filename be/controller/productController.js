const ExcelJS = require('exceljs');

const firebaseApp = require('../app')
const admin = firebaseApp.admin;
const db = admin.firestore();
const productsCollection = db.collection('products');

const PAGE_SIZE =5
const productController={}

productController.createProduct = async(req, res)=>{
	try{
		const {sku,name,image,category,description,stock,price,status,isDeleted} = req.body;

		const newProduct = {sku, name,image,category,
			description,
			stock,price,
			status:'active',
			isDeleted: 'false'
		}

		await productsCollection.add(newProduct)
		
		return res.status(200).json({status:'ok', data:newProduct})
	}catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}
productController.batchCreateProducts = async(req, res) => {
	console.log('batch시작')
    try {
		function convertToValidJSON(input) {   // "쌍따옴표 넣어주기"
			const corrected = input.replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
			return corrected;
		}

        const file = req.file;
		console.log('file :', file)
        if (!file) {
            return res.status(400).json({ status: 'fail', error: '파일이 제공되지 않았습니다.' });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(file.path); // file.buffer를 안사용

        const worksheet = workbook.getWorksheet(1);
        const createdProducts = [];

        worksheet.eachRow({ includeEmpty: false }, async (row, rowNumber) => {
            if (rowNumber > 1) { // 첫 번째 행은 헤더로 가정
                const sku = row.getCell(1).value;
                const name = row.getCell(2).value;
                const image = row.getCell(3).value;
				const description = row.getCell(4).value;
				const price = parseInt(row.getCell(5).value); 
				const status = row.getCell(6).value;
                const category = row.getCell(7).value.split(',').map(item => item.trim())
                const stockValue = row.getCell(8).value;
                const isDeleted = row.getCell(9).value === 'TRUE';

				let stock;
				try {
					const validJSON = convertToValidJSON(stockValue);
					stock = JSON.parse(validJSON);
				} catch (e) {
					console.error(`Stock JSON parsing error at row ${rowNumber}: ${stockValue}`);
					return; // 이 행을 건너뛰거나 에러 처리
				}

                const newProduct = { sku, name, image, category, description, stock, price, status, isDeleted }
                await productsCollection.add(newProduct)
                createdProducts.push(newProduct);
            }
        });

        return res.status(200).json({ status: 'ok', data: createdProducts });
    } catch (e) {
        return res.status(500).json({ status: 'fail', error: e.message });
    }
};


productController.getProductList=async(req, res)=>{
	try{
		const {page, name}= req.query  // ?뒤의 쿼리값
		let query = productsCollection.where('isDeleted','==',false);  // firebase 쿼리객체 생성
		
		if(name){
			query = query.where('name','>=',name).where('name','<=',name)
		}
		
		let response ={status: 'success'} // response전용 객체

		if(page){
			const offset = (page -1)*PAGE_SIZE // skip 부분이다.

			query = query.limit((PAGE_SIZE).offset(offset)
			//전체페이지(총페이지) = 전체 데이터 /PAGE_SIZE
			const totalItemNumSnapshot = await productsCollection.where('isDeleted','==',false).get()
			const totalItemNum = totalItemNumSnapshot.size;

			const totalPages = Math.ceil(totalItemNum / PAGE_SIZE)
			response.totalPageNum = totalPages 
		}

		const querySnapshot = await query.get() //Firebase 쿼리실행
		const productList =[]
		
		// 쿼리 결과를 productList 배열에 추가합니다.
        querySnapshot.forEach(doc => {
            productList.push(doc.data());
        });

		response.data = productList
		res.status(200).json(response) 
		console.log('찾은 productList:', productList)
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}
productController.getProductById = async(req,res)=>{
	try{
		const id = req.params.id
		const productDoc = await productsCollection.doc(id).get();
		if(productDoc.exists){
			const foundProduct = productDoc.data()
			res.status(200).json({status:'ok', data:foundProduct})
		}
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}

productController.updateProduct =async(req,res)=>{
	try{
		const id = req.params.id
		const {sku,name,image,category,description,stock,price,status,isDeleted} = req.body;

		// 업데이트할 데이터
		const updatedProductData = {
			sku, name,image,category,description,stock,
			price,status,isDeleted
		};

		// 제품 컬렉션에서 해당 문서를 업데이트
      	await productsCollection.doc(id).set(updatedProductData, { merge: true });

		res.status(200).json({status:'ok', data: updatedProductData})
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}

productController.deleteProduct =async(req, res)=>{
  try {
    const id = req.params.id;
    // 해당 제품 문서를 가져옴
    const productRef = productsCollection.doc(id);
	// isDeleted 필드를 true로 업데이트
    await productRef.update({ isDeleted: true });

    res.status(200).json({ status: "success", message:'A item was deleted successfully' });
  } catch (e) {
    res.status(400).json({ status: "fail", error: e.message });
  }
};

// 실제 삭제하는 코드
// const productController = {
//   deleteProduct: async (req, res) => {
//     try {
//       const id = req.params.id;

//       // 제품 컬렉션에서 해당 문서를 삭제
//       await productsCollection.doc(id).delete();

//       // 성공 메시지를 응답으로 보냄
//       res.status(200).json({ status: "success", message: 'A item was deleted successfully' });
//     } catch (e) {
//       // 에러 발생 시 적절한 응답을 보냄
//       res.status(400).json({ status: "fail", error: e.message });
//     }
//   }
// };


productController.checkStock=async(item)=>{
	try{
		// 사려는 아이템 재고 정보 들고오기
		const productRef = await productsCollection.doc(item.productId);
		const productSnapshot = await productRef.get();
	
		if (!productSnapshot.exists) {
		  return {
			isVerify: false,
			message: '해당 제품을 찾을 수 없습니다.'
		  };
		}
		// 사려는 아이템 qty, 재고 비교
		// 재고가 불충불하면 불충분 메시지와 함께 데이터 반환
		// 충분하다면, 재고에서 -qty. 성공
		const productData = productSnapshot.data();
		if (productData.stock[item.size] < item.qty) {
		  return {
			isVerify: false,
			message: `${productData.name}의 ${item.size} 재고가 부족합니다. \n현재 ${productData.stock[item.size]}개 재고가 있습니다.`
		  };
		}
		// 충분한 재고가 있으면 재고에서 qty만큼 빼기
		const newStock = { ...productData.stock };
		newStock[item.size] -= item.qty;
		await productRef.update({ stock: newStock });
	
		return { isVerify: true };
	} catch(e){
		console.error('재고 확인 및 업데이트 중 오류 발생:', error);
		return {
		isVerify: false,
		message: '재고 확인 및 업데이트 중 오류가 발생했습니다.'
		};
	}
}

productController.checkItemsStock= async (items)=>{
	const insufficientStockItems =[]
	await Promise.all(
		items.map(async(item)=>{
			try{
				const stockCheck = await productController.checkStock(item)
				if(!stockCheck.isVerify){
					insufficientStockItems.push({item, message:stockCheck.message})
				}
			} catch(e){
				console.error("Error checking stock:", error);
			}
		})
	)
	return insufficientStockItems;
}


module.exports = productController;