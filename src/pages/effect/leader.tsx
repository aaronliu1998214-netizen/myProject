import React, { useEffect } from 'react'
import { Spin, Flex } from 'antd'
import { history } from '@umijs/max'

function Leader() {

    useEffect(() => {
      history.push('/effectBig')
    }, [])
   
  return (
    <Flex justify='center' align='center' style={{ height: '80vh' }}>
      <Spin spinning={true}/>
    </Flex>
  )
}

export default Leader
