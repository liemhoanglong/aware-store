import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

export default function EditCart(props) {
    let item = props.cart.cart[props.infoCartItem.cartIndex];
    let sizeId = -1;
    if (item)
        sizeId = item.productId.size.findIndex(e => e.name === item.size);
    let itemInStock;
    if (sizeId > -1)
        itemInStock = item.productId.size[sizeId].quantity - item.productId.sold[sizeId].quantity;
    const handleChangeQuantity = async (qty) => {
        let cart = props.cart.cart;
        let product = cart[props.infoCartItem.cartIndex];
        let sumQtyProductSameIdAndSize = 0;
        for (let i = 0; i < cart.length; i++) {//check already in your cart
            // console.log(cart[i])
            if (cart[i].productId._id === product.productId._id && product.size === cart[i].size) {
                sumQtyProductSameIdAndSize += cart[i].quantity;
            }
        }
        // console.log(sumQtyProductSameIdAndSize)
        // console.log(itemInStock)
        if (qty - cart[props.infoCartItem.cartIndex].quantity + sumQtyProductSameIdAndSize > itemInStock) {
            return 1;
        }

        if (qty < 1) return;
        if (qty > itemInStock)
            qty = itemInStock;
        props.setInfoCartItem({ ...props.infoCartItem, quantity: qty })
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <center>
                    <h4><b>Edit product</b></h4>
                </center>
                <div className='mx-4 mb-3'>
                    {props.error && <Alert variant='danger'>{props.error}</Alert>}
                    <div className='d-flex align-items-center my-4'>
                        <p className='' style={{ width: '100px' }}>Color: </p>
                        <div className='d-flex flex-wrap' style={{ width: '75%' }}>
                            {props.cart.cart.length > 0 && props.infoCartItem.cartIndex > -1 && item.productId.colors.map((color, idx) => (
                                <div style={{ width: '11%' }} key={color.code}>
                                    <button onClick={() => props.setInfoCartItem({ ...props.infoCartItem, color })} title={color.name} className={`product-filter-color-item${props.infoCartItem.color.code === color.code ? '-active' : ''}`} title={color.name} style={{ backgroundColor: color.code }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='d-flex align-items-baseline'>
                        <p className='mb-4' style={{ width: '100px' }}>Size: </p>
                        {props.cart.cart.length > 0 && props.infoCartItem.cartIndex > -1 && item.productId.size.map((each, idx) => (
                            <button key={idx} onClick={() => props.setInfoCartItem({ ...props.infoCartItem, size: each.name })} className={`me-3 product-filter-size-item-btn${props.infoCartItem.size === each.name ? '-active' : ''}`} title={`Size ${each.name}`} disabled={item.productId.sold[idx].quantity === each.quantity}>{each.name}</button>
                        ))}
                    </div>
                    <div className='d-flex align-items-baseline'>
                        <p className='mb-5' style={{ width: '100px' }}></p>
                        <p className='text-14 text-danger'><b>{itemInStock > 0 ? itemInStock + ' item(s) in stock' : 'Out of stock'}</b></p>
                    </div>
                    <div className='d-flex align-items-baseline'>
                        <p className='mb-5' style={{ width: '100px' }}>Quantity: </p>
                        <div style={{ padding: '10px', border: '2px solid #d4d3d3', width: '120px' }}>
                            <span onClick={() => handleChangeQuantity(Number(props.infoCartItem.quantity) - 1)} className='p-2 cursor-hover cart-item-quanlity-btn'> - </span>
                            <input onChange={(e) => handleChangeQuantity(e.target.value)} name='quantitity' className='text-center' value={props.infoCartItem.quantity} style={{ width: '36px', border: 'none' }} type='number' />
                            <span onClick={() => handleChangeQuantity(Number(props.infoCartItem.quantity) + 1)} className='p-2 cursor-hover cart-item-quanlity-btn'>+ </span>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'flex-end' }}>
                <Button onClick={props.onHide} variant="warning">No</Button>
                <Button onClick={props.onAccepted} variant="danger">Yes</Button>
            </Modal.Footer>
        </Modal>
    );
}
