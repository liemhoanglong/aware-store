import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import routes from './routes';
import './App.css';
import Header from "./components/Header";
import Progress from './components/Progress';

import { useSelector, useDispatch } from 'react-redux';
import { getMyProfile } from './redux/user/userSlice';

const showContentMenus = (routes) => {
  let result = null;
  if (routes.length > 0) {
    result = routes.map((route, index) => {
      return <Route key={index}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />
    })
  }
  return result;
};

function App() {
  const profile = useSelector((state) => state.user.profile)
  const isLoad = useSelector((state) => state.user.isLoad)
  const dispatch = useDispatch();

  if (localStorage.getItem('access_token') && !profile && !isLoad) {
    dispatch(getMyProfile());
  }

  return (
    <Router>
      <Progress isLoad={isLoad} />
      {/* <Suspense
      fallback={
      <div style={{ width: "100%" }}>
        <CustomizedLinearProgress isOpen={true} />
      </div>
      }
      > */}
      <Header />
      <Switch>
        {showContentMenus(routes)}
      </Switch>
      {/* </Suspense> */}
    </Router>
  );
}

export default App;
