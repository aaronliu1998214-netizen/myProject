import React from 'react';
import ReactECharts from 'echarts-for-react';

const App: React.FC<{ list: any }> = ({ list = [] }) => {
    const colors = ['#42e9f4', '#ffe225', '#26f5bd', '#066bcaff']
    /* 要求最大值在最外层 */
    const _list = list?.sort((a:any, b:any) => a.percentage - b.percentage);

    const option = {
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            textStyle: {
                color: '#FFFFFF', // 设置字体为白色
            },
            formatter: ({ seriesName, value, percent }) => {
                return `${seriesName}<br/>已使用: ${percent}%`;
            }
        },
        series: _list?.map((item, index) => ({
            name: item.category,
            type: 'pie',
            radius: [`${20 + index * 10}%`, `${25 + index * 10}%`],
            center: ['50%', '50%'],
            hoverAnimation: true, // ✅ 添加悬停动画
            label: { show: false },
            labelLine: { show: false },
            data: [
                {
                    value: item.percentage,
                    name: item.category,
                    itemStyle: {
                        color: colors[index],
                        borderRadius: 20   // <--- 添加圆角
                    }
                },
                {
                    value: 100 - item.percentage,
                    name: '剩余',
                    itemStyle: {
                        color: '#194672'  // 设置为透明

                    },
                    tooltip: { show: false }
                }
            ]
        }))
    };

    return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
};

export default App;
