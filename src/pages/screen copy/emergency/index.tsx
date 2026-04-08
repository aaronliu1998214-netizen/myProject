import React, {} from 'react';
import ItemCard from '@/pages/screen/component/itemCard';


// 应急处理 
const Safety: React.FC = () => {
 
  return (
       <div className='container'>
          <div className="column column_left">
            <ItemCard title="危险撤离统计" height={"33%"}>UI还没切图</ItemCard>
            <ItemCard title="风险处应急救援体系" height={"63%"}>UI还没切图</ItemCard>
          </div>
          <div className="column">
            {/* <Image src={back} width={'100%'} height={'100%'}/> */}
          </div>
          <div className="column column_right">
            <ItemCard title="危险撤离统计" height={'33%'}>UI还没切图</ItemCard>
            <ItemCard title="急救物质清单" height={'63%'}>UI还没切图</ItemCard>
          </div>
       </div>
  );
};

export default Safety;
