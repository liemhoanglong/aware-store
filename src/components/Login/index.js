import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Col, Button } from 'react-bootstrap';

import checkedBox from '../../images/checked-box.svg';
import checkBox from '../../images/check-box.svg';

export default function Login(props) {
    const onClickSigup = () => {
        props.setLoginShow(false);
        props.setSignupShow(true);
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
                    <h4 style={{ fontFamily: 'Montserrat', fontSize: '32px', fontWeight: 'bold' }}>Login</h4>
                    <p className='my-2 modal-text-error'>Your e-mail/password is invalid!</p>
                </center>
                <div style={{ padding: '15px 80px 17px' }}>
                    <p className='mb-2 model-lable'><b>E-MAIL</b></p>
                    <input type='email' name='email' className='mb-4 modal-input' placeholder='Enter your e-mail...' />
                    <p className='mb-2 model-lable'><b>PASSWORD</b></p>
                    <input type='password' name='password' className='mb-4 modal-input' placeholder='Enter your password...' />
                    <div className='d-flex justify-content-between' >
                        {/* {props.filter.brand === brand._id ? <img src={checkedBox} alt='checked-box' /> : <img src={checkBox} alt='check-box' />} */}
                        <div className='cursor-hover'><img src={checkedBox} alt='checked-box' /><span style={{ fontSize: '14px', fontWeight: '300', color: '4d4d4d', fontFamily: 'Montserrat' }} >Remember password</span></div>
                        <span onClick={() => { props.setLoginShow(false); props.setForgotPassShow(true); }} className='cursor-hover' style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'Montserrat', paddingTop: '3px' }}>Forgot your password?</span>
                    </div>
                    <Button className='modal-btn' variant="secondary">Login</Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                Don’t have an account?
                <span className='cursor-hover color-ffa15f text-underline' onClick={onClickSigup}>Register</span>
            </Modal.Footer>
        </Modal>
    );
}
