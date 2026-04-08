import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

interface IPprops {
    list: any[];
    ifFullScreen: boolean | undefined;
}

const App: React.FC<IPprops> = ({ list, ifFullScreen }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const xCategories = list?.map((item) => item.category);

    useEffect(() => {
        if (!chartRef.current || list.length === 0) return;

        const myChart = echarts.init(chartRef.current);

        const dataSet1: [number, number, number][] = []; // 国外运营商
        const dataSet2: [number, number, number][] = []; // 中国联通
        const dataSet3: [number, number, number][] = []; // 中国移动
        const dataSet4: [number, number, number][] = []; // 中国电信

        list.forEach(item => {
            const xIndex = xCategories.indexOf(item.category);
            if (xIndex !== -1) {
                dataSet1.push([xIndex, 0, item.type1]);
                dataSet2.push([xIndex, 0, item.type2]);
                dataSet3.push([xIndex, 0, item.type3]);
                dataSet4.push([xIndex, 0, item.type4]);
            }
        });

        const option: echarts.EChartsOption = {
            title: {
                text: '流量(GB)',
                left: '2%',   // 靠右
                top: '5%',     // 靠上
                textStyle: {
                    color: '#FFFFFF',
                    fontSize: 10,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                textStyle: {
                    color: '#FFFFFF',
                },
                // formatter: (params: any) => {
                //     return `${params.seriesName}：${params.value[2]}`;
                // },
                formatter: (params: any) => {
                    const xName = xCategories[params.value[0]]; // 拿到x轴对应的分类名
                    return `<b>${xName}</b><br/>${params.seriesName}：${params.value[2]}`;
                },
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
            xAxis3D: {
                type: 'category',
                data: xCategories,
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#0a1b38', width: 0.3 } },
                axisLabel: {
                    color: '#FFFFFF',
                    fontSize: '10',
                }
            },
            yAxis3D: {
                type: 'category',
                data: ['类别'],
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#0a1b38', width: 0.5 } },
                axisLabel: { show: false },
            },
            zAxis3D: {
                type: 'value',
                nameLocation: 'end', // 放到z轴正方向端（顶部）
                nameGap: 25, // 调整与轴的距离
                nameTextStyle: {
                    color: '#0a1b38',
                    fontSize: 10,
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                splitLine: { show: false },
                axisLine: {
                    lineStyle: {
                        color: '#ffffff',
                        width: 0.5,
                    }
                },
                axisLabel: { color: '#FFFFFF', fontSize: 10 },
            },
            grid3D: {
                boxWidth: ifFullScreen ? 330 : 430,
                // boxWidth: 330,
                boxDepth: 5,
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
                    name: '国外运营商',
                    type: 'bar3D',
                    barSize: 8,
                    data: dataSet1,
                    stack: 'stack',
                    shading: 'lambert',
                    itemStyle: { color: '#62A241' },
                    emphasis: { label: { show: false } },
                },
                {
                    name: '中国联通',
                    type: 'bar3D',
                    barSize: 8,
                    data: dataSet2,
                    stack: 'stack',
                    shading: 'lambert',
                    itemStyle: { color: '#E0A525' },
                    emphasis: { label: { show: false } },
                },
                {
                    name: '中国移动',
                    type: 'bar3D',
                    barSize: 8,
                    data: dataSet3,
                    stack: 'stack',
                    shading: 'lambert',
                    itemStyle: { color: '#28E8F1' },
                    emphasis: { label: { show: false } },
                },
                {
                    name: '中国电信',
                    type: 'bar3D',
                    barSize: 8,
                    data: dataSet4,
                    stack: 'stack',
                    shading: 'lambert',
                    itemStyle: { color: '#296BFA' },
                    emphasis: { label: { show: false } },
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
            style={{ height: '18vh', width: '100%', top: '-1vh' }}
        />
    );
};

export default App;
