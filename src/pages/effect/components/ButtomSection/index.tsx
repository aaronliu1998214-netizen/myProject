import React from 'react'
import styles from './styles.less'
import TitleSearchBar from '../TitleSearchBar';
import waiting from '@/assets/dashbord/waiting.png';
import { history } from '@umijs/max';

const Index: React.FC<{
  title: string 
  more?: React.ReactNode
  extre?: React.ReactNode
  }> = ({ 
    title,
    extre
  }) => {



  return (
    <div className={styles.bottomSection}>
      {/* 顶部标题栏 */}
      <TitleSearchBar 
        title={title} 
        width={'80%'} 
        extre={extre}/>
      
      {/* 内容区域 */}
      <div className={styles.content}>
        {/* 右侧表格模块 */}
        <img src={waiting}/>
        待开发
      </div>
    </div>
  )
}

export default Index
