import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';

import { logout, updateProfile } from '../redux/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';

export default function Profile(props) {
    const profile = useSelector((state) => state.user.profile);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const dispatch = useDispatch();
    const [input, setInput] = useState({
        name: '',
        username: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (profile)
            setInput({
                name: profile.name,
                username: profile.username,
                phone: profile.phone,
                address: profile.address,
            })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(input));
    }

    const handleChange = (e) => {
        console.log(e.target.value)
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    console.log('profile')

    if (!isAuthenticated) return (<Redirect to='/login' />);
    return (
        <>
            <h1>Profile</h1>
            <form onSubmit={handleSubmit} className="form-group">
                <input value={input.name} onChange={handleChange} type="text" className="form-control" name="name" id="name" aria-describedby="helpId" placeholder="name" />
                <input value={input.username} onChange={handleChange} type="text" className="form-control" name="username" id="username" aria-describedby="helpId" placeholder="username" />
                <input value={input.phone} onChange={handleChange} type="text" className="form-control" name="phone" id="phone" aria-describedby="helpId" placeholder="phone" />
                <input value={input.address} onChange={handleChange} type="text" className="form-control" name="address" id="address" aria-describedby="helpId" placeholder="address" />
                <button type='submit'>SAVE</button>
            </form>
            <button onClick={() => dispatch(logout())}>logout</button>
        </>
    )
}