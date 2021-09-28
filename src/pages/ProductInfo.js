import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

import StarIcon from '../components/Icon/StartIcon';
import Progress from '../components/Progress';
import Paginate from '../components/Paginate';
import Comment from '../components/Comment';
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
  const [filter, setFilter] = useState({ size: '', color: 0, quantity: 1 });
  const productId = useParams().id;

  const [page, setPage] = useState(1);
  const [commentData, setCommentData] = useState();
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      try {
        // let resCommentData = CallAPI(`/comment/product/${productId}`, 'get', {});
        let resRateData = CallAPI(`/comment/rate/${productId}`, 'get', {});
        let resProductData = await CallAPI(`/product/${productId}`, 'get', {});
        setProduct(resProductData.data.data);
        setLoad(false);
        // let resultCommentData = await resCommentData;
        let resultRateData = await resRateData;
        // setCommentData(resultCommentData.data);
        setRate(resultRateData.data ? resultRateData.data : 0);
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
        setFilter({ size: '', color: 0, quantity: 1 })
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
    }
    fetchData();
  }, [productId])

  useEffect(() => {
    const fetchData = async () => {
      setLoad(true);
      try {
        let resCommentData = CallAPI(`/comment/product/${productId}?page=${page}`, 'get', {});
        let resultCommentData = await resCommentData;
        setCommentData(resultCommentData.data);
        setLoad(false);
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
    }
    fetchData();
  }, [productId, page]);

  // console.log(filter);
  const handleAddProductToCart = async () => {
    setShowAlert(false);
    if (!filter.size) {
      setShowAlert(true);
      setAlert({ type: 'warning', info: 'Your must choice size before add to cart! ⚠️' })
      return;
    }
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

  const handleChangePage = (page) => {
    // console.log('onclick ' + page)
    if (page < 1) page = 1;
    if (page === Number(page)) return;
    if (page > Math.ceil(commentData.count / 4)) page = Math.ceil(commentData.count / 4);
    setPage(page);
  }

  const handleClickPrePage = () => {
    let pagePrev = page;
    // console.log('onclick Pre Page ' + page)
    if (pagePrev - 1 < 1) return;
    --pagePrev;
    setPage(pagePrev);
    // handleChangePage(pagePrev);
  }

  const handleClickNextPage = () => {
    let pageNext = page;
    // console.log('onclick Next Page ' + page)
    if (pageNext + 1 > Math.ceil(commentData.count / 4)) return;
    ++pageNext;
    setPage(pageNext);
    // handleChangePage(pageNext);
  }

  const [itemInStock, setItemInStock] = useState(null);

  useEffect(() => {
    if (!product) return;
    if (product.status === 0) {
      setItemInStock('Sold out');
      return;
    }
    if (filter.size) {
      let idx = product.size.findIndex(e => e.name === filter.size);
      let res = product.size[idx].quantity - product.sold[idx].quantity;
      return setItemInStock(res + ' item(s) in stock');
    }

  }, [product, filter]);

  return (
    <Container>
      <Progress isLoad={load} />
      <center className='my-4 text-regular'><p>{product && product.catelist[0].name + '/' + product.categroup[0].name + '/' + product.name}</p></center>
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
                <p className='product-info-detail-price mb-2'>{product && product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                <div className='d-flex'>
                  <StarIcon color={`${rate > 0 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                  <StarIcon color={`${rate > 1 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                  <StarIcon color={`${rate > 2 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                  <StarIcon color={`${rate > 3 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                  <StarIcon color={`${rate > 4 ? '#FFD543' : '#D4D3D3'}`} className='me-3' />
                  <span className='text-regular text-14 ps-2' style={{ borderLeft: '1px solid #D4D3D3', marginTop: '-2px' }}>{commentData && commentData.count ? commentData.count : 0} review(s)</span>
                </div>
                <div >
                  <p className='mt-4 text-14'>Size</p>
                  {product && product.size.map((each, idx) => (
                    <button key={each.name} onClick={() => setFilter(prevState => ({ ...prevState, size: each.name, quantity: 1 }))} className={`me-3 product-info-size-item-btn${filter.size === each.name ? '-active' : ''}`} title={`Size ${each.name}`} disabled={product.sold[idx].quantity === each.quantity}>{each.name}</button>
                  ))}
                  <p className='mt-4 text-14 text-danger'><b>{itemInStock}</b></p>
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
                    <input type='number' onChange={(e) => setFilter(prevState => ({ ...prevState, quantity: e.target.value > itemInStock ? itemInStock : e.target.value > 1 ? e.target.value : 1 }))} name='quantitity' value={filter.quantity} className='text-center' style={{ width: '36px', border: 'none' }} />
                    <span onClick={() => setFilter(prevState => ({ ...prevState, quantity: prevState.quantity === itemInStock ? itemInStock : prevState.quantity + 1 }))} className='p-2 cursor-hover cart-item-quanlity-btn'>+</span>
                  </div>
                </div>
                <Button onClick={handleAddProductToCart} className='product-info-bnt-add-to-cart' disabled={product && product.status ? 0 : 1}>Add to cart</Button>
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
                  <div dangerouslySetInnerHTML={{ __html: product ? product.info : '' }} />
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
          {commentData && commentData.count > 0 ?
            <>
              <div className='d-flex justify-content-end mb-2'>
                <Paginate
                  handleClickPrePage={handleClickPrePage}
                  handleClickNextPage={handleClickNextPage}
                  page={page}
                  handleChangePage={handleChangePage}
                  data={commentData}
                  limit={4}
                />
              </div>
              <Comment commentData={commentData} />
              <div className='d-flex justify-content-end'>
                <Paginate
                  handleClickPrePage={handleClickPrePage}
                  handleClickNextPage={handleClickNextPage}
                  page={page}
                  handleChangePage={handleChangePage}
                  data={commentData}
                  limit={4}
                />
              </div>
            </>
            : <center><p className='text-14 text-regular product-info-no-review'>No reviews</p></center>
          }
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
                <Link to={'/product-info/' + product._id} className='link-custom' title={product.name}>
                  <img className='img-cover' src={product.imageList[0]} alt={product.name} width='100%' height='195px' />
                  <span className='text-regular text-14 product-card-name-text' >{product.name}</span>
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