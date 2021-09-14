import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import Progress from '../Progress';
import CallAPI from '../../services/CallAPI';

export default function Signup(props) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 7) {
            setError('1');
        } else {
            setLoad(true)
            let res
            try {
                res = await CallAPI('/user/register', 'post', { name, username, password })
                props.setSignupShow(false);
            } catch (err) {
                if (err.response.data.err === 'This username already exists!') {
                    setError('2');
                }
                else if (err.response.data.err === 'This name already exists!') {
                    setError('3');
                }
                console.log(err);
            }
            setLoad(false);
        }
    }

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
            <Progress isLoad={load} />

            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <center>
                    <h4 style={{ fontSize: '32px', fontWeight: 'bold' }}>Register</h4>
                </center>
                <form onSubmit={onSubmit} style={{ padding: '27px 80px' }}>
                    <p className='mb-2'><b>NAME</b></p>
                    <input onChange={e => setName(e.target.value)} type='text' name='name' className={`modal-input${error === '3' ? '-error' : ''} `} placeholder='Enter your name...' />
                    <p className={`modal-text-error mt-1 ${error === '3' ? '' : 'invisible'}`}>Please enter a valid name!</p>

                    <p className='mb-2'><b>E-MAIL</b></p>
                    <input onChange={e => setUsername(e.target.value)} type='email' name='email' className={`modal-input${error === '2' ? '-error' : ''} `} placeholder='Enter your e-mail...' />
                    <p className={`modal-text-error mt-1 ${error === '2' ? '' : 'invisible'}`}>Please enter a valid e-mail!</p>

                    <p className='mb-2'><b>PASSWORD</b></p>
                    <input onChange={e => setPassword(e.target.value)} type='password' name='password' className={`modal-input${error === '1' ? '-error' : ''} `} placeholder='Enter your password...' />
                    <p className={`modal-text-error mt-1 ${error === '1' ? '' : 'invisible'}`}>Your passwords must be more than 6 characters!</p>

                    <center className='mt-2 text-14'>
                        <p className='m-0'>By creating an account you agree to the</p>
                        <p className='m-0'><span className='cursor-hover text-color-orange text-underline'>Terms of Service</span> and <span className='cursor-hover text-color-orange text-underline'>Privacy Policy</span></p>
                        <Button type='submit' className='modal-btn' variant="secondary" disabled={(username != '' && password != '' && name != '') ? false : true}>Register</Button>
                    </center>
                </form>
            </Modal.Body>
            <Modal.Footer className='text-14'>
                <span style={{ fontWeight: '400' }}>Do you have an account?</span>
                <span className='cursor-hover text-color-orange text-underline p-0' onClick={onClickLogin}>Log In</span>
            </Modal.Footer>
        </Modal>
    );
}
