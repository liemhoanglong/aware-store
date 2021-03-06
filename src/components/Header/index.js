import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Form, FormControl } from "react-bootstrap";
import { Link, useHistory, useLocation } from 'react-router-dom';
import QueryString from 'query-string';

import './header.css';
import logo from '../../logo.svg';
import cart from '../../images/cart.svg';
import avatar from '../../images/avatar.jpg';
import arrowDown from '../../images/arrow-down.svg';
import { useUserState, logoutUser, useUserDispatch } from "../../contexts/UserContext";
import productImage from '../../images/no-img.png';
import callApi from '../../services/CallAPI';

export default function Header(props) {
  const { isAuthenticated } = useUserState();
  const userDispatch = useUserDispatch();
  const catelists = props.catelists;
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [dataClone, setDataClone] = useState([]);
  const history = useHistory();
  const location = useLocation();
  // console.log(props.user)
  let queryObject = QueryString.parse(location.search);

  useEffect(() => {
    queryObject.name = queryObject.name === undefined ? '' : queryObject.name;
    setSearch(queryObject.name);
    const fetchData = async () => {
      let res = await callApi('/product/name', 'get', {});
      setData(res.data.slice(0, 10));
      setDataClone(res.data);
    }
    fetchData();
  }, [])

  const handleSearch = (e) => {
    e.preventDefault();
    history.push(`/product-list?name=${e.target[0].value}`);
  }

  return (
    <header>
      <Container>
        <Row className='header-group'>
          <Col>
            <Form className='header-search' onSubmit={(e) => handleSearch(e)}>
              <div className='search-auto-input' style={{ position: 'relative' }}>
                <div className='d-flex'>
                  <FormControl
                    className='text-14'
                    type="text"
                    placeholder="search"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setData(dataClone.filter(i => i.name.toLowerCase().includes(e.target.value.toLowerCase())).slice(0, 10)) }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8B8B8C" className="bi bi-search icon-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </div>
                {
                  data.length > 0 &&
                  <div className="search-auto-list">
                    {
                      data.map((item, index) => {
                        return <Link className='link-custom' to={`/product-list?name=${item.name}`}><div className='search-auto-item max-width suggestion-content' value={item.name} key={index}> {item.name}</div></Link>
                      })
                    }
                  </div>
                }
              </div>
            </Form>
          </Col>
          <Col className='d-flex justify-content-center'>
            <Link to="/" >
              <img className='logo' src={logo} alt='logo' width='96px' />
            </Link>
          </Col>
          <Col>
            <div className='d-flex justify-content-end'>
              {isAuthenticated ?
                <div className='ms-4 d-flex '>
                  <div className='custom-dropdown cursor-hover'>
                    <div className='bg-orange rounded-circle' style={{ padding: '2px', marginTop: '2px' }}>
                      <img className='icon-avatar rounded-circle' src={avatar} alt='cart' />
                    </div>
                    <div className="dropdown-content-right">
                      <div className='dropdown-content-group-right' style={{ marginTop: '-2px' }}>
                        <Link to='/profile/setting' className='link-custom dropdown-item-right'>Account setting</Link>
                        <Link to='/my-orders' className='link-custom dropdown-item-right'>My orders</Link>
                        <div onClick={() => logoutUser(userDispatch, history)} className='dropdown-item-right'>Logout</div>
                      </div>
                    </div>
                  </div>
                </div>
                : <>
                  <Button onClick={() => props.setSignupShow(true)} className='header-button1-custom text-14' variant="outline">Register</Button>
                  <Button onClick={() => props.setLoginShow(true)} className='header-button2-custom text-14' variant="outline">Log In</Button>
                </>
              }

              <div className='ms-4 d-flex '>
                <div className='custom-dropdown cursor-hover'>
                  <img className='icon-cart' src={cart} alt='cart' />
                  {props.cart.totalProducts > 0 &&
                    <div className='number-cart'>
                      {props.cart.totalProducts}
                    </div>
                  }
                  <div className="dropdown-content-right">
                    <div className='dropdown-content-group-right'>
                      {props.cart && props.cart.cart.map((item, idx) => (
                        <Link to={`/product-info/${item.productId._id}`} key={idx} title={item.productId.name} className='d-flex dropdown-item-right link-custom'>
                          <img className='img-cover' width='60px' height='60px' src={item.productId.imageList[0] ? item.productId.imageList[0] : productImage} alt={item.productId.name} />
                          <div style={{ width: '200px', padding: '5px 5px 5px 20px' }} className='d-flex flex-column justify-content-between'>
                            <span className='dropdown-cart-item-name'>{item.productId.name}</span>
                            <div className='d-flex justify-content-between'>
                              <span className='dropdown-cart-item-name text-regular' style={{ width: '45px' }}>${item.productId.price}</span>
                              <span className='dropdown-cart-item-name text-regular'>{item.size} - {item.color.name} - {item.quantity}pcs</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <Link to='/shopping-cart' className='link-custom dropdown-item-right text-color-orange text-center py-4'>View cart</Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* <button type="button" className="btn btn-primary position-relative">
                                Mails <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">9 <span className="visually-hidden">unread messages</span></span>
                            </button> */}
            </div>
          </Col>
        </Row>
      </Container>
      <hr className='mt-0' style={{ color: 'lightgray', boxShadow: '.1px 0 .7px rgba(0, 0, 0, 2)' }} />
      {/* nav bar */}
      <Container>
        <div className='nav-header d-flex justify-content-center position-relative'>
          <div className='nav-header-dropdown'>
            <Link className='link-custom' to='/product-list?catelist=6136342577e31326701a18fd' style={{ fontWeight: '500' }}>Mens</Link>
            <img src={arrowDown} alt='arrow' />
            <div className="nav-header-dropdown-contents">
              {catelists.length > 0 && catelists[0].map((item, idx) => (
                <Link to={`/product-list?catelist=6136342577e31326701a18fd&categroup=${item._id}`} key={idx} className="link-custom nav-header-dropdown-content">{item.name}</Link>
              ))}
            </div>
          </div>
          <div className='nav-header-dropdown'>
            <Link className='link-custom' to='/product-list?catelist=6136343677e31326701a1901' style={{ fontWeight: '500' }}>Ladies</Link>
            <img src={arrowDown} alt='arrow' />
            <div className="nav-header-dropdown-contents">
              {catelists.length > 0 && catelists[1].map((item, idx) => (
                <Link to={`/product-list?catelist=6136343677e31326701a1901&categroup=${item._id}`} key={idx} className="link-custom nav-header-dropdown-content">{item.name}</Link>
              ))}
            </div>
          </div>
          <div className='nav-header-dropdown'>
            <Link className='link-custom' to='/product-list?catelist=6136343b77e31326701a1903' style={{ fontWeight: '500' }}>Girls</Link>
            <img src={arrowDown} alt='arrow' />
            <div className="nav-header-dropdown-contents">
              {catelists.length > 0 && catelists[2].map((item, idx) => (
                <Link to={`/product-list?catelist=6136343b77e31326701a1903&categroup=${item._id}`} key={idx} className="link-custom nav-header-dropdown-content">{item.name}</Link>
              ))}
            </div>
          </div>
          <div className='nav-header-dropdown'>
            <Link className='link-custom' to='/product-list?catelist=6136346c9f814a47407fae2b' style={{ fontWeight: '500' }}>Boys</Link>
            <img src={arrowDown} alt='arrow' />
            <div className="nav-header-dropdown-contents">
              {catelists.length > 0 && catelists[3].map((item, idx) => (
                <Link to={`/product-list?catelist=6136346c9f814a47407fae2b&categroup=${item._id}`} key={idx} className="link-custom nav-header-dropdown-content">{item.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
      <hr style={{ color: 'lightgray', marginTop: '-10px', boxShadow: '0 .1px .7px 0 rgba(0, 0, 0, 2)' }} />
    </header >
  )
}