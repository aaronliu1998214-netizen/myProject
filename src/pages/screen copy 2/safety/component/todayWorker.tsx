import React, {} from 'react';
import ScreenTable from '@/pages/screen/component/screenTable';

import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType = [
  {
    title: '区域',
    dataIndex: 'area',
    width: '24%'
  },
  {
    title: '人数',
    dataIndex: 'count',
    width: '18%'
  },
  {
    title: '负责人',
    width: '20%',
    dataIndex: 'name',
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
  },
];

const RiskInfo: React.FC = () => {

const data: any[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    area: `Edward`,
    count: 32,
    phone: `11111111111`,
    name: i + 1
  });
}

  return (
    <div className='work'>
      <div className='work_left'>
         <div className='icon'></div>
         <div className='num'>
            <div style={{ fontSize: '2.4vh', fontWeight: 700  }}> { 6000 }</div>
            <div> 总人数</div>
         </div>
      </div>
      <div className='work_right'>
        <ScreenTable
          dataSource={data}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default RiskInfo;
