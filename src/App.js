import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Progress from './components/Progress';
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPass from "./components/ForgotPass";
import CallAPI from './services/CallAPI';
import CallAuthAPI from './services/CallAuthAPI';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProductList from "./pages/ProductList";
import ProductInfo from "./pages/ProductInfo";
import ShoppingCart from "./pages/ShoppingCart";
import MyOrders from "./pages/MyOrders";
import PageNotFound from "./pages/PageNotFound";
import ScrollToTop from "./components/ScrollToTop";

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

  const [loginShow, setLoginShow] = useState(false);
  const [signupShow, setSignupShow] = useState(false);
  const [forgotPassShow, setForgotPassShow] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      if (!isAuthenticated) {
        // console.log('App-----------------')
        // console.log(cartParsed)
        let cartParsed = JSON.parse(localStorage.getItem('CART'));
        if (cartParsed) {
          // console.log('not login --------------- ' + cartParsed.cart.length)
          let totalPriceRaw = 0;
          let totalProducts = 0;
          for (let i = 0; i < cartParsed.cart.length; i++) {
            totalPriceRaw += Number(cartParsed.cart[i].productId.price) * Number(cartParsed.cart[i].quantity);
            totalProducts += Number(cartParsed.cart[i].quantity);
          }
          setCart({ cart: cartParsed.cart, totalPriceRaw, totalProducts });
        }
        else
          setCart({ cart: [], totalPriceRaw: 0, totalProducts: 0 });
        return;
      }
      try {
        setLoad(true);
        let res = await CallAuthAPI('/user/get-cart', 'get', null);
        if (!res.data.cart || res.data.cart.length === 0) {
          //if user cart after fetch is null save cart form local storage to cart
          //then update cart in database
          let cartParsed = JSON.parse(localStorage.getItem('CART'));
          if (cartParsed) {
            try {
              CallAuthAPI('/user/update-cart', 'put', { cart: cartParsed.cart });
              // console.log(res.data);
            }
            catch (err) {
              console.log(err);
              setLoad(false);
            }
            // console.log('login but cart null ---------- ' + cartParsed.cart.length)
            let totalPriceRaw = 0;
            let totalProducts = 0;
            for (let i = 0; i < cartParsed.cart.length; i++) {
              totalPriceRaw += Number(cartParsed.cart[i].productId.price) * Number(cartParsed.cart[i].quantity);
              totalProducts += Number(cartParsed.cart[i].quantity);
            }
            setCart({ cart: cartParsed.cart, totalPriceRaw, totalProducts });
            setLoad(false);
          }
          else
            setCart({ cart: [], totalPriceRaw: 0, totalProducts: 0 });
          setLoad(false);
        }
        else { //if user cart after fetch is exist save cart form to local storage
          setCart(res.data);
          localStorage.setItem('CART', JSON.stringify(res.data));
          setLoad(false);
        }
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
    }
    fetchAll();
  }, [isAuthenticated, updateCart])
  // console.log(cart)

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
    <div className='App d-flex flex-column h-100 vsc-initialized'>
      <ScrollToTop />
      <Router>
        {/* component load */}
        <Progress isLoad={load} />
        <Login
          show={loginShow}
          onHide={() => setLoginShow(false)}
          setSignupShow={() => setSignupShow(true)}
          setLoginShow={() => setLoginShow(true)}
          setForgotPassShow={() => setForgotPassShow(true)}
        />
        <Signup
          show={signupShow}
          onHide={() => setSignupShow(false)}
          setLoginShow={() => setLoginShow(true)}
        />
        <ForgotPass
          show={forgotPassShow}
          onHide={() => setForgotPassShow(false)}
          setLoginShow={() => setLoginShow(true)}
        />
        <Header catelists={catelists} cart={cart} setSignupShow={setSignupShow} setLoginShow={setLoginShow} />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/profile/:state' exact component={Profile} />
          <Route path='/product-list' exact component={ProductList} />
          <Route
            path="/product-info/:id"
            exact
            render={(props) => (
              <ProductInfo {...props} cart={cart} setUpdateCart={setUpdateCart} />
            )}
          />
          <Route
            path="/shopping-cart"
            exact
            render={(props) => (
              <ShoppingCart {...props} cart={cart} setUpdateCart={setUpdateCart} setLoginShow={setLoginShow} />
            )}
          />
          <Route
            path="/my-orders"
            exact
            render={(props) => (
              <MyOrders {...props} cart={cart} setUpdateCart={setUpdateCart} setLoginShow={setLoginShow} />
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
