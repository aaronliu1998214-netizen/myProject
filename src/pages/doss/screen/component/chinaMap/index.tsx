import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl'; // 引入 echarts-gl 才能用 map3D
import cqMap from '@/assets/cq.json'; // 替换为你的实际路径

// 原始数据
const dataValue = [
  { name: "万州区", value: '0', data: { count: '30', count2: '23' }, },
  { name: "涪陵区", value: '50', data: { count: '30', count2: '23' }, },
  { name: "渝中区", value: '150', data: { count: '30', count2: '23' }, },
  { name: "大渡口区", value: '350', data: { count: '30', count2: '23' }, },
  { name: "江北区", value: '510', data: { count: '30', count2: '23' }, },
  { name: "沙坪坝区", value: '0', data: { count: '30', count2: '23' }, },
  { name: "九龙坡区", value: '150', data: { count: '30', count2: '23' }, },
  { name: "南岸区", value: '50', data: { count: '30', count2: '23' }, },
  { name: "北碚区", value: '350', data: { count: '30', count2: '23' }, },
  { name: "綦江区", value: '510', data: { count: '30', count2: '23' }, },
  { name: "大足区", value: '150', data: { count: '30', count2: '23' }, },
  { name: "渝北区", value: '222', data: { count: '30', count2: '23' }, },
  { name: "巴南区", value: '150', data: { count: '30', count2: '23' }, },
  { name: "黔江区", value: '510', data: { count: '30', count2: '23' }, },
  { name: "长寿区", value: '245', data: { count: '30', count2: '23' }, },
  { name: "江津区", value: '0', data: { count: '30', count2: '23' }, },
  { name: "合川区", value: '437', data: { count: '30', count2: '23' }, },
  { name: "永川区", value: '510', data: { count: '30', count2: '23' }, },
  { name: "南川区", value: '389', data: { count: '30', count2: '23' }, },
  { name: "璧山区", value: '150', data: { count: '30', count2: '23' }, },
  { name: "铜梁区", value: '321', data: { count: '30', count2: '23' }, },
  { name: "潼南区", value: '0', data: { count: '30', count2: '23' }, },
  { name: "荣昌区", value: '333', data: { count: '30', count2: '23' }, },
  { name: "开州区", value: '350', data: { count: '30', count2: '23' }, },
  { name: "梁平区", value: '425', data: { count: '30', count2: '23' }, },
  { name: "武隆区", value: '510', data: { count: '30', count2: '23' }, },
  { name: "城口县", value: '367', data: { count: '30', count2: '23' }, },
  { name: "丰都县", value: '150', data: { count: '30', count2: '23' }, },
  { name: "垫江县", value: '0', data: { count: '30', count2: '23' }, },
  { name: "忠县", value: '430', data: { count: '30', count2: '23' }, },
  { name: "云阳县", value: '510', data: { count: '30', count2: '23' }, },
  { name: "奉节县", value: '510', data: { count: '30', count2: '23' }, },
  { name: "巫山县", value: '350', data: { count: '30', count2: '23' }, },
  { name: "巫溪县", value: '150', data: { count: '30', count2: '23' }, },
  { name: "石柱土家族自治县", value: '150', data: { count: '30', count2: '23' }, },
  { name: "秀山土家族苗族自治县", value: '356', data: { count: '30', count2: '23' }, },
  { name: "酉阳土家族苗族自治县", value: '510', data: { count: '30', count2: '23' }, },
  { name: "彭水苗族土家族自治县", value: '350', data: { count: '30', count2: '23' }, },
];

// 映射颜色函数
const getColorByValue = (value: number) => {
  if (value === 0) return '#eaecf1';
  if (value <= 100 && value > 0) return '#aab3c7';
  if (value <= 300 && value > 100) return '#76839eff';
  if (value <= 500 && value > 300) return '#354872ff';
  if (value > 500) return '#1c3772ff'
};
interface IPprop {
  params?: any
}
const Index: React.FC<IPprop> = ({ params }) => {
  const chartRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!chartRef.current) return;

  const myChart = echarts.init(chartRef.current);
  // @ts-ignore
  echarts.registerMap('cq', cqMap);

  const coloredData = dataValue.map(item => {
    const numericValue = Number(item.value);
    return {
      ...item,
      value: numericValue,
      itemStyle: {
        areaColor: getColorByValue(numericValue),
        color: getColorByValue(numericValue),
      },
    };
  });

  const option = {
    tooltip: {
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      textStyle: { color: '#fff', fontSize: 12 },
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data;
        return `${params.name}<br/>攻击总流量 ${data?.value || 0} GB<br/>带宽峰值 ${data?.data?.count2 || 0} Gbps`;
      },
    },
  // ✅ 添加图例
      visualMap: {
        type: 'piecewise',
        show: true,
        right: '8%',
        bottom: '18%',
        textStyle: { color: '#fff' },
        orient: 'vertical',     // 垂直排列
        align: 'left',    
        itemSymbol: 'circle',   // ✅ 改成小圆点
        itemWidth: 10,          // 圆点直径
        itemHeight: 10,
        pieces: [
          { value: 0, label: '0 GB', color: '#eaecf1' },
          { min: 1, max: 100, label: '< 100 GB', color: '#aab3c7' },
          { min: 101, max: 300, label: '100 ~ 300 GB', color: '#76839eff' },
          { min: 301, max: 500, label: '300 ~ 500 GB', color: '#354872ff' },
          { min: 501, label: '> 500 GB', color: '#1c3772ff' },
        ],
      },
    series: [
      {
        type: 'map3D',
        map: 'cq',
        data: coloredData,
        label: { show: true, textStyle: { color: '#fff', fontSize: 12 } },
        itemStyle: { borderColor: '#27c6e0', borderWidth: 3 },
        regionHeight: 2,
        viewControl: {
          distance: 140,
          autoRotate: true,
          autoRotateSpeed: 5,
          rotateSensitivity: 1,
          zoomSensitivity: 0,
          minAlpha: 30,
          maxAlpha: 60,
          minBeta: -Infinity,
          maxBeta: Infinity,
        },
        regions: [
          {
            name: '重庆市',
            itemStyle: { borderColor: '#fff', borderWidth: 4, areaColor: 'rgba(0,0,0,0)' },
            label: { show: false },
          },
        ],
      },
    ],
  };

  myChart.setOption(option);
  // 在 setOption 后加一段测试代码
setTimeout(() => {
  const testName = '涪陵区';
  console.log('开始高亮', testName);
  myChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
  myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, name: testName });
  myChart.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    name: testName,
    coordinate: [107.394905, 29.703652, 2]
  });
}, 1000);

  /* ===== 循环高亮+tooltip ===== */
  let idx = 0;
  const timer = setInterval(() => {
    // 先清掉上一轮
    myChart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
    myChart.dispatchAction({ type: 'hideTip' });

    const target = coloredData[idx];
    if (!target) return;

    // 高亮
    myChart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      name: target.name,
    });

    // 显示 tooltip（3D 需要把经纬度带上高度 2）
    myChart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      name: target.name,
      // @ts-ignore
      coordinate: [target.value[0], target.value[1], 3],
    });

    idx = (idx + 1) % coloredData.length;
  }, 2000);

  return () => {
    clearInterval(timer);
    myChart.dispose();
  };
}, []);



  return (
    <div
      style={{
        width: '100%',
        height: '90vh',
        position: 'relative',
        marginTop: '-15vh',
      }}
    >
      <div
        ref={chartRef}
        id="map"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
      />
    </div>
  );
};

export default Index;
