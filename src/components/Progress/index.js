import React from 'react';
import styles from './styles.module.css'

const Progress = ({ isLoad }) => {
  const [load, setLoad] = React.useState(isLoad);

  React.useEffect(() => {
    setLoad(isLoad)
  }, [isLoad])

  if (!load) return <></>;

  return (
    <>
      <div className={`${styles['lightbox']}`}>
        <div className={`${styles['centered']}`} >
          <div className={`${styles['lds-roller']} ${styles['mb-3']}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Progress;
