import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import SearchBox from "../component/SearchBox";
import productStore from '../store/productStore'
import uiStore from '../store/uiStore'
import NewItemDialog from "../component/NewItemDialog";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductTable from "../component/ProductTable";


const AdminProduct = () => {
  const {productList, getProductList, totalPage, setSelectedProduct, deleteProduct, selectedProduct, batchCreateProducts} = productStore()
  const {showPopup} = uiStore()
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [query, setQuery] = useSearchParams();  
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  const [mode, setMode] = useState("new");
  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(()=>{
    getProductList({...searchQuery})
    console.log('query :', query.toString())
    navigate("?" + query.toString() )
  },[query, selectedProduct])
  useEffect(() => {
    getProductList(searchQuery)
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery.name === ''){
      delete searchQuery.name;
    }

    // const params = new URLSearchParams(searchQuery)
    // const urlQuery = params.toString()
    // console.log('query url:',urlQuery)
    // navigate("?" + urlQuery)    
    const searchParamsString = new URLSearchParams(searchQuery).toString();
    navigate("?" + searchParamsString )    
  }, [searchQuery]);

  const deleteItem = async (id) => {
    //아이템 삭제하가ㅣ
    await deleteProduct(id, navigate)
  };

  const openEditForm = (product) => {
    //edit모드로 설정하고
    // 아이템 수정다이얼로그 열어주기
    setMode('edit')
    setSelectedProduct(product)
    setShowDialog(true)
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고
    setMode('new')
    // 다이얼로그 열어주기
    setShowDialog(true)
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    console.log('selected:', selected)
    setSearchQuery({...searchQuery, page:selected+1})
    //searchQuery가 바뀌면 useEffect실행된다.
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("파일을 선택해주세요.");
      return;
    }
    console.log('selectedFile :', selectedFile)

    const formData = new FormData();
    formData.append('file', selectedFile);
    for (let [key, value] of formData.entries()) {
    console.log('formData: ', key, value);
}
    batchCreateProducts(formData, navigate)
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2" 
          style={{display:'flex', gap:'100px'}}
        >
          <SearchBox
            query={query}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품 이름으로 검색"
            field="name"
          />
          <Button variant="success" onClick={showPopup}>show popup</Button>
           <input type="file" onChange={handleFileChange} accept=".xlsx" />
          <Button variant="danger" onClick={handleUpload}>Add Items(batch)</Button>
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPage} //전체페이지
          forcePage={searchQuery.page -1} // 1페이지면 2임 여긴 한개씩 +1 해야함
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        />
    </div>
  );
};

export default AdminProduct;
