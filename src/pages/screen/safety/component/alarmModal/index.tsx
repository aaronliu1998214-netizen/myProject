import React, { useState } from 'react';
import './index.less'
import { Col, Row, Typography } from 'antd';
import modalvideo from '@/assets/screen/modalvideo.png'
import modaltime from '@/assets/screen/modaltime.png'

const rawData = [
  { id: 0, time: '2025-01-09', unitType: 'CS001', content: '警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容' },
  { id: 1, time: '2025-01-09', unitType: 'CS002', content: '警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容' },
  { id: 2, time: '2025-01-09', unitType: 'CS003', content: '警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容警告内容' },
  { id: 3, time: '2025-01-09', unitType: 'CS004', content: '警告内容较长的测试内容，看看能否正确换行和截断显示告警内容' },
  { id: 4, time: '2025-01-09', unitType: 'CS005', content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容' },
  { id: 5, time: '2025-01-09', unitType: 'CS006', content: '测试更多内容测试更多内容测试更多内容测试更多内容测试更多内容测试更多内容' },
  { id: 6, time: '2025-01-09', unitType: 'CS007', content: '警告内容警告内容警告内容警告内容警告内容警告内容警告内容' },
];

const Index: React.FC = () => {
  const [dataList, setDataList] = useState(rawData);
  const [visibleList, setVisibleList] = useState(rawData.slice(0, 4)); // 每次取四条告警信息

  const onClose = (id: number) => {
    const newDataList = dataList.filter(item => item.id !== id);
    setDataList(newDataList);
    setVisibleList(newDataList.slice(0, 4));
  };

  return (
    <div className='alarm_modal'>
      <Row gutter={[10, 10]}>
        {
          visibleList.map((item) => (
            <Col key={item.id} span={12}>
              <div className='modal_card'>
                <div className='top'>
                  {/* 告警时间 */}
                  <div className='item'>
                    <div className='icon' style={{ background: `url(${modaltime})` }} />
                    <div className='text'>{item.time}</div>
                  </div>
                  {/* 告警设备 */}
                  <div className='item'>
                    <div className='icon' style={{ background: `url(${modalvideo})` }} />
                    <div className='text'>{item.unitType}</div>
                  </div>
                  {/* 关闭按钮 */}
                  <div className='close' onClick={() => onClose(item.id)} />
                </div>
                {/* 告警内容 */}
                <div className='content'>
                  <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                    type='warning'
                  >
                    {item.content}
                  </Typography.Paragraph>
                </div>
              </div>
            </Col>
          ))
        }
      </Row>
    </div>
  );
};

export default Index;
