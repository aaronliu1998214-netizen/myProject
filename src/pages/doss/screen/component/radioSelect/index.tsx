import React, { useState } from 'react';
import styles from './index.less';

interface IPprops {
  btn: any[];
  onSelect: (val:any) => void;
}
const Index: React.FC<IPprops> = ({ btn , onSelect }) => {
  const [activekey, setActivekey] = useState<string>(btn[0].value);

  return (
    <div className={styles.radioselect}>
      {btn?.map((item: any) => {
        return (
          <div
            className={`${styles.btnitem} ${activekey === item.value ? styles.active : ''}`}
            key={item.label}
            onClick={() => {
              setActivekey(item.value);
              onSelect(item.value)
            }}
          >
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Index;
