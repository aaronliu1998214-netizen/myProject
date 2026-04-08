import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

interface IPprops {
    list: any[]
}

const App: React.FC<IPprops> = ({ list }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current || list.length === 0) return;

        const myChart = echarts.init(chartRef.current);

        const xCategories = list?.map((i) => i.category);

        const dataSet1: [number, number, number][] = []; // 被攻击资产
        const dataSet2: [number, number, number][] = []; // 防护资产

        list.forEach(item => {
            const xIndex = xCategories.indexOf(item.category);
            if (xIndex !== -1) {
                dataSet1.push([xIndex, 0, item.attackedAssets]);
                dataSet2.push([xIndex, 0, item.protectAssets]);
            }
        });

        const option: echarts.EChartsOption = {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                textStyle: { color: '#FFFFFF' },
                formatter: (params: any) => {
                    const xName = xCategories[params.value[0]];
                    return `<b>${xName}</b><br/>${params.seriesName}：${params.value[2]}`;
                },
            },
            legend: {
                data: ['防护资产', '被攻击资产'],
                icon: 'rect',
                itemWidth: 5,
                itemHeight: 5,
                textStyle: { color: '#FFFFFF', fontSize: 10 },
                top: 0,
                right: 10,
            },
            xAxis3D: {
                type: 'category',
                data: xCategories,
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#08152cff', width: 0.5 } },
                axisLabel: {
                    color: '#FFFFFF',
                    fontSize: 9,
                    rotate: 45,
                    formatter: (value: string) => value
                }
            },
            yAxis3D: {
                type: 'category',
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#0a1b38', width: 0.5 } },
                axisLabel: { show: false },
            },
            zAxis3D: {
                type: 'value',
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#010307ff', width: 0.5 } },
                axisLabel: { color: '#FFFFFF', fontSize: 9 },
            },
            grid3D: {
                boxWidth: 330,
                boxDepth: 5,
                top: '-18',
                viewControl: {
                    projection: 'perspective',
                    alpha: 0,
                    beta: 0,
                    rotateSensitivity: 0,
                    zoomSensitivity: 0,
                    panSensitivity: 0,
                },
                axisPointer: { show: false },
                light: {
                    main: { intensity: 1.2 },
                    ambient: { intensity: 0.4 },
                },
            },
            // @ts-ignore
            series: [
                {
                    name: '防护资产',
                    type: 'bar3D',
                    barSize: 10,
                    data: dataSet2,
                    stack: 'stack',
                    shading: 'lambert',
                    itemStyle: { color: '#296BFA' },
                    emphasis: { label: { show: false } },
                },
                {
                    name: '被攻击资产',
                    type: 'bar3D',
                    barSize: 10,
                    data: dataSet1,
                    stack: 'stack',
                    shading: 'lambert',
                    itemStyle: { color: '#EEA83E' },
                    emphasis: { label: { show: false } },
                },
            ],
        };

        myChart.setOption(option);

        // 监听窗口变化
        const handleResize = () => {
            myChart.resize();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            myChart.dispose();
        };
    }, [list]);

    return (
        <div
            ref={chartRef}
            style={{ height: '18vh', width: '100%', left: '2vh' }}
        />
    );
};

export default App;
