import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl'; // 加载 echarts-gl 扩展
import cqMap from '../../../assets/cq.json';  // 重庆地图 json
import chineseMap from '../../../assets/chinese.json'; // 中国地图 json

const dataValue = [
  { name: "设备1", value: '60', center: [108.380246, 30.807807], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2", value: '76', center: [107.394905, 29.703652], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备1", value: '80', center: [106.56288, 29.556742], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备12", value: '90', center: [106.48613, 29.481002], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备13", value: '20', center: [106.532844, 29.575352], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备14", value: '30', center: [106.4542, 29.541224], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备15", value: '40', center: [106.480989, 29.523492], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备16", value: '50', center: [106.560813, 29.523992], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备17", value: '60', center: [106.437868, 29.82543], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备18", value: '70', center: [106.651417, 29.028091], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备19", value: '80', center: [105.715319, 29.700498], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备20", value: '90', center: [106.512851, 29.601451], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21", value: '80', center: [106.519423, 29.381919], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备22", value: '70', center: [108.782577, 29.527548], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备212", value: '60', center: [107.074854, 29.833671], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备214", value: '50', center: [106.253156, 29.283387], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备213", value: '40', center: [106.265554, 29.990993], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备216", value: '30', center: [105.894714, 29.348748], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2167", value: '20', center: [107.098153, 29.156646], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2187", value: '40', center: [106.231126, 29.593581], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2145", value: '50', center: [106.054948, 29.839944], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21gg", value: '60', center: [105.841818, 30.189554], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21gf", value: '70', center: [105.594061, 29.403627], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2143", value: '80', center: [108.413317, 31.167735], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2123", value: '90', center: [107.800034, 30.672168], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21gg", value: '80', center: [107.75655, 29.32376], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21xc", value: '70', center: [108.6649, 31.946293], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21677", value: '60', center: [107.73248, 29.866424], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备211333", value: '50', center: [107.348692, 30.330012], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2198", value: '40', center: [108.037518, 30.291537], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2100", value: '30', center: [108.697698, 30.930529], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21gfg", value: '40', center: [109.465774, 31.019967], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2188888", value: '50', center: [109.878928, 31.074843], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备211221212", value: '60', center: [109.628912, 31.3966], data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备2167888", center: [108.112448, 29.99853], value: '70', data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21ttttttttt", center: [108.996043, 28.444772], value: '60', data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21cc", center: [108.767201, 28.839828], value: '50', data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
  { name: "设备21ccdd", center: [108.166551, 29.293856], value: '40', data: { q1: '渝中区xxxx2号路机房', q2: '中国电信', q3: '400Gbsp/500Gbsp(已使用80%)', q4: '60%', q5: '20' }, },
]




const MapChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null); // 创建一个 ref 引用，用于挂载图表

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current); // 初始化 ECharts 实例
    echarts.registerMap('cq', cqMap); // 注册自定义地图名为 'cq'，使用重庆地图数据

    // 转换数据为适配 scatter 格式的数组
    const scatterData = dataValue.map(item => ({
      name: item.name,
      value: [...item.center, item.value], // [经度, 纬度, 数值]
      data: item.data // 额外数据用于 tooltip 显示
    }));

    const option = {
      // 鼠标悬浮提示框配置
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove', // 鼠标移动时触发
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 背景透明黑
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        // 自定义内容显示格式
        formatter: (params: any) => {
          const data = params.data;
          return `${params.marker}${params.name}<br/>
                  地理位置: ${data?.data?.q1 || 0}<br/>
                  所属厂商: ${data?.data?.q2 || 0}<br/>
                  防护带宽: ${data?.data?.q3 || 0}<br/>
                  负载率: ${data?.data?.q4 || 0}<br/>
                  防护资产数: ${data?.data?.q5 || 0}<br/>`;
        }
      },

      // 地图配置
      geo: {
        map: 'cq', // 使用注册的地图名
        roam: true, // 可拖动缩放
        silent: true, // 禁用地图 hover 效果（只展示点）
        zoom: 1.2, // 初始缩放
        itemStyle: {
          borderColor: 'white', // 边界颜色
          borderWidth: 2, // 边界线宽
          areaColor: '#e6edf2', // 区域填充色
        },
        emphasis: {
          itemStyle: {
            areaColor: '#ccc', // 鼠标悬浮地图区域的颜色
          }
        }
      },

      // visualMap 是颜色映射配置，这里虽然设定了颜色，但已隐藏
      visualMap: {
        show: false, // 不显示图例
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: ['#bae6ff', '#68c0ff', '#1690ff', '#0050b3'],
        },
        textStyle: {
          fontSize: 12
        }
      },

      // 点数据系列
      series: [
        {
          name: '资源分布',
          type: 'effectScatter', // 带涟漪效果的散点图
          coordinateSystem: 'geo', // 使用地理坐标系
          data: scatterData, // 显示的数据
          symbolSize: (val: any) => Math.sqrt(val[2]) + 5, // 根据 value 大小调整点的大小
          showEffectOn: 'render', // 渲染时显示涟漪
          rippleEffect: {
            brushType: 'stroke' // 涟漪为描边效果
          },
          label: {
            formatter: '{b}', // 使用 name 显示
            position: 'right',
            show: false // 默认不显示标签
          },
          itemStyle: {
            borderColor: (params: any) => {
              const val = params.value[2];
              if (val > 80) return '#0050b3';
              if (val <= 80 && val > 60) return '#1690ff';
              if (val <= 60 && val > 40) return '#68c0ff';
              return '#bae6ff';
            },
            borderWidth: 1,
            shadowBlur: 5,
            shadowColor: 'rgba(51, 51, 51, 0.4)'
          },

          emphasis: {
            scale: false, // 鼠标悬浮时不放大点
            label: {
              show: false // 不显示 label
            }
          }
        },
      ]
    };

    myChart.setOption(option); // 渲染图表配置

    // === 自动轮播 tooltip 和高亮 ===
    let currentIndex = 0;
    const total = scatterData.length;

    const timer = setInterval(() => {
      // 取消上一个点的高亮
      myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex
      });

      // 计算下一个点的索引
      currentIndex = (currentIndex + 1) % total;

      // 高亮当前点
      myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex
      });

      // 显示当前点的 tooltip
      myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: currentIndex
      });
    }, 3000); // 每 3 秒轮播一次

    // 初始化时显示第一个点
    myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 });
    myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex: 0 });

    // 组件卸载时清理定时器与图表实例
    return () => {
      clearInterval(timer);
      myChart.dispose();
    };
  }, []);

  // 渲染图表容器
  return (
    <div
      style={{
        height: '400px',
        width: '60%',
        backgroundColor: 'white'
      }}
      ref={chartRef}
    />
  );
};

export default MapChart;