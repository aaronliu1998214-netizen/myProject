import React from 'react';
import './index.less';

interface IPprops {
  title?: string;
  children?: any;
  height?: number | string;
  extra?: any;
}
const ItemCard: React.FC<IPprops> = ({ children, title, height }) => {
  return (
    <div className="panel" style={{ height: height }}>
      <div className="itemcard_title">{title}</div>
      <div className="content">{children}</div>
    </div>
  );
};

export default ItemCard;
