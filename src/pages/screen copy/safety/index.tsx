import React, {} from 'react';
import ItemCard from '@/pages/screen/component/itemCard';
import RiskInfo from '@/pages/screen/safety/component/riskInfo';
import RiskHandle from '@/pages/screen/safety/component/riskHandle';
import TodayWorker from '@/pages/screen/safety/component/todayWorker';
// 安全管理 
const Safety: React.FC = () => {
 
  return (
       <div className='container'>
        {/* <Image src={back} width={'100%'} height={'100%'}/>  */}
          <div className="column column_left">
            <ItemCard title="风险信息" height={"18vh"}>
              < RiskInfo />
            </ItemCard>
            <ItemCard title="风险处理工单" height={"30vh"}>
              <RiskHandle />
            </ItemCard>
            <ItemCard title="今日工作人员统计" height={"33vh"}>
              <TodayWorker />
            </ItemCard>
          </div>
          <div className="column">
            this
          </div>
          <div className="column column_right">
            <ItemCard title="环境监控" height={'41.5vh'} extra={'按钮'}>UI还没切图</ItemCard>
            <ItemCard title="报警监控查询" height={'41.5vh'}>UI还没切图</ItemCard>
          </div>
       </div>
  );
};

export default Safety;
