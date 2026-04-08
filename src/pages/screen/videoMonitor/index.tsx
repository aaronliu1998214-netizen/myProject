import React from 'react';
import ItemCard from '@/pages/screen/component/itemCard';
import Trimester from '@/pages/screen/videoMonitor/component/trimester';
import Fifteen from '@/pages/screen/videoMonitor/component/fifteen';
import Monthly from '@/pages/screen/videoMonitor/component/monthly';
import AlarmReport from '@/pages/screen/videoMonitor/component/alarmReport';

// 视频监控
const Safety: React.FC = () => {
  return (
    <div className="container" style={{ backgroundColor: '#051f4e' }}>
      <div className="column">
        <ItemCard title="近三个月的告警统计" height={'19vh'}>
          <Trimester />
        </ItemCard>
        <ItemCard title="近15天平台告警统计" height={'29vh'}>
          <Fifteen />
        </ItemCard>
        <ItemCard title="近一个月平台告警占比" height={'32vh'}>
          <Monthly />
        </ItemCard>
      </div>
      <div className="column" style={{ color: '#ffffff' }}>
        {/* 监控视频分页组件 */}
        
      </div>
      <div className="column">
        <ItemCard title="报警监控查询" height={'80vh'}>
          <AlarmReport />
        </ItemCard>
      </div>
    </div>
  );
};

export default Safety;
