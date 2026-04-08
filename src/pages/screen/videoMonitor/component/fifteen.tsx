import React from 'react';
import ReactECharts from 'echarts-for-react';

const Fifteen: React.FC = () => {
  const option = {
    backgroundColor: 'transparent', // 背景透明
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // 设置 tooltip
      textStyle: {
        color: '#FFFFFF', // 设置 tooltip 文本颜色为白色
      },
    },
    legend: {
      data: ['车辆', '生产区', '矿山区'],
      right: 10,
      top: 10,
      itemWidth: 30, // 图例图标宽度
      itemHeight: 10, // 图例图标高度
      textStyle: {
        color: '#FFFFFF', // 图例文字白色
        fontSize: 10,     // 图例文字大小
      },
    },
    xAxis: {
      type: 'category',
      data: [
        '3.1', '3.2', '3.3', '3.4', '3.5',
        '3.6', '3.7', '3.8', '3.9', '3.10',
        '3.11', '3.12', '3.13', '3.14', '3.15'
      ],
      axisLabel: {
        color: '#FFFFFF',
      },
    },
    yAxis: {
      type: 'value',
      name: '单位(个)', 
      nameTextStyle: {
        color: '#FFFFFF', // 设置 Y轴标题为白色
        fontSize: 12,      // Y轴标题字体大小
      },
      nameGap: 40, // 调整 Y轴标题与 Y轴之间的距离，确保图例与标题在同一水平位置
      axisLabel: {
        color: '#FFFFFF',
      },
    },
    series: [
      {
        name: '车辆',
        type: 'line',
        data: [120, 132, 101, 134, 90, 230, 210, 190, 220, 250, 270, 300, 280, 310, 330],
        lineStyle: {
          color: '#00C4FF',
        },
        symbol: 'circle',
      },
      {
        name: '生产区',
        type: 'line',
        data: [220, 182, 191, 234, 290, 330, 310, 334, 390, 390, 450, 470, 510, 550, 600],
        lineStyle: {
          color: '#00FFFF',
        },
        symbol: 'circle',
      },
      {
        name: '矿山区',
        type: 'line',
        data: [150, 232, 201, 154, 190, 330, 410, 450, 300, 310, 350, 370, 400, 430, 460],
        lineStyle: {
          color: '#FF9805',
        },
        symbol: 'circle',
      },
    ],
  };

  return (
    <div className="fifteen">
       <ReactECharts option={option} style={{ bottom: '-2vh', height: '25.5vh', width: '100%' }} />
    </div>
  );
};

export default Fifteen;