import * as echarts from 'echarts';
import 'echarts-gl';
import React, { useEffect, useRef } from 'react';
import './index.less';





const COLOR_TYPES = ['#3FA1FB', '#9A78F1', '#48C95D', '#ffaaaa', '#2AB4FF', '#7A9BFF', '#FFB640'];

export default function Echart3D() {
  const chartRef = useRef<HTMLDivElement>(null);
  const option = useRef<any>({});
  const res = [
    {
      "name": "API滥用",
      "total": 34,
      "percent": 14,

    },
    {
      "name": "HTTP慢速",
      "total": 33,
      "percent": 13
    },
    {
      "name": "QUIC协议攻击",
      "total": 35,
      "percent": 14
    },
    {
      "name": "SYN Flood",
      "total": 67,
      "percent": 28
    },
    {
      "name": "UDP反射",
      "total": 69,
      "percent": 28
    }
  ]

  const optionData = res.map((i: any, index: number) => ({
    ...i,
    itemStyle: { color: COLOR_TYPES[index % COLOR_TYPES.length] },
    value: i.total,
    pre: i.percent,
  }));
  /** 获取3D扇区参数方程 */
  const getParametricEquation = (
    startRatio: number,
    endRatio: number,
    isSelected: boolean,
    isHovered: boolean,
    k: number,
    h: number,
  ) => {
    const midRatio = (startRatio + endRatio) / 2;
    const startRadian = startRatio * Math.PI * 2;
    const endRadian = endRatio * Math.PI * 2;
    const midRadian = midRatio * Math.PI * 2;

    if (startRatio === 0 && endRatio === 1) isSelected = false;
    k = typeof k !== 'undefined' ? k : 1 / 3;
    const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
    const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;
    const hoverRate = isHovered ? 1.05 : 1;

    return {
      u: { min: -Math.PI, max: Math.PI * 3, step: Math.PI / 32 },
      v: { min: 0, max: Math.PI * 2, step: Math.PI / 20 },
      x: (u: number, v: number) => {
        if (u < startRadian)
          return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
        if (u > endRadian)
          return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
        return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      y: (u: number, v: number) => {
        if (u < startRadian)
          return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate;
        if (u > endRadian)
          return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate;
        return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      z: (u: number, v: number) => {
        if (u < -Math.PI * 0.5) return Math.sin(u);
        if (u > Math.PI * 2.5) return Math.sin(u) * h * 0.1;
        return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
      },
    };
  };

  /** 计算环的高度 */
  const getHeight3D = (series: any[], height: number) => {
    series.sort((a, b) => b.pieData.value - a.pieData.value);
    return (height * 25) / series[0].pieData.value;
  };
  /** 构建3D饼状图 */
  const getPie3D = (pieData: any[], internalDiameterRatio: number) => {
    const series: any[] = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    const k = 1 - internalDiameterRatio;

    pieData.sort((a, b) => b.value - a.value);

    for (let i = 0; i < pieData.length; i++) {
      sumValue += pieData[i].value;
      const seriesItem: any = {
        name: pieData[i].name || `series${i}`,
        type: 'surface',
        parametric: true,
        wireframe: { show: false },
        pieData: pieData[i],
        pieStatus: { selected: false, hovered: false, k },
        center: ['10%', '50%'],
      };

      if (pieData[i].itemStyle) {
        seriesItem.itemStyle = { ...pieData[i].itemStyle };
      }
      series.push(seriesItem);
    }

    for (let i = 0; i < series.length; i++) {
      endValue = startValue + series[i].pieData.value;
      series[i].pieData.startRatio = startValue / sumValue;
      series[i].pieData.endRatio = endValue / sumValue;
      series[i].parametricEquation = getParametricEquation(
        series[i].pieData.startRatio,
        series[i].pieData.endRatio,
        false,
        false,
        k,
        series[i].pieData.value,
      );
      startValue = endValue;
    }

    const boxHeight = getHeight3D(series, 26);

    return {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: (params: any) => {
          if (
            params.seriesName !== 'mouseoutSeries' &&
            params.seriesName !== 'pie2d'
          ) {
            const bfb = (
              (option.current.series[params.seriesIndex].pieData.endRatio -
                option.current.series[params.seriesIndex].pieData.startRatio) *
              100
            ).toFixed(2);
            return `${params.seriesName}<br/>
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
              ${bfb}%`;
          }
        },
      },
      xAxis3D: { min: -1, max: 1 },
      yAxis3D: { min: -1, max: 1 },
      zAxis3D: { min: -1, max: 1 },
      grid3D: {
        show: false,
        boxHeight,
        viewControl: {
          alpha: 24,
          distance: 300,
          rotateSensitivity: 1,
          zoomSensitivity: 1,
          panSensitivity: 1,
          autoRotate: true,
        },
      },
      series,
    };
  };





  useEffect(() => {

    const myChart = echarts.init(chartRef.current);
    option.current = getPie3D(optionData, 0.8);

    myChart.setOption(option.current);

    //  监听浏览器窗口变化
    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [optionData]);

  return (
    <div className="water-eval-container">
      <div ref={chartRef} className="cityGreenLand-charts" />
      {/* <div className='back'></div> */}
    </div>
  );
}
