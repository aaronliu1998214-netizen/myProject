import React from 'react';
import ScreenTable from '@/pages/screen/component/screenTable'
import './index.less'
import type { ColumnsType } from 'antd/es/table';


const columns: ColumnsType = [
  {
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
    width: '3vw',
  },
  {
    title: '数量',
    width: '2.5vw',
    ellipsis: true,
    dataIndex: 'count',
  },
  {
    title: '有效期(天)',
    ellipsis: true,
    dataIndex: 'day',
    width: '4.2vw',
  },
  {
    title: '位置',
    ellipsis: true,
    dataIndex: 'position',
    // width: '6vw',
  },
  {
    title: '管理人',
    ellipsis: true,
    dataIndex: 'manage',
    width: '3vw',
  },
  {
    title: '联系方式',
    ellipsis: true,
    dataIndex: 'phone',
    // width: '6vw',
  },
];

// 应急救援体系
const Index: React.FC = () => {

  const data: any[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      count: 5,
      day:365,
      position:'急救药箱',
      name: '酒精',
      manage:'张三',
      phone:'13332333333',
    });
  }


  return (
    <div className="rescue">
        <ScreenTable dataSource={data} columns={columns} height='44vh' />
    </div>
  );
};

export default Index;
