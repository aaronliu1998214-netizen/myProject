import React, {} from 'react';
import { history } from '@umijs/max';

const ScreenIcon: React.FC = () => {


  return (
   <div
    onClick={() => {
        history.push('/screen')
    }}
   >安全应急指挥中心</div>
  );
};

export default ScreenIcon;
