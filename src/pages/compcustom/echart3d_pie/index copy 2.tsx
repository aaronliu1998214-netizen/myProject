import React from "react";
import * as echarts from "echarts";
import styles from "./index.less";
// var Highcharts = require("highcharts/highmaps.src.js");
import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
highcharts3d(Highcharts);

class DoughnutChart extends React.Component {
  constructor(props) {
    super(props);
  }

  loadDoughnut = () => {
    const { totalSize } = this.props.data;
    let totalData = totalSize / 1099511627776;
    let realData = [
      ["业务数据", Number((totalData * 0.07399856).toFixed(2))],
      ["感知数据", Number((totalData * 0.668697529).toFixed(2))],
      ["互联网数据", Number((totalData * 0.000143919).toFixed(2))],
      ["外部门数据", Number((totalData * 0.25715999).toFixed(2))],
    ];
    Highcharts.chart("dought", {
      chart: {
        backgroundColor: "transparent",
        type: "pie",
        options3d: {
          enabled: true,
          alpha: 45,
        },
      },
      title: {
        text: "",
      },

      credits: { enabled: false },
      tooltip: {
        headerFormat: "",
        pointFormat:
          '<div style="font-size: 13px"><span style="color:{point.color}; font-weight:400">{point.name}</span><span style="font-weight:400">  {point.y} TB</span></div> ',
      },
      plotOptions: {
        pie: {
          size: 170,
          innerSize: 70,
          depth: 30,
          cursor: "pointer",
          colors: ["#006AFF", "#00E6FF", "#FFAB00", "#9B58EE", "#00F39F"],
          dataLabels: {
            softConnector: false,
            enabled: true,
            format:
              '<div ><span style="color:{point.color}; font-weight:400">{point.name}</span><br/><span style="color:#CCFFFE; font-weight:400">{point.y} TB</span></div> ',
            style: {
              color: "#eee",
              fontSize: "13px",
              textOutline: "none",
            },
          },
        },
      },

      series: [
        {
          name: "接入总量",
          data: realData,
        },
      ],
    });
  };
  componentDidMount() {
    // 页面加载完毕加载饼图
    this.loadDoughnut();
  }
  render() {
    return (
      <div
        style={{
          width: "96%",
          height: "100%",
          position: "relative",
          top: "-10px",
        }}
        id="dought"
        className={styles.dought}
      >
        {/* <ReactHighcharts config={config} ref="chart" /> */}
      </div>
    );
  }
}
export default DoughnutChart;

