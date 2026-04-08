import React from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import ReactECharts from 'echarts-for-react';

const App: React.FC = () => {
  const option = {
    title: {
      text: '3D 柱形图示例',
    },
    tooltip: {},
    xAxis3D: {
      type: 'category',
      data: ['苹果', '香蕉', '橙子', '葡萄', '西瓜'],
      splitLine: { show: false },
      name: '',
    },
    yAxis3D: {
      type: 'category',
      data: ['销量'],
      splitLine: { show: false },
      name: '',
    },
    zAxis3D: {
      type: 'value',
      splitLine: { show: false },
      name: '',
    },

    grid3D: {
      boxWidth: 200,
      boxDepth: 15,
      viewControl: {
        projection: 'perspective',
        alpha: 30,
        beta: 0,
        rotateSensitivity: 0,
        zoomSensitivity: 0,
        panSensitivity: 0,
      },
      axisPointer: { show: false },
      light: {
        main: { intensity: 1.2 },
        ambient: { intensity: 0.5 },
      },
    },
    series: [
      {
        type: 'bar3D',
        barSize: 5,
        data: [
          ['苹果', '销量', 120],
          ['香蕉', '销量', 200],
          ['橙子', '销量', 150],
          ['葡萄', '销量', 80],
          ['西瓜', '销量', 70],
        ],
        shading: 'lambert',
        label: {
          show: true,
          formatter: (params: any) => `${params.value[2]}`,
        },
        itemStyle: {
          color: '#3fa7dc',
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 500, width: '100%' }} />;
};

export default App;
