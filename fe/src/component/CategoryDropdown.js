import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import productStore from '../store/productStore'
import { category } from '../constants/category.constants';


function CategoryDropdown() {
  const {setProducts, initialProductList} = productStore()
  console.log('priceDropdown의 initialProductList', initialProductList)
  const iList = [...initialProductList]

  function filterByCategory(category){
    console.log('product category: ', category)

    const results = iList.filter(product => product.name.includes(category) || product.category.includes(category))
    setProducts(results)
  }
  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Category
      </Dropdown.Toggle>

      <Dropdown.Menu style={{background: '#211e1e'}}>
              {/* {genres.map((genre, index) => (
                <Button key={index} variant="primary" size="sm">{genre.name}</Button>
              ))} */}
              {category.map((ct, index) => (
                <Button style={{marginRight:"3px", marginBottom:"3px" }} 
					onClick={()=>filterByCategory(ct)} key={index} >{ct}</Button>
              ))}
        </Dropdown.Menu>
    </Dropdown>
  );
}

export default CategoryDropdown;
