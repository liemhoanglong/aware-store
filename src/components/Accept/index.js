import React, { useState } from 'react';
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
                <center>
                    <h4><b>{props.title}</b></h4>
                </center>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'flex-end' }}>
                <Button onClick={props.onHide} variant="warning">Cancel</Button>
                <Button onClick={props.onAccepted} variant="danger">Delete</Button>
            </Modal.Footer>
        </Modal>
    );
}
