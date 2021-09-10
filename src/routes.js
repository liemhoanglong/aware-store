import React from 'react';
import { Redirect } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";

const routes = [
    {
        path: '/',
        exact: true,
        component: () => <Home />
    },
    {
        path: '/login',
        exact: true,
        component: () => <Login />
    },
    {
        path: '/signup',
        exact: true,
        component: () => <Signup />
    },
    {
        path: '/Profile',
        exact: true,
        component: () => <Profile />
    },
    {
        path: '',
        exact: false,
        component: () => <PageNotFound />
    },
]

export default routes;