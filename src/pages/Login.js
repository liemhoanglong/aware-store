import React, { useState } from 'react';
import { Redirect } from 'react-router';

import { useUserDispatch, loginUser, useUserState } from "../contexts/UserContext";

export default function Login(props) { //func login will dispatch action
    const { isAuthenticated } = useUserState();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');

    const userDispatch = useUserDispatch();

    const onSubmit = (e) => {
        e.preventDefault();
        loginUser(userDispatch, username, password, props.history, setLoad, setError)
        setLoad(false);
    }

    if (isAuthenticated) return (<Redirect to='/' />);
    return (
        <>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <input type='email' value={username} onChange={e => setUsername(e.target.value)} placehoder='Enter your email...' />
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} placehoder='Enter your password...' />
                <button>Log in</button>
            </form>
        </>
    )
}