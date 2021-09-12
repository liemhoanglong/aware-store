import React, { useState } from 'react';
import { Redirect, useHistory } from "react-router-dom";

import { useUserState, logoutUser, useUserDispatch } from "../contexts/UserContext";

export default function Profile(props) {
    const { isAuthenticated, user } = useUserState();
    const userDispatch = useUserDispatch();
    let history = useHistory();

    if (!isAuthenticated) return (<Redirect to='/login' />);
    return (
        <>
            <h1>Profile</h1>
            <button onClick={() => logoutUser(userDispatch, history)}>Log out</button>
        </>
    )
}