import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React from 'react';
import 'echarts-liquidfill';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
interface IpPropos {
  pre?: number;
  color?: string;
  name?: string;
  level?: number;
}

const WaterBall: React.FC<IpPropos> = (props: any) => {
  const { pre, color, level, name } = props;
  const level_text = level === 1 ? '高风险' : level === 2 ? '中风险' : '低风险';

  const backgroundColor = hexToRgba(color, 0.2); // 设置为 20% 透明度
  const _pre = pre !== 0 ? pre / 100 : 1
  const option = {
    series: [
      {
        type: 'liquidFill',
        radius: '70%',
        center: ['50%', '50%'],
        data: [_pre],
        backgroundStyle: {
          borderWidth: 0,
          color: backgroundColor, // 半透明背景
        },
        outline: {
          show: true,
          borderDistance: 1.5,
          itemStyle: {
            borderWidth: 1.5,
            borderColor: color,
          },
        },
        label: {
          formatter: `{percent|${pre.toFixed(0)}%}\n{level|${name ?? level_text}}`,
          rich: {
            percent: {
              fontSize: 14,
              color: color,
            },
            level: {
              fontSize: 12,
              color: '#ffffff',
            },
          },
          align: 'center',
          baseline: 'middle',
        },

        itemStyle: {
          color: color,
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      echarts={echarts}
    />
  );
};

export default WaterBall;
