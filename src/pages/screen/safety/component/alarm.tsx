import React from 'react';
import './index.less';
import ScreenTable from '@/pages/screen/component/screenTable';
import type { ColumnsType } from 'antd/es/table';
import ScreenDataPicker from '@/pages/screen/component/screenDataPicker';

const Alarm: React.FC = () => {
  const columns: ColumnsType = [
    {
      title: '序号',
      dataIndex: 'index',
      ellipsis: true,
      width: '2.4vw',
    },
    {
      title: '区域',
      dataIndex: 'area',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '时间',
      dataIndex: 'time',
      ellipsis: true,
      width: '20%',
    },
    {
      title: '事件',
      dataIndex: 'something',
      ellipsis: true,
      render: (text: string) => {
        return <span style={{ color: '#FF9805' }}>{text}</span>;
      },
    },
  ];

  const data: any[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      index: i + 1,
      area: `这十四区域区域`,
      time: '2012-12-01',
      something: 'xx区域发生了xxx事件',
    });
  }

  const onChange = (value: any) => {
    console.log('select-->', value);
  };

  return (
    <div className="alarm">
      <div className="search_box">
        <ScreenDataPicker onChange={onChange} />
      </div>
      <div>
        <ScreenTable height="26.5vh" dataSource={data} columns={columns} />
      </div>
    </div>
  );
};

export default Alarm;
