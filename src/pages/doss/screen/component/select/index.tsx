import { Button } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

type IPprops = {
  onTypeSelect: (val: any) => void;
};


const buttons = [
  { label: '攻击来源地图', value: 1 },
  { label: '流量统计地图', value: 2 },
]


const Index: React.FC<IPprops> = ({ onTypeSelect }) => {

  const [activekey, setActivekey] = useState<string>(buttons[0]?.value);


  return (
      <div className={styles.radio_select}>
        <div style={{ display: 'flex' }}>
          {buttons?.map((item: any) => {
            return (
              <div
                className={`${styles.btnitem} ${activekey === item.value ? styles.active : ''}`}
                key={item.label}
                onClick={() => {
                  setActivekey(item.value);
                  onTypeSelect(item.value)
                }}
              >
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default Index;
