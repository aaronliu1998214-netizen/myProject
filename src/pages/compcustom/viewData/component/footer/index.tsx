import React, { useState } from 'react';
import styles from './index.less';

interface footerIp {
  getActivekey: (val:any) => void
}

const Footer: React.FC<footerIp> = ({ getActivekey }) => {
  const btn = [
    { label: '安全管理', key: 1 , title: '安全管理调控中心' },
    { label: '应急处理', key: 2 , title: '应急处置调度中心'},
    { label: '视频管理', key: 3 , title: '视频管理中心'},
    { label: '生产调度', key: 4 , title: '生产经营调度中心'},
  ];

  const [activeKey, setActiveKey] = useState(1); // 默认选中第一个按钮

  const onChange = (val: any) => {
    console.log("val-->", val);
    setActiveKey(val?.key);
    getActivekey(val)
  };

  return (
    <div className={styles.footer_mian}>
      <div style={{ width:'25%' }}/>
        {btn.map((item) => (
          <div
            className={`${styles.btn} ${activeKey === item.key ? styles.active : ''}`}
            key={item.key}
            onClick={() => onChange(item)}
          >
            {item.label}
          </div>
        ))}
      <div style={{ width:'25%' }}/>
    </div>
  );
};

export default Footer;
