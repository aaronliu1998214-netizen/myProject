import * as echarts from 'echarts';
import 'echarts-gl';
import React, { useEffect, useRef } from 'react';
import './index.less';

export default function Echart3D(propos: any) {
  const { optionData } = propos;
  const option = useRef({});

  useEffect(() => {
    init();
    console.log("ccc");
    
  }, [optionData]);

  const init = () => {
    //构建3d饼状图
    const myChart = echarts.init(
      document.getElementById('cityGreenLand-charts'),
    );
    // 传入数据生成 option
    option.current = getPie3D(optionData, 0.8);
    myChart.setOption(option.current);

    // 添加透明 2D 饼图，用于显示标签
    //是否需要label指引线，如果要就添加一个透明的2d饼状图并调整角度使得labelLine和3d的饼状图对齐，并再次setOption
    // option.current.series.push({
    //   name: 'pie2d',
    //   type: 'pie',
    //   labelLine: {
    //     length: 10,
    //     length2: 5,
    //   },
    //   startAngle: -30, //起始角度，支持范围[0, 360]。
    //   clockwise: false, //饼图的扇区是否是顺时针排布。上述这两项配置主要是为了对齐3d的样式
    //   radius: ['20%', '50%'],
    //   center: ['50%', '50%'],
    //   data: optionData,
    //   itemStyle: {
    //     opacity: 0, // 隐藏图形
    //   },
    //   label: {     // 图形隐藏，标签也会被隐藏，需要单独设置标签透明度回显
    //     show: true,
    //     opacity: 1,
    //     formatter: (params) => `${params.value}`, // 显示数值
    //     color: '#fff',
    //     fontSize: 12,
    //   },
    // });

    myChart.setOption(option.current);
    bindListen(myChart);
  };

  // 其余函数保持不变
  const getPie3D = (pieData, internalDiameterRatio) => {
    //internalDiameterRatio:透明的空心占比
    const series = [];
    let sumValue = 0;
    let startValue = 0;
    let endValue = 0;
    let legendData = [];
    let legendBfb = [];
    const k = 1 - internalDiameterRatio;
    pieData.sort((a, b) => b.value - a.value);

    // 为每一个饼图数据，生成一个 series-surface 配置
    for (let i = 0; i < pieData.length; i++) {
      sumValue += pieData[i].value;
      const seriesItem = {
        name: pieData[i].name || `series${i}`,
        type: 'surface',
        parametric: true,
        wireframe: { show: false },
        pieData: pieData[i],
        pieStatus: { selected: false, hovered: false, k: k },
        center: ['10%', '50%'],
      };
      if (pieData[i].itemStyle) {
        const itemStyle = {};
        if (pieData[i].itemStyle.color)
          itemStyle.color = pieData[i].itemStyle.color;
        if (pieData[i].itemStyle.opacity)
          itemStyle.opacity = pieData[i].itemStyle.opacity;
        seriesItem.itemStyle = itemStyle;
      }
      series.push(seriesItem);
    }
    // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
    // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
    legendData = [];
    legendBfb = [];
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
      const bfb = fomatFloat(series[i].pieData.value / sumValue, 4);
      legendData.push({ name: series[i].name, value: bfb });
      legendBfb.push({ name: series[i].name, value: bfb });
    }

    const boxHeight = getHeight3D(series, 26); //通过传参设定3d饼/环的高度，26代表26px
    return {
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        formatter: (params) => {
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
        boxHeight: boxHeight, //圆环的高度
        viewControl: {
          //3d效果可以放大、旋转等，请自己去查看官方配置
          alpha: 24,
          distance: 300,
          rotateSensitivity: 1,
          zoomSensitivity: 1,
          panSensitivity: 1,
          autoRotate: true,
        },
      },
      series: series,
    };
  };

  const getHeight3D = (series, height) => {
    series.sort((a, b) => b.pieData.value - a.pieData.value);
    return (height * 25) / series[0].pieData.value;
  };

  const getParametricEquation = (
    startRatio,
    endRatio,
    isSelected,
    isHovered,
    k,
    h,
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
      x: (u, v) => {
        if (u < startRadian)
          return (
            offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        if (u > endRadian)
          return (
            offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      y: (u, v) => {
        if (u < startRadian)
          return (
            offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        if (u > endRadian)
          return (
            offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          );
        return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
      },
      z: (u, v) => {
        if (u < -Math.PI * 0.5) return Math.sin(u);
        if (u > Math.PI * 2.5) return Math.sin(u) * h * 0.1;
        return Math.sin(v) > 0 ? 1 * h * 0.1 : -1;
      },
    };
  };

  const fomatFloat = (num, n) => {
    let f = parseFloat(num);
    if (isNaN(f)) return false;
    f = Math.round(num * 10 ** n) / 10 ** n;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + n) {
      s += '0';
    }
    return s;
  };

  const bindListen = (myChart) => {
    const options = option.current;
    let selectedIndex = '';
    let hoveredIndex = '';

    // myChart.on('click', (params) => {
    //   if (options.series[params.seriesIndex].name === 'pie2d') return;
    //   const isSelected =
    //     !options.series[params.seriesIndex]?.pieStatus?.selected;
    //   const isHovered = options.series[params.seriesIndex].pieStatus.hovered;
    //   const k = options.series[params.seriesIndex].pieStatus.k;
    //   const startRatio = options.series[params.seriesIndex].pieData.startRatio;
    //   const endRatio = options.series[params.seriesIndex].pieData.endRatio;

    //   if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
    //     options.series[selectedIndex].parametricEquation =
    //       getParametricEquation(
    //         options.series[selectedIndex].pieData.startRatio,
    //         options.series[selectedIndex].pieData.endRatio,
    //         false,
    //         false,
    //         k,
    //         options.series[selectedIndex].pieData.value,
    //       );
    //     options.series[selectedIndex].pieStatus.selected = false;
    //   }

    //   options.series[params.seriesIndex].parametricEquation =
    //     getParametricEquation(
    //       startRatio,
    //       endRatio,
    //       isSelected,
    //       isHovered,
    //       k,
    //       options.series[params.seriesIndex].pieData.value,
    //     );
    //   options.series[params.seriesIndex].pieStatus.selected = isSelected;
    //   if (isSelected) selectedIndex = params.seriesIndex;
    //   myChart.setOption(options);
    // });

    // myChart.on('mouseover', (params) => {
    //   let isSelected, isHovered, startRatio, endRatio, k;
    //   if (hoveredIndex === params.seriesIndex) return;

    //   if (hoveredIndex !== '') {
    //     isSelected = options.series[hoveredIndex].pieStatus.selected;
    //     isHovered = false;
    //     startRatio = options.series[hoveredIndex].pieData.startRatio;
    //     endRatio = options.series[hoveredIndex].pieData.endRatio;
    //     k = options.series[hoveredIndex].pieStatus.k;
    //     options.series[hoveredIndex].parametricEquation = getParametricEquation(
    //       startRatio,
    //       endRatio,
    //       isSelected,
    //       isHovered,
    //       k,
    //       options.series[hoveredIndex].pieData.value,
    //     );
    //     options.series[hoveredIndex].pieStatus.hovered = isHovered;
    //     hoveredIndex = '';
    //   }

    //   if (
    //     params.seriesName !== 'mouseoutSeries' &&
    //     params.seriesName !== 'pie2d'
    //   ) {
    //     isSelected = options.series[params.seriesIndex].pieStatus.selected;
    //     isHovered = true;
    //     startRatio = options.series[params.seriesIndex].pieData.startRatio;
    //     endRatio = options.series[params.seriesIndex].pieData.endRatio;
    //     k = options.series[params.seriesIndex].pieStatus.k;
    //     options.series[params.seriesIndex].parametricEquation =
    //       getParametricEquation(
    //         startRatio,
    //         endRatio,
    //         isSelected,
    //         isHovered,
    //         k,
    //         options.series[params.seriesIndex].pieData.value + 5,
    //       );
    //     options.series[params.seriesIndex].pieStatus.hovered = isHovered;
    //     hoveredIndex = params.seriesIndex;
    //   }
    //   myChart.setOption(options);
    // });

    // myChart.on('globalout', () => {
    //   let isSelected, isHovered, startRatio, endRatio, k;
    //   if (hoveredIndex !== '') {
    //     isSelected = options.series[hoveredIndex].pieStatus.selected;
    //     isHovered = false;
    //     k = options.series[hoveredIndex].pieStatus.k;
    //     startRatio = options.series[hoveredIndex].pieData.startRatio;
    //     endRatio = options.series[hoveredIndex].pieData.endRatio;
    //     options.series[hoveredIndex].parametricEquation = getParametricEquation(
    //       startRatio,
    //       endRatio,
    //       isSelected,
    //       isHovered,
    //       k,
    //       options.series[hoveredIndex].pieData.value,
    //     );
    //     options.series[hoveredIndex].pieStatus.hovered = isHovered;
    //     hoveredIndex = '';
    //   }
    //   myChart.setOption(options);
    // });
  };

  return (
    <div className="water-eval-container">
      <div className="cityGreenLand-charts" id="cityGreenLand-charts"></div>
    </div>
  );
}
