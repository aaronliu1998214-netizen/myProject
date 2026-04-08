import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'antd';

const data = [
    { category: "中国电信", percentage: 80 },
    { category: "中国移动", percentage: 70 },
    { category: "中国联通", percentage: 65 },
    { category: "云服务商", percentage: 50 }
];

const App: React.FC = () => {
    const colors =['#42e9f4', '#ffe225', '#26f5bd', '#0c589d']

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
        series: data.map((item, index) => ({
            name: item.category,
            type: 'pie',
            radius: [`${30 + index * 10}%`, `${35 + index * 10}%`], // 控制每个环的粗细和大小
            center: ['50%', '55%'],
            hoverAnimation: true,
            label: { show: false, },
            labelLine: { how: false },
            data: [
                {
                    value: item.percentage,
                    name: item.category,
                    itemStyle: {
                        color: colors[index],
                        borderRadius: 15   // <--- 添加圆角
                    }
                },
                {
                    value: 100 - item.percentage,
                    name: '剩余',
                    itemStyle: {
                        color: '#eee'
                    },
                    tooltip: { show: false }
                }
            ]
        }))
    };

    return <Card title='极坐标系下的堆叠柱形图' style={{ width: '45%' }}>
    <ReactECharts option={option} style={{ height: '300px', width: '100%' }} />
    </Card>
};

export default App;
