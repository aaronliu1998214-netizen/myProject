import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import React, { useMemo } from 'react';
import point from '@/assets/screen/point.png';

interface IDataItem {
  category: string;
  handledWorkOrdersCount: number;
  workOrderSubmissionCount: number;
  averageHandleTimes: number;
}

interface IPprops {
  list?: IDataItem[] | any;
}

/**
 * 获取数组中指定字段的最大值
 */
const getMaxValue = <T extends Record<string, any>>(list: T[], key: keyof T): number => {
  if (!Array.isArray(list) || list.length === 0) return 0;
  return list.reduce((max, item) => {
    const value = Number(item[key]) || 0;
    return value > max ? value : max;
  }, 0);
};

const Index: React.FC<IPprops> = ({ list = [] }) => {
  // ===== 数据预处理 =====
  const option = useMemo(() => {
    const handleMax = getMaxValue(list, 'handledWorkOrdersCount');
    const workMax = getMaxValue(list, 'workOrderSubmissionCount');
    const maxValue = Math.max(handleMax, workMax);

    const categories = list.map((i:any) => i.category);
    const handledData = list.map((i:any) => -i.handledWorkOrdersCount); // 左边取负
    const submissionData = list.map((i:any) => i.workOrderSubmissionCount);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: (params: any) => {
          const category = params[0]?.name || '';
          const item = list.find((p:any) => p.category === category);
          const handled = Math.abs(params.find((p: any) => p.seriesName === '已处置工单')?.value || 0);
          const submitted = params.find((p: any) => p.seriesName === '已提交工单')?.value || 0;
          return `${category}
              <br/>已处置工单: ${handled}
              <br/>已提交工单: ${submitted}
              <br/>平均处理时长：${item?.averageHandleTimes ?? 0}分钟`;
        },
      },
      legend: {
        data: ['已处置工单', '已提交工单'],
        top: 0,
        right: 10,
        itemWidth: 6,
        itemHeight: 6,
        textStyle: { fontSize: 10, color: '#fff' },
      },
      grid: { top: '18%', bottom: '0%', containLabel: true },
      xAxis: {
        type: 'value',
        min: -maxValue,
        max: maxValue,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: categories,
        axisLabel: { fontSize: 11, color: '#fff' },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          name: '已处置工单',
          type: 'bar',
          stack: '总量',
          barWidth: 8,
          data: handledData,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#2DC7FF' },
              { offset: 1, color: '#28FBFF' },
            ]),
          },
        },
        {
          name: '已提交工单',
          type: 'bar',
          stack: '总量',
          barWidth: 8,
          data: submissionData,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
              { offset: 0, color: '#3CFFB8' },
              { offset: 1, color: '#43BA86' },
            ]),
          },
        },
        {
          name: 'bg-male',
          type: 'bar',
          stack: '总量',
          barWidth: 11,
          silent: true,
          itemStyle: { color: '#A0E6FF', opacity: 0.5 },
          data: categories.map(() => -maxValue),
          z: 0,
        },
        {
          name: 'bg-female',
          type: 'bar',
          stack: '总量',
          barWidth: 11,
          silent: true,
          itemStyle: { color: '#A0E6FF', opacity: 0.5 },
          data: categories.map(() => maxValue),
          z: 0,
        },
        {
          name: '交点',
          type: 'scatter',
          symbol: `image://${point}`,
          symbolSize: 15,
          data: categories.map((item:any) => ({ value: [0, item] })),
          z: 10,
        },
      ],
    };
  }, [list]);

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default Index;
