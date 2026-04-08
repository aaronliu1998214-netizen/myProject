import React, { useState,  } from 'react';
import './index.less'
import Footer from '@/pages/screen/component/footer';
import Header from '@/pages/screen/component/header';
import Conrainer from '@/pages/screen/component/container';
import { btn } from './_data'
import { Button, Image } from 'antd';
import back from '@/assets/screen/back.png'


const App: React.FC = () => {
  const [screenType , setScreenType] = useState<any>(btn[0])


  const getActivekey = (val:any) => {
    console.log("val-->",val, val.key);
    setScreenType(val)
  }


  return (
    <div className='main'>
    
    {/* 视频上图预留 */}
       <div className='action'>
          <Image src={back} width={'20%'} height={'100%'}/>
          <Button onClick={()=>{ console.log("点击率");
          }}>按钮</Button>
       </div>
       <Header title={screenType?.title} keyI={screenType.key}/>
       <Conrainer>{ screenType?.comp }</Conrainer>
       <Footer getActivekey={getActivekey}/>
    </div>
  );
};

export default App;
