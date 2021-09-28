import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from "react-bootstrap";

import './CartTable.css';
import { useUserState } from "../../contexts/UserContext";
import CallAuthAPI from '../../services/CallAuthAPI';
import Progress from '../Progress';
import Accept from '../Accept';
import EditCart from '../EditCart';
import goShoppingNow from '../../images/go-shopping-now.png';

export default function CartTable(props) {
  const { isAuthenticated } = useUserState();
  const [load, setLoad] = useState(false);
  const [acceptShow, setAcceptShow] = useState(false);
  const [editCartItemShow, setEditCartItemShow] = useState(false);
  const [infoCartItem, setInfoCartItem] = useState({ cartIndex: -1, size: '', color: {}, quantity: 0 });
  const [productIndex, setproductIndex] = useState(-1);
  const [error, setError] = useState('');

  const handleChangeQuantity = async (cartIndex, qty) => {
    let product = props.cart.cart[cartIndex];
    let sizeId = product.productId.size.findIndex(e => e.name === product.size);
    let itemInStock = product.productId.size[sizeId].quantity - product.productId.sold[sizeId].quantity;
    if (qty < 1 || qty === itemInStock + 1) return;
    if (qty > itemInStock)
      qty = itemInStock;
    if (qty === product.quantity) return;
    setInfoCartItem({ ...props.infoCartItem, quantity: qty })
    setLoad(true)
    let cartTemp = JSON.parse(JSON.stringify(props.cart));//clone cart
    if (cartTemp.cart[cartIndex].quantity === Number(qty)) return;
    if (cartIndex > -1) {
      cartTemp.cart[cartIndex].quantity = Number(qty);
    }

    //change local storage
    let totalPriceRaw = 0;
    let totalProducts = 0;
    for (let i = 0; i < cartTemp.cart.length; i++) {
      totalPriceRaw += Number(cartTemp.cart[i].productId.price) * Number(cartTemp.cart[i].quantity);
      totalProducts += Number(cartTemp.cart[i].quantity);
    }
    localStorage.setItem('CART', JSON.stringify({ cart: cartTemp.cart, totalPriceRaw, totalProducts }));

    if (isAuthenticated) {//CallAuthAPI
      try {
        let res = await CallAuthAPI('/user/update-cart', 'put', { cart: cartTemp.cart });
        // console.log(res.data);
      }
      catch (err) {
        console.log(err);
        setLoad(false);
      }
    }
    props.setUpdateCart(prevState => (!prevState))//update cart
    setLoad(false);
  }

  const handleAcceptRemoveProduct = async (cartIndex) => {
    setAcceptShow(true);
    setproductIndex(cartIndex)
  }

  const handleRemoveProduct = async (cartIndex) => {
    setAcceptShow(false);
    setLoad(true)
    let cartTemp = JSON.parse(JSON.stringify(props.cart));//clone cart
    if (cartIndex > -1) {
      cartTemp.cart.splice(cartIndex, 1);
    }

    //change local storage
    let totalPriceRaw = 0;
    let totalProducts = 0;
    for (let i = 0; i < cartTemp.cart.length; i++) {
      totalPriceRaw += Number(cartTemp.cart[i].productId.price) * Number(cartTemp.cart[i].quantity);
      totalProducts += Number(cartTemp.cart[i].quantity);
    }
    localStorage.setItem('CART', JSON.stringify({ cart: cartTemp.cart, totalPriceRaw, totalProducts }));

    if (isAuthenticated) {//CallAuthAPI
      try {
        let res = await CallAuthAPI('/user/update-cart', 'put', { cart: cartTemp.cart });
        // console.log(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }
    setInfoCartItem({ cartIndex: -1, size: '', color: {}, quantity: 0 })
    props.setUpdateCart(prevState => (!prevState))//update cart
    setLoad(false);
  }

  const handleChangeProduct = async (cartIndex) => {
    setEditCartItemShow(true)
    let cartTemp = JSON.parse(JSON.stringify(props.cart)).cart;//clone cart
    setInfoCartItem({ cartIndex: cartIndex, quantity: cartTemp[cartIndex].quantity, size: cartTemp[cartIndex].size, color: cartTemp[cartIndex].color })
  }

  const handleEditCartItem = async () => {
    setError('');
    let cartTemp = JSON.parse(JSON.stringify(props.cart));//clone cart
    if (cartTemp.cart[infoCartItem.cartIndex].quantity === Number(infoCartItem.quantity) &&
      cartTemp.cart[infoCartItem.cartIndex].size === infoCartItem.size &&
      cartTemp.cart[infoCartItem.cartIndex].color === infoCartItem.color
    ) return;
    if (infoCartItem.cartIndex > -1) {
      for (let i = 0; i < cartTemp.cart.length; i++) {
        if (i !== infoCartItem.cartIndex) {
          if (cartTemp.cart[i].productId._id === cartTemp.cart[infoCartItem.cartIndex].productId._id &&
            infoCartItem.size === cartTemp.cart[i].size &&
            infoCartItem.color._id === cartTemp.cart[i].color._id) {
            setError('This product is exist!');
            return;
          }
        }
      }
      cartTemp.cart[infoCartItem.cartIndex].quantity = Number(infoCartItem.quantity);
      cartTemp.cart[infoCartItem.cartIndex].size = infoCartItem.size;
      cartTemp.cart[infoCartItem.cartIndex].color = infoCartItem.color;
    }
    // console.log(cartTemp)
    //change local storage
    let totalPriceRaw = 0;
    let totalProducts = 0;
    for (let i = 0; i < cartTemp.cart.length; i++) {
      totalPriceRaw += Number(cartTemp.cart[i].productId.price) * Number(cartTemp.cart[i].quantity);
      totalProducts += Number(cartTemp.cart[i].quantity);
    }
    localStorage.setItem('CART', JSON.stringify({ cart: cartTemp.cart, totalPriceRaw, totalProducts }));
    setEditCartItemShow(false);

    if (isAuthenticated) {//CallAuthAPI
      setLoad(true)
      try {
        let res = await CallAuthAPI('/user/update-cart', 'put', { cart: cartTemp.cart });
        // console.log(res.data);
      }
      catch (err) {
        console.log(err);
        setLoad(false);
      }
    }
    props.setUpdateCart(prevState => (!prevState))//update cart
    setLoad(false);
  }

  return (
    <div>
      <Accept
        show={acceptShow}
        onHide={() => setAcceptShow(false)}
        onAccepted={() => handleRemoveProduct(productIndex)}
        title='Do you really want to remove this product?'
      />
      <EditCart
        show={editCartItemShow}
        onHide={() => setEditCartItemShow(false)}
        onAccepted={() => handleEditCartItem()}
        infoCartItem={infoCartItem}
        setInfoCartItem={setInfoCartItem}
        cart={props.cart}
        error={error}
      />
      <Progress isLoad={load} />
      {props.cart.cart.length > 0 &&
        <Row >
          <Col lg={4}>
            <div className='text-14'><b>Product</b></div>
          </Col>
          <Col lg={8}>
            <Row >
              <Col lg={5}>
                <Row >
                  <Col lg={6}>
                    <div className='text-center text-14'><b>Color</b></div>
                  </Col>
                  <Col lg={6}>
                    <div className='text-center text-14'><b>Size</b></div>
                  </Col>
                </Row>
              </Col>
              <Col lg={7}>
                <Row >
                  <Col lg={8}>
                    <div className='text-center text-14'><b>Quanlity</b></div>
                  </Col>
                  <Col lg={4}>
                    <div className='text-end text-14'><b>Amount</b></div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      }
      {props.cart.cart.length > 0 ? props.cart.cart.map((item, idx) => (
        <div key={idx}>
          <Row key={idx}>
            <Col lg={12}>
              <hr className='my-2' />
            </Col>
            <Col lg={4}>
              <div className='cart-item-product-col text-14 d-flex'>
                <Link to={`product-info/${item.productId._id}`}><img className='cart-item-product-col-img' src={item.productId.imageList[0]} alt={item.productId.name} width='80px' height='100%' /></Link>
                <div className='d-flex justify-content-between flex-column' style={{ marginLeft: '20px' }}>
                  <Link to={`product-info/${item.productId._id}`} className='link-custom cart-item-product-col-name'>{item.productId.name}</Link>
                  <div>
                    <span onClick={() => handleChangeProduct(idx)} className='cursor-hover pe-1 text-12' >Change</span>
                    <span onClick={() => handleAcceptRemoveProduct(idx)} className='cursor-hover ps-1 text-12' style={{ borderLeft: '.5px solid #979797' }}>Remove</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={8}>
              <Row style={{ height: '100%' }}>
                <Col lg={5}>
                  <Row style={{ height: '100%' }}>
                    <Col lg={6} className='text-center d-flex justify-content-center align-self-center'>
                      <div className='text-center cart-item-color' style={{ backgroundColor: item.color.code }}></div>
                    </Col>
                    <Col lg={6} className='text-center d-flex justify-content-center align-self-center'>
                      <div className='text-center'>{item.size}</div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={7}>
                  <Row style={{ height: '100%' }}>
                    <Col lg={8} className='text-center d-flex justify-content-center align-self-center'>
                      <div style={{ padding: '10px', border: '2px solid #d4d3d3' }}>
                        <span onClick={() => handleChangeQuantity(idx, Number(item.quantity) - 1)} className='p-2 cursor-hover cart-item-quanlity-btn'>-</span>
                        <input onChange={(e) => handleChangeQuantity(idx, e.target.value)} name='quantitity' className='text-center' value={item.quantity} style={{ width: '36px', border: 'none' }} type='number' />
                        <span onClick={() => handleChangeQuantity(idx, Number(item.quantity) + 1)} className='p-2 cursor-hover cart-item-quanlity-btn'>+</span>
                      </div>
                    </Col>
                    <Col lg={4} className='text-center d-flex justify-content-end align-self-center'>
                      <div className='text-end'>{item.productId.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      ))
        :
        <Row>
          <center>
            <Link to='/product-list'> <img src={goShoppingNow} alt='Go shopping now' width='500px' /></Link>
            <h2 className='mt-4 mb-3'><b>Your cart is empty!</b></h2>
            <Link to='/product-list'><Button variant="danger" className='cart-btn-checkout'>Go shopping now</Button></Link>
          </center>
        </Row>
      }
    </div>
  )
}