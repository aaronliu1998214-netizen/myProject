import React from 'react';
import './index.less';
import { Row, Col } from 'antd';
import shidu from '@/assets/screen/shidu.png';
import wendu from '@/assets/screen/wendu.png';
import pm2410 from '@/assets/screen/pm.png';
import yuliang from '@/assets/screen/yuliang.png';
import fengsu from '@/assets/screen/fengsu.png';
import fengxiang from '@/assets/screen/fengxiang.png';
import zhaodu from '@/assets/screen/zhaodu.png';
import guangzhao from '@/assets/screen/guangzhao.png';
import zaosheng from '@/assets/screen/zaosheng.png';

interface CardIP {
  data: any[];
}

const data1 = [
  { icon: wendu, title: '温度', count: '37.5', symbol: '℃' },
  { icon: shidu, title: '湿度', count: '58', symbol: '%' },
  { icon: pm2410, title: 'PM2.5', count: '45', symbol: '' },
  { icon: pm2410, title: 'PM10', count: '9.5', symbol: '' },
];

const data2 = [
  { icon: yuliang, title: '雨量累计', count: '0.0', symbol: 'mm' },
  { icon: fengsu, title: '风速', count: '9.0', symbol: 'm/s' },
  { icon: fengxiang, title: '风向', count: '165.0', symbol: '°' },
];

const data3 = [
  { icon: zhaodu, title: '照度', count: '9810', symbol: 'LUX' },
  { icon: guangzhao, title: '光照', count: '58', symbol: 'mW/cm' },
  { icon: zaosheng, title: '噪声', count: '45', symbol: 'PPM' },
];

const Environment: React.FC = () => {
  const EvnCard: React.FC<CardIP> = ({ data = [] }) => {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {data?.map((item: any, index: number) => {
          return (
            <div className="evn_card_item" key={index}>
              <div className="top">
                <div
                  className="icon"
                  style={{
                    backgroundImage: `url(${item.icon})`,
                    marginRight: '0.8vh',
                  }}
                />
                <div>{item?.title}</div>
              </div>
              <div className="count_">
                {item.count}
                <span
                  style={{
                    fontSize: '1.6vh',
                    paddingTop: item.title === '风向' ? '' : '1.8vh',
                  }}
                >
                  {item.symbol || ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="environment">
      <Row gutter={['1.5vh', '1.5vh']}>
        <Col className="box" span={24}>
          <Row gutter={[0, '1.5vh']}>
            {data1?.map((item: any, index: number) => {
              return (
                <Col key={index} className="box_1" span={11}>
                  <div className="icon_title">
                    <div
                      className="icon"
                      style={{
                        backgroundImage: `url(${item.icon})`,
                      }}
                    />
                    <div className="icon_title_">{item.title}</div>
                  </div>
                  {/* 具体数值 */}
                  <div className="count">
                    {item.count}
                    <span style={{ fontSize: '1.6vh', paddingTop: '1vh' }}>
                      {item.symbol || ''}
                    </span>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col className="box env_box" span={24}>
          <EvnCard data={data2} />
        </Col>
        <Col className="box env_box" span={24}>
          <EvnCard data={data3} />
        </Col>
      </Row>
    </div>
  );
};

export default Environment;
