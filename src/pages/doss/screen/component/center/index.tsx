import React from 'react';
import styles from './index.less';

type IPprops = {
  data: any
};



const ItemCard: React.FC<IPprops> = ({ data }) => {


  const topData = [
    { title: '攻击事件总数', count: data?.totalAttackEvents, color: '#F0A22E' },
    { title: '被攻击资产总数', count: data?.totalAttackedEvents, color: '#00F2FF' },
    { title: '业务影响时长', count: data?.impactHours, color: '#FFFFFF' },
    { title: '平均响应效率', count: data?.averageResponseEfficiency, color: '#FFFFFF' },
  ];

  return (
    <div className={styles.center_select_main}>
      <div className={styles.center_top}>
        {topData?.map((item: any, index: number) => {
          return (
            <div key={index} className={styles.top_item}>
              <div> {item?.title} </div>
              <div className={styles.top_count} style={{ color: item?.color }}>
                {item?.count}
                <span>
                  {' '}
                  {index === 2 ? '小时' : index === 3 ? '分钟' : null}{' '}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemCard;
