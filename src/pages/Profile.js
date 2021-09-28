import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useHistory, Redirect } from "react-router-dom";

import { useUserState, logoutUser, useUserDispatch, resetUserState } from "../contexts/UserContext";
import callAuthAPI from '../services/CallAuthAPI';
import validateEmail from '../utils/validateEmail';
import validatePhone from '../utils/validatePhone';

export default function Profile(props) {
    const userDispatch = useUserDispatch();
    const { profile, isAuthenticated } = useUserState();
    let history = useHistory();
    let state = history.location.pathname.includes('pass');
    // const [profile, setProfile] = useState();
    const [isEdit, setIsEdit] = useState(false)
    const [inputInfo, setInputInfo] = useState({ name: '', username: '', phone: '', address: '' })
    const [inputPass, setInputPass] = useState({ password: '', newpass: '', renewpass: '' })
    const [msg, setMsg] = useState('');
    const [msgErr, setMsgErr] = useState('');
    const [resetProfile, setResetProfile] = useState(false);

    useEffect(() => {
        // const fetchAll = async () => {
        //     let res = await callAuthAPI('/user/profile', 'get', {})
        //     setProfile(res.data)
        //     setInputInfo({
        //         name: res.data.name,
        //         username: res.data.username,
        //         phone: res.data.phone,
        //         address: res.data.address,
        //     });
        // }
        // fetchAll();
        if (profile) {
            // console.log('profile page')
            // console.log(profile)
            setInputInfo({
                name: profile.name,
                username: profile.username,
                phone: profile.phone,
                address: profile.address,
            });
        }
    }, [])

    const handleEditInfo = async (e) => {
        e.preventDefault();
        setMsgErr('');
        setMsg('');
        if (!validateEmail(inputInfo.username))
            return setMsgErr('Email "' + inputInfo.username + '" is not valid!')
        if (inputInfo.phone && !validatePhone(inputInfo.phone))
            return setMsgErr('Your phone number "' + inputInfo.phone + '" is not exist!')
        try {
            let res = await callAuthAPI('/user/edit-profile', 'put', inputInfo)
            // console.log(res.data)
            if (inputInfo.username != res.data.username) {
                logoutUser(userDispatch, history);
                return;
            }
            resetUserState(userDispatch);
            setInputInfo(res.data);
            setIsEdit(false);
            // setResetProfile(!resetProfile);
        } catch (err) {
            setMsgErr(err.response.data.err);
            console.log(err)
        }
    }

    const handleChangePass = async (e) => {
        e.preventDefault();
        setMsgErr('');
        setMsg('');
        if (inputPass.newpass.length < 7 || inputPass.renewpass.length < 7 || inputPass.password.length < 7)
            return setMsgErr('Your passwords must be more than 6 characters!')
        if (inputPass.newpass != inputPass.renewpass)
            return setMsgErr('New password and re-enter new password not match!')
        if (inputPass.password === inputPass.newpass)
            return setMsgErr('New password and current password not diff!')
        try {
            let res = await callAuthAPI('/user/change-pass', 'put', inputPass)
            setMsg('Change password success');
        } catch (err) {
            setMsgErr(err.response.data.err);
            console.log(err);
        }
    }

    if (!isAuthenticated) return <Redirect to='/' />

    return (
        <Container>
            <Row>
                <Col lg={2}>
                    <h4>My Account</h4>
                    <br />
                    <p onClick={() => history.push('/profile/setting')} className={`cursor-hover text-14  ${state ? 'text-regular' : 'text-color-orange'}`}>Account setting</p>
                    <p onClick={() => history.push('/profile/change-password')} className={`cursor-hover text-14 ${!state ? 'text-regular' : 'text-color-orange'}`}>Change password</p>
                </Col>
                <Col lg={10}>
                    <div className='profile-wrapper'>
                        {!state ?
                            <div>
                                <div className='d-flex justify-content-between mt-1 mb-3 text-14'>
                                    <b>Information</b>
                                    {!isEdit &&
                                        <span onClick={() => setIsEdit(true)} className='cursor-hover text-regular text-12' style={{ fontWeight: 500 }}>Edit</span>
                                    }
                                </div>
                                <form onSubmit={handleEditInfo} className='jumbotron'>
                                    {msgErr && <p className='text-center text-14 text-danger'>{msgErr}</p>}
                                    {msg && <p className='text-center text-14 text-success'>{msg}</p>}
                                    <p className='mb-2 model-lable'>Name</p>
                                    {isEdit ?
                                        <input value={inputInfo.name} onChange={e => setInputInfo({ ...inputInfo, name: e.target.value })} type='text' name='name' className={`mb-4 profile-input text-14`} placeholder='Enter your name...' required />
                                        : <p className='text-14 text-regular'>{inputInfo.name}</p>
                                    }
                                    <p className='mb-2 model-lable'>E-mail</p>
                                    {isEdit ?
                                        <input value={inputInfo.username} onChange={e => setInputInfo({ ...inputInfo, username: e.target.value })} type='email' name='username' className={`mb-4 profile-input text-14`} placeholder='Enter your e-mail...' required />
                                        : <p className='text-14 text-regular'>{inputInfo.username}</p>
                                    }
                                    <p className='mb-2 model-lable'>Phone number</p>
                                    {isEdit ?
                                        <input value={inputInfo.phone} onChange={e => setInputInfo({ ...inputInfo, phone: e.target.value })} type='text' name='phone' className={`mb-4 profile-input text-14`} placeholder='Enter your phone number...' />
                                        : <p className='text-14 text-regular' style={{ height: 21 }}>{inputInfo.phone}</p>
                                    }
                                    <p className='mb-2 model-lable'>Address</p>
                                    {isEdit ?
                                        <input value={inputInfo.address} onChange={e => setInputInfo({ ...inputInfo, address: e.target.value })} type='text' name='address' className={`mb-4 profile-input text-14`} placeholder='Enter your address...' />
                                        : <p className='text-14 text-regular' style={{ height: 21 }}>{inputInfo.address}</p>
                                    }
                                    {isEdit && profile &&
                                        <div className='d-flex justify-content-end'>
                                            <Button
                                                onClick={() => {
                                                    setInputInfo({ name: profile.name, username: profile.username, phone: profile.phone, address: profile.address });
                                                    setIsEdit(false);
                                                    setMsgErr('');
                                                }}
                                                className='profile-btn-cancel text-14'
                                            >Cancel</Button>
                                            <Button
                                                type='submit' variant="secondary" className='profile-btn-save text-14'
                                                disabled={inputInfo.name !== profile.name || inputInfo.username !== profile.username || inputInfo.phone !== profile.phone || inputInfo.address !== profile.address ? false : true}
                                            >Save</Button>
                                        </div>
                                    }
                                </form>
                            </div>
                            :
                            <div>
                                <p className='mt-1 mb-3 text-14'><b>Change password</b></p>
                                <form onSubmit={handleChangePass} className='jumbotron'>
                                    {msgErr && <p className='text-center text-14 modal-text-error'>{msgErr}</p>}
                                    {msg && <p className='text-center text-14 text-success'>{msg}</p>}
                                    <p className='mb-2 model-lable'><b>Current password</b></p>
                                    <input onChange={e => setInputPass({ ...inputPass, password: e.target.value })} type='password' name='password' className={`mb-4 profile-input text-14`} placeholder='Enter your password...' required />

                                    <p className='mb-2 model-lable'><b>New password</b></p>
                                    <input onChange={e => setInputPass({ ...inputPass, newpass: e.target.value })} type='password' name='newpass' className={`mb-4 profile-input text-14`} placeholder='Enter your password...' required />

                                    <p className='mb-2 model-lable'><b>Re-enter new password</b></p>
                                    <input onChange={e => setInputPass({ ...inputPass, renewpass: e.target.value })} type='password' name='renewpass' className={`mb-4 profile-input text-14`} placeholder='Enter your password...' required />
                                    <div className='d-flex justify-content-end'>
                                        <Button type='submit' className='profile-btn-save text-14' variant="secondary" disabled={(inputPass.newpass === '' || inputPass.password === '' || inputPass.renewpass === '') ? true : false}>Save</Button>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                </Col>
            </Row >
        </Container >
    )
}