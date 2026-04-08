import React from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

const App: React.FC = () => {
  const option = {
    title: {
      text: '3D 饼图模拟示例',
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 24,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      left: 'center',
      textStyle: {
        color: '#333',
      },
    },
    series: [
      {
        name: '销量',
        type: 'pie',
        radius: ['40%', '60%'], // 做成环形，增强立体感
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
        },
        labelLine: {
          length: 15,
          length2: 10,
          smooth: true,
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          color: (params: any) => {
            const colorList = [
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#1890ff' },
                { offset: 1, color: '#0050b3' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#52c41a' },
                { offset: 1, color: '#237804' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#faad14' },
                { offset: 1, color: '#ad6800' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f5222d' },
                { offset: 1, color: '#a8071a' },
              ]),
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#722ed1' },
                { offset: 1, color: '#391085' },
              ]),
            ];
            return colorList[params.dataIndex % colorList.length];
          },
        },
        data: [
          { value: 120, name: '苹果' },
          { value: 200, name: '香蕉' },
          { value: 150, name: '橙子' },
          { value: 80, name: '葡萄' },
          { value: 70, name: '西瓜' },
        ],
      },
    ],
  };

  return (
    <ReactECharts
      echarts={echarts}  // 传入 echarts 实例，避免 ReferenceError
      option={option}
      style={{ height: 500, width: '100%' }}
    />
  );
};

export default App;
