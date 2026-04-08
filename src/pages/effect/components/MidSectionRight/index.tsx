import React from 'react'
import styles from './index.less'
import TitleSearchBar from '../TitleSearchBar';
import type1 from '@/assets/dashbord/type1.png'
import type2 from '@/assets/dashbord/type2.png'
import type3 from '@/assets/dashbord/type3.png'
import type4 from '@/assets/dashbord/type4.png'
import icon3 from '@/assets/dashbord/icon3.png'
import RollTable from '../RollTable';
import { history } from '@umijs/max';
import { Flex } from 'antd';

const Index: React.FC<{
  title: string 
  more?: React.ReactNode
  children?: React.ReactNode
  }> = ({ 
    title,
    more,
    children
  }) => {

  const dataSource = Array.from({ length: 30 }).map((_, index) => ({
      index,
      unit: `单位${index + 1}`,
      developmentComplianceRate: `${70 + index * 3}%`,
      unCompliantProjectCount: `${10 + index}`,
      unCompliantPersonCount: `${200 + index * 20}`,
    }))

const columns = [
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
    render: (text: string, record:any) => {
      const inx = record.index + 1
      const Color:Record<number, string> = { 1: '#fe1767', 2: "#ffd15c", 3: "#68d1ff" }
      return (
         <Flex align='center' gap={'0.1vw'}>    
           <Flex align='center' justify='center' style={{ 
              backgroundColor: inx < 4 ? Color[inx] : '',
              padding: "0.2vw 0.2vw",
              color: inx > 3 ? "#fff" : '#000',
              fontWeight:600,
              borderRadius: '0.2vw'
            }}>
              {inx}
            </Flex>
            <div>{`${text}`}</div>
          </Flex>
      )
    }
  },
  {
    title: '达标率',
    dataIndex: 'complianceRate',
  },
  {
    title: '人数',
    dataIndex: 'unCompliantPersonCount',
  },
  {
    title: '小于60分',
    dataIndex: 'lessThan60Count',
  },
  {
    title: '60-80分',
    dataIndex: 'between60And80Count',
  },
  {
    title: '大于80分',
    dataIndex: 'greaterThan80Count',
  },
]


  return (
    <div className={styles.minSection}>
      {/* 顶部标题栏 */}
      <TitleSearchBar title={title} width={'50%'}  more={<span onClick={() => {history.push('/develop/team?type=1')}}>查看更多</span>}/>
      
      {/* 内容区域 */}
      <div className={styles.content}>
       <div className={styles.lefcolumn}>
          <div className={styles.block}>
            <img src={type1} alt="" />
            <p>{1230}人</p>
            <span>全口径人员</span>
          </div>
          <div className={styles.block}>
             <img src={type2} alt="" />
            <p>{1230}人</p>
            <span>外包人员</span>
          </div>
          <div className={styles.block}>
            <img src={type3} alt="" />
            <p>{460}人</p>
            <span>核心研发人员</span>
          </div>
          <div className={styles.block}>
            <img src={type4} alt="" />
            <p>{210}人</p>
            <span>二开研发人员</span>
          </div>
       </div>
       <div className={styles.rightcolumn}>
          <div className={styles.title}>
              <div className={styles.icon}> 
                <img src={icon3} alt="" />
                <span>核心研发人员月度考核情况</span>
              </div>
          </div>
          <RollTable
            columns={columns}
            dataSource={dataSource}
            scrollY={"10vh"}
          />
       </div>
      </div>
    </div>
  )
}

export default Index
