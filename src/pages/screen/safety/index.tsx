import React from 'react';
import ItemCard from '@/pages/screen/component/itemCard';
import RiskInfo from '@/pages/screen/safety/component/riskInfo';
import RiskHandle from '@/pages/screen/safety/component/riskHandle';
import TodayWorker from '@/pages/screen/safety/component/todayWorker';
import { Button, message } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import Environment from '@/pages/screen/safety/component/environment';
import Alarm from '@/pages/screen/safety/component/alarm';
// 安全管理
const Safety: React.FC = () => {
  const MoreBtn = () => {
    return (
      <Button
        className="morebtn"
        color="default"
        variant="outlined"
        iconPosition="end"
        icon={<DoubleRightOutlined />}
        onClick={() => {
          message.info('开发中');
        }}
      >
        查看更多
      </Button>
    );
  };

  return (
       <div className='container' style={{ backgroundColor: '#051f4e' }}>
          <div className="column column_left">
            <ItemCard title="风险信息" height={"18.5vh"}>
              < RiskInfo />
            </ItemCard>
            <ItemCard title="风险处理工单" height={"31vh"}>
              <RiskHandle />
            </ItemCard>
            <ItemCard title="今日工作人员统计" height={"28vh"}>
              <TodayWorker />
            </ItemCard>
          </div>
          <div className="column">
          </div>
          <div className="column column_right">
            <ItemCard title="环境监控" extra={<MoreBtn />}>
             <Environment />
            </ItemCard>
            <ItemCard title="报警监控查询" height={'38vh'}>
              <Alarm />
            </ItemCard>
          </div>
       </div>
  );
};

export default Safety;
