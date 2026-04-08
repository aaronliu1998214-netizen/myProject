import React, { useState } from 'react';
import './index.less';
import Footer from '@/pages/screen/component/footer';
import Header from '@/pages/screen/component/header';
import Conrainer from '@/pages/screen/component/container';
import { btn } from './_data';
import Map from '@/pages/screen/component/Map';
import AlarmModal from '@/pages/screen/safety/component/alarmModal'

const App: React.FC = () => {
  const [screenType, setScreenType] = useState<any>(btn[0]);

  const getActivekey = (val: any) => {
    console.log('val-->', val, val.key);
    setScreenType(val);
  };

  return (
    <div className="main">
      {/* 视频上图预留 */}
      <div className="action">{(screenType?.key === 1 || screenType?.key === 2) && <Map />}</div>
      <Header title={screenType?.title} keyI={screenType.key} />
      <Conrainer>{screenType?.comp}</Conrainer>
      <Footer getActivekey={getActivekey} />
      {
        screenType?.key === 1 && <AlarmModal />
      }
    </div>
  );
};

export default App;
