import React, { useState } from 'react';
import { Button } from "react-bootstrap";

import CallAuthAPI from '../../services/CallAuthAPI';
import { useUserState } from "../../contexts/UserContext";
import Progress from '../Progress';

export default function CartTotal(props) {
    const { isAuthenticated } = useUserState();
    const [load, setLoad] = useState(false);

    const handleCheckOut = async () => {
        if (!isAuthenticated) {
            props.setLoginShow(true)//open login
            return;
        }
        else {//CallAuthAPI
            setLoad(true);
            try {
                let res = await CallAuthAPI('/order/create', 'post', { feeShipping: 0, phone: '123456', address: 'ha noi', note: '' });
                localStorage.removeItem('CART');
                props.setUpdateCart(prevState => (!prevState))//update cart
                setLoad(false);
            }
            catch (err) {
                console.log(err);
                setLoad(false);
            }
        }
    }

    return (
        <div>
            <Progress isLoad={load} />
            <div className='text-14'><b>Total</b></div>
            <div className='cart-total mt-2'>
                <div className='d-flex justify-content-between'>
                    <span>Shipping & Handling:</span>
                    <span>Free</span>
                </div>
                <div className='d-flex justify-content-between'>
                    <span>Total product:</span>
                    <span>${props.cart.totalPriceRaw}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between'>
                    <b><span>Subtotal</span></b>
                    <b><span>${props.cart.totalPriceRaw}</span></b>
                </div>
            </div>
            <Button onClick={handleCheckOut} variant="danger" className='cart-btn-checkout'>Check out</Button>
        </div>
    )
}