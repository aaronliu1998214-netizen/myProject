import React, {} from 'react';
import './index.less'

interface IPprops {
  title?: string;
  children?: any;
  height?: number | string;
}
const ItemCard: React.FC<IPprops> = ({ children, title, height }) => {


  return (
    <div className="panel pie" style={{ height: height }}>
        <h2>{title}</h2>
        <div>{children}</div>
    </div>
  );
};

export default ItemCard;
