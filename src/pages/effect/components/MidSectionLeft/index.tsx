import React, { useState, useEffect } from 'react'
import styles from './index.less'
import TitleSearchBar from '../TitleSearchBar';
import rate from '@/assets/dashbord/rate.png'
import pros from '@/assets/dashbord/pros.png'
import icon3 from '@/assets/dashbord/icon3.png'
import { message, Flex } from 'antd'
import RollTable from '../RollTable';
import { history } from '@umijs/max';



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
    title: '开发合规率',
    dataIndex: 'developmentComplianceRate',
  },
  {
    title: '未达标项目数',
    dataIndex: 'unCompliantProjectCount',
  },
  {
    title: '未达标人次',
    dataIndex: 'unCompliantPersonCount',
  },
  {
    title: '僵尸项目数',
    dataIndex: 'unCompliantProjectCount',
  },
]


  return (
    <div className={styles.minSection}>
      {/* 顶部标题栏 */}
      <TitleSearchBar title={title} width={'50%'} more={more}/>
      
      {/* 内容区域 */}
      <div className={styles.content}>
       <div className={styles.lefcolumn}>
          <div className={styles.block}>
             <img src={rate} alt="" />
             <div>
                <p className={styles.number}>70%</p>
                <p>研发合规率</p>
             </div>
          </div>
          <div className={styles.block}>
             <img src={pros} alt="" />
             <div>
                <p className={styles.number}>14个</p>
                <p>僵尸项目数</p>
             </div>
          </div>
       </div>
       <div className={styles.rightcolumn}>
          <div className={styles.title}>
              <div className={styles.icon}> 
                <img src={icon3} alt="" />
                <span>风险等级排名</span>
                <span className={styles.desc}>{`（按照研发合规率由低到高）`}</span>
              </div>
              <div className={styles.more} onClick={()=>{ history.push('/develop/rask?type=1') }}>更多 &gt;</div>
          </div>
          <RollTable
            columns={columns}
            dataSource={dataSource}
          />
       </div>
      </div>
    </div>
  )
}

export default Index
