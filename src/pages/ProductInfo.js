import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

import StarIcon from '../components/Icon/StartIcon';
import Progress from '../components/Progress';
import CallAPI from '../services/CallAPI';
import CallAuthAPI from '../services/CallAuthAPI';
import { useUserState } from "../contexts/UserContext";

export default function ProductInfo(props) {
  const { isAuthenticated } = useUserState();
  const [product, setProduct] = useState();
  const [productByBrand, setProductByBrand] = useState();
  const [productByCate, setProductByCate] = useState();
  // const [productByCate2, setProductByCate2] = useState();
  const [load, setLoad] = useState(false);
  const [alert, setAlert] = useState({ type: '', info: '' });
  const [showAlert, setShowAlert] = useState(false);

  const [imgCurr, setImgCurr] = useState('')
  const [filter, setFilter] = useState({ size: 'S', color: 0, quantity: 1 });
  const productId = useParams().id;

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      try {
        let resProductData = await CallAPI(`/product/${productId}`, 'get', {});
        setProduct(resProductData.data.data);
        setLoad(false);
        //call api relative
        let productDataByBrand = CallAPI(`/product/search?brand=${resProductData.data.data.brand._id}&limit=5`, 'get', {});
        let productDataByCate = CallAPI(`/product/search?cate=${resProductData.data.data.cate[0]}&limit=9`, 'get', {});
        setImgCurr(resProductData.data.data.imageList[0]);
        let resProductDataByBrand = await productDataByBrand;
        let resProductDataByCate = await productDataByCate;
        //filter 4 products for brand
        let filterResProductDataByBrand = resProductDataByBrand.data.data.products.filter(product => product._id !== resProductData.data.data._id)
        if (filterResProductDataByBrand.length > 4)
          filterResProductDataByBrand = filterResProductDataByBrand.splice(0, 4);
        setProductByBrand(filterResProductDataByBrand);
        //filter 8 products for cate
        let filterResProductDataByCate = resProductDataByCate.data.data.products.filter(product => product._id !== resProductData.data.data._id)
        if (filterResProductDataByCate.length > 8)
          filterResProductDataByCate = filterResProductDataByCate.splice(0, 8);
        setProductByCate(filterResProductDataByCate);
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
    }
    fetchData();
  }, [productId])

  // console.log(filter);
  const handleAddProductToCart = async () => {
    setShowAlert(false);
    setLoad(true);
    let cartTemp = JSON.parse(JSON.stringify(props.cart.cart));//clone cart
    for (let i = 0; i < cartTemp.length; i++) {//check already in your cart
      if (cartTemp[i].productId._id === productId && product.colors[filter.color]._id === cartTemp[i].color._id && filter.size === cartTemp[i].size) {
        setLoad(false);
        setShowAlert(true);
        setAlert({ type: 'danger', info: 'This product is already in your cart! ❌' })
        return;
      }
    }
    cartTemp.push({
      productId: product,
      size: filter.size,
      quantity: filter.quantity,
      color: product.colors[filter.color]
    });
    let totalPriceRaw = 0;
    let totalProducts = 0;
    for (let i = 0; i < cartTemp.length; i++) {
      totalPriceRaw += Number(cartTemp[i].productId.price) * Number(filter.color.quantity);
      totalProducts += Number(filter.color.quantity);
    }
    localStorage.setItem('CART', JSON.stringify({ cart: cartTemp, totalPriceRaw, totalProducts }));

    if (isAuthenticated) {//CallAuthAPI
      try {
        let res = await CallAuthAPI('/user/update-cart', 'put', { cart: cartTemp });
        // console.log(res.data);
      }
      catch (err) {
        console.log(err);
        setLoad(false);
        setShowAlert(true)
        setAlert({ type: 'danger', info: 'Can not add to cart! ❌' })
      }
    }
    setShowAlert(true)
    setAlert({ type: 'success', info: 'Add to cart successfully ✔️' })
    props.setUpdateCart(prevState => (!prevState))//update cart
    setLoad(false);
  }

  return (
    <Container>
      <Progress isLoad={load} />
      <center>Product Info</center>
      <Row>
        <Col lg={1}>
          <div className='product-info-thumbnail-wrapper'>
            {product && product.imageList.map((image, idx) => (
              <img key={idx} className='product-info-thumbnail cursor-hover' onClick={() => { (imgCurr !== image) && setImgCurr(image); }} src={image} alt={product.name + idx} title={product && product.name + ' ' + idx} />
            ))}
          </div>
        </Col>
        <Col lg={4}>
          <img className='product-info-img' title={product && product.name + 'main'} src={imgCurr} alt={product && product.name + ' main'} />
        </Col>
        <Col lg={5}>
          <Row style={{ height: '100%' }}>
            <Col lg={1}>
            </Col>
            <Col lg={11} className='product-info-detail'>
              <div>
                <h1 className='product-info-detail-title m-0'>{product && product.name}</h1>
                <p className='product-info-detail-price mb-2'>${product && product.price}</p>
                <div className='d-flex align-items-center'>
                  <StarIcon color='#FFD543' className='me-1' />
                  <StarIcon color='#FFD543' className='me-1' />
                  <StarIcon color='#FFD543' className='me-1' />
                  <StarIcon color='#D4D3D3' className='me-1' />
                  <StarIcon color='#D4D3D3' className='me-3' />
                  <span className='text-regular text-14 ps-2' style={{ borderLeft: '1px solid #D4D3D3' }}>0 review</span>
                </div>
                <div >
                  <p className='mt-4 text-14'>Size</p>
                  <button onClick={() => setFilter(prevState => ({ ...prevState, size: 'S' }))} className={`product-info-size-item-btn${filter.size === 'S' ? '-active' : ''}`} title='Size S'>S</button>
                  <button onClick={() => setFilter(prevState => ({ ...prevState, size: 'M' }))} className={`product-info-size-item-btn${filter.size === 'M' ? '-active' : ''} mx-3`} title='Size M'>M</button>
                  <button onClick={() => setFilter(prevState => ({ ...prevState, size: 'L' }))} className={`product-info-size-item-btn${filter.size === 'L' ? '-active' : ''}`} title='Size L'>L</button>
                </div>
                <div>
                  <p className='mt-4 text-14'>Color</p>
                  <div className='d-flex flex-wrap'>
                    {product && product.colors.map((color, idx) => (
                      <div style={{ width: '11%' }} key={color.code}>
                        <button onClick={() => setFilter(prevState => ({ ...prevState, color: idx }))} title={color.name} className={`product-filter-color-item${filter.color === idx ? '-active' : ''}`} title={color.name} style={{ backgroundColor: color.code }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className='d-flex align-self-center'>
                  <p className='mt-4 text-14'>Quantity</p>
                  <div style={{ margin: '15px 0 5px 21px', padding: '5px 10px', border: '2px solid #d4d3d3' }}>
                    <span onClick={() => setFilter(prevState => ({ ...prevState, quantity: prevState.quantity > 1 ? prevState.quantity - 1 : 1 }))} className='p-2 cursor-hover cart-item-quanlity-btn'>-</span>
                    <input type='number' onChange={(e) => setFilter(prevState => ({ ...prevState, quantity: (!isNaN(e.target.value) && e.target.value > 1) ? e.target.value : 1 }))} name='quantitity' value={filter.quantity} className='text-center' style={{ width: '36px', border: 'none' }} />
                    <span onClick={() => setFilter(prevState => ({ ...prevState, quantity: prevState.quantity + 1 }))} className='p-2 cursor-hover cart-item-quanlity-btn'>+</span>
                  </div>
                </div>
                <Button onClick={handleAddProductToCart} className='product-info-bnt-add-to-cart'>Add to cart</Button>
                {showAlert ?
                  <Alert variant={alert.type} onClose={() => setShowAlert(false)} dismissible>
                    <p>
                      {alert.info}
                    </p>
                  </Alert>
                  : null
                }
                <hr className='mt-0' />
                <div className='mt-2 text-12' >
                  <div dangerouslySetInnerHTML={{ __html: product ? product.size[filter.size === 'S' ? 0 : filter.size === 'M' ? 1 : 2].info : '' }} />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg={1}></Col>
        <Col lg={1} className='product-from-brand'>
          <p className='m-0'>More From</p>
          <p className='text-regular'>{product && product.brand.name}</p>
          {productByBrand && productByBrand.map((product) => (
            <Link key={product._id} to={'product/' + product._id} title={product.name}>
              <img src={product.imageList[0]} alt={product.name} className='img-cover' />
            </Link>
          ))}
        </Col>
      </Row >
      <br />
      <br />
      <br />
      <Row>
        <Col lg={1}><p className='text-with-line-between'></p></Col>
        <Col lg={11}>
          <p className='text-with-line-between'><span>Review</span></p>
        </Col>
      </Row >
      <Row >
        <Col lg={1}></Col>
        <Col lg={10}>
          <center><p className='text-14 text-regular product-info-no-review'>No reviews</p></center>
        </Col>
        <Col lg={1}></Col>
      </Row >
      <Row >
        <Col lg={1}><p className='text-with-line-between'></p></Col>
        <Col lg={11}>
          <p className='text-with-line-between'><span>You may also like</span></p>
        </Col>
      </Row >
      <Row style={{ marginTop: '21px' }}>
        <Col lg={6}>
          <Row>
            {productByCate && productByCate.length > 0 && productByCate.slice(0, 4).map(product => (
              <Col lg={3} key={product._id}>
                <Link to={'/product-info/' + product._id} className='link-custom'>
                  <img className='img-cover' src={product.imageList[0]} alt={product.name} width='100%' height='195px' />
                  <span className='text-regular text-14'>{product.name}</span>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>
        <Col lg={6}>
          <Row>
            {productByCate && productByCate.length > 4 && productByCate.slice(4, 8).map(product => (
              <Col lg={3} key={product._id}>
                <Link to={'/product-info/' + product._id} className='link-custom'>
                  <img className='img-cover' src={product.imageList[0]} alt={product.name} width='100%' height='195px' />
                  <span className='text-regular text-14'>{product.name}</span>
                </Link>
              </Col>
            ))}
          </Row>
        </Col>
      </Row >
    </Container >
  )
}