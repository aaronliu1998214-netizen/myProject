import React from 'react';
import ItemCard from '@/pages/screen/component/itemCard';

// 生成调度
const Safety: React.FC = () => {
  return (
    <div className="container" style={{ backgroundColor: '#051f4e' }}>
      <div className="column">
        <ItemCard title="今日生成计划" height={'25vh'}>
          近15天平台告警统计
        </ItemCard>
        <ItemCard title="产量统计" height={'58vh'}>
          近一个月平台告警占比
        </ItemCard>
      </div>
      <div className="column">UI还没切图</div>
      <div className="column">
        <ItemCard title="今日生成计划" height={'27vh'}>
          报警监控查询
        </ItemCard>
        <ItemCard title="今日生成计划" height={'56vh'}>
          报警监控查询
        </ItemCard>
      </div>
    </div>
  );
};

export default Safety;
