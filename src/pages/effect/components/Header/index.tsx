import React from 'react'
import './index.less'
import { Flex } from 'antd';
import { history } from 'umi';

function Index() {
  return (
    <Flex 
      justify="space-between"
      align='center'
    style={{ 
        height: '46px',
        padding: '0 10px',
    }}>
      
      <div style={{ cursor: 'pointer' }} onClick={()=>{ history.push('/') }}>返回</div>
      <div style={{ fontSize: 25, fontWeight: 550 }}>重庆效能平台</div>
      <div>2026 年 1 月 23 日 星期三 15：03：00</div>
    </Flex>
  )
}

export default Index
