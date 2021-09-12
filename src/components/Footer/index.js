import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from "react-bootstrap";

import './footer.css';
import logo from '../../images/logo.svg';
import facebook from '../../images/facebook.svg';
import twitter from '../../images/twitter.svg';
import instagram from '../../images/instagram.svg';

export default function Footer(props) {

    return (
        <footer>
            <hr style={{ color: 'lightgray', boxShadow: '.1px 0 .7px rgba(0, 0, 0, 2)', marginTop: '57px' }} />
            <Container>
                <div className='d-flex justify-content-between flex-wrap' style={{ alignItems: 'baseline' }}>
                    <img src={logo} alt='logo' width='96px' style={{ marginTop: '52px', marginBottom: '48px' }} />
                    <div className='d-flex justify-content-between flex-wrap' >
                        <span className='sitemap mx-3'>Home</span>
                        <span className='sitemap mx-3'>Products</span>
                        <span className='sitemap mx-3'>Services</span>
                        <span className='sitemap mx-3'>About Us</span>
                        <span className='sitemap mx-3'>Help</span>
                        <span className='sitemap mx-3'>Contacts</span>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <img className='mx-2' src={twitter} alt='twitter' />
                        <img className='mx-2' src={facebook} alt='facebook' />
                        <img className='mx-2' src={instagram} alt='instagram' />
                    </div>
                </div>
            </Container>
            <hr style={{ color: 'lightgray', boxShadow: '.1px 0 .7px rgba(0, 0, 0, 2)' }} />
            <Container>
                <div className='d-flex justify-content-between flex-wrap mb-4'>
                    <div className='d-flex justify-content-start flex-wrap'>
                        <span className='sitemap me-4'>Home</span>
                        <span className='sitemap me-4'>Products</span>
                        <span className='sitemap me-4'>Services</span>
                        <span className='sitemap me-4'>About Us</span>
                        <span className='sitemap me-4'>Help</span>
                        <span className='sitemap me-4'>Contacts</span>
                    </div>
                    <div className='d-flex justify-content-end flex-wrap'>
                        <span className='sitemap me-4'>Privacy Policy</span>
                        <span className='sitemap'>Terms & Conditions</span>
                    </div>
                </div>
            </Container>
        </footer>
    )
}