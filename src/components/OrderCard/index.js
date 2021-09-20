import React from 'react';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import threeDot from '../../images/threedots.svg';

export default function OrderCard(props) {

  const handleWriteReview = (data, idx) => {
    props.setWriteReviewShow(true);
    props.setReviewData(prevState => ({
      ...prevState,
      productId: data.productId._id,
      orderId: props.order._id,
      color: data.color._id,
      size: data.size,
      index: idx
    }));
  }

  const handleEditReview = (data, idx) => {
    props.setReviewData(prevState => ({
      ...prevState,
      productId: data.productId._id,
      orderId: props.order._id,
      color: data.color._id,
      size: data.size,
      index: idx
    }));
    props.setCallMyReview(prevState => (!prevState));
    props.setEditReviewShow(true);
  }

  return (
    <div className='jumbotron'>
      <div className='d-flex justify-content-between'>
        <div>
          <span style={{ paddingRight: '20px', color: '#f27c24' }}>#{props.order._id}</span>
          <span style={{ paddingLeft: '20px', borderLeft: '1px solid black' }}>{(new Date(props.order.orderedDate) + '').slice(0, 24)}</span>
        </div>
        <div>
          {props.order.status === 0 ?
            <Badge bg="secondary">Pending</Badge> :
            props.order.status === 1 ?
              <Badge bg="success">Completed</Badge> :
              props.order.status === 2 ?
                <Badge bg="primary">Delivering</Badge> :
                <Badge bg="warning" text="dark">Canceled</Badge>
          }
          {props.order.status === 0 &&
            <div className="custom-dropdown cursor-hover">
              <img style={{ marginBottom: '2px' }} src={threeDot} alt='more action' />
              <div className="dropdown-content-right">
                <div className="dropdown-content-group-right">
                  <span onClick={props.handleAcceptCancelOrder} className="link-custom dropdown-item-right">Cancel order</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <hr />
      {props.order.items && props.order.items.map((item, idx) => (
        <div className='d-flex justify-content-between align-items-center mb-3' key={idx}>
          <div className='d-flex'>
            <Link to={'product-info/' + item.productId._id}>
              <img className='img-cover' src={item.productId.imageList[0]} width='100px' height='100px' alt={item.productId.name} />
            </Link>
            <div className='ms-3'>
              <Link to={'product-info/' + item.productId._id} className='link-custom'>
                {item.productId.name}
              </Link>
              <p className='m-0'>${item.price + '.00'}</p>
              <p className='m-0'>{'Size: ' + item.size + ' | Color: ' + item.color.name}</p>
              <p className='m-0'>QTY: {item.quantity}</p>
            </div>
          </div>
          {!item.isReview ?
            <span onClick={() => handleWriteReview(item, idx)} className='cursor-hover text-right text-primary'>Write review</span>
            : <span onClick={() => handleEditReview(item, idx)} className='cursor-hover text-right text-success'>Edit review</span>
          }
        </div>
      ))}
      <hr className=' mt-0' />
      <p className="text-end">Subtotal: {props.order.feeShipping > 0 ? props.order.totalPrice - props.order.feeShipping + '.00' : props.order.totalPrice + '.00'}</p>
      <p className="text-end">Fee Shipping: {props.order.feeShipping > 0 ? props.order.feeShipping + '.00' : 'Free'}</p>
      <p className='m-0 text-end' style={{ color: '#f27c24' }}>Total Price: {props.order.totalPrice + '.00'}</p>
    </div>
  )
}