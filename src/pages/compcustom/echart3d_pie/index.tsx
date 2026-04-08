import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';
highcharts3d(Highcharts);

const DoughnutChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {

    Highcharts.chart(chartRef.current, {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: '物资类型及库存状态分布'
      },
      subtitle: {
        text: '3D donut in Highcharts'
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'Medals',
        data: [
          ['Norway', 16],
          ['Germany', 12],
          ['USA', 8],
          ['Sweden', 8],
          ['Netherlands', 8],
          ['ROC', 6],
          ['Austria', 7],
          ['Canada', 4],
          ['Japan', 3]

        ]
      }]
    });
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: "96%", height: "100%", position: "relative", top: "-10px" }}
    />
  );
};

export default DoughnutChart;
