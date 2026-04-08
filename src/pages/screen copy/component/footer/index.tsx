import React, { useState } from 'react';
import styles from './index.less';
import { btn } from '../../_data'

interface footerIp {
  getActivekey: (val:any) => void
}

const Footer: React.FC<footerIp> = ({ getActivekey }) => {

  const [activeKey, setActiveKey] = useState(1); // 默认选中第一个按钮

  const onChange = (val: any) => {
    console.log("val-->", val);
    setActiveKey(val?.key);
    getActivekey(val)
  };

  return (
    <div className='footer'>
    <div className={styles.footer_mian}>
      <div style={{ width:'25vw'}}/>
        {btn.map((item:any) => (
          <div
            className={`${styles.btn} ${activeKey === item.key ? styles.active : ''}`}
            key={item.key}
            onClick={() => onChange(item)}
          >
            <div style={{ marginTop: '2vh' }}>
              <img style={{ width: '1.1vw' }} src={item.icon}/>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      <div style={{ width:'25vw' }}/>
    </div>
    </div>
  );
};

export default Footer;
