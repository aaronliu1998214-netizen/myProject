import React from 'react';
import ReactECharts from 'echarts-for-react';

const App: React.FC = () => {
  // 伪3D柱状图相关配置
  const xdata = ['bar1', 'bar2', 'bar3', 'bar4', 'bar5'];
  const ydata = [18, 9, 15, 4, 12];
  const barWidth = 25;

  // 构造四个系列的数据
  const topArr = ydata.map((item) => ({
    value: item,
    symbol: 'diamond',
    symbolOffset: [0, '-50%'],
    symbolPosition: 'end',
    symbolSize: [barWidth, barWidth * 0.4],
    itemStyle: {
      color: {
        x: 1,
        y: 0,
        x2: 0,
        y2: 0,
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#34DFF1' },
          { offset: 1, color: '#1B5590' },
        ],
      },
    },
  }));

  const bottomArr = ydata.map((item) => ({
    value: item,
    symbol: 'triangle',
    symbolOffset: [0, barWidth * 0.25],
    symbolSize: [-barWidth, barWidth * 0.25],
    symbolRotate: 180,
    itemStyle: {
      color: {
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#12276F' },
          { offset: 0.5, color: '#12276F' },
          { offset: 0.5, color: '#08154D' },
          { offset: 1, color: '#08154D' },
        ],
      },
    },
  }));

  const leftArr = ydata.map((item) => ({
    value: item,
    itemStyle: {
      color: {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#37F1FD' },
          { offset: 1, color: '#12276F' },
        ],
      },
    },
  }));

  const rightArr = ydata.map((item) => ({
    value: item,
    itemStyle: {
      color: {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        type: 'linear',
        colorStops: [
          { offset: 0, color: '#179DD1' },
          { offset: 1, color: '#08154D' },
        ],
      },
    },
  }));

  const option = {
    grid: {
      left: 15,
      right: 15,
      bottom: 10,
      top: 30,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params: any) => {
        let str = '';
        params.forEach((el: any) => {
          if (el.componentSubType === 'bar') {
            str = `${el.seriesName}<br />${el.marker}${el.name}：${el.data.value}%`;
          }
        });
        return str;
      },
    },
    xAxis: [
      {
        type: 'category',
        data: xdata,
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: true,
          color: '#76A5D1',
          fontSize: 10,
          fontWeight: 300,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
          show: true,
          lineStyle: { color: '#082745' },
        },
        axisLabel: {
          show: true,
          color: '#76A5D1',
          fontSize: 10,
          fontWeight: 300,
        },
      },
    ],
    series: [
      {
        type: 'pictorialBar',
        name: '顶部棱盖',
        z: 10,
        data: topArr,
      },
      {
        type: 'bar',
        name: '安全监管',
        barGap: '-50%',
        barWidth: barWidth / 2,
        z: 2,
        label: {
          show: true,
          color: '#fff',
          fontSize: 10,
          position: 'top',
          offset: [barWidth / 4, -5],
        },
        data: leftArr,
      },
      {
        type: 'bar',
        name: '安全监管',
        barGap: '-5%',
        barWidth: barWidth / 2,
        z: 3,
        data: rightArr,
      },
      {
        type: 'pictorialBar',
        name: '底部棱盖',
        barGap: '-100%',
        z: 6,
        data: bottomArr,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400, width: '100%' }} />;
};

export default App;
