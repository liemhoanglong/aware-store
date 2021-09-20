import React from 'react';
import { Row, Col } from 'react-bootstrap';

import StarIcon from '../Icon/StartIcon';

export default function Comment(props) {

    return (
        <>
            {
                props.commentData.comments.map((comment, idx) => (
                    <Row className='text-14 mb-3' key={idx}>
                        <Col lg={3}>
                            <p className='m-0 pt-3'><b>{comment.authorId.name}</b></p>
                            <p className='text-regular'>{((new Date(comment.postedDate)) + '').slice(3, 24)}</p>
                        </Col>
                        <Col lg={9} style={{ padding: '20px 16px 20px 24px', backgroundColor: '#f9f9f9' }}>
                            <p className='m-0'><b>{comment.title}</b></p>
                            <StarIcon color={`${comment.star > 0 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                            <StarIcon color={`${comment.star > 1 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                            <StarIcon color={`${comment.star > 2 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                            <StarIcon color={`${comment.star > 3 ? '#FFD543' : '#D4D3D3'}`} className='me-1' />
                            <StarIcon color={`${comment.star > 4 ? '#FFD543' : '#D4D3D3'}`} className='me-3' />
                            <p className='text-regular mt-4'>{comment.content}</p>
                        </Col>
                        {idx != props.commentData.comments.length - 1 && <div style={{ borderBottom: '1px dashed lightgray', marginTop: '16px' }} />}
                    </Row>
                ))
            }
        </>
    )
}