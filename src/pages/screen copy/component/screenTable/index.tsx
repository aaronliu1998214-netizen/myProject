import React, { useEffect, useRef } from 'react';
import './index.less';
import { Table } from 'antd';

const data: any[] = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    area: `Edward`,
    count: 32,
    phone: `11111111111`,
    name: i + 1
  });
}

interface TableIP {
dataSource: any[]
columns:any[]
}

const App: React.FC<TableIP> = ({ dataSource = [], columns=[] }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = 50; // 每次滚动间隔
    const step = 1; // 每次滚动距离（px）

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
  }, []);

  return (
    <div ref={scrollRef} style={{ width: '100%' }}>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ y: '22.5vh' }}
        className="screen_table"
        bordered={false}
      />
    </div>
  );
};

export default App;
