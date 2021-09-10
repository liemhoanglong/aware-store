import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import routes from './routes';
import './App.css';
import Header from "./components/Header";

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

  return (
    <Router>
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
