import React, { useRef , useEffect, useState } from 'react';
import styles from './index.less';

import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

const RollTable: React.FC<{ columns: ColumnsType<any>, dataSource: any[], scrollY?: number | string }> = ({
    columns, 
    dataSource, 
    ...setProps 
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 动态计算 scrollY 值
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // 计算 scrollY 值
    const calculateScrollY = () => {
      const value = (window.innerHeight - 46) * 0.15;
      setScrollY(value);
    };

    // 初始化计算
    calculateScrollY();

    // 监听窗口大小变化
    window.addEventListener('resize', calculateScrollY);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', calculateScrollY);
    };
  }, []);
    
    useEffect(() => {
        if (dataSource?.length > 0) {
            const interval = 50; // 每次滚动间隔
            const step = 0.5; // 每次滚动距离（px）

            const scrollContainer = () =>
                scrollRef.current?.querySelector('.ant-table-body') as HTMLDivElement;

            const timer = setInterval(() => {
                const body = scrollContainer();
                if (body) {
                    // 当前是否到底
                    if (body.scrollTop + body.clientHeight >= body.scrollHeight) {
                        body.scrollTop = 0; // 回到顶部
                    } else {
                        body.scrollTop += step; // 继续向下滚动
                    }
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [dataSource]);
  


  return (
    <div ref={scrollRef} className={styles.rollTable}>
      <Table
        {...setProps}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size='small'
        className={styles.screen_table}
        scroll={{ y: scrollY }}
      />
  </div>
    )
}

export default RollTable
