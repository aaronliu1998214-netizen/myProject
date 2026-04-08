import React, { useState } from 'react';
import ScreenTable from '@/pages/screen/component/screenTable'
import { Select } from 'antd';
import pickerIcon from '@/assets/screen/pickerIcon.png';
import type { ColumnsType } from 'antd/es/table';
import './index.less'

const columns: ColumnsType = [
  {
    title: '区域',
    ellipsis: true,
    dataIndex: 'area',
    width: '3.5vw',
  },
  {
    title: '时间',
    dataIndex: 'time',
    ellipsis: true,
    width: '3vw',
  },
  {
    title: '负责人',
    width: '3.5vw',
    ellipsis: true,
    dataIndex: 'name',
  },
  {
    title: '内容',
    ellipsis: true,
    dataIndex: 'content',
    // width: '6vw',
  },
];

// 危险撤离人数
const Index: React.FC = () => {
  const [type, setType] = useState<string>('date')

  const data: any[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      area: `展会的`,
      time: '2025-02-04',
      content: `xx区域发生xxx事件`,
      name: '王五里',
    });
  }

  return (
    <div className="evacuess">
      <div className='top'>
      <div className='count'>
        <div>总数</div>
        <div>{ '60' }</div>
      </div>
      <Select
        aria-label="Picker Type"
        value={type}
        onChange={setType}
        suffixIcon={<img src={pickerIcon} />}
        className="custom_select"
        options={[
          { value: 'date', label: '日' },
          { value: 'week', label: '周' },
          { value: 'quarter', label: '季' },
          { value: 'year', label: '年' },
        ]}
        bordered={false}
        popupMatchSelectWidth={false}
        popupClassName='popupClassName_select'
      />
      </div>
      <div style={{ margin: '0 0.45vw 0 0.45vw' }}>
        <ScreenTable dataSource={data} columns={columns} height='14vh' />
      </div>
    </div>
  );
};

export default Index;
