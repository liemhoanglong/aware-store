import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Row, Col } from "react-bootstrap";

import './CartTable.css';
import { useUserState } from "../../contexts/UserContext";
import CallAuthAPI from '../../services/CallAuthAPI';
import Progress from '../Progress';

export default function CartTable(props) {
    const { isAuthenticated } = useUserState();
    const [load, setLoad] = useState(false);
    const history = useHistory();

    const handleChangeQuantity = async (itemId, qty) => {
        if (qty < 1 || isNaN(qty)) return
        setLoad(true)
        let cartIndex = -1;
        let cartTemp = JSON.parse(JSON.stringify(props.cart));//clone cart
        console.log(cartTemp)
        for (let i = 0; i < cartTemp.length; i++) {
            if (cartTemp[i]._id === itemId) {
                cartIndex = i;
            }
            delete cartTemp[i]._id;
            cartTemp[i].productId = cartTemp[i].productId._id;
        }
        if (cartIndex > -1) {
            cartTemp[cartIndex].quantity = Number(qty);
        }
        if (isAuthenticated) {//CallAuthAPI
            try {
                let res = await CallAuthAPI('/user/update-cart', 'put', { cart: cartTemp });
                console.log(res.data);
                props.setUpdateCart(prevState => (!prevState))
            }
            catch (err) {
                console.log(err);
            }
        } else {//change local storage
            localStorage.setItem('CART', JSON.stringify(cartTemp));
        }
        setLoad(false);
    }

    const handleRemoveProduct = async (itemId) => {
        setLoad(true)
        let cartIndex = -1;
        let cartTemp = JSON.parse(JSON.stringify(props.cart));//clone cart
        for (let i = 0; i < cartTemp.length; i++) {
            if (cartTemp[i]._id === itemId) {
                cartIndex = i;
            }
            delete cartTemp[i]._id;
            cartTemp[i].productId = cartTemp[i].productId._id;
        }
        if (cartIndex > -1) {
            cartTemp.splice(cartIndex, 1);
        }
        if (isAuthenticated) {//CallAuthAPI

            try {
                let res = await CallAuthAPI('/user/update-cart', 'put', { cart: cartTemp });
                console.log(res.data);
                props.setUpdateCart(prevState => (!prevState))
            }
            catch (err) {
                console.log(err);
            }
        } else {//change local storage
            localStorage.setItem('CART', JSON.stringify(cartTemp));
        }
        setLoad(false);
    }

    const handleChangeProduct = async (itemId) => {
        handleRemoveProduct(itemId);
        history.push('/product-item/' + itemId);
    }

    return (
        <div>
            <Progress isLoad={load} />
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
            {props.cart.length > 0 && props.cart.map((item) => (
                <Row key={item._id} >
                    <Col lg={12}>
                        <hr className='my-2' />
                    </Col>
                    <Col lg={4}>
                        <div className='cart-item-product-col text-14 d-flex'>
                            <Link to={`product-item/${item.productId._id}`}><img className='cart-item-product-col-img' src={item.productId.imageList[0]} alt={item.productId.name} width='80px' height='100%' /></Link>
                            <div className='d-flex justify-content-between flex-column' style={{ marginLeft: '20px' }}>
                                <Link to={`product-item/${item.productId._id}`} className='link-custom cart-item-product-col-name'>{item.productId.name}</Link>
                                <div>
                                    <span onClick={() => handleChangeProduct(item._id)} className='cursor-hover pe-1 text-12' >Change</span>
                                    <span onClick={() => handleRemoveProduct(item._id)} className='cursor-hover ps-1 text-12' style={{ borderLeft: '.5px solid #979797' }}>Remove</span>
                                </div>
                            </div>
                        </div>
                        {/* <div>product</div> */}
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
                                            <span onClick={() => handleChangeQuantity(item._id, Number(item.quantity) - 1)} className='p-2 cursor-hover cart-item-quanlity-btn'>-</span>
                                            <input onChange={(e) => handleChangeQuantity(item._id, e.target.value)} name='quantitity' className='text-center' value={item.quantity} style={{ width: '36px', border: 'none' }} />
                                            <span onClick={() => handleChangeQuantity(item._id, Number(item.quantity) + 1)} className='p-2 cursor-hover cart-item-quanlity-btn'>+</span>
                                        </div>
                                    </Col>
                                    <Col lg={4} className='text-center d-flex justify-content-center align-self-center'>
                                        <div className='text-end'>${item.productId.price}</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ))
            }
        </div>
    )
}