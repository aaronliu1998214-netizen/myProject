import React from 'react';
import ScreenTable from '@/pages/screen/component/screenTable';
import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType = [
  {
    title: '区域',
    ellipsis: true,
    dataIndex: 'area',
    width: '3.5vw',
  },
  {
    title: '人数',
    dataIndex: 'count',
    ellipsis: true,
    width: '3vw',
  },
  {
    title: '负责人',
    width: '3vw',
    ellipsis: true,
    dataIndex: 'name',
  },
  {
    title: '联系方式',
    ellipsis: true,
    dataIndex: 'phone',
    // width: '6vw',
  },
];

const RiskInfo: React.FC = () => {
  const data: any[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      area: `展会的`,
      count: 32,
      phone: `11111111111`,
      name: i + 1,
    });
  }

  return (
    <div className="work">
      <div className="work_left">
        <div className="icon"></div>
        <div className="num">
          <div style={{ fontSize: '2.4vh', fontWeight: 700 }}> {6000}</div>
          <div style={{ fontSize: '1.6vh' }}> 总人数</div>
        </div>
      </div>
      <div className="work_right">
        <ScreenTable height="20vh" dataSource={data} columns={columns} />
      </div>
    </div>
  );
};

export default RiskInfo;
