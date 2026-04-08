import React, {  } from 'react';
import icon1 from '@/assets/screen/12x.png';
import icon2 from '@/assets/screen/22x.png';
import icon3 from '@/assets/screen/32x.png';
import icon4 from '@/assets/screen/42x.png';
import icon5 from '@/assets/screen/52x.png';
import icon_1 from '@/assets/screen/1index.png';
import icon_2 from '@/assets/screen/2index.png';
import icon_3 from '@/assets/screen/3index.png';
import icon_4 from '@/assets/screen/4index.png';
import icon_5 from '@/assets/screen/5index.png';
import styles from './index.less';

interface IPprop {
    list:any;
    type:number
}
const bgs = [icon_1,icon_2,icon_3,icon_4,icon_5]
const icons = [icon1,icon2,icon3,icon4,icon5]

const Header: React.FC<IPprop> = ({ list=[], type = 1 }) => {

    return (
        <div className={styles._index}>
         { type === 2 &&  
         <div style={{
             marginBottom: '1.5vh' ,
             borderRadius: '10vh',
             backgroundColor: 'rgba(3, 50, 81, 0.7)',
             border: '1px solid #2080E8',
             textAlign: 'center',
            }}>被攻击区县TOP5</div>
            }
            {
              list?.length > 0 && list?.slice(0,5)?.map((item: any, index: number) => {
                    return <div
                        key={index}
                        className={styles.index_item}
                        style={{
                            backgroundImage: `url(${bgs[index]})`
                        }}
                    >
                        <div className={styles.icon_box}>
                            <div className={styles.icon_} style={{ backgroundImage: `url(${icons[index]})` }}/>
                        </div>
                        <div className={styles.count}>
                          <span style={{ fontSize:'1.5vh' }}> {item.category} </span><br/>
                            {`${item.value || 0}GB`}
                        </div>
                    </div>
                })
            }
        </div>
    );
};

export default Header;
