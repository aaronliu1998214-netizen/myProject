import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import cqMap from '../../../assets/cq.json'; // 注意路径和 cq.json 是否已经正确加载
const dataValue = [
                { name:"万州区",value:'300', center:[108.380246,30.807807], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"涪陵区",value:'422', center:[107.394905,29.703652], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"渝中区",value:'433', center:[106.56288,29.556742], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"大渡口区",value:'344',center:[106.48613,29.481002], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"江北区",value:'345', center:[106.532844,29.575352], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"沙坪坝区",value:'336', center:[106.4542,29.541224], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"九龙坡区",value:'457', center:[106.480989,29.523492], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"南岸区",value:'128', center:[106.560813,29.523992], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"北碚区",value:'339', center:[106.437868,29.82543], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"綦江区",value:'290', center:[106.651417,29.028091], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"大足区",value:'331', center:[105.715319,29.700498], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"渝北区",value:'222', center:[106.512851,29.601451], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"巴南区",value:'253', center:[106.519423,29.381919], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"黔江区",value:'194', center:[108.782577,29.527548], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"长寿区",value:'245', center:[107.074854,29.833671], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"江津区",value:'376', center:[106.253156,29.283387], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"合川区",value:'437', center:[106.265554,29.990993], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"永川区",value:'218', center:[105.894714,29.348748], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"南川区",value:'389', center:[107.098153,29.156646], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"璧山区",value:'290', center:[106.231126,29.593581], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"铜梁区",value:'321', center:[106.054948,29.839944], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"潼南区",value:'342', center:[105.841818,30.189554], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"荣昌区",value:'333', center:[105.594061,29.403627], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"开州区",value:'224', center:[108.413317,31.167735], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"梁平区",value:'425', center:[107.800034,30.672168], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"武隆区",value:'426', center:[107.75655,29.32376], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"城口县",value:'367', center:[108.6649,31.946293], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"丰都县",value:'268', center:[107.73248,29.866424], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"垫江县",value:'229', center:[107.348692,30.330012], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"忠县",value:'430', center:[108.037518,30.291537], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"云阳县",value:'331', center:[108.697698,30.930529],  data: { servicePerson:'30', nstitutions:'23'},},
                { name:"奉节县",value:'102',  center:[109.465774,31.019967], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"巫山县",value:'233', center:[109.878928,31.074843],  data: { servicePerson:'30', nstitutions:'23'},},
                { name:"巫溪县",value:'343', center:[109.628912,31.3966], data: { servicePerson:'30', nstitutions:'23'},},
                { name:"石柱土家族自治县", center:[108.112448,29.99853], value:'145',data: { servicePerson:'30', nstitutions:'23'},},
                { name:"秀山土家族苗族自治县", center:[108.996043,28.444772], value:'356',data: { servicePerson:'30', nstitutions:'23'},},
                { name:"酉阳土家族苗族自治县", center:[108.767201,28.839828], value:'237', data: { servicePerson:'30', nstitutions:'23'},},
                { name:"彭水苗族土家族自治县", center:[108.166551,29.293856], value:'368',data: { servicePerson:'30', nstitutions:'23'},},
            ]

            
const MapChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    echarts.registerMap('cq', cqMap);

    const scatterData = dataValue.map(item => ({
      name: item.name,
      value: [...item.center, item.value], // 结构为 [lng, lat, value]
      data: item.data,
    }));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data;
          return `${params.name}<br/>法律服务人员: ${data?.data?.servicePerson || 0}<br/>法律机构数量: ${data?.data?.nstitutions || 0}`;
        }
      },
      geo: {
        map: 'cq',
        roam: true,
        itemStyle: {
          borderColor: '#aaa',
          borderWidth: 1,
          areaColor: '#f5f5f5',
        },
        emphasis: {
          itemStyle: {
            areaColor: '#ccc',
          }
        }
      },
      visualMap: {
        min: 0,
        max: 500,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: ['lightskyblue', 'yellow', 'orangered'],
        },
        textStyle: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '服务情况',
          type: 'effectScatter', // 或使用 scatter
          coordinateSystem: 'geo',
          data: scatterData,
          symbolSize: (val: any) => Math.sqrt(val[2]) / 2 + 5, // 根据 value 控制点大小
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            formatter: '{b}',
            position: 'right',
            show: true
          },
          itemStyle: {
            color: '#f44336',
            shadowBlur: 10,
            shadowColor: '#333'
          },
          emphasis: {
            scale: true
          }
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return (
    <div style={{ height: '700px', width: '100%' }} ref={chartRef} />
  );
};

export default MapChart;
