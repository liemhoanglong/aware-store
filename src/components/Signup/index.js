import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Col, Button } from 'react-bootstrap';

export default function Signup(props) {
    const onClickLogin = () => {
        props.setSignupShow(false);
        props.setLoginShow(true);
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
                    <h4 style={{ fontFamily: 'Montserrat', fontSize: '32px', fontWeight: 'bold' }}>Register</h4>
                </center>
                <div style={{ padding: '27px 80px' }}>
                    <p className='mb-2'><b>NAME</b></p>
                    <input type='text' name='name' className={`modal-input-error`} placeholder='Enter your name...' />
                    <p className='my-2 modal-text-error'>Please enter a valid name!</p>

                    <p className='mb-2'><b>E-MAIL</b></p>
                    <input type='email' name='email' className={`modal-input`} placeholder='Enter your e-mail...' />
                    <p className='my-2 modal-text-error invisible'>Please enter a valid e-mail!</p>

                    <p className='mb-2'><b>PASSWORD</b></p>
                    <input type='password' name='password' className={`modal-input`} placeholder='Enter your password...' />
                    <p className='my-2 modal-text-error invisible'>Your passwords must be more than 6 characters!</p>

                    <center className='mt-2 text-14 font-mon'>
                        <p className='m-0'>By creating an account you agree to the</p>
                        <p className='m-0'><span className='cursor-hover color-ffa15f text-underline'>Terms of Service</span> and <span className='cursor-hover color-ffa15f text-underline'>Privacy Policy</span></p>
                        <Button className='modal-btn' variant="secondary" disabled>Register</Button>
                    </center>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-14 font-mon'>
                <span style={{ fontWeight: '400' }}>Do you have an account?</span>
                <span className='cursor-hover color-ffa15f text-underline p-0' onClick={onClickLogin}>Log In</span>
            </Modal.Footer>
        </Modal>
    );
}
