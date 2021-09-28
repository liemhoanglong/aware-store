import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function Accept(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <form onSubmit={e => { e.preventDefault(); props.onAccepted(); }} style={{ padding: '15px 80px 17px' }}>
          <center>
            <h4><b>Checkout</b></h4>
            {props.msg && <p className='text-center text-14 text-danger text'><b>{props.msg}</b></p>}
          </center>
          <p className='mb-2 model-lable'><b>Address</b></p>
          <input value={props.info.address} onChange={e => props.setInfo(prevState => ({ ...prevState, address: e.target.value }))} type='text' name='address' className={`mb-4 modal-input`} placeholder='Enter your Address...' required />
          <p className='mb-2 model-lable'><b>Phone</b></p>
          <input value={props.info.phone} onChange={e => props.setInfo(prevState => ({ ...prevState, phone: e.target.value }))} type='text' name='phone' className={`mb-4 modal-input`} placeholder='Enter your Phone number...' required />
          <p className='mb-2 model-lable'><b>Note</b></p>
          <input onChange={e => props.setInfo(prevState => ({ ...prevState, note: e.target.value }))} type='text' name='note' className={`mb-4 modal-input`} placeholder='Enter your note...' />
          <div className='d-flex justify-content-end'>
            <Button onClick={props.onHide} className='me-3' variant="warning">Cancel</Button>
            <Button type='submit' variant="success">Submit</Button>
          </div>
        </form>
        <br />
      </Modal.Body>
    </Modal>
  );
}
