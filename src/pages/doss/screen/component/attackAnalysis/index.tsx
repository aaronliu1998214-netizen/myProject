import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styles from './index.less';
import Echart3D from './pei';
import WaterBall from './waterBall';
import { Spin } from 'antd';
import { getAssertsLeveRatio, getAssertsTypeRatio } from '../../service';

interface WaterData {
  name: string;
  percent?: number;
}

interface AttackType {
  name: string;
  total: number;
  percent: string;
}

const COLOR_TYPES = ['#3FA1FB', '#9A78F1', '#48C95D', '#ffaaaa', '#2AB4FF', '#7A9BFF', '#FFB640'];
const COLOR_WATER = ['#FFB640', '#2AB4FF', '#7A9BFF'];

const _data = {
        "total": 238,
        "list": [
            {
                "name": "API滥用",
                "total": 34,
                "percent": 14
            },
            {
                "name": "HTTP慢速",
                "total": 33,
                "percent": 13
            },
            {
                "name": "QUIC协议攻击",
                "total": 35,
                "percent": 14
            },
            {
                "name": "SYN Flood",
                "total": 67,
                "percent": 28
            },
            {
                "name": "UDP反射",
                "total": 69,
                "percent": 28
            }
        ]
    }
const Index: React.FC<{ params?: any }> = ({ params }) => {
  const [dataWater, setDataWater] = useState<WaterData[]>([
    { name: '高风险' },
    { name: '中风险' },
    { name: '低风险' },
  ]);
  const [optionData, setOptionData] = useState<any[]>([]);
  const [maxTotal, setMaxTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)

  // 查询攻击事件等级占比
  const queryAttackEventAnalysis = useCallback(async (param: any) => {
    try {
      const res:any = await getAssertsLeveRatio(param);
      if (res) setDataWater(res);
    } catch (e) {
      console.error('获取攻击事件等级占比失败:', e);
    }
  }, []);

  useEffect(() => {
    const _maxTotal = Math.max(..._data.list.map((item:any) => item.total));
        setMaxTotal(_maxTotal);

        const _list = _data.list.map((i:any, index:number) => ({
          ...i,
          itemStyle: { color: COLOR_TYPES[index % COLOR_TYPES.length] },
          value: _maxTotal > 10 ? i.total : i.total * 10,
          pre: i.percent,
        }));
        setOptionData(_list);
  }, [_data]);


  // 查询攻击类型占比
  const queryAssertsTypeRatio = useCallback(async (param: any) => {
    setLoading(true);
    try {
      const res: { list: AttackType[] } & any = await getAssertsTypeRatio(param);
      if (res?.list?.length) {
        const _maxTotal = Math.max(...res.list.map((item:any) => item.total));
        setMaxTotal(_maxTotal);

        const _list = res.list.map((i:any, index:number) => ({
          ...i,
          itemStyle: { color: COLOR_TYPES[index % COLOR_TYPES.length] },
          value: _maxTotal > 10 ? i.total : i.total * 10,
          pre: i.percent,
        }));
        setOptionData(_list);
        setLoading(false);
      } else {
        setOptionData([]);
        setMaxTotal(0);
        setLoading(false);
      }
    } catch (e) {
      console.error('获取攻击类型占比失败:', e);
      setLoading(false);
    }
  }, []);

  // 请求数据
  useEffect(() => {
    if (params) {
      queryAttackEventAnalysis(params);
      queryAssertsTypeRatio({ ...params, useType: 2 });
    }
  }, [params, queryAttackEventAnalysis, queryAssertsTypeRatio]);

  const renderAttackTypeList = useMemo(
    () =>
      optionData.map((item, index) => (
        <div key={index} className={styles.list_item}>
          <div className={styles.point} style={{ backgroundColor: item.itemStyle?.color }} />
          <span style={{ width: '8vh', fontSize: '1.2vh' }}>{item.name}</span>
          <span> &nbsp; | &nbsp; </span>
          <span style={{ width: '5vh', opacity: 0.6 }}>{item.pre ?? '0'}%</span>
          <span>{maxTotal > 10 ? item.value : item.value / 10}</span>
        </div>
      )),
    [optionData, maxTotal]
  );

  return (
    <div className={styles.attack}>
      {/* 攻击类型占比 */}
      <div className={styles.chartTitle}>
        <div className={styles.title}>攻击类型占比</div>
      </div>
      <div className={styles.bar_bg} />
        {
          loading ? 
          <Spin 
           spinning={true} 
           style={{
             width: '50%',
             height: '12vh',
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             position: 'absolute',
             top: '0',
             left: '0',
             right: '0',
             bottom: '0',
             borderRadius: '5px',
            }}
          /> 
          : 
          <div className={styles.top_l}>
            <Echart3D optionData={optionData} />
          </div>
        }
      {/* </div> */}
      <div className={styles.top}>
        <div className={styles.top_item_l}></div>
        <div className={styles.top_item_r}>{renderAttackTypeList}</div>
      </div>

      {/* 攻击事件等级占比 */}
      <div className={styles.bottom}>
        <div className={styles.chartTitle}>
          <div className={styles.title}>
            攻击事件
            <br />
            等级占比
          </div>
        </div>
        {dataWater.map((item, index) => (
          <div key={index} className={styles.bottom_item}>
            <WaterBall
              pre={item?.percent ?? 0}
              name={item.name}
              color={COLOR_WATER[index % COLOR_WATER.length]}
              level={index + 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
