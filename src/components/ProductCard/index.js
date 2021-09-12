import React from 'react';
import { Link } from 'react-router-dom';

import './productCard.css'
import porductImage from '../../images/product-default.PNG'

export default function ProductCard(props) {
    // console.log(props)
    return (
        // <Col lg={2}>
        <div className='product-card-wapper d-flex flex-column justify-content-end ms-4 mt-3'>
            <div>
                <div className='product-card-img'>
                    <Link to={`/product-item/${props.product._id}`} className='link-custom '>
                        <img src={porductImage} alt='asfd' />
                    </Link>
                    <div className='product-card-btn'>
                        + Quick shop
                    </div>
                    {!props.product.status &&
                        <div className='product-card-status'>
                            <div className='centered'>
                                Sold out
                            </div>
                        </div>
                    }
                </div>
                <div>
                    <Link to={`/product-item/${props.product._id}`} className='link-custom product-card-name-text'>{props.product.name}</Link>
                </div>
            </div>
            <p className='product-card-price-text m-0'>${props.product.price}</p>
        </div>
        // </Col>
    )
}