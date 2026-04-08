import React from 'react'
import styles from './index.less'
import { Flex } from 'antd'
import StaticeItemCardOne from './component/StaticeItemCardOne'
import StaticeItemCardTwo from './component/StaticeItemCardTwo'
import NoticeComp from '../NoticeComp';

const TopSectionLeft = () => {



  const ItemCardBlock = ({ title, children }: { title: string, children?: React.ReactNode} ) => { 
    return (
        <div className={styles.blockItem}>
          <Flex flex={1} align='center' vertical justify='space-evenly'>
            {children}
          </Flex>
          <Flex justify='center'>
            {title}
          </Flex>
        </div>
    )
  }




  return (
    <div className={styles.topSectionRight}>
      {/* 公告 及 消息 */}
       <NoticeComp /> 
       <div className={styles.bottom}>
            {/* 研发投入指标 */}
            <ItemCardBlock title='研发投入指标'>
              <StaticeItemCardOne value='78' title='列账率' unit='%' />
              <StaticeItemCardOne value='798.09' title='列账金额' unit='万元' />
              <StaticeItemCardOne value='12' title='超期未立项项目' unit='个' />
            </ItemCardBlock>
            {/* 研发合规指标 */}
            <ItemCardBlock title='研发合规指标'>
              <StaticeItemCardTwo title='新建' value={[{ name: '研发合规率', value: '98%' }, { name: '不达标项目个数', value: '2个' }]}/>
              <StaticeItemCardTwo title='存续' value={[{ name: '研发合规率', value: '78%' }, { name: '不达标项目个数', value: '3个' }]}/>
           </ItemCardBlock>
            {/* 全流程上云指标 */}
            <ItemCardBlock title='全流程上云指标'>
              <StaticeItemCardTwo title='全流程上云率' value={[{ name: '', value: '87%' }]}/>
              <StaticeItemCardTwo title='未上云项目数' value={[{ name: '', value: '5个' }]}/>
            </ItemCardBlock>
            {/* 自研能力指标 */}
            <ItemCardBlock title='自研能力指标'>
              <StaticeItemCardOne value='92' title='月度工时饱和率' unit='%' />
              <StaticeItemCardOne value='12' title='月度工时不饱和人数' unit='人' />
              <StaticeItemCardOne value='81' title='深度用户代码生成占比' unit='%' />
            </ItemCardBlock>
       </div>
    </div>
  )
}

export default TopSectionLeft
