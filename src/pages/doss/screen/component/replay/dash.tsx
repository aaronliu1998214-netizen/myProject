import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface IPprops {
    count: number
}

const Index: React.FC<IPprops> = ({ count }) => {
    const chartRef = useRef<any>(null);

    const option = {
        series: [
            {
                name: 'detail-bg',
                type: 'pie',
                radius: ['0%', '80%'],
                center: ['50%', '90%'],
                startAngle: 180,
                data: [
                    {
                        value: 1,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 1, 0,
                                [
                                    { offset: 0, color: 'rgba(129, 177, 168, 1)' },
                                    { offset: 0.5, color: 'rgba(129, 177, 168, 0)' },
                                    { offset: 1, color: 'rgba(129, 177, 168, 1)' },
                                ]
                            ),
                        },
                        label: { show: false },
                        labelLine: { show: false },
                    },
                    {
                        value: 1,
                        itemStyle: { color: 'transparent' },
                        label: { show: false },
                        labelLine: { show: false },
                    },
                ],
                hoverAnimation: false,
                silent: true,
            },
            {
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                center: ['50%', '90%'],
                radius: '150%',
                min: 0,
                max: 10,
                splitNumber: 5,
                axisLine: {
                    lineStyle: {
                        width: 1,
                        color: [
                            [
                                0.5,
                                new echarts.graphic.LinearGradient(1, 0, 0.5, 0, [
                                    { offset: 0, color: '#00E4FF' },
                                    { offset: 0.5, color: '#00E4FE' },
                                    { offset: 1, color: '#00FDCB' },
                                ]),
                            ],
                            [
                                1,
                                new echarts.graphic.LinearGradient(0.5, 0, 0, 0, [
                                    { offset: 0, color: '#00FDCB' },
                                    { offset: 0.5, color: '#00E4FE' },
                                    { offset: 1, color: '#00E4FF' },
                                ]),
                            ],
                        ],
                    },
                },
                pointer: {
                    length: '15%',
                    width: 3,
                    offsetCenter: [0, '-65%'],
                    itemStyle: { color: '#FFFFFF' },
                },
                axisTick: {
                    length: 1,
                    lineStyle: { color: 'auto', width: 1 },
                },
                splitLine: {
                    length: 8,
                    lineStyle: {
                        width: 3,
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#00E4FF' },
                            { offset: 1, color: '#00FFCA' },
                        ]),
                    },
                },
                axisLabel: { show: false },
                title: {
                    offsetCenter: [0, '-10%'],
                    fontSize: 10,
                    color: '#ffffff',
                },
                detail: {
                    fontSize: 15,
                    offsetCenter: [0, '-30%'],
                    valueAnimation: true,
                    color: '#fff',
                    formatter: (value: number) => `${value.toFixed(1)}分`,
                },
                data: [{ value: count || 0, name: '最近得分' }],
            },
        ],
    };

    // 监听 resize
    useEffect(() => {
        const chart = chartRef.current?.getEchartsInstance?.();
        if (!chart) return;

        const handleResize = () => {
            chart.resize();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <ReactECharts
            ref={chartRef}
            option={option}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
        />
    );
};

export default Index;
