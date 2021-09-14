import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from "react-bootstrap";

// import './footer.css';

export default function CartTotal(props) {

    return (
        <div>
            <div className='text-14'><b>Total</b></div>
            <div className='cart-total'>
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
            <Button className='cart-btn-checkout'>Check out </Button>
        </div>
    )
}