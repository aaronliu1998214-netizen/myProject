import React from 'react'
import styles from './index.less'
  

 const StaticeItemCardOne = ({ value, title, unit }: { value: string, title: string, unit: string} ) => { 


  
  const renderValue = (val: string) => {
    if (val.includes('.')) {
      const [integer, decimal] = val.split('.');
      return (
        <>
          {integer}
          <span style={{ fontSize: '0.7em' }}>.{decimal}<span>{unit}</span></span>
        </>
      );
    }
    return `${val}${unit}`;
  };

  const tooLong = (val: string) => val.length > 4;



    return (
      <div className={styles.staticitem}>
        <div className={styles.containt}>
        <span className={styles.staticvalue}>{renderValue(value)}</span>
        <p className={styles.valueshadow}>{renderValue(value)}</p>
        <div className={styles.statictitle}>
          <p style={{
            marginTop: tooLong(title) ? '' : '7%'
            }}
          >{title}</p>
        </div>
        </div>
      </div>
    )
  }

  export default StaticeItemCardOne