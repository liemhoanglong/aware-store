import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home(props) {

    return (
        <>
            <h1>
                Home
            </h1>
            <Link to='/profile'>Profile</Link>
            <br />
            <Link to='/login'>Login</Link>
            <br />
            <Link to='/signup'>Signup</Link>
        </>
    )
}