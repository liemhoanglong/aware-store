import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Progress from './components/Progress';
import CallAPI from './services/CallAPI';
import CallAuthAPI from './services/CallAuthAPI';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProductList from "./pages/ProductList";
import ProductInfo from "./pages/ProductInfo";
import ShoppingCart from "./pages/ShoppingCart";
import PageNotFound from "./pages/PageNotFound";
import { useUserState } from "./contexts/UserContext";

function App() {
  const { isAuthenticated } = useUserState();

  // console.log("App")
  // console.log(isAuthenticated)
  // console.log(profile)
  const [catelists, setCatelists] = useState([]);
  const [load, setLoad] = useState(false);
  const [cart, setCart] = useState({ cart: [], totalPriceRaw: 0, totalProducts: 0 });
  const [updateCart, setUpdateCart] = useState(false);


  useEffect(() => {
    if (!isAuthenticated) {
      let cartParsed = JSON.parse(localStorage.getItem('CART'));
      let totalPriceRaw = 0;
      let totalProducts = 0;
      if (cartParsed) {
        // console.log('not login --------------- ' + cartParsed.cart.length)
        for (let i = 0; i < cartParsed.cart.length; i++) {
          // totalPriceRaw += Number(cartParsed.cart[i].productId.price) * Number(cartParsed.cart[i].quantity);
          totalProducts += Number(cartParsed.cart[i].quantity);
        }
        setCart({ cart: cartParsed.cart, totalPriceRaw, totalProducts });
      }
      else
        setCart({ cart: [], totalPriceRaw: 0, totalProducts: 0 });
      return;
    }
    // const timeOutId = setTimeout(() => {
    const fetchAll = async () => {
      setLoad(true);
      try {
        // fetch all cate group by catlists
        let res = await CallAuthAPI('/user/get-cart', 'get', null);
        if (res.data.cart.length === 0) {
          let cartParsed = JSON.parse(localStorage.getItem('CART'));
          let totalPriceRaw = 0;
          let totalProducts = 0;
          if (cartParsed) {
            // console.log('login but cart null ---------- ' + cartParsed.cart.length)
            for (let i = 0; i < cartParsed.cart.length; i++) {
              // totalPriceRaw += Number(cartParsed.cart[i].productId.price) * Number(cartParsed.cart[i].quantity);
              totalProducts += Number(cartParsed.cart[i].quantity);
            }
            setCart({ cart: cartParsed.cart, totalPriceRaw, totalProducts });
          }
          else
            setCart({ cart: [], totalPriceRaw: 0, totalProducts: 0 });
        }
        else
          setCart(res.data);
      } catch (err) {
        console.log(err)
      }
      setLoad(false);
    }
    fetchAll();
    // }, 500);
    // return () => clearTimeout(timeOutId);

  }, [isAuthenticated, updateCart])
  console.log(cart)


  useEffect(() => {
    const fetchAll = async () => {
      setLoad(true);
      try {
        // fetch all cate group by catlists
        let callCateGroup = CallAPI('/cate-group/by-catlists', 'get', null);
        let res = await callCateGroup;
        setCatelists(res.data.data);

      } catch (err) {
        console.log(err)
      }
      setLoad(false);
    }
    fetchAll();
  }, [])
  // console.log(catelists)

  return (
    <div className='App'>
      <Router>
        {/* component load */}
        <Progress isLoad={load} />

        <Header catelists={catelists} cart={cart} />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/profile/:state' exact component={Profile} />
          <Route path='/product-list' exact component={ProductList} />
          <Route
            path="/product-item/:id"
            exact
            render={(props) => (
              <ProductInfo {...props} setCart={setCart} cart={cart} setUpdateCart={setUpdateCart} />
            )}
          />
          <Route
            path="/shopping-cart"
            exact
            render={(props) => (
              <ShoppingCart {...props} setCart={setCart} cart={cart} setUpdateCart={setUpdateCart} />
            )}
          />
          <Route path='' component={PageNotFound} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
