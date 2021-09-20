import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

import Progress from '../Progress';
import CallAuthAPI from '../../services/CallAuthAPI';

export default function Review(props) {
  const [load, setLoad] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (props.type === 1) {
      // console.log('write reviewData')
      // console.log(props.reviewData)
      try {
        let res = await CallAuthAPI(`/comment`, 'post', props.reviewData);
        props.setMyOrderReset(prevState => (!prevState))
        props.setReviewData({ productId: '', orderId: '', color: '', size: '', title: '', content: '', star: 5, index: '-1' })
        props.onHide();
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
    } else {
      console.log('edit reviewData')
      console.log(props.reviewData)
      try {
        let res = await CallAuthAPI(`/comment/${props.reviewId}`, 'put', props.reviewData);
        props.setMyOrderReset(prevState => (!prevState))
        props.setReviewData({ productId: '', orderId: '', color: '', size: '', title: '', content: '', star: 5, index: '-1' })
        props.onHide();
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
    }
    setLoad(false);
  }


  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Progress isLoad={load} />
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <center>
          <h4><b>{props.type === 1 ? 'Write review' : 'Edit review'}</b></h4>
        </center>
        <form onSubmit={handleSubmitReview} style={{ padding: "15px 80px 17px" }}>
          <input
            style={{ fontSize: '16px' }}
            className='modal-input'
            onChange={e => props.setReviewData(prevState => ({ ...prevState, title: e.target.value }))}
            type='text' name='title' placeholder='TITLE'
            value={props.reviewData.title}
          />
          <textarea
            className='mt-2 modal-textarea'
            onChange={e => props.setReviewData(prevState => ({ ...prevState, content: e.target.value }))}
            rows="6" name='content' placeholder='Add your comment here…'
            value={props.reviewData.content}
          />
          <div className='d-flex justify-content-between my-3'>
            <div>
              <p className='text-14 m-0'>*Rating for us:</p>
              <div className="rate">
                <input type="radio" id="star5" name="rate" value="5"
                  checked={props.reviewData.star === 5 ? true : false}
                  onClick={() => props.setReviewData(prevState => ({ ...prevState, star: 5 }))} />
                <label htmlFor="star5" title="text">5 stars</label>
                <input type="radio" id="star4" name="rate" value="4"
                  checked={props.reviewData.star === 4 ? true : false}
                  onClick={() => props.setReviewData(prevState => ({ ...prevState, star: 4 }))} />
                <label htmlFor="star4" title="text">4 stars</label>
                <input type="radio" id="star3" name="rate" value="3"
                  checked={props.reviewData.star === 3 ? true : false}
                  onClick={() => props.setReviewData(prevState => ({ ...prevState, star: 3 }))} />
                <label htmlFor="star3" title="text">3 stars</label>
                <input type="radio" id="star2" name="rate" value="2"
                  checked={props.reviewData.star === 2 ? true : false}
                  onClick={() => props.setReviewData(prevState => ({ ...prevState, star: 2 }))} />
                <label htmlFor="star2" title="text">2 stars</label>
                <input type="radio" id="star1" name="rate" value="1"
                  checked={props.reviewData.star === 1 ? true : false}
                  onClick={() => props.setReviewData(prevState => ({ ...prevState, star: 1 }))} />
                <label htmlFor="star1" title="text">1 star</label>
              </div>
            </div>
            <Button type='submit' className='modal-submit-btn' variant="secondary" >Submit</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
