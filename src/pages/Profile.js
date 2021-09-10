import React, { useState } from 'react';
import { Redirect } from 'react-router';

import { useUserDispatch, loginUser, useUserState } from "../contexts/UserContext";

export default function Profile(props) {
    const { isAuthenticated, user } = useUserState();

    if (!isAuthenticated) return (<Redirect to='/login' />);
    return (
        <h1>Profile</h1>
    )
}