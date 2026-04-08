import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface IPprops {
  list: any[];
}

const App: React.FC<IPprops> = ({ list }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || list.length === 0) return;

    const myChart = echarts.init(chartRef.current);

    const xCategories = list.map((item) => item.category);
    const data1 = list.map((item) => item.type1);
    const data2 = list.map((item) => item.type2);
    const data3 = list.map((item) => item.type3);
    const data4 = list.map((item) => item.type4);

    const option: echarts.EChartsOption = {
      title: {
        text: "流量(GB)",
        left: "2%",
        top: "2%",
        textStyle: {
          color: "#FFFFFF",
          fontSize: 8,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(0,0,0,0.6)",
        textStyle: { color: "#FFFFFF" },
      },
      legend: {
        data: ['国外运营商', '中国联通', '中国移动', '中国电信'],
        icon: 'rect',
        itemWidth: 5,
        itemHeight: 5,
        textStyle: { color: '#FFFFFF', fontSize: 10 },
        top: 12,
        right: 10,
      },
      grid: {
        left: "5%",
        right: "5%",
        bottom: '30%',
        top: "20%",
        containLabel: true,
      },
      dataZoom: [
        {
          type: "slider", // 底部滑动条
          show: false,
          xAxisIndex: 0,
          height: 12,
          bottom: 0,
          start: 0,
          end: xCategories.length > 38 ? 28 : 100, // 默认显示 20 个
          textStyle: { color: "#fff" },
        },
        {
          type: "inside", // 鼠标滚轮缩放
          xAxisIndex: 0,
          start: 0,
          end: xCategories.length > 20 ? 20 : 100,
        },
      ],
      xAxis: {
        type: "category",
        data: xCategories,
        splitLine: { show: false },
        axisLabel: { color: "#FFFFFF", fontSize: 8 },
        axisLine: { show: false },
      },
      yAxis: {
        type: "value",
        splitLine: { show: false },
        axisLabel: { color: "#FFFFFF", fontSize: 10 },
        axisLine: { show: false },
      },
      series: [
        {
          name: "国外运营商",
          type: "bar",
          stack: "总量",
          data: data1,
          itemStyle: { color: "#62A241" },
        },
        {
          name: "中国联通",
          type: "bar",
          stack: "总量",
          data: data2,
          itemStyle: { color: "#E0A525" },
        },
        {
          name: "中国移动",
          type: "bar",
          stack: "总量",
          data: data3,
          itemStyle: { color: "#28E8F1" },
        },
        {
          name: "中国电信",
          type: "bar",
          stack: "总量",
          data: data4,
          itemStyle: { color: "#296BFA" },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [list]);

  return (
    <div
      ref={chartRef}
      style={{ height: "20vh", width: "100%", }}
    />
  );
};

export default App;
