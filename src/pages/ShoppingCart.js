import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import CartTable from '../components/CartTable';
import CartTotal from '../components/CartTotal';

export default function ShoppingCart(props) {
    // console.log(props.cart)
    return (
        <Container>
            <Row>
                <h1 style={{ fontSize: '24px', marginBottom: '36px' }}>My Bag</h1>
                <Col lg={8}>
                    <CartTable cart={props.cart} setUpdateCart={props.setUpdateCart} />
                </Col>
                <Col lg={4}>
                    <CartTotal cart={props.cart.cart} totalPriceRaw={props.cart.totalPriceRaw} />
                </Col>
            </Row>
        </Container>
    )
}