import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { useHistory } from 'react-router-dom';

import CallAuthAPI from '../../services/CallAuthAPI';
import { useUserState } from "../../contexts/UserContext";
import Progress from '../Progress';
import PopupCheckout from '../PopupCheckout';
import config from '../../constants/config';
import Info from '../../images/info.svg';
import validatePhone from '../../utils/validatePhone';

export default function CartTotal(props) {
  const { profile, isAuthenticated } = useUserState();
  const [load, setLoad] = useState(false);
  // const history = useHistory();
  const [info, setInfo] = useState({ feeShipping: 0, phone: '', address: '', note: '' });
  const [checkoutShow, setCheckoutShow] = useState(false);
  const [showInfoShip, setShowInfoShip] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    props.cart.totalPriceRaw > 1000 ? setInfo(prevState => ({ ...prevState, feeShipping: 0 })) : setInfo(prevState => ({ ...prevState, feeShipping: 20 }));
  }, [props.cart.totalPriceRaw]);

  const handleCheckLogin = () => {
    if (!isAuthenticated) {
      props.setLoginShow(true)//open login
      return;
    }
    setInfo(prevState => ({ ...prevState, phone: profile.phone, address: profile.address }));
    setCheckoutShow(true);
  }

  const handleCheckOut = async () => {
    setMsg('');
    if (!validatePhone(info.phone)) {
      setMsg('Your phone number does not exist!');
      return;
    }
    setLoad(true);
    try {
      let res = await CallAuthAPI('/order/create', 'post', info);
      localStorage.removeItem('CART');
      props.setUpdateCart(prevState => (!prevState))//update cart
      setLoad(false);
      setCheckoutShow(false);
      // history.push('/');
    }
    catch (err) {
      console.log(err);
      setMsg(err.response.data.err)
      setLoad(false);
    }
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Free shipping on all orders over 1000$
    </Tooltip>
  );

  return (
    <div style={{ marginBottom: 240 }}>
      <Progress isLoad={load} />
      <PopupCheckout
        show={checkoutShow}
        onHide={() => { setMsg(''); setCheckoutShow(false); }}
        info={info}
        setInfo={setInfo}
        msg={msg}
        onAccepted={() => handleCheckOut()}
      />
      <div className='text-14'><b>Total</b></div>
      <div className='cart-total mt-2'>

        <div className='d-flex justify-content-between'>
          <span>Shipping & Handling:</span>
          <div className='d-flex justify-content-end'>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <img src={Info} alt='info-logo' onClick={() => setShowInfoShip(!showInfoShip)} className="cursor-hover me-1" />
            </OverlayTrigger>
            <span>{props.cart.totalPriceRaw > 1000 ? 'Free' : `${config.FEE_SHIPPING.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`}</span>
          </div>
        </div>
        <div className='d-flex justify-content-between'>
          <span>Total product:</span>
          <span>{props.cart.totalPriceRaw.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </div>
        <hr />
        <div className='d-flex justify-content-between'>
          <b><span>Subtotal</span></b>
          <b><span>{(props.cart.totalPriceRaw + info.feeShipping).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span></b>
        </div>
      </div>
      <Button onClick={handleCheckLogin} variant="danger" className='cart-btn-checkout' disabled={props.cart.cart.length > 0 ? 0 : 1}>Check out</Button>
    </div>
  )
}