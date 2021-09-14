import React, { useState } from 'react';
import { Container, Button, Row, Col, Form, FormControl } from "react-bootstrap";
import { Link, useHistory } from 'react-router-dom';

import './header.css';
import logo from '../../images/logo.svg';
import cart from '../../images/cart.svg';
import avatar from '../../images/avatar.jpg';
import arrowDown from '../../images/arrow-down.svg';
import Login from "../Login";
import Signup from "../Signup";
import ForgotPass from "../ForgotPass";
import { useUserState, logoutUser, useUserDispatch } from "../../contexts/UserContext";

export default function Header(props) {
    const { isAuthenticated } = useUserState();
    const userDispatch = useUserDispatch();

    const catelists = props.catelists;
    const [search, setSearch] = useState('');

    const [loginShow, setLoginShow] = useState(false);
    const [signupShow, setSignupShow] = useState(false);
    const [forgotPassShow, setForgotPassShow] = useState(false);

    const history = useHistory();
    // console.log(props.user)
    const onSearch = (e) => {
        if (e) {
            e.preventDefault();
        }
        history.push(`/product-list?name=${e.target[0].value}`);
        e.target[0].value = '';
    }

    return (
        <header>
            <Login
                show={loginShow}
                onHide={() => setLoginShow(false)}
                setSignupShow={setSignupShow}
                setLoginShow={setLoginShow}
                setForgotPassShow={setForgotPassShow}
            />
            <Signup
                show={signupShow}
                onHide={() => setSignupShow(false)}
                setSignupShow={setSignupShow}
                setLoginShow={setLoginShow}
            />
            <ForgotPass
                show={forgotPassShow}
                onHide={() => setForgotPassShow(false)}
                setLoginShow={setLoginShow}
                setForgotPassShow={setForgotPassShow}
            />
            <Container>
                <Row className='header-group'>
                    <Col>
                        <Form className='header-search d-flex' onSubmit={(e) => onSearch(e)}>
                            <FormControl
                                className='text-14'
                                type="text"
                                placeholder="search"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#8B8B8C" className="bi bi-search icon-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>
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
                                                <div onClick={() => logoutUser(userDispatch, history)} className='dropdown-item-right'>Logout</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : <>
                                    <Button onClick={() => setSignupShow(true)} className='header-button1-custom text-14' variant="outline">Register</Button>
                                    <Button onClick={() => setLoginShow(true)} className='header-button2-custom text-14' variant="outline">Log In</Button>
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
                                            <div className='dropdown-item-right'>Link 1</div>
                                            <div className='dropdown-item-right'>Link 2</div>
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
                        <span style={{ fontWeight: '500' }}>Mens</span>
                        <img src={arrowDown} alt='arrow' />
                        <div className="nav-header-dropdown-contents">
                            {catelists.length > 0 && catelists[0].map((item, idx) => (
                                <Link to={`/product-list?catelist=6136342577e31326701a18fd&categroup=${item._id}`} key={idx} className="link-custom nav-header-dropdown-content">{item.name}</Link>
                            ))}
                        </div>
                    </div>
                    <div className='nav-header-dropdown'>
                        <span style={{ fontWeight: '500' }}>Ladies</span>
                        <img src={arrowDown} alt='arrow' />
                        <div className="nav-header-dropdown-contents">
                            {catelists.length > 0 && catelists[1].map((item, idx) => (
                                <Link to={`/product-list?catelist=6136343677e31326701a1901&categroup=${item._id}`} key={idx} className="link-custom nav-header-dropdown-content">{item.name}</Link>
                            ))}
                        </div>
                    </div>
                    <div className='nav-header-dropdown'>
                        <span style={{ fontWeight: '500' }}>Girls</span>
                        <img src={arrowDown} alt='arrow' />
                        <div className="nav-header-dropdown-contents">
                            {catelists.length > 0 && catelists[2].map((item, idx) => (
                                <Link to={`/product-list?catelist=6136343b77e31326701a1903&categroup=${item._id}`} key={idx} className="link-custom nav-header-dropdown-content">{item.name}</Link>
                            ))}
                        </div>
                    </div>
                    <div className='nav-header-dropdown'>
                        <span style={{ fontWeight: '500' }}>Boys</span>
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