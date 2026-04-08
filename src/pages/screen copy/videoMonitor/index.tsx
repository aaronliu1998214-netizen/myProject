import React, {} from 'react';
import ItemCard from '@/pages/screen/component/itemCard';


// 视频监控 
const Safety: React.FC = () => {
 
  return (
       <div className='container' style={{ backgroundColor: '#051f4e' }}>
          <div className="column" >
            <ItemCard title="近三个月的告警统计" height={"18%"}>近三个月的告警统计</ItemCard>
            <ItemCard title="近15天平台告警统计" height={"38%"}>近15天平台告警统计</ItemCard>
            <ItemCard title="近一个月平台告警占比" height={"38%"}>近一个月平台告警占比</ItemCard>
          </div>
          <div className="column">
            UI还没切图
          </div>
          <div className="column" >
            <ItemCard title="报警监控查询" height={'98%'}>报警监控查询</ItemCard>
          </div>
       </div>
  );
};

export default Safety;
