import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import CallAPI from '../../services/CallAPI';
import Progress from '../Progress';

export default function ForgotPass(props) {
    const [username, setUsername] = useState('');
    const [load, setLoad] = useState(false);
    const [show, setShow] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoad(false);
        try {
            let res = await CallAPI('/user/forgot-pass', 'post', { username });
            setShow(true);
        }
        catch (err) {
            console.log(err);
        }
        setLoad(false);
    }

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
            <Progress isLoad={load} />
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <center>
                    <h4 style={{ fontFamily: 'Montserrat', fontSize: '32px', fontWeight: 'bold' }}>Forgot Password</h4>
                    {show && <span style={{ color: '#f63f45' }}>Please check your email!</span>}
                </center>
                <form onSubmit={onSubmit} style={{ padding: '27px 80px' }}>
                    <p className='mb-2'><b>E-MAIL</b></p>
                    <input onChange={e => setUsername(e.target.value)} type='email' name='email' className={`modal-input`} placeholder='Enter your e-mail...' />

                    <center className='mt-2 text-14 font-mon'>
                        <Button type='submit' style={{ marginTop: '27px' }} className='modal-btn' variant="secondary" >Submit</Button>
                    </center>
                </form>
            </Modal.Body>
            <Modal.Footer className='text-14 font-mon'>
                <span style={{ fontWeight: '400' }}>I remember my password now.</span>
                <span className='cursor-hover color-ffa15f text-underline p-0' onClick={onClickLogin}>Log In</span>
            </Modal.Footer>
        </Modal >
    );
}
