import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../redux/counter/counterSlice';
import { logout, login } from '../redux/user/userSlice';

import Progress from '../components/Progress';

const DemoRedux = () => {
    const count = useSelector((state) => state.counter.value)
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
    const isLoad = useSelector((state) => state.user.isLoad)
    const profile = useSelector((state) => state.user.profile)
    const error = useSelector((state) => state.user.error)
    const dispatch = useDispatch()

    const [input, setInput] = useState({
        username: '',
        password: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(input));
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setInput({
            ...input,
            [e.target.name]: value
        });
    }

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
                    {isAuthenticated &&
                        <>
                            {JSON.stringify(profile)}
                            <button onClick={() => dispatch(logout())}>logout</button>
                        </>
                    }
                </div >
                {/* <div className='col d-flex'>
                    <button onClick={() => dispatch(decrement())}>-</button>
                    <div className="text-center" style={{ width: 100 }}>
                        <span>{count}</span>
                    </div>
                    <button onClick={() => dispatch(increment())}>+</button>
                </div > */}

            </div >
        </div >
    )
}

export default DemoRedux
