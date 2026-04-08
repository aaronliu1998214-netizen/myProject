import React , { useEffect, useRef} from 'react'
import styles from './index.less'
import TitleSearchBar from '../TitleSearchBar';
import { history } from '@umijs/max';
import { Table } from 'antd';


const Index: React.FC<{
  title: string 
  }> = ({ 
    title,
  }) => {

     const scrollRef = useRef<HTMLDivElement | null>(null);
  const dataSource = Array.from({ length: 30 }).map((_, index) => ({
            unit: `单位${index + 1}`,
            budget: `${10000 + index * 1000}`,
            projectCount: `${10 + index}`,
            projectAmount: `${5000 + index * 1000}`,
            columnAmount: `${3000 + index * 1000}`,
            personalCollection: `${2000 + index * 1000}`,
            developmentInvestment: `${3000 + index * 1000}`,
          }))

   useEffect(() => {
        if (dataSource?.length > 0) {
            const interval = 50; // 每次滚动间隔
            const step = 0.5; // 每次滚动距离（px）

            const scrollContainer = () =>
                scrollRef.current?.querySelector('.ant-table-body') as HTMLDivElement;

            const timer = setInterval(() => {
                const body = scrollContainer();
                if (body) {
                    // 当前是否到底
                    if (body.scrollTop + body.clientHeight >= body.scrollHeight) {
                        body.scrollTop = 0; // 回到顶部
                    } else {
                        body.scrollTop += step; // 继续向下滚动
                    }
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [dataSource]);


  const columns = [
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: '下达预算（万元）',
    dataIndex: 'budget',
  },
  {
    title: '下达项目数',
    dataIndex: 'projectCount',
  },
  {
    title: '立项金额（万元）',
    dataIndex: 'projectAmount',
  },
  {
    title: '列账金额（万元）',
    dataIndex: 'columnAmount',
  },
  {
    title: '立项项目数',
    dataIndex: 'projectCount',
  },  
  {
    title: '个人归集（万元）',
    dataIndex: 'personalCollection',
  },
  {
    title: '研发投入（万元）',
    dataIndex: 'developmentInvestment',
  },
]


  const gotoPage = () => {
    // 跳转到路由地址： '/develop/input' 
    history.push('/develop/input?type=1')

  }

  const onSearch = () => {}

  
  return (
    <div className={styles.topSectionRight}>
      {/* 顶部标题栏 */}
      <TitleSearchBar title={title} width={'50%'}  more={<span onClick={gotoPage}>投入详情</span>} onSearch={onSearch}/>
      {/* 内容区域 */}
      <div className={styles.content}>
        {/* 右侧表格模块 */}
        <div className={styles.lefcolumn}>
          <div  className={`${styles['block']} ${styles['block2']}`}>
            <span>未立项项目数</span>
            <div className={styles.count}>14个</div>
          </div>

           <div className={`${styles['block']} ${styles['block1']}`}>
            <span>创新基地</span>
            <div className={styles.count}>70%</div>
          </div>
        </div>
        <div ref={scrollRef} className={styles.rightcolumn}>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size='small'
            className={styles.screen_table}
            scroll={{ y: '32vh' }}
          />
        </div>
      </div>
    </div>
  )
}

export default Index
