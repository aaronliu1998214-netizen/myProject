import React from 'react';
import ScreenTable from '@/pages/screen/component/screenTable'
import './index.less'
import type { ColumnsType } from 'antd/es/table';


const columns: ColumnsType = [
  {
    title: '组别',
    ellipsis: true,
    dataIndex: 'area',
    // width: '3.5vw',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    ellipsis: true,
    // width: '3vw',
  },
  {
    title: '职位',
    // width: '3.5vw',
    ellipsis: true,
    dataIndex: 'post',
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
      area: `应急智慧组`,
      name: '张三',
      post:'组长',
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
