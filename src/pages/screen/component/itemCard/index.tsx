import React from 'react';
import './index.less';

interface IPprops {
  title?: string;
  children?: any;
  height?: number | string;
  extra?: any;
}
const ItemCard: React.FC<IPprops> = ({ children, title, height, extra = '' }) => {
  return (
    <div className="panel" style={{ height: height }}>
      <div style={{}}>
        <div className="title">
          <div className="tit">{title}</div>
          <div className="extra">{extra ? extra : ''}</div>
        </div>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

export default ItemCard;
