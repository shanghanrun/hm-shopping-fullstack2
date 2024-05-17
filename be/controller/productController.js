const ExcelJS = require('exceljs');
const {data1} = require('../data/data');

const {productsCollection} = require('../firebaseConfig')

const PAGE_SIZE =5
const productController={}

productController.createProduct = async(req, res)=>{
	console.log('product create 시작')
	try{
		const {sku,name,image,category,description,stock,price,status,isDeleted} = req.body;

		const newProduct = {sku, name,image,category,
			description,
			stock,price,
			status:'active',
			isDeleted: 'false'
		}

		const docRef = await productsCollection.add(newProduct)
		console.log('docRef :', docRef)
		console.log("Document written with ID: ", docRef.id);
        return docRef.id; // 성공적으로 문서가 생성된 경우, 문서 ID 반환
		
		return res.status(200).json({status:'ok', data:newProduct})
	}catch(e){
		return res.status(400).json({status:'fail', error:e.message})
	}
}
productController.batch= async(req, res)=>{
	try{
		createdList =[]
		const data = JSON.stringify(data1)
        const dataList = JSON.parse(data);
		console.log('dataList :', dataList)
        for (const item of dataList) {
            const newProduct = {
                sku: item.sku,
                name: item.name,
                image: item.image,
                category: item.category,
                description: item.description,
                stock: item.stock,
                price: item.price,
                status: item.status,
                isDeleted: item.isDeleted
            };
            // productsCollection.add(newProduct)를 비동기적으로 처리
            await productsCollection.add(newProduct);
            createdProducts.push(newProduct);
        }
		
		return res.status(200).json({ status: 'ok', data: createdProducts });
	}catch(e){
		return res.status(500).json({ status: 'fail', error: e.message });
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
					console.log('parsed stock: ', stock)
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
	console.log('getProductList 시작 ')
	try{
		const { page, name } = req.query;  // ?뒤의 쿼리값
        if(name) console.log('name: ', name);
        let response = { status: 'success' }; // response 전용 객체

        // isDeleted가 false인 제품들만 쿼리합니다.
        let query = productsCollection.where('isDeleted', '==', false);

        // 이름 검색 조건이 있다면 해당하는 이름을 포함하는 제품들로 필터링합니다.
        if (name !== undefined && name !== null && name !== '') {
            query = query.where('name', '==', name);
        }

        // 페이지가 지정되었다면 해당 페이지에 해당하는 제품들을 가져오도록 쿼리합니다.
        if (page !== undefined && page !== null && page !== '') {
            const offset = (parseInt(page) - 1) * PAGE_SIZE;
            query = query.limit(PAGE_SIZE).offset(offset);
        }

        const querySnapshot = await query.get();

        // 쿼리 결과를 배열로 변환하여 response에 할당합니다.
        // const productList = querySnapshot.docs.map(doc => doc.data());
		const productList = querySnapshot.docs.map(doc => {
			const data = doc.data();
			data.id = doc.id;  // doc.id를 data 객체에 추가
			return data;
		});

		response.data = productList;

        // 전체 페이지 수를 계산하여 response에 할당합니다.
        if (page !== undefined && page !== null && page !== '') {
            const totalItemNumSnapshot = await productsCollection.where('isDeleted', '==', false).get();
            const totalItemNum = totalItemNumSnapshot.size;
            const totalPages = Math.ceil(totalItemNum / PAGE_SIZE);
            response.totalPageNum = totalPages;
        }

        res.status(200).json(response);
	}catch(e){
		res.status(400).json({status:'fail', error:e.message})
	}
}
productController.getProductById = async(req,res)=>{
	try{
		const id = req.params.id
		const productDocSnapshot = await productsCollection.doc(id).get();
		if(productDocSnapshot.exists){
			const foundProduct = productDocSnapshot.data()
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
	console.log('재고확인 절차 시작')
	console.log('item : ', item) 
	try{
		// 사려는 아이템 재고 정보 들고오기
		const productRef = await productsCollection.doc(item.productId);
		const productDoc = await productRef.get();
		console.log('검사중인 product :', productDoc.data())
	
		if (!productDoc.exists) {
		  return {
			isVerify: false,
			message: '해당 제품을 찾을 수 없습니다.'
		  };
		}
		// 사려는 아이템 qty, 재고 비교
		// 재고가 불충불하면 불충분 메시지와 함께 데이터 반환
		// 충분하다면, 재고에서 -qty. 성공
		const product = productDoc.data();
		console.log('check하는 product :', product)

		if (product.stock[item.size] < item.qty) {
		  return {
			isVerify: false,
			message: `${product.name}의 ${item.size} 재고가 부족합니다. \n현재 ${product.stock[item.size]}개 재고가 있습니다.`
		  };
		}
		// 충분한 재고가 있으면 재고에서 qty만큼 빼기
		const newStock = { ...product.stock };
		newStock[item.size] -= item.qty;

		console.log('여기까지 진행됨')
		await productRef.update({ stock: newStock });
	
		return { isVerify: true };
	} catch(e){
		console.error('재고 확인 및 업데이트 중 오류 발생:', e.error);
		return {
		isVerify: false,
		message: '재고 확인 및 업데이트 중 오류가 발생했습니다.'
		};
	}
}

productController.checkItemsStock= async (items)=>{
	console.log('checkItemsStock - items :', items)

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