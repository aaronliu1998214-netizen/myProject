import React from 'react'
import styles from './index.less'
import { DatePicker, message } from 'antd'
import type { DatePickerProps } from 'antd';

const DESC:Record<string, string> = {
  '研发投入': 'YAN FA TOU RU',
  '风险管控': 'FENG XIAN GUAN KONG',
  '研发队伍': 'YAN FA DUI WU',
  '过程管控': 'GUO CHENG GUAN KONG',
  '研发产出': 'YAN FA CHU CUN',
  '三效评估': 'SAN XIAO PING GU',
}


const Index: React.FC<{ 
    onSearch?: (val:any) => void
    title: string
    gotoDetail?: React.ReactNode
    more?: React.ReactNode
    width?: string
    extre?: React.ReactNode
 }> = ({ 
    onSearch,
    title="",
    gotoDetail,
    more,
    width,
    extre
 }) => {

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
   onSearch && onSearch(date)
};


  return (
    <div className={styles.titleBar}>
        <div className={styles.title} style={{ width: width ? width : '50%' }}>
          <span>{title} <span className={styles.desc}>{DESC[title] || ''}</span></span>
          {
            more && <div className={styles.detailLink}>{more} &gt;</div>
          }
        </div>
        {
          onSearch && 
          <DatePicker onChange={onChange} picker="month" />
        }
        {
          extre && <div className={styles.detailLink}>{extre} &gt;</div>
        }
    </div>
  )
}

export default Index
