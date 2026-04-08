import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl'; // 加载 echarts-gl 扩展
import cqMap from '../../../assets/cq.json';

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
  const chartRef = useRef<HTMLDivElement>(null); // 图表容器引用

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current); // 初始化 ECharts 实例
    echarts.registerMap('cq', cqMap); // 注册地图数据为名为 'cq'

    // 构建 scatter 点数据，value 数组为 [经度, 纬度, 数值]
    const scatterData = dataValue.map(item => ({
      name: item.name,
      value: [...item.center, item.value],
      data: item.data, // 附加数据用于 tooltip 显示
    }));

    // 图表配置项
    const option = {
      tooltip: {
        trigger: 'item', // 触发类型为单个图形项
        triggerOn: 'mousemove', // 鼠标移动时触发
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 背景黑色半透明
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        formatter: (params: any) => {
          // 自定义 tooltip 内容
          const data = params.data;
          return `${params.marker}${params.name}<br/>
                  地理位置: ${data?.data?.q1 || 0}<br/>
                  所属厂商: ${data?.data?.q2 || 0}<br/>
                  防护带宽: ${data?.data?.q3 || 0}<br/>
                  负载率: ${data?.data?.q4 || 0}<br/>
                  防护资产数: ${data?.data?.q5 || 0}<br/>`;
        }
      },
      geo: {
        map: 'cq', // 使用上面注册的 'cq' 地图
        roam: true, // 允许缩放和平移
        silent: true, // 地图不响应鼠标交互（比如点击、tooltip）
        itemStyle: {
          borderColor: '#aaa',
          borderWidth: 1,
          areaColor: '#f5f5f5', // 地图区域颜色
        },
        emphasis: {
          itemStyle: {
            areaColor: '#ccc', // 鼠标移上去的颜色
          }
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true, // 显示拖动手柄
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: ['#1690ff', '#bae6ff', '#68c0ff', '#1690ff', '#0050b3'], // 渐变色范围
        },
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '资源分布',
          type: 'effectScatter', // 带有涟漪效果的散点图
          coordinateSystem: 'geo', // 使用地理坐标系
          data: scatterData,
          symbolSize: (val: any) => Math.sqrt(val[2]) + 5, // 根据 value 动态设置点大小
          showEffectOn: 'render', // 渲染时显示特效
          rippleEffect: {
            brushType: 'stroke' // 波纹样式为描边
          },
          label: {
            formatter: '{b}', // 显示设备名称
            position: 'right',
            show: false // 默认不显示 label
          },
          itemStyle: {
            color: 'rgba(244, 67, 54, 0.6)', // 设置圆点颜色为半透明红色
            shadowBlur: 10,
            shadowColor: 'rgba(51, 51, 51, 0.4)' // 半透明阴影
          },
          emphasis: {
            scale: false, // 悬浮时不缩放
            label: {
              show: false // 悬浮时也不显示 label
            }
          }
        }
      ]
    };

    myChart.setOption(option); // 设置图表配置

    return () => {
      myChart.dispose(); // 卸载组件时销毁图表实例，防止内存泄漏
    };
  }, []);

  return (
    <div style={{ height: '700px', width: '100%' }} ref={chartRef} /> // 图表容器
  );
};

export default MapChart;