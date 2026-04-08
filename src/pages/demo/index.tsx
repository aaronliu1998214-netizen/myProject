import React, { } from 'react';
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table';
import './index.less'
const columns: ColumnsType = [
  {
    title: '区',
    dataIndex: 'area',
    width: '24%'
  },
  {
    title: '人',
    dataIndex: 'count',
    width: '18%'
  },
  {
    title: '负',
    width: '20%',
    dataIndex: 'name',
  },
  {
    title: '联',
    dataIndex: 'phone',
  },
];

const Index: React.FC = () => {

  const data: any[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      area: `Edw`,
      count: 32,
      phone: `111111`,
      name: i + 1
    });
  }


  const demo1 = (fn:any, wait:number) => {
     let timer = null
     return  function(...args){
       clearInterval(timer)
       timer = setTimeout(function(){
        fn.apply(this,args)
       },wait)
     }
  }

  const demo2 = (fn,wait) => {
    let old = 0
    return function(...args){
      let now = new Date().valueOf()
      if(now - old > wait){
        fn.apply(this, args)
        old = now
      } 
      return;
    }
  }



  return (
    <div className='work' style={{}}>
      <div className='left' style={{ width: '99%', backgroundColor: 'red' }}>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ y: 100 }}
          pagination={false}
        />
      </div>

    </div>
  );
};

export default Index;
