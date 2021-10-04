import React, { useState } from 'react';
import { Redirect } from 'react-router';

import { useSelector, useDispatch } from 'react-redux';
import { login } from '../redux/user/userSlice';
import Progress from '../components/Progress';

export default function Login(props) { //func login will dispatch action
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const isLoad = useSelector((state) => state.user.isLoad);
    const error = useSelector((state) => state.user.error);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(input));
    }

    const handleChange = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }

    if (isAuthenticated) return (<Redirect to='/' />);
    return (
        <div className="container">
            <Progress isLoad={isLoad} />
            <div className='row'>
                {error && <span className='text-danger'>{error}</span>}
                <div className='col'>
                    {!isAuthenticated &&
                        <form onSubmit={handleSubmit}>
                            <input type="text" name='username' value={input.username} onChange={handleChange} />
                            <input type="password" name='password' value={input.password} onChange={handleChange} />
                            <button type='submit'>login</button>

                        </form>
                    }

                </div >
            </div >
        </div >
    )
}