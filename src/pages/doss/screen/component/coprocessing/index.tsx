import { Col, Row, Statistic } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import item2 from '@/assets/screen/item2.png';
import item3 from '@/assets/screen/item3.png';
import Double from './double';
import styles from './index.less';
import { getCooperationDisposalAnalysis } from '../../service';
import { Spin } from 'antd';

interface WorkOrderItem {
  type: string;
  handledWorkOrdersCount: number;
  workOrderSubmissionCount: number;
}

interface CooperationData {
  workOrderSubmissionCount: number;
  processedWorkOrderRatio: number;
  list: WorkOrderItem[];
}

interface IPprop {
  params?: any;
}

const Index: React.FC<IPprop> = ({ params }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<CooperationData>({
    workOrderSubmissionCount: 0,
    processedWorkOrderRatio: 0,
    list: [
             {
            "category": "地理位置封禁",
            "workOrderSubmissionCount": 52032,
            "handledWorkOrdersCount": 95023,
            "averageHandleTimes": "12"
        },
                     {
            "category": "URL拦截",
            "workOrderSubmissionCount": 48110,
            "handledWorkOrdersCount": 86250,
            "averageHandleTimes": "12"
        },
                     {
            "category": "域名封禁",
            "workOrderSubmissionCount": 55860,
            "handledWorkOrdersCount": 83565,
            "averageHandleTimes": "12"
        },
                    {
            "category": "流量清洗",
            "workOrderSubmissionCount": 53467,
            "handledWorkOrdersCount": 95023,
            "averageHandleTimes": "12"
        },
                     {
            "category": "其他",
            "workOrderSubmissionCount": 62153,
            "handledWorkOrdersCount": 96023,
            "averageHandleTimes": "12"
        },
    ],
  });

  /** 获取数据 */
  const queryCooperationDisposalAnalysis = async (param: any) => {
    try {
      // setLoading(true)
      const res: any = await getCooperationDisposalAnalysis(param);
      if (res) setData(res);
      setLoading(false)
    } catch (error) {
      console.error('获取协同处置分析失败:', error);
    }
  };

  useEffect(() => {
    if (params) queryCooperationDisposalAnalysis(params);
  }, [params]);

  /** 截取前 5 条数据 */
  const top5List = useMemo(() => data.list.slice(0, 5), [data.list]);

  /** 左右数据对比 */
  const dataPairs = useMemo(
    () =>
      top5List.map((i) => ({
        left: i.handledWorkOrdersCount,
        right: i.workOrderSubmissionCount,
      })),
    [top5List]
  );

  const statisticItems = [
    {
      title: '提交的工单总数',
      value: data.workOrderSubmissionCount,
      icon: item2,
    },
    {
      title: '已处理工单占比',
      value: data.processedWorkOrderRatio,
      suffix: '%',
      icon: item3,
    },
  ];

  return (
    <div className={styles.copro}>
      {/* 顶部统计数据 */}
      <Row gutter={8}>
        {statisticItems.map((item, index) => (
          <Col key={index} span={12}>
            <div className={styles.item}>
              <div
                className={styles.icon}
                style={{ backgroundImage: `url(${item.icon})` }}
              />
              <div className={styles.itemInfo}>
                <div>{item.title}</div>
                <Statistic
                  value={item.value}
                  suffix={item.suffix}
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

      {/* 图表部分 */}
      <div className={styles.chartTitle}>
        <div className={styles.title}>工单类型及状态分布</div>
      </div>
      <div className={styles.chartBox}>
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
            <>
              <Double list={top5List} />
              <div className={styles.data_ls}>
                <div className={styles.data_box}>
                  {dataPairs.map((pair, index) => (
                    <div className={styles.item_data} key={index}>
                      {pair.left}/{pair.right}
                    </div>
                  ))}
                </div>
              </div>
            </>
        }
      </div>
    </div>
  );
};

export default Index;
