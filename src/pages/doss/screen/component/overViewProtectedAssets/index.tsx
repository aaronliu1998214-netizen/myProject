import { Col, Row, Statistic, Spin } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import RadioSelect from '@/pages/doss/screen/component/radioSelect';
import styles from './index.less';
import { getProtectedAssetOverview } from '../../service';
import Bar3D from './bar3d';

interface IPprops {
  title?: string;
  children?: React.ReactNode;
  height?: number | string;
  extra?: React.ReactNode;
  params?: Record<string, any>;
}

const DATA_TITLES = [
  { title: '资产总数' },
  { title: '重点资产总数' },
];

const RADIO_OPTIONS = [
  { label: '全部资产', value: 1 },
  { label: '重点资产', value: 2 },
];

const Index: React.FC<IPprops> = ({ params }) => {
  const [param, setParam] = useState({ criticalAssets: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    assetCount: 0,
    criticalAssetsCount: 0,
    list: [
        {
            "category": "民生服务",
            "protectAssets": 13,
            "attackedAssets": 8
        },
          {
            "category": "政务协同",
            "protectAssets": 5,
            "attackedAssets": 7
        },
                {
            "category": "公共安全",
            "protectAssets": 5,
            "attackedAssets": 4
        },
          {
            "category": "应急指挥",
            "protectAssets": 3,
            "attackedAssets": 9
        }
    ] as any[],
  });

  /** 获取防护资产概况数据 */
  const queryProtectedAssetOverview = useCallback(async (p: any) => {
    // setLoading(true);
    try {
      const res:any = await getProtectedAssetOverview(p);
      if (res) setData(res);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 参数变化时重新请求数据 */
  useEffect(() => {
    if (params) {
      queryProtectedAssetOverview({ ...param, ...params });
    }
  }, [params, param, queryProtectedAssetOverview]);

  /** RadioSelect 切换 */
  const handleSelect = useCallback((val: number) => {
    setParam({ criticalAssets: val });
  }, []);

  const { assetCount, criticalAssetsCount, list } = data;

  return (
    <div className={styles.overview}>
      <Row gutter={8}>
        {DATA_TITLES.map((item, index) => (
          <Col key={index} span={12}>
            <div className={styles.item}>
              <div className={styles.icon} />
              <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: '1.3vh',
                    fontWeight: 600,
                  }}>
                <div>{item.title}</div>
                <Statistic
                  value={index === 0 ? assetCount : criticalAssetsCount}
                  valueStyle={{
                    backgroundImage: 'linear-gradient(to bottom, #1197EA, #AAD1FF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <div className={styles.chartBox}>
        <div className={styles.chartTitle}>
          <div className={styles.title}>资产所属领域</div>
          <RadioSelect btn={RADIO_OPTIONS} onSelect={handleSelect} />
        </div>
        {
          loading ?
          <Spin
            spinning={true}
            style={{
              width: '100%',
              height: '12vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          :
          <Bar3D list={list} />
        }
      </div>
    </div>
  );
};

export default Index;
