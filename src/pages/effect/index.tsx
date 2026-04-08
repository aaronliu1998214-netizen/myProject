import './index.less';
import BottomSection from './components/ButtomSection';
import MidSectionLeft from './components/MidSectionLeft'
import MidSectionRight from './components/MidSectionRight'
import TopSectionRight from './components/TopSectionRight';
import TopSectionLeft from './components/TopSectionLeft';
import Header from './components/Header';
import styles from './index.less'
import { history } from '@umijs/max';
import { useState, useEffect } from 'react';

export default function PageIndex() {
  const [resizeKey, setResizeKey] = useState(0);

  /* 适配浏览器缩放效果 */
  useEffect(() => {
    // 处理窗口 resize 事件
    const handleResize = () => {
      setResizeKey(prev => prev + 1);
    };
    // 添加事件监听器
    window.addEventListener('resize', handleResize);
    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
      <div className={styles.mian} key={resizeKey}>
        <div className={styles.header}>
          <Header />
        </div>
        {/* 第一层 */}
        <div className={styles.row1}>
          <div className={styles.block}>
            <TopSectionLeft />
          </div>
          <div className={styles.block}>
            <TopSectionRight title='研发投入'/>
          </div>
        </div>

        {/* 第二层 */}
        <div className={styles.row2}>
          <div className={styles.block}>
            <MidSectionLeft title='风险管控'/>
          </div>
          <div className={styles.block}>
            <MidSectionRight title='研发队伍'/>
          </div>
        </div>

        {/* 第三层 */}
        <div className={styles.row3} >
          <div className={styles.block}>
           <BottomSection title='过程管控'/>
          </div>
          <div className={styles.block}>
           <BottomSection title='研发产出' extre={<span onClick={()=>{history.push('/develop/output?type=1')}}>更多</span>} />
          </div>
          <div className={styles.block}>
           <BottomSection title='三效评估' />
          </div>
        </div>
      </div>
  );
}