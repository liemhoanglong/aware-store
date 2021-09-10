import React, { useState } from 'react';

export default function Signup(props) { //func login will dispatch action
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [load, setLoad] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        setLoad(false);
    }

    return (
        <form onSubmit={onSubmit}>
            <input type='email' value={username} onChange={e => setUsername(e.target.value)} placehoder='Enter your email...' />
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} placehoder='Enter your password...' />
            <input type='password' value={repassword} onChange={e => setRepassword(e.target.value)} placehoder='Retype your password...' />
            <button>Sign up</button>
        </form>
    )
}