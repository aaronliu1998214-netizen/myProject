import React, { } from 'react';
import { Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react'; // Import React wrapper for ECharts

// 近十五天告警统计
const Monthly: React.FC = () => {
  const data = [
    { name: '车辆', color: '#0091FF', count: 64 },
    { name: '生产区', color: '#00FFFF', count: 64 },
    { name: '矿山区', color: '#FF9805', count: 64 }
  ];


  const pieChartOptions = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.1)', // 设置 tooltip
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
        radius: ['40%', '70%'], 
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center', 
          formatter: '{b}\n{d}%',
          fontSize: '16'
        },
        data: data.map(item => ({
          value: item.count,
          name: item.name,
          itemStyle: { color: item.color }
        }))
      }
    ]
  };

  return (
    <div className="monthly">
      <Row>
        <Col span={9}>
          <div className='mon_item mon_legend'>
            {
              data?.map((item: any, index: number) => {
                return (
                  <div className='legend_item' key={index}>
                    <div className='point_' style={{ backgroundColor: `${item.color}` }} />
                    <div className='legend_name'>{ item.name }</div>
                    <div style={{ fontSize: '2.7vh' }}>{ item.count }</div>
                  </div>
                )
              })
            }
          </div>
        </Col>
        <Col span={15}>
          <div className='mon_item pie_box'>
            <ReactECharts option={pieChartOptions} style={{ width: '100%', height: '100%' }} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Monthly;
