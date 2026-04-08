import React from 'react';
import ReactECharts from 'echarts-for-react';

const option = {
    tooltip: {
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // 半透明黑色
        textStyle: {
            color: '#fff',
            fontSize: 12,
        },
    },
    legend: {
        show: false,
    },
    radar: {
    center: ['50%', '60%'], // 横向50%居中，纵向下移到60%
    radius: '70%',     
    nameGap: 5, 
        indicator: [
            { name: '定级准确性', max: 6500 },
            { name: '流程合理性', max: 16000 },
            { name: '意见有效性', max: 30000 },
            { name: '防护资源', max: 38000 },
            { name: '处置能力', max: 52000 },
        ],
    },
    name: {
        textStyle: {
            fontSize: 8, // 雷达维度字体小一点
        },
    },
    series: [
        {
            name: '预算 vs 开销',
            type: 'radar',
            label: {
                show: false,
                fontSize: 10, // 数据点标签字体大小
            },
            data: [
                {
                    value: [4200, 10000, 28000, 35000, 50000],
                    name: '预算分配',
                    symbolSize: 4,      // 设置点大小
                    lineStyle: {
                        color: '#00D0FF',
                        width: 0.5,
                    },
                    itemStyle: {
                        color: '#00D0FF',
                    },
                    areaStyle: {
                        color: 'rgba(0, 208, 255, 0.3)',
                    },
                },
                {
                    value: [5000, 14000, 28000, 31000, 42000],
                    name: '实际开销',
                    symbolSize: 4,      // 设置点大小

                    lineStyle: {
                        color: '#FB8D08',
                        width: 0.5,
                    },
                    itemStyle: {
                        color: '#FB8D08',
                    },
                    areaStyle: {
                        color: 'rgba(251, 141, 8, 0.3)',
                    },
                },
            ],
        },
    ],
};

const Index: React.FC = () => {
    return <ReactECharts option={option} style={{ zIndex:99999, height: '100%', width: '100%' }} />;
};

export default Index;
