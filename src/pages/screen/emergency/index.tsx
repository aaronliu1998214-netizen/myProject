import React from 'react';
import ItemCard from '@/pages/screen/component/itemCard';
import Evacuess from '@/pages/screen/emergency/component/evacuess';
import Relief from '@/pages/screen/emergency/component/relief';
import Rescue from '@/pages/screen/emergency/component/rescue';
import Statistics from '@/pages/screen/emergency/component/statistics';

// 应急处理
const Emergency: React.FC = () => {
  return (
    <div className="container" style={{ backgroundColor: '#051f4e' }}>
      <div className="column column_left">
        <ItemCard title="危险撤离统计" height={'28.5vh'}>
          <Evacuess />
        </ItemCard>
        <ItemCard title="风险处应急救援体系" height={'52vh'}>
          <Rescue />
        </ItemCard>
      </div>
      <div className="column">{/* <Image src={back} width={'100%'} height={'100%'}/> */}</div>
      <div className="column column_right">
        <ItemCard title="危险撤离统计" height={'28.5vh'}>
          <Statistics />
        </ItemCard>
        <ItemCard title="急救物质清单" height={'52vh'}>
          <Relief />
        </ItemCard>
      </div>
    </div>
  );
};

export default Emergency;
