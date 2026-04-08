import React from 'react';
import Header from './components/header';
import TopSection from './components/TopSection';
import BottomSection from './components/BottomSection';
import './index.less';

const Index: React.FC = () => {




  return (
    <div className='efficiency-main'>
      <Header />
      <div className="efficiency-dashboard">
        <TopSection />
        <BottomSection />
      </div>
    </div>
  );
};

export default Index;
