import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl'; // ✅ 引入 echarts-gl 才能用 map3D
import cqMap from '../../../assets/cq.json';

const dataValue = [
                { name:"万州区",value:'300', data: { count:'30', count2:'23'},},
                { name:"涪陵区",value:'422',data: { count:'30', count2:'23'},},
                { name:"渝中区",value:'433',data: { count:'30', count2:'23'},},
                { name:"大渡口区",value:'344',data: { count:'30', count2:'23'},},
                { name:"江北区",value:'345',data: { count:'30', count2:'23'},},
                { name:"沙坪坝区",value:'336',data: { count:'30', count2:'23'},},
                { name:"九龙坡区",value:'457',data: { count:'30', count2:'23'},},
                { name:"南岸区",value:'128',data: { count:'30', count2:'23'},},
                { name:"北碚区",value:'339',data: { count:'30', count2:'23'},},
                { name:"綦江区",value:'290',data: { count:'30', count2:'23'},},
                { name:"大足区",value:'331',data: { count:'30', count2:'23'},},
                { name:"渝北区",value:'222',data: { count:'30', count2:'23'},},
                { name:"巴南区",value:'253',data: { count:'30', count2:'23'},},
                { name:"黔江区",value:'194',data: { count:'30', count2:'23'},},
                { name:"长寿区",value:'245',data: { count:'30', count2:'23'},},
                { name:"江津区",value:'376',data: { count:'30', count2:'23'},},
                { name:"合川区",value:'437',data: { count:'30', count2:'23'},},
                { name:"永川区",value:'218',data: { count:'30', count2:'23'},},
                { name:"南川区",value:'389',data: { count:'30', count2:'23'},},
                { name:"璧山区",value:'290',data: { count:'30', count2:'23'},},
                { name:"铜梁区",value:'321',data: { count:'30', count2:'23'},},
                { name:"潼南区",value:'342',data: { count:'30', count2:'23'},},
                { name:"荣昌区",value:'333',data: { count:'30', count2:'23'},},
                { name:"开州区",value:'224',data: { count:'30', count2:'23'},},
                { name:"梁平区",value:'425',data: { count:'30', count2:'23'},},
                { name:"武隆区",value:'426',data: { count:'30', count2:'23'},},
                { name:"城口县",value:'367',data: { count:'30', count2:'23'},},
                { name:"丰都县",value:'268',data: { count:'30', count2:'23'},},
                { name:"垫江县",value:'229',data: { count:'30', count2:'23'},},
                { name:"忠县",value:'430',data: { count:'30', count2:'23'},},
                { name:"云阳县",value:'331', data: { count:'30', count2:'23'},},
                { name:"奉节县",value:'102', data: { count:'30', count2:'23'},},
                { name:"巫山县",value:'233', data: { count:'30', count2:'23'},},
                { name:"巫溪县",value:'343',data: { count:'30', count2:'23'},},
                { name:"石柱土家族自治县",value:'145',data: { count:'30', count2:'23'},},
                { name:"秀山土家族苗族自治县",value:'356',data: { count:'30', count2:'23'},},
                { name:"酉阳土家族苗族自治县",value:'237', data: { count:'30', count2:'23'},},
                { name:"彭水苗族土家族自治县",value:'368',data: { count:'30', count2:'23'},},
            ]

const Map3DChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    echarts.registerMap('cq', cqMap); // ✅ 仍然需要注册地图

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data;
          return `${params.name}<br/>攻击总流量 ${data?.data?.count || 0}<br/>带宽峰值 ${data?.data?.count2 || 0}`;
        }
      },
      visualMap: {
        show: true,
        min: 0,
        max: 500,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered']
        },
        calculable: true,
        left: 20,
        bottom: 20
      },
      series: [
        {
          type: 'map3D',
          map: 'cq',
          coordinateSystem: 'geo3D',
          data: dataValue,
          shading: 'color',
          label: {
            show: true,
            textStyle: {
              color: '#000',
              fontSize: 10,
              backgroundColor: 'rgba(255,255,255,0.7)',
              borderRadius: 3,
              padding: [2, 4]
            }
          },
          itemStyle: {
            areaColor: '#ddd',
            opacity: 1,
            borderWidth: 0.5,
            borderColor: '#111',
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 12
              }
            },
            itemStyle: {
              areaColor: '#f47920'
            }
          },
          viewControl: {
            distance: 100, // 控制视角距离
            panMouseButton: 'left',
            rotateMouseButton: 'right'
          },
          regionHeight: 2 // 地区拉伸高度
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div style={{ height: '700px', width: '100%' }} ref={chartRef} />;
};

export default Map3DChart;
