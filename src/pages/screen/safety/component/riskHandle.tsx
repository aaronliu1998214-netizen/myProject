import React, { useState } from 'react';
import { Radio } from 'antd';
import type { RadioChangeEvent } from 'antd';
import './index.less';
import ReactECharts from 'echarts-for-react'; // 引入 ECharts 的 React 包


const RiskHandle: React.FC = () => {
  const [value, setValue] = useState('Apple');

  const options = [
    { label: '月度', value: 'month' },
    { label: '季度', value: 'quarter' },
    { label: '年度', value: 'year' },
  ];

  const data = [
    { name: '未处理', count: 33.3, color: '#FF9805' },
    { name: '已完成', count: 20, color: '#00C9FF' },
    { name: '已关闭', count: 33.3, color: '#808080' },
  ];

const pieChartOptions = {
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // 设置 tooltip 背景色
    textStyle: {
      color: '#FFFFFF', // 设置 tooltip 文本颜色为白色
    },
  },
  legend: {
    show: false, // 明确不显示图例
  },
  series: [
    {
      name: '告警统计',
      type: 'pie',
      radius: ['40%', '60%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'outside', // 外部标签
        formatter: '{b}\n{d}%',
        fontSize: 12,
        color: '#FFFFFF', // 白色字体
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 10,
        lineStyle: {
          color: '#FFFFFF', // 白色连接线
        },
      },
      data: data.map((item) => ({
        value: item.count,
        name: item.name,
        itemStyle: { color: item.color }
      })),
    }
  ],
  graphic: [
    {
      type: 'text',
      left: 'center',
      top: 'center',
      style: {
        text: '占比情况', // 自定义的文字
        textAlign: 'center',
        textVerticalAlign: 'middle',
        fill: '#FFFFFF', // 白色字体
        fontSize: 15,
        fontWeight: 'bold',
      }
    }
  ]
};



  const onChange = ({ target: { value } }: RadioChangeEvent) => {
    setValue(value);
  };

  const orderCount = '48';

  return (
    <div className="riskHandle">
      <div className="radio">
        <Radio.Group
          className="custom-radio-group"
          options={options}
          onChange={onChange}
          value={value}
          optionType="button"
          size="small"
        />
      </div>
      <div className="content_box">
        <div className="box_1">
          <div className="box_1_title">
            <div className="i_con"></div>
            <div className="myorder">
              <div style={{ fontSize: '1.5vh' }}>全部工单</div>
              <div style={{ fontSize: '2.5vh', fontWeight: 700 }}>{orderCount}</div>
            </div>
          </div>
          <div className="box_1_content">
            <div className="all">
              <span className="status">
                <div style={{ backgroundColor: '#FF9805' }} />
                未处理
              </span>
              <span className="num" style={{ color: '#FF9805' }}>
                {'16'}
              </span>
            </div>
            <div className="all">
              <span className="status">
                <div style={{ backgroundColor: '#00C9FF' }} />
                已完成
              </span>
              <span className="num" style={{ color: '#00C9FF' }}>
                {'16'}
              </span>
            </div>
            <div className="all">
              <span className="status">
                <div style={{ backgroundColor: '#F2F2F2' }} />
                已关闭
              </span>
              <span className="num" style={{ color: '#F2F2F2' }}>
                {'16'}
              </span>
            </div>
          </div>
        </div>
        <div className="chart_box">
          <ReactECharts option={pieChartOptions} style={{ width: '90%', height: '90%' }} />
        </div>
      </div>
    </div>
  );
};

export default RiskHandle;
