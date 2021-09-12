import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Col, Button } from 'react-bootstrap';

export default function ForgotPass(props) {
    const onClickLogin = () => {
        props.setForgotPassShow(false);
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
                    <h4 style={{ fontFamily: 'Montserrat', fontSize: '32px', fontWeight: 'bold' }}>Forgot Password</h4>
                </center>
                <div style={{ padding: '27px 80px' }}>
                    <p className='mb-2'><b>E-MAIL</b></p>
                    <input type='email' name='email' className={`modal-input`} placeholder='Enter your e-mail...' />

                    <center className='mt-2 text-14 font-mon'>
                        <Button style={{ marginTop: '27px' }} className='modal-btn' variant="secondary" >Submit</Button>
                    </center>
                </div>
            </Modal.Body>
            <Modal.Footer className='text-14 font-mon'>
                <span style={{ fontWeight: '400' }}>I remember my password now.</span>
                <span className='cursor-hover color-ffa15f text-underline p-0' onClick={onClickLogin}>Log In</span>
            </Modal.Footer>
        </Modal >
    );
}
