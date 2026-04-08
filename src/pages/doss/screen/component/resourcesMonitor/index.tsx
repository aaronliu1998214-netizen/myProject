import { Statistic, message, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import RadioSelect from '@/pages/doss/screen/component/radioSelect';
import styles from './index.less';
import { getProtectedAssetMonitor, getAttackTrend, getTrafficAttackTrend } from '../../service';
import Bar3D from './bar3d';
import StackedBar from './stackedBar';
import * as echarts from 'echarts';

interface IProps {
  params?: any;
  ifFullScreen?: boolean;
}

const COLOR_LIST = ['#42e9f4', '#ffe225', '#26f5bd', '#0c589d'];

const BTN_OPTIONS = [
  { label: '按攻击与防护', value: 1 },
  { label: '按运营商流量', value: 2 },
];

const Index: React.FC<IProps> = ({ params, ifFullScreen }) => {
  const [dataList, setDataList] = useState<any>({
    list: [ {
            "category": "中国电信",
            "number": "144",
            "percentage": "70"
        },{
            "category": "中国移动",
            "number": "44",
            "percentage": "38"
        },
      {
            "category": "中国联通",
            "number": "100",
            "percentage": "65"
        },{
            "category": "云厂商",
            "number": "86",
            "percentage": "38"
        },],
    protectionBandwidthUtilization: 56,
    totalProtectionBandwidth: 317,
  });
  const [attack, setAttack] = useState<any[]>([
             {
        "category": "2025-4",
        "inboundTraffic": 4,
        "cleanedTraffic": 2
    },     {
        "category": "2025-7",
        "inboundTraffic": 12,
        "cleanedTraffic": 12
    },
         {
        "category": "2025-6",
        "inboundTraffic": 14,
        "cleanedTraffic": 24
    },     {
        "category": "2025-7",
        "inboundTraffic": 7,
        "cleanedTraffic": 16
    },
     {
        "category": "2025-8",
        "inboundTraffic": 10,
        "cleanedTraffic": 20
    },     {
        "category": "2025-9",
        "inboundTraffic": 7,
        "cleanedTraffic": 16
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [attackTrend, setAttackTrend] = useState<any[]>([]);
  const [type, setType] = useState<number>(1);

  /** 饼图数据（右侧列表） */
  const queryProtectedAssetMonitor = useCallback(async (p: any) => {
    try {
      const res = await getProtectedAssetMonitor(p);
      if (res) setDataList(res);
    } catch (err) {
      message.error('获取防护资产监控数据失败');
    }
  }, []);

  /** 折线图数据 */
  const queryAttackTrend = useCallback(async (p: any) => {
    try {
      // setLoading(true);
      const res: any = await getAttackTrend(p);
      if (res) setAttack(res || []);
      setLoading(false);
    } catch {
      message.error('获取攻击趋势失败');
    }
  }, []);

  /** 3D柱形图数据 */
  const queryTrafficAttackTrend = useCallback(async (p: any) => {
    try {
      const res = await getTrafficAttackTrend(p);
      if (Array.isArray(res) && res.length > 0) {
        setAttackTrend(
          res.map((item: any) => ({
            category: item?.category?.slice(5, 10),
            type1: item?.dxTraffic,
            type2: item?.gwTraffic,
            type3: item?.ltTraffic,
            type4: item?.ydTraffic,
          }))
        );
      }
    } catch {
      message.error('获取运营商流量趋势失败');
    }
  }, []);

  /** 监听 params 变化 */
  useEffect(() => {
    if (!params) return;
    queryProtectedAssetMonitor(params);
  }, [params, queryProtectedAssetMonitor]);

  /** 监听 type 或 params 变化 */
  useEffect(() => {
    if (!params) return;
    if (type === 1) {
      queryAttackTrend({ operatorTraffic: 1, ...params });
    } else {
      queryTrafficAttackTrend({ operatorTraffic: 2, ...params });
    }
  }, [params, type, queryAttackTrend, queryTrafficAttackTrend]);

  /** ECharts 配置项 */
  const options = useMemo(() => {
    if (!attack.length) return {};
    return {
      title: {
        text: '带宽 (Gbps)',
        textStyle: { color: '#fff', fontSize: 8 },
        left: '0',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        backgroundColor: 'rgba(0,0,0,0.6)',
        textStyle: { color: '#fff', fontSize: 12 },
      },
      legend: {
        top: '3%',
        right: '0%',
        data: ['入向流量', '清洗后流量'],
        icon: 'rect',
        itemWidth: 5,
        itemHeight: 5,
        textStyle: { color: '#fff', fontSize: 10 },
      },
      grid: { left: '3%', right: '4%', bottom: '8%', top: '20%', containLabel: true },
      xAxis: {
        type: 'category',
        data: attack.map((i) => i.category),
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#061f46' } },
        axisLabel: { color: '#fff', fontSize: 9 },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#ccc' } },
        splitLine: { show: false },
        axisLabel: { color: '#fff', fontSize: 8 },
      },
      series: [
        {
          name: '入向流量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          itemStyle: { color: '#EAAF1D' },
          lineStyle: { width: 1, color: '#EAAF1D' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#EAAF1D' }, // 顶部深色
              { offset: 1, color: 'rgba(234,175,29,0.05)' }, // 底部浅色
            ]),
          },
          data: attack.map((i) => i.inboundTraffic),
        },
        {
          name: '清洗后流量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 4,
          itemStyle: { color: '#296BFA' },
          lineStyle: { width: 1, color: '#296BFA' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#296BFA' }, // 顶部深色
              { offset: 1, color: 'rgba(41,107,250,0.05)' }, // 底部浅色
            ]),
          },
          data: attack.map((i) => i.cleanedTraffic),
        },
      ]

    };
  }, [attack]);

  return (
    <div className={styles.resour}>
      <div className={styles.item}>
        <div className={styles.item_1}>
          <StackedBar list={dataList?.list} />
        </div>
        <div className={styles.item_2}>
          <div className={styles.item_2_fles}>
            <div>
              <span className={styles.cardLabel}>防护带宽总量(Gbps)</span>
              <Statistic
                value={dataList?.totalProtectionBandwidth || 0}
                valueStyle={{
                  backgroundImage: 'linear-gradient(to bottom, #1197EA, #AAD1FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2vh',
                  fontWeight: 550,
                }}
              />
            </div>
            <div>
              <span className={styles.cardLabel}>带宽总使用率</span>
              <Statistic
                value={dataList?.protectionBandwidthUtilization || 0}
                suffix="%"
                valueStyle={{
                  backgroundImage: 'linear-gradient(to bottom, #EEA83E, #FFF2E9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '2vh',
                  fontWeight: 550,
                }}
              />
            </div>
          </div>
          <div className={styles.list}>
            {dataList?.list?.map((item: any, index: number) => (
              <div key={item?.category || index} className={styles.list_item}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={styles.point} style={{ backgroundColor: COLOR_LIST[index] }} />
                  <span>{item.category}</span>
                  <span>&nbsp; | &nbsp;</span>
                  <Statistic value={item.number} valueStyle={{ color: '#fff', fontSize: '1.2vh' }} />
                </div>
                <div>
                  已使用：<span style={{ color: '#FEC369' }}>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartBox}>
        <div className={styles.chartTitle}>
          <div className={styles.title}>攻击趋势</div>
          <RadioSelect onSelect={setType} btn={BTN_OPTIONS} />
        </div>
        {type === 1 ? (
          <>
            {loading ?
              <Spin
                spinning={true}
                style={{
                  width: '100%',
                  height: '12vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              /> : <ReactECharts option={options} style={{ height: '15vh', width: '100%' }} />}
          </>
        ) : (
          <Bar3D list={attackTrend} ifFullScreen={ifFullScreen} />
        )}
      </div>
    </div>
  );
};

export default Index;
