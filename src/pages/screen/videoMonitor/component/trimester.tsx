import React from 'react';
import { Col, Row } from 'antd';
import './index.less'
// 近一个月月告警统计



const Trimester: React.FC = () => {
    return (
        <div className="trimester">
            <Row justify="center" align='top'>
                <Col span={12} className='item'>
                   <div className='icon'/>
                   <div className='text'> 
                      <div>告警总数</div>
                      <div style={{ fontSize: '1.4vw', color: '#00FFFF' }}>48</div>
                   </div>
                </Col>
            </Row>
            <div className='bottom'>
                   <div className='item_card'> 
                        <div className="dot-text dot-text_1">已确认</div>
                      <span style={{ fontWeight: 700, fontSize: '1.2vw' }}> { 24 } </span>
                   </div>
                   <div className='item_card'> 
                     <div className="dot-text dot-text_2">已确认</div>
                        <span style={{ fontWeight: 700, fontSize: '1.2vw', color: '#FF9805' }}> { 24 } </span>
                   </div>
            </div>
        </div>
    );
};

export default Trimester;
