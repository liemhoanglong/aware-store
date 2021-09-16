import React, { useState } from 'react';
import { Button } from "react-bootstrap";

import CallAuthAPI from '../../services/CallAuthAPI';
import { useUserState } from "../../contexts/UserContext";
import Progress from '../Progress';

export default function CartTotal(props) {
    const [load, setLoad] = useState(false);
    const handleCheckOut = () => {

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
                    <span>${props.totalPriceRaw}</span>
                </div>
                <hr />
                <div className='d-flex justify-content-between'>
                    <b><span>Subtotal</span></b>
                    <b><span>${props.totalPriceRaw}</span></b>
                </div>
            </div>
            <Button onclick={handleCheckOut} className='cart-btn-checkout'>Check out</Button>
        </div>
    )
}