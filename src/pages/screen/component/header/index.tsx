import React, { useEffect, useState } from 'react';
import styles from './index.less';
// import { Button } from 'antd'
import { history } from '@umijs/max';

interface IPprop {
  keyI?: number;
  title?: string;
}

const Header: React.FC<IPprop> = ({ title, keyI }) => {
  const [datePart, setDatePart] = useState('');
  const [weekPart, setWeekPart] = useState('');
  const [timePart, setTimePart] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');

      const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const day = dayNames[now.getDay()];

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      setDatePart(`${year}/${month}/${date}`);
      setWeekPart(`${day}`);
      setTimePart(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.header_bg}>
      <div
        className={styles.header_main}
        style={keyI === 3 || keyI === 4 ? { backgroundColor: '#051f4e' } : {}}
      >
        <div className={styles.name}>智慧调度驾驶舱</div>
        <header className={styles.title}>{title}</header>
        <div className={styles.time}>
          <span
            className="back"
            onClick={() => {
              history?.back();
            }}
            style={{ cursor: 'pointer' }}
          >
            返回
          </span>
          <span>{datePart}</span>
          <span>{weekPart}</span>
          <span className={styles.redTime}>{timePart}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
