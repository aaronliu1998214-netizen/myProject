import React from 'react';
import risk1 from '@/assets/screen/risk1.png';
import risk2 from '@/assets/screen/risk2.png';
import risk3 from '@/assets/screen/risk3.png';
import risk4 from '@/assets/screen/risk4.png';
import './index.less';

const data = [
  { icon: risk1, name: '重大风险', count: 1 },
  { icon: risk2, name: '较大风险', count: 0 },
  { icon: risk3, name: '一般风险', count: 14 },
  { icon: risk4, name: '潜在风险', count: 32 },
];

const RiskInfo: React.FC = () => {
  return (
    <div className="riskBox">
      {data?.map((item: any, index: number) => {
        return (
          <div className="box" key={index}>
            <div
              className="count"
              style={{
                backgroundImage: `url(${item.icon})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: '100% 100%',
              }}
            >
              <span> {item?.count}</span>
            </div>
            <div className="name">{item?.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default RiskInfo;
