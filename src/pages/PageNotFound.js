import React, { useState } from 'react';

import image from '../images/404.jpg'

export default function PageNotFound(props) {

    return (
        <center>
            <h1>
                <img src={image} width='600px' />
            </h1>
        </center>
    )
}