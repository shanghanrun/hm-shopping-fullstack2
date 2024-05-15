import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import productStore from '../store/productStore'
import { sizes } from '../constants/sizes.constants';


function SizeDropdown() {
  const {setProducts, initialProductList} = productStore()
  const iList = [...initialProductList]

  function filterBySize(size){
    console.log('product size: ', size)

    const results = iList.filter(product => Object.keys(product.stock).includes(size))
    setProducts(results)
  }
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Size
      </Dropdown.Toggle>

      <Dropdown.Menu style={{background: '#211e1e'}}>
              {/* {genres.map((genre, index) => (
                <Button key={index} variant="primary" size="sm">{genre.name}</Button>
              ))} */}
              {sizes.map((sz, index) => (
                <Button style={{marginRight:"3px", marginBottom:"3px" }} 
					onClick={()=>filterBySize(sz)} key={index} >{sz}</Button>
              ))}
        </Dropdown.Menu>
    </Dropdown>
  );
}

export default SizeDropdown;
