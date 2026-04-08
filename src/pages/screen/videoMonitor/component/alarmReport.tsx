import React from 'react';
import ScreenTable from '@/pages/screen/component/screenTable'
import './index.less'
import type { ColumnsType } from 'antd/es/table';
import ScreenDataPicker from '@/pages/screen/component/screenDataPicker';


const columns: ColumnsType = [
  {
    title: '摄像机编号',
    ellipsis: true,
    dataIndex: 'id',
    // width: '3.5vw',
  },
  {
    title: '区域',
    dataIndex: 'area',
    ellipsis: true,
    // width: '3vw',
  },
  {
    title: '时间',
    // width: '3.5vw',
    ellipsis: true,
    dataIndex: 'time',
  },
  {
    title: '事件',
    ellipsis: true,
    dataIndex: 'content',
    render: (text:string) => {
      return (<span style={{ color: '#FF9805' }}>{ text }</span>)
    }
    // width: '6vw',
  },
];

// 近一个月月告警统计
const AlarmReport: React.FC = () => {

const data: any[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      id: `SRC${i}`,
      area: `面向生产区XXXXX慧组`,
      time: '2025-08-01 12:54:54',
      content:'xxXXXXX区域发生XXXXxxx事件',
    });
  }

  const onChange = (val:any) => {
    console.log("val--->",val);
    
  }

  return (
    <div className="alarmReport">
        <div style={{ padding: '1vh' }}>
          <ScreenDataPicker onChange={onChange} />
        </div>
        <ScreenTable dataSource={data} columns={columns} height='71.5vh'/>
    </div>
  );
};

export default AlarmReport;
