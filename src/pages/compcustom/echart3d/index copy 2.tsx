import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

const App: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);

    // 示例数据（可替换为你的真实数据）
    const dataSet1 = [
      [0, 0, 2], [1, 0, 3], [2, 0, 1],
    ];

    const dataSet2 = [
      [0, 0, 1], [1, 0, 2], [2, 0, 3],
    ];

    const option: echarts.EChartsOption = {
      xAxis3D: {
        type: 'value'
      },
      yAxis3D: {
        type: 'value'
      },
      zAxis3D: {
        type: 'value'
      },
      grid3D: {
        viewControl: {
          // 可添加 autoRotate: true 等参数
        },
        light: {
          main: {
            shadow: true,
            quality: 'ultra',
            intensity: 1.5
          }
        }
      },
      series: [
        {
          type: 'bar3D',
          data: dataSet1,
          stack: 'stack',
          shading: 'lambert',
          emphasis: {
            label: { show: false }
          }
        },
        {
          type: 'bar3D',
          data: dataSet2,
          stack: 'stack',
          shading: 'lambert',
          emphasis: {
            label: { show: false }
          }
        }
      ]
    };

    myChart.setOption(option);

    // 销毁图表实例以防止内存泄漏
    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '600px' }}
    />
  );
};

export default App;
