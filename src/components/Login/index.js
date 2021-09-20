import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import checkedBox from '../../images/checked-box.svg';
import checkBox from '../../images/check-box.svg';
import { useUserDispatch, loginUser, useUserState } from "../../contexts/UserContext";
import Progress from '../Progress';

export default function Login(props) {
    const { isAuthenticated } = useUserState();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');

    const userDispatch = useUserDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        loginUser(userDispatch, username, password, props.history, setLoad, setError);
    }

    if (isAuthenticated) {
        props.onHide();
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Progress isLoad={load} />
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <center>
                    <h4 style={{ fontSize: '32px', fontWeight: 'bold' }}>Login</h4>
                    {error &&
                        <p className='my-2 modal-text-error'>Your e-mail/password is invalid!</p>
                    }
                </center>
                <form onSubmit={onSubmit} style={{ padding: '15px 80px 17px' }}>
                    <p className='mb-2 model-lable'><b>E-MAIL</b></p>
                    <input onChange={e => setUsername(e.target.value)} type='email' name='email' className={`mb-4 modal-input${error ? '-error' : ''} `} placeholder='Enter your e-mail...' required />
                    <p className='mb-2 model-lable'><b>PASSWORD</b></p>
                    <input onChange={e => setPassword(e.target.value)} type='password' name='password' className={`mb-4 modal-input${error ? '-error' : ''} `} placeholder='Enter your password...' required />
                    <div className='d-flex justify-content-between' >
                        {/* {props.filter.brand === brand._id ? <img src={checkedBox} alt='checked-box' /> : <img src={checkBox} alt='check-box' />} */}
                        <div className='cursor-hover'><img src={checkedBox} alt='checked-box' /><span className='text-14 text-regular' >Remember password</span></div>
                        <span onClick={() => { props.onHide(); props.setForgotPassShow(); }} className='cursor-hover text-14' style={{ fontWeight: '600', paddingTop: '3px' }}>Forgot your password?</span>
                    </div>
                    <Button type='submit' className='modal-btn' variant="secondary" disabled={(username != '' && password != '') ? false : true}>Login</Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                Don’t have an account?
                <span className='cursor-hover text-color-orange text-underline' onClick={() => { props.onHide(); props.setSignupShow(); }}>Register</span>
            </Modal.Footer>
        </Modal>
    );
}
