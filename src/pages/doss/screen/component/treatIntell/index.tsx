import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import styles from './index.less';
import { Spin } from 'antd';
import { getThreatIntelligence } from '../../service';

interface ThreatData {
  category: string;
  value: number;
}

const HorizontalBarChart: React.FC<{ params: any }> = ({ params }) => {
  const [data, setData] = useState<ThreatData[]>([
    {
        "category": "Mirai变种操纵者",
        "value": 9.7
    },    {
        "category": "AISURU僵尸网络",
        "value": 9.5
    },
        {
        "category": "FSB情报机构",
        "value": 9.3
    },    {
        "category": "FDVE木马",
        "value": 9.0
    },    {
        "category": "DOES漏洞木马",
        "value": 8.8
    },
  ]);
  const [loading, setLoading] = useState(false);

  // 请求数据函数
  const queryThreatIntelligence = useCallback(async (par: any) => {
    try {
      // setLoading(true)
      const res: any = await getThreatIntelligence(par);
      if (res) {
        setData(res.slice(0, 5));
        setLoading(false)
      }
    } catch (e) {
      console.error('获取威胁情报失败:', e);
    }
  }, []);

  useEffect(() => {
    if (params) {
      queryThreatIntelligence(params);
    }
  }, [params, queryThreatIntelligence]);

  // y轴富文本配置（提取出来，避免每次都创建）
  const richText = useMemo(() => ({
    rank0: { color: '#D61515', fontWeight: 'bold' },
    rank1: { color: '#FF6C16', fontWeight: 'bold' },
    rank2: { color: '#EEC53E', fontWeight: 'bold' },
    rank3: { color: '#2d9df9', fontWeight: 'bold' },
    rank4: { color: '#20ABF9', fontWeight: 'bold' },
    label: { color: '#ffffff', padding: [0, 0, 0, 4] },
  }), []);

  // ECharts 配置项
  const option = useMemo(() => {
    if (data.length === 0) return {};

    const sortedData = [...data].sort((a, b) => b.value - a.value);

    return {
      tooltip: { show: false },
      grid: {
        left: '5%',
        right: '10%',
        bottom: '5%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        max: 10,
        boundaryGap: [0, 0.01],
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: sortedData.map((item, index) => {
          const rankStyle = `rank${index}`;
          return `{${rankStyle}|NO${index + 1}} {label|${item.category}}`;
        }),
        axisLabel: { formatter: (value: string) => value, rich: richText },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          // 背景条
          type: 'pictorialBar',
          barWidth: 15,
          symbol: 'rect',
          symbolSize: [5, 15],
          symbolMargin: 2,
          symbolRepeat: true,
          symbolClip: true,
          barGap: '-100%',
          data: new Array(sortedData.length).fill(10),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#0f1c2f' },
              { offset: 1, color: '#1f2d45' },
            ]),
          },
          silent: true,
          z: 1,
        },
        {
          // 前景条
          name: '数量',
          type: 'pictorialBar',
          barWidth: 15,
          symbol: 'rect',
          symbolSize: [5, 15],
          symbolMargin: 2,
          symbolRepeat: true,
          symbolClip: true,
          data: sortedData.map((item) => item.value),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#052850' },
              { offset: 1, color: '#2ba7fd' },
            ]),
          },
          z: 2,
        },
      ],
    };
  }, [data, richText]);

  return (
    <div className={styles.treat}>
      <div className={styles.treat_title}>
        <span>活跃组织 TOP5</span>
        <span style={{ color: '#5CA8FF' }}>活跃指数(10分值)</span>
      </div>
      {
        loading ?
          <Spin
            spinning={true}
            style={{
              width: '100%',
              height: '12vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          : 
          <div>
            <ReactECharts
              option={option}
              style={{ height: '17vh', top: '-1.2vh', width: '100%' }}
            />
            <div className={styles.datalist}>
              <div className={styles.datalist_box}>
                {data.map((item, index) => (
                  <div key={index}>
                    {item.value !== undefined ? item.value.toFixed(1) : '-'}
                  </div>
                ))}
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default HorizontalBarChart;
