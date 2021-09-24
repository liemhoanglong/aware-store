import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

export default function EditCart(props) {
    const handleChangeQuantity = async (qty) => {
        if (qty < 1 || isNaN(qty)) return;
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
                            {props.cart.cart.length > 0 && props.infoCartItem.cartIndex > -1 && props.cart.cart[props.infoCartItem.cartIndex].productId.colors.map((color, idx) => (
                                <div style={{ width: '11%' }} key={color.code}>
                                    <button onClick={() => props.setInfoCartItem({ ...props.infoCartItem, color })} title={color.name} className={`product-filter-color-item${props.infoCartItem.color.code === color.code ? '-active' : ''}`} title={color.name} style={{ backgroundColor: color.code }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='d-flex align-items-baseline'>
                        <p className='mb-5' style={{ width: '100px' }}>Size: </p>
                        <button onClick={() => props.setInfoCartItem({ ...props.infoCartItem, size: 'S' })} className={`product-filter-size-item-btn${props.infoCartItem.size === 'S' ? '-active' : ''}`}>S</button>
                        <button onClick={() => props.setInfoCartItem({ ...props.infoCartItem, size: 'M' })} className={`product-filter-size-item-btn${props.infoCartItem.size === 'M' ? '-active' : ''} mx-3`}>M</button>
                        <button onClick={() => props.setInfoCartItem({ ...props.infoCartItem, size: 'L' })} className={`product-filter-size-item-btn${props.infoCartItem.size === 'L' ? '-active' : ''}`}>L</button>
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
