import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Progress from './components/Progress';
import CallAPI from './services/CallAPI';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProductList from "./pages/ProductList";
import ProductInfo from "./pages/ProductInfo";
import ShoppingCart from "./pages/ShoppingCart";
import PageNotFound from "./pages/PageNotFound";
import { useUserState } from "./contexts/UserContext";

function App() {
  const { isAuthenticated, profile } = useUserState();
  // console.log(isAuthenticated)
  // console.log(profile)
  const [catelists, setCatelists] = useState([]);
  const [load, setLoad] = useState(true);


  useEffect(async () => {
    try {
      // fetch all cate group by catlists
      let callCateGroup = CallAPI('/cate-group/by-catlists', 'get', null);
      let res = await callCateGroup;
      setCatelists(res.data.data);

    } catch (err) {
      console.log(err)
    }
    setLoad(false);
  }, [])

  // console.log(catelists)

  return (
    <Router>
      {/* component load */}
      <Progress isLoad={load} />

      <Header catelists={catelists} user={profile} />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/profile' exact component={Profile} />
        <Route path='/shopping-cart' exact component={ShoppingCart} />
        <Route path='/product-list' exact component={ProductList} />
        <Route path='/product-item/:id' exact component={ProductInfo} />
        <Route path='' component={PageNotFound} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
