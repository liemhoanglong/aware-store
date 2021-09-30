import React from 'react';
import { Button } from 'react-bootstrap';

import './styles.css'

const ScrollToTop = () => {
  const [showScroll, setShowScroll] = React.useState(false)

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 200) {
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 200) {
      setShowScroll(false)
    }
  };
  window.addEventListener('scroll', checkScrollTop)

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={showScroll ? 'scroll active' : 'scroll block'}>
        <Button className='btn-circle' variant="warning" onClick={scrollTop}> <i className="fa fa-chevron-up" style={{ color: 'white' }} /></Button>
      </div>
    </>
  )
}

export default ScrollToTop;
