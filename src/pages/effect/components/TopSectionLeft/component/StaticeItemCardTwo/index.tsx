import React from 'react'
import styles from './index.less'
import { Flex } from 'antd'

const Index: React.FC<{
  value?: Array<{ name: string, value: string | number }>
  title?: string
  unit?: string
}> = ({ value, title, unit }) => {
  return (
    <div className={styles.staticitem}>
      <div className={styles.title}>{title}</div>
      <div className={styles.boxvalue}>
        {
            value?.map((item:any) => (
                <Flex vertical justify='center' align='center' key={item.name} className={styles.box}>
                    <div className={styles.value}>{item.value}</div>
                   {
                    item.name &&
                      <span>{item.name}</span>
                    }
                </Flex>
            ))
        }
      </div>
    </div>
  )
}

export default Index