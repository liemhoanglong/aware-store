import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import homeBigPic from '../images/home-big-pic.PNG';
import homePic1 from '../images/home-pic1.PNG';
import homePic2 from '../images/home-pic2.PNG';
import homePic3 from '../images/home-pic3.PNG';
import homePic4 from '../images/home-pic4.PNG';

export default function Home(props) {

    return (
        <Container>
            <Link to='/product-list' >
                <br />
                <img src={homeBigPic} alt='home big pic' width='100%' />
            </Link>
            <Row className='mt-4'>
                <Col> <Link to='/product-list?catelist=6136342577e31326701a18fd&categroup=61363fc80fc94302bcc7b7ec' ><img src={homePic1} alt='home pic 1' width='100%' /></Link></Col>
                <Col> <Link to='/product-list?catelist=6136343677e31326701a1901' ><img src={homePic2} alt='home pic 2' width='100%' /></Link></Col>
                <Col> <Link to='/product-list?catelist=6136343b77e31326701a1903' ><img src={homePic3} alt='home pic 3' width='100%' /></Link></Col>
                <Col> <Link to='/product-list?catelist=6136346c9f814a47407fae2b' ><img src={homePic4} alt='home pic 4' width='100%' /></Link></Col>
            </Row>
        </Container>
    )
}