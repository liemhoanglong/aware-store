import React from 'react';
import { Link } from 'react-router-dom';

import './productCard.css'
import porductImage from '../../images/no-img.png'

export default function ProductCard(props) {
    // console.log(props)
    return (
        // <Col lg={2}>
        <div className='product-card-wapper d-flex flex-column justify-content-start ms-4 mt-3'>
            <div>
                <div className='product-card-img'>
                    <Link to={`/product-info/${props.product._id}`} className='link-custom' title={props.product.name}>
                        <img src={props.product.imageList.length > 0 ? props.product.imageList[0] : porductImage} alt={props.product.name} />
                    </Link>
                    <Link to={`/product-info/${props.product._id}`} className='link-custom product-card-btn'>
                        + Quick shop
                    </Link>
                    {!props.product.status &&
                        <div className='product-card-status'>
                            <div className='centered'>
                                Sold out
                            </div>
                        </div>
                    }
                </div>
                <div>
                    <Link to={`/product-info/${props.product._id}`} className='link-custom product-card-name-text' title={props.product.name}>{props.product.name}</Link>
                </div>
            </div>
            <p className='product-card-price-text m-0'>{props.product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
        </div>
        // </Col>
    )
}