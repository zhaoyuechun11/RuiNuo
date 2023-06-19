import React, { useState, useEffect } from 'react';
import styles from './index.less';

const Index = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if(props.current) {
      setCurrentIndex(props.current)
    }
  }, [props])
  const handleChange = index => {
    setCurrentIndex(index);
    props.handleChange(index);
  };
  return (
    <div className={styles.tabbutton}>
      {props.list.map((item, index) => (
        <div
          style={{ width: `${props.width}px` }}
          key={index}
          className={
            currentIndex === index
              ? `${styles.tabbutton_item} ${styles.active}`
              : `${styles.tabbutton_item}`
          }
          onClick={() => {
            handleChange(index);
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Index;
