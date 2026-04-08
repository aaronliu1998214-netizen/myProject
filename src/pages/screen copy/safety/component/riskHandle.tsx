import React, { useState } from 'react';
import { Radio, } from 'antd'
import type { RadioChangeEvent } from 'antd';
import './index.less'
import { Pie } from '@ant-design/plots';


const RiskHandle: React.FC = () => {
  const [value, setValue] = useState('Apple');

  const options = [
  { label: '月度', value: 'month' },
  { label: '季度', value: 'quarter'},
  { label: '年度', value: 'year' },
];

const salesPieData = [
  { x: '未处理', y: 33.3 },
  { x: '已完成', y: 33.3 },
  { x: '已关闭', y: 33.3 },
];

const colorMap: Record<string, string> = {
  未处理: '#FF0000',  // 红色
  已完成: '#0000FF',  // 蓝色
  已关闭: '#808080',  // 灰色
};


const onChange =({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
}

const orderCount = '48'

  return (
    <div className='riskHandle'>
      <div className='radio'>
        <Radio.Group   
            className="custom-radio-group" 
            options={options}
            onChange={onChange} 
            value={value} 
            optionType="button" 
            size='small'
          />
      </div>
      <div className='content_box'>
         <div className='box_1'>
           <div className='box_1_title'> 
             <div className='i_con'></div>
             <div className='myorder'>
               <div style={{ fontSize: '1.5vh' }}>全部工单</div>
               <div style={{ fontSize: '2.5vh' , fontWeight: 700}}>{ orderCount }</div>
             </div>
           </div>
           <div className='box_1_content'>
              <div className='all'>
                 <span className='status'><div style={{ backgroundColor:'#FF9805' }}/>未处理</span>
                 <span className='num' style={{ color:'#FF9805' }}>{ '16' }</span>
              </div>
              <div className='all'>
                 <span className='status'><div style={{ backgroundColor:'#00C9FF' }}/>已完成</span>
                 <span className='num'  style={{ color:'#00C9FF' }}>{ '16' }</span>
              </div>
              <div className='all'>
                 <span className='status'><div style={{ backgroundColor:'#F2F2F2' }}/>已关闭</span>
                 <span className='num' style={{ color:'#F2F2F2' }}>{ '16' }</span>
              </div>
           </div>
         </div>
         <div className='chart_box'>
          <Pie
            data={salesPieData}
            angleField="y"
            colorField="x"
            autoFit
            radius={0.6}
            innerRadius={0.4}
            label={{
              position: 'spider',
              text: (item: { x: string; y: number }) => {
                return `${item.x}:\n${item.y}%`;
              },
              style: {
                fill: '#ffffff', // 设置字体颜色为红色
                fontSize: 12, // 可选：设置字体大小
              },
            }}
            color={(x: string) => colorMap[x] || '#000'}
            interactions={[{ type: 'element-active' }]}
            legend={false}
            
          />
         </div>
      </div>
    </div>
  );
};

export default RiskHandle;
