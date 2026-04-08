import React, { useState } from 'react'
import styles from './index.less'
import NoticeIcon from '@/assets/dashbord/notice-icon.png';
import { Carousel, Flex, message } from 'antd'
import './index.less'


interface MessageItem {
  id: number;
  status: 'unread' | 'read';
  statusText: string;
  content: string;
}

const NoticeComp = () => {
  const [messageList] = useState<MessageItem[]>([
    { id: 1, status: 'unread', statusText: '待阅', content: '【告警】1月研发合规率未达标，请及时处理' },
    { id: 2, status: 'read', statusText: '已阅', content: '【告警】1月研发合规率未达标，请及时处理' },
    { id: 3, status: 'unread', statusText: '待阅', content: '【通知】系统维护公告' },
    { id: 4, status: 'read', statusText: '已阅', content: '【通知】项目进度更新' },
    { id: 5, status: 'unread', statusText: '待阅', content: '【告警】代码质量检查报告' },
    { id: 6, status: 'read', statusText: '已阅', content: '【通知】团队会议安排' },
  ]);

    const ItemCard: React.FC<{ title: string , children: React.ReactNode }> = ({ title, children }) =>{

        return (
            <div className={styles.block}>
              <Flex justify='space-between' vertical className={styles.content}>
                <Flex justify='space-between' className={styles.title}>
                    <div className={styles.titleL}>{title}</div>
                    <div className={styles.titleR} onClick={()=>{ message.info('开发中') }}>更多 &gt;</div>
                </Flex>
                <div className={styles.children}>
                    {children && children}
                </div>
              </Flex>

                {
                    title === '公告' && 
                    <div style={{ width: '5vw', height: '100%' }}>
                      <img src={NoticeIcon} alt=''/>
                    </div>
                }
            </div>
        )
    }

  return (
    <div className={styles.top}>
        <ItemCard title='公告'>
          <Flex justify='start' className='notic-message'>
            <Carousel
              vertical
              autoplay
              dots={false}
              autoplaySpeed={3000}
            >
              {messageList.map((item) => (
                <Flex gap={8} className='notic-item' key={item.id}>
                  <span className='notic-text' style={{ color:"#fff" }}>{item.content}</span>
                </Flex>
              ))}
            </Carousel>
          </Flex>
        </ItemCard>


        <ItemCard title='消息'>
          <Flex justify='start' className='notic-message'>
            <Carousel
              vertical
              autoplay
              dots={false}
              autoplaySpeed={3000}
              slidesToShow={2}
              slidesToScroll={2}
            >
              {messageList.map((item) => (
                <Flex gap={8} className='message-item' key={item.id}>
                    <span className={`status-badge ${item.status}`}>{item.statusText}</span>
                    <span className='message-text'>{item.content}</span>
                </Flex>
              ))}
            </Carousel>
          </Flex>
        </ItemCard>
    </div>
  )
}

export default NoticeComp
