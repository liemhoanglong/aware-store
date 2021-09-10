import {useState, useEffect} from 'react';
import * as _ from 'lodash';

const getDeviceConfig = (width) => {
  if(width <375){
    return 'xss'
  }
  else if(width >= 375 && width < 576) {
    return 'xs';
  } else if(width >= 576 && width < 768 ) {
    return 'sm';
  } else if(width >= 768 && width < 992) {
    return 'md';
  } else if(width >= 992 && width < 1200) {
    return 'lg';
  } else if(width >= 1200) {
    return 'xl';
  }
};

const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(() => getDeviceConfig(window.innerWidth));
  
  useEffect(() => {
    const calcInnerWidth = _.throttle(()=> {
      setBrkPnt(getDeviceConfig(window.innerWidth))
    }, 200); 
    window.addEventListener('resize', calcInnerWidth);
    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return brkPnt;
}
export default useBreakpoint;