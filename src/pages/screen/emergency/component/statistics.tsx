import React from 'react';
import './index.less';
import ReactECharts from 'echarts-for-react';

// 危险撤离人数
const Index: React.FC = () => {
  const option = {
    // tooltip: {
    //   trigger: 'axis'
    // },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // 设置 tooltip
      textStyle: {
        color: '#FFFFFF', // 设置 tooltip 文本颜色为白色
      },
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLabel: {
        color: '#fff',
        fontSize: 10,
        interval: 0,  //  强制显示所有标签
      },
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff'
      },
      axisLine: {
        lineStyle: {
          color: '#aaa'
        }
      },
      max: 300,
    },
    series: [
      {
        name: '销量',
        type: 'line',
        data: [120, 200, 150, 80, 70, 110, 120, 200, 150, 80, 70, 110],
        smooth: false,
        lineStyle: {
          color: '#00c4ff'
        },
        itemStyle: {
          color: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#00C4FF' },
              { offset: 1, color: '#0091FF' }
            ]
          }
        }
      }
    ],
  };

  return (
    <div className="evacuess">
      <div className='top'>
        <div className='count'>
          <div>总数</div>
          <div>{'350'}</div>
        </div>
        <div className='legend'>
          <div className="line-with-dot"></div> <div>危险撤人</div>
        </div>
      </div>
      <div className='line'>
        <ReactECharts option={option} style={{ bottom: '4vh', height: '27.5vh', width: '100%' }} />
      </div>
    </div>
  );
};

export default Index;
