import { Empty } from 'antd';
import React from 'react';
import styles from './ItemList.module.less';

type Item = {
  text: string;
  onClick?: () => void;
};

type Props = {
  list: Item[];
};
export const ItemList: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      {props.list && props.list.length > 0 ? (
        props.list.map((item, index) => {
          return (
            <span key={index} onClick={item.onClick}>
              {item.text}
            </span>
          );
        })
      ) : (
        <Empty />
      )}
    </div>
  );
};
