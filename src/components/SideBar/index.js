import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import QueryString from 'query-string';

import './styles.css'
import arrowDown from '../../images/arrow-down.svg';
import MultiRangeSlider from '../MultiRangeSlider';
import checkedBox from '../../images/checked-box.svg';
import checkBox from '../../images/check-box.svg';
import CallAPI from '../../services/CallAPI';

const SideBar = (props) => {
  // console.log('sidebar');
  let history = useHistory();
  const [minValue, setMinValue] = useState(props.filter.minprice);
  const [maxValue, setMaxValue] = useState(props.filter.maxprice);
  const [cates, setCates] = useState([])
  // console.log(cates)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        let queryObject = QueryString.parse(history.location.search);
        let res
        if (queryObject.categroup === undefined && queryObject.catelist === undefined)
          res = await CallAPI(`/cate`, 'get', null);
        else if (queryObject.categroup === undefined)
          res = await CallAPI(`/cate/by-list/${queryObject.catelist}`, 'get', null);
        else
          res = await CallAPI(`/cate/by-list-and-group/${queryObject.catelist}/${queryObject.categroup}`, 'get', null);
        setCates(res.data.data);
      } catch (err) {
        console.log(err)
      }
    }
    fetchAll();
  }, [props.filter.categroup, props.filter.catelist])

  const handleChangeFilterPrice = () => {
    props.handleChangeFilter({ minprice: minValue, maxprice: maxValue })
  }

  const handleChangeSize = (size) => {
    // console.log('onclick  ' + size)
    if (props.filter.size === size) {
      props.handleChangeFilter({ size: '' })
    }
    else {
      props.handleChangeFilter({ size })
    }
  }

  const handleChangeColor = (color) => {
    // console.log('onclick  ' + color)
    if (props.filter.color === color) {
      props.handleChangeFilter({ color: '' })
    }
    else {
      props.handleChangeFilter({ color })
    }
  }

  const handleChangeBrand = (brand) => {
    // console.log('onclick  ' + brand)
    if (props.filter.brand === brand) {
      props.handleChangeFilter({ brand: '' })
    }
    else {
      props.handleChangeFilter({ brand })
    }
  }

  const handleChangeStatus = (status) => {
    console.log('onclick  ' + status)
    if (props.filter.status === status) {
      props.handleChangeFilter({ status: '' })
    }
    else {
      props.handleChangeFilter({ status })
    }
  }

  const handleChangeCate = (cate) => {
    // console.log('onclick  ' + cate)
    if (props.filter.cate === cate) {
      props.handleChangeFilter({ cate: '' })
    }
    else {
      props.handleChangeFilter({ cate })
    }
  }

  return (
    <div>
      <h6>Category</h6>
      <br />
      <p onClick={() => handleChangeCate('')} className={`cursor-hover text-14 text-regular ${props.filter.cate === '' ? 'text-color-orange' : ''}`}>All {props.categroup ? props.categroup : 'category'}</p>
      <div className="line-litle"></div>
      <div className='cate'>
        {cates.map((cate) => (
          <p onClick={() => handleChangeCate(cate._id)} key={cate._id} className={`m-0 text-14 text-regular cursor-hover ${props.filter.cate === cate._id ? 'text-color-orange ' : ''}`}>{cate.name}</p>
        ))}
        {/* <p className='m-0 text-14 text-regular'>Casual dresses</p> */}
        {/* <p className='m-0 text-14 text-regular'>Going out dresses</p> */}
      </div>
      <div className="line"></div>
      <h6>Filter</h6>
      <br />
      <div className='cursor-hover product-filter-size'>
        <div className='d-flex justify-content-between'>
          <span className='text-14 text-regular'>Size</span>
          <img src={arrowDown} className='product-filter-size-arrow-down' />
        </div>
        <div className='cursor-hover product-filter-size-items'>
          <div className="line-dash"></div>
          <button onClick={() => handleChangeSize('S')} className={`product-filter-size-item-btn${props.filter.size === 'S' ? '-active' : ''}`}>S</button>
          <button onClick={() => handleChangeSize('M')} className={`product-filter-size-item-btn${props.filter.size === 'M' ? '-active' : ''} mx-3`}>M</button>
          <button onClick={() => handleChangeSize('L')} className={`product-filter-size-item-btn${props.filter.size === 'L' ? '-active' : ''}`}>L</button>
        </div>
      </div>
      <hr className='my-2' />
      <div className='cursor-hover product-filter-color'>
        <div className='d-flex justify-content-between'>
          <span className='text-14 text-regular'>Color</span>
          <img src={arrowDown} className='product-filter-color-arrow-down' />
        </div>
        <div className='product-filter-color-items'>
          <div className="line-dash"></div>
          <Row>
            <Col xl={3} md={4} xs={6}>
              <button onClick={() => handleChangeColor('61377b4288b68e3f0c615ebe')} className={`product-filter-color-item${props.filter.color === '61377b4288b68e3f0c615ebe' ? '-active' : ''}`} style={{ backgroundColor: '#ff5f6d' }} />
            </Col>
            <Col xl={3} md={4} xs={6}>
              <button onClick={() => handleChangeColor('613cd95b0cb57c150d107f68')} className={`product-filter-color-item${props.filter.color === '613cd95b0cb57c150d107f68' ? '-active' : ''}`} style={{ backgroundColor: 'rgba(255, 213, 67, 0.4)' }} />
            </Col>
            <Col xl={3} md={4} xs={6}>
              <button onClick={() => handleChangeColor('613cd96f0cb57c150d107f69')} className={`product-filter-color-item${props.filter.color === '613cd96f0cb57c150d107f69' ? '-active' : ''}`} style={{ backgroundColor: 'rgba(95, 109, 255, 0.4)' }} />
            </Col>
            <Col xl={3} md={4} xs={6}>
              <button onClick={() => handleChangeColor('613cd9850cb57c150d107f6a')} className={`product-filter-color-item${props.filter.color === '613cd9850cb57c150d107f6a' ? '-active' : ''}`} style={{ backgroundColor: 'rgba(255, 161, 95, 0.4)' }} />
            </Col>
            <Col xl={3} md={4} xs={6}>
              <button onClick={() => handleChangeColor('61377b5f88b68e3f0c615ec1')} className={`product-filter-color-item${props.filter.color === '61377b5f88b68e3f0c615ec1' ? '-active' : ''}`} style={{ backgroundColor: 'rgba(61, 61, 63, 0.4)' }} />
            </Col>
            <Col xl={3} md={4} xs={6}>
              <button onClick={() => handleChangeColor('61377b6a88b68e3f0c615ec4')} className={`product-filter-color-item${props.filter.color === '61377b6a88b68e3f0c615ec4' ? '-active' : ''}`} style={{ backgroundColor: 'rgba(237, 237, 237, 0.4)' }} />
            </Col>
          </Row>
        </div>
      </div>
      <hr className='my-2' />
      <div className='cursor-hover product-filter-brand'>
        <div className='d-flex justify-content-between'>
          <span className='text-14 text-regular'>Brand</span>
          <img src={arrowDown} className='product-filter-brand-arrow-down' />
        </div>
        <div className='product-filter-brand-items'>
          <div className="line-dash"></div>
          {props.brandData && props.brandData.map((brand) => (
            <div onClick={() => handleChangeBrand(brand._id)} key={brand._id} className='product-filter-brand-item d-flex justify-content-between align-items-center p-2 mb-1 bg-white'>
              <span className={`cursor-hover w-100 text-14 ${props.filter.brand === brand._id ? 'text-color-orange' : ''}`}>{brand.name}</span>
              {props.filter.brand === brand._id ? <img src={checkedBox} alt='checked-box' /> : <img src={checkBox} alt='check-box' />}
            </div>
          ))}
          <div onClick={() => handleChangeBrand('61363fc80fc94302bcc7b7ec')} className='product-filter-brand-item d-flex justify-content-between align-items-center p-2 mb-1 bg-white'>
            <span className='cursor-hover w-100 text-14'>SWE</span>
            {props.filter.brand === '61363fc80fc94302bcc7b7ec' ? <img src={checkedBox} alt='checked-box' /> : <img src={checkBox} alt='check-box' />}
          </div>
          <div onClick={() => handleChangeBrand('61363fc80fc94323qcc7b7ec')} className='product-filter-brand-item d-flex justify-content-between align-items-center p-2 mb-1 bg-white'>
            <span className='cursor-hover w-100 text-14'>POLO</span>
            {props.filter.brand === '61363fc80fc94323qcc7b7ec' ? <img src={checkedBox} alt='checked-box' /> : <img src={checkBox} alt='check-box' />}
          </div>
        </div>
      </div>
      <hr className='my-2' />
      <div className='cursor-hover product-filter-price'>
        <div className='d-flex justify-content-between'>
          <span className='text-14 text-regular'>Price</span>
          <img src={arrowDown} className='product-filter-price-arrow-down' />
        </div>
        <div className='product-filter-price-items'>
          <div className="line-dash"></div>
          <br />
          <MultiRangeSlider
            min={0}
            max={5000}
            onChange={({ min, max }) => { setMinValue(min); setMaxValue(max); }}
          />
          <div style={{ textAlign: 'center' }}>
            <button className='product-filter-size-item-btn-active rotate-right' onClick={handleChangeFilterPrice}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="white" fillRule="evenodd" d="M16.762 9.684l-.48-.458A.844.844 0 0 0 15.696 9a.807.807 0 0 0-.578.226L12 12.196l-3.12-2.97A.807.807 0 0 0 8.304 9a.844.844 0 0 0-.584.226l-.475.458A.74.74 0 0 0 7 10.24c0 .22.081.404.244.55l4.178 3.978A.782.782 0 0 0 12 15a.817.817 0 0 0 .584-.232l4.178-3.978a.73.73 0 0 0 .238-.55.763.763 0 0 0-.238-.556z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr className='my-2' />
      <div className='cursor-hover product-filter-available'>
        <div className='d-flex justify-content-between'>
          <span className='text-14 text-regular'>Available</span>
          <img src={arrowDown} className='product-filter-available-arrow-down' />
        </div>
        <div className='product-filter-available-items'>
          <div className="line-dash"></div>
          <div onClick={() => handleChangeStatus('1')} className='product-filter-available-item d-flex justify-content-between align-items-center p-2 mb-1 bg-white'>
            <span className={`cursor-hover w-100 text-14 ${props.filter.status === '1' ? 'text-color-orange' : ''}`}>In-store</span>
            {props.filter.status === '1' ? <img src={checkedBox} alt='checked-box' /> : <img src={checkBox} alt='check-box' />}
          </div>
          <div onClick={() => handleChangeStatus('0')} className='product-filter-available-item d-flex justify-content-between align-items-center p-2 mb-1 bg-white'>
            <span className={`cursor-hover w-100 text-14 ${props.filter.status === '0' ? 'text-color-orange' : ''}`}>Out of stock</span>
            {props.filter.status === '0' ? <img src={checkedBox} alt='checked-box' /> : <img src={checkBox} alt='check-box' />}
          </div>
        </div>
      </div>
    </div >
  )
}

export default SideBar;
