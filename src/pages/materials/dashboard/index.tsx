import React from 'react';
import { Card, Statistic, Row, Col, List, Button, Tag, Typography } from 'antd';
import { Link } from 'umi';
import { InboxOutlined, AppstoreOutlined, UnorderedListOutlined, BarChartOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Title } = Typography;

const App: React.FC = () => {
  // 模拟数据
  const metrics = [
    {
      title: '备品备件在库数量',
      value: 156,
      icon: <AppstoreOutlined />,
      color: '#1890ff',
      link: '/materials/spare-parts',
    },
    {
      title: '材料设备在库数量',
      value: 89,
      icon: <DatabaseOutlined />,
      color: '#52c41a',
      link: '/materials/equipment',
    },
    {
      title: '今日新增入库数',
      value: 12,
      icon: <InboxOutlined />,
      color: '#faad14',
      link: '/materials/verification',
    },
    {
      title: '待出库审批数',
      value: 5,
      icon: <UnorderedListOutlined />,
      color: '#f5222d',
      link: '/materials/outbound',
    },
    {
      title: '今日完成出库数',
      value: 8,
      icon: <BarChartOutlined />,
      color: '#722ed1',
      link: '/materials/search',
    },
  ];

  const todos = [
    {
      id: 1,
      title: '驳回申请处理',
      description: '3个备品备件入库申请需要重新审核',
      role: '录入员',
      link: '/materials/spare-parts',
    },
    {
      id: 2,
      title: '待审批申请',
      description: '5个出库申请等待审批',
      role: '审批人',
      link: '/materials/outbound',
    },
    {
      id: 3,
      title: '待入库核验',
      description: '8个物资需要入库核验',
      role: '管理员',
      link: '/materials/verification',
    },
  ];

  const quickActions = [
    {
      title: '备品备件入库',
      icon: <AppstoreOutlined />,
      link: '/materials/spare-parts',
      color: 'primary',
    },
    {
      title: '材料设备入库',
      icon: <DatabaseOutlined />,
      link: '/materials/equipment',
      color: 'success',
    },
    {
      title: '发起出库申请',
      icon: <UnorderedListOutlined />,
      link: '/materials/outbound',
      color: 'warning',
    },
    {
      title: '物资查询',
      icon: <InboxOutlined />,
      link: '/materials/search',
      color: 'default',
    },
    {
      title: '数据分析',
      icon: <BarChartOutlined />,
      link: '/materials/analysis',
      color: 'purple',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>物资台账首页</Title>

      {/* 指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {metrics.map((metric, index) => (
          <Col span={8} key={index}>
            <Link to={metric.link} style={{ textDecoration: 'none' }}>
              <Card hoverable>
                <Statistic
                  title={metric.title}
                  value={metric.value}
                  prefix={metric.icon}
                  valueStyle={{ color: metric.color }}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* 待办模块 */}
        <Col span={12}>
          <Card title="待办事项" bordered={false}>
            <List
              dataSource={todos}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <Link to={item.link} key="view">
                      处理
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        {item.title}
                        <Tag style={{ marginLeft: '8px' }}>{item.role}</Tag>
                      </div>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 快速入口 */}
        <Col span={12}>
          <Card title="快速操作" bordered={false}>
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col span={8} key={index}>
                  <Link to={action.link} style={{ display: 'block' }}>
                    <Button
                      type={action.color as any}
                      icon={action.icon}
                      size="large"
                      block
                      style={{ height: '80px' }}
                    >
                      {action.title}
                    </Button>
                  </Link>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default App;