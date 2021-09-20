import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Progress from '../components/Progress';
import CallAuthAPI from '../services/CallAuthAPI';
import OrderCard from '../components/OrderCard';
import Accept from '../components/Accept';
import Paginate from '../components/Paginate';
import goShoppingNow from '../images/go-shopping-now.png';

export default function MyOrders(props) {
  const [ordersData, setOrdersData] = useState(null);
  const [load, setLoad] = useState(false);
  const [acceptShow, setAcceptShow] = useState(false);
  const [orderIndex, setOrderIndex] = useState(-1);
  const [orderId, setOrderId] = useState(-1);
  const [page, setPage] = useState(1);

  const handleAcceptCancelOrder = async (orderId, orderIndex) => {
    setAcceptShow(true);
    setOrderIndex(orderIndex);
    setOrderId(orderId);
  }

  const handleCancelOrder = async () => {
    setLoad(true);
    setAcceptShow(false);
    if (orderIndex < 0 || orderId < 0) return;
    let orderDataTemp = JSON.parse(JSON.stringify(ordersData.orders))
    console.log(orderIndex)
    console.log(orderId)
    try {
      await CallAuthAPI(`/order/cancel/${orderId}`, 'get', null)
    } catch (err) {
      console.log(err)
      setLoad(false);
    }
    setLoad(false);
    orderDataTemp[orderIndex].status = -1;
    setOrdersData({ ...ordersData, orders: orderDataTemp });
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoad(true);
      try {
        let res = await CallAuthAPI(`/order/my?page=${page}`, 'get', null);
        setOrdersData(res.data);
      } catch (err) {
        console.log(err)
      }
      setLoad(false);
    };
    fetchAll();
  }, [page])

  const handleChangePage = (page) => {
    // console.log('onclick ' + page)
    if (page < 1) page = 1;
    if (page === Number(page)) return;
    if (page > Math.ceil(ordersData.count / 5)) page = Math.ceil(ordersData.count / 5);
    setPage(page);
  }

  const handleClickPrePage = () => {
    let pagePrev = page;
    // console.log('onclick Pre Page ' + page)
    if (pagePrev - 1 < 1) return;
    --pagePrev;
    setPage(pagePrev);
    // handleChangePage(pagePrev);
  }

  const handleClickNextPage = () => {
    let pageNext = page;
    // console.log('onclick Next Page ' + page)
    if (pageNext + 1 > Math.ceil(ordersData.count / 5)) return;
    ++pageNext;
    setPage(pageNext);
    // handleChangePage(pageNext);
  }

  return (
    <Container>
      <Accept
        show={acceptShow}
        onHide={() => setAcceptShow(false)}
        onAccepted={() => handleCancelOrder()}
        title='Do you really want to cancel this order?'
      />
      <Progress isLoad={load} />
      <h1 style={{ fontSize: '24px', marginBottom: '36px' }}>My orders</h1>
      {ordersData && <div className='d-flex justify-content-end'>
        <Paginate
          handleClickPrePage={handleClickPrePage}
          handleClickNextPage={handleClickNextPage}
          page={page}
          handleChangePage={handleChangePage}
          data={ordersData}
          limit={5}
        />
      </div>
      }
      <br />
      {ordersData ? ordersData.orders.map((order, idx) => (
        <div key={order._id}>
          <OrderCard order={order} handleAcceptCancelOrder={() => handleAcceptCancelOrder(order._id, idx)} />
          <hr />
        </div>
      ))
        :
        <center>
          <Link to='/product-list'> <img src={goShoppingNow} alt='Go shopping now' width='500px' /></Link>
          <h2 className='mt-4 mb-3'><b>You don't have any orders!</b></h2>
          <Link to='/product-list'><Button variant="danger" className='cart-btn-checkout'>Go shopping now</Button></Link>
        </center>
      }
      {ordersData && <div className='d-flex justify-content-end'>
        <Paginate
          handleClickPrePage={handleClickPrePage}
          handleClickNextPage={handleClickNextPage}
          page={page}
          handleChangePage={handleChangePage}
          data={ordersData}
          limit={5}
        />
      </div>
      }
    </Container>
  )
}