import { Carousel, Button,  } from 'antd';
import React, { useRef } from 'react';

const contentStyle: React.CSSProperties = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const CarouselDemo = () => {
  const carouselRef = useRef<any>(null);

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button onClick={handlePrev} style={{ marginRight: 16 }}>← 上一页</Button>
        <div style={{ width: '400px' }}>
          <Carousel autoplay ref={carouselRef}>
            <div><h3 style={contentStyle}>1</h3></div>
            <div><h3 style={contentStyle}>2</h3></div>
            <div><h3 style={contentStyle}>3</h3></div>
            <div><h3 style={contentStyle}>4</h3></div>
          </Carousel>
        </div>
        <Button onClick={handleNext} style={{ marginLeft: 16 }}>下一页 →</Button>
      </div>
  );
};

export default CarouselDemo;
