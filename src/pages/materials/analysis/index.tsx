import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Button,
  Space,
  message,
} from 'antd';
import { BarChartOutlined, DownloadOutlined, PieChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { Pie, Line, Bar } from '@ant-design/plots';
import ChartPie from '@/pages/compcustom/echart3d_pie';


const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟数据
const mockData = {
  // 饼图数据 - 物资类型及库存状态分布
  pieData: [
    { type: '备品备件-待入库', value: 15 },
    { type: '备品备件-已入库', value: 120 },
    { type: '备品备件-已出库', value: 30 },
    { type: '材料设备-待入库', value: 8 },
    { type: '材料设备-已入库', value: 60 },
    { type: '材料设备-已出库', value: 20 },
  ],
  // 折线图数据 - 出入库数量趋势
  lineData: [
    { date: '2024-01-01', inStock: 5, outStock: 2 },
    { date: '2024-01-02', inStock: 8, outStock: 3 },
    { date: '2024-01-03', inStock: 10, outStock: 1 },
    { date: '2024-01-04', inStock: 3, outStock: 5 },
    { date: '2024-01-05', inStock: 6, outStock: 4 },
    { date: '2024-01-06', inStock: 2, outStock: 6 },
    { date: '2024-01-07', inStock: 7, outStock: 2 },
  ],
  // 柱状图数据 - 品牌/供货商分布
  barData: [
    { name: 'Intel', value: 35 },
    { name: 'Samsung', value: 25 },
    { name: 'Kingston', value: 20 },
    { name: 'Dell', value: 15 },
    { name: 'Cisco', value: 10 },
    { name: '京东', value: 40 },
    { name: '天猫', value: 30 },
    { name: '苏宁', value: 15 },
    { name: '国美', value: 10 },
    { name: '其他', value: 20 },
  ],
  // 关键指标
  metrics: {
    sparePartsInStock: 135,
    equipmentInStock: 68,
    pendingVerification: 23,
    pendingApproval: 12,
    totalOutbound: 50,
    stockSnapshot: {
      in: 200,
      out: 50,
      remaining: 150,
    },
  },
};

const App: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [materialType, setMaterialType] = useState('all');

  // 导出报表
  const handleExport = (format: string) => {
    message.success(`导出${format.toUpperCase()}报表成功`);
    // 模拟下载链接
    setTimeout(() => {
      message.info('报表下载链接：http://example.com/report.' + format);
    }, 1000);
  };

  // 饼图配置
  const pieConfig = {
    data: mockData.pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {value}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  // 折线图配置
  const lineConfig = {
    data: mockData.lineData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    // @ts-ignore
    data: [
      ...mockData.lineData.map(item => ({ ...item, category: '入库' })),
      ...mockData.lineData.map(item => ({ date: item.date, value: item.outStock, category: '出库' })),
    ],
    smooth: true,
    interactions: [
      {
        type: 'tooltip',
        shared: true,
      },
    ],
  };

  // 柱状图配置
  const barConfig = {
    data: mockData.barData,
    xField: 'name',
    yField: 'value',
    label: {
      position: 'top',
    },
    interactions: [
      {
        type: 'tooltip',
      },
    ],
  };

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
      <Card title="数据分析仪表板" bordered={false}>
        {/* 筛选条件 */}
        <Card type="inner" title="筛选条件" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <label style={{ marginRight: '8px' }}>时间范围：</label>
              <Select
                style={{ width: '150px' }}
                value={timeRange}
                onChange={setTimeRange}
              >
                <Option value="day">今日</Option>
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
                <Option value="custom">自定义</Option>
              </Select>
            </Col>
            <Col span={8}>
              {timeRange === 'custom' && (
                <RangePicker style={{ width: '200px' }} />
              )}
            </Col>
            <Col span={6}>
              <label style={{ marginRight: '8px' }}>物资类型：</label>
              <Select
                style={{ width: '150px' }}
                value={materialType}
                onChange={setMaterialType}
              >
                <Option value="all">全部</Option>
                <Option value="spareParts">备品备件</Option>
                <Option value="equipment">材料设备</Option>
              </Select>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport('csv')}
                >
                  导出 CSV
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport('pdf')}
                >
                  导出 PDF
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* 关键指标卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="备品备件在库总数"
                value={mockData.metrics.sparePartsInStock}
                prefix={<PieChartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="材料设备在库总数"
                value={mockData.metrics.equipmentInStock}
                prefix={<PieChartOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="待入库核验数"
                value={mockData.metrics.pendingVerification}
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="待出库审批数"
                value={mockData.metrics.pendingApproval}
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="累计出库数"
                value={mockData.metrics.totalOutbound}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="库存数量快照"
                value={`${mockData.metrics.stockSnapshot.in}/${mockData.metrics.stockSnapshot.out}/${mockData.metrics.stockSnapshot.remaining}`}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表 */}
        <Row gutter={[24, 24]}>
          {/* 饼图 */}
          <Col span={12}>
            <Card title="物资类型及库存状态分布" bordered={false} style={{ height: '400px' }}>
              <div style={{ height: '320px' }}>
                {/* <Pie {...pieConfig} /> */}
                <ChartPie />
              </div>
            </Card>
          </Col>
          {/* 折线图 */}
          <Col span={12}>
            <Card title="出入库数量趋势" bordered={false} style={{ height: '400px' }}>
              <div style={{ height: '320px' }}>
                <Line {...lineConfig} />
              </div>
            </Card>
          </Col>
          {/* 柱状图 */}
          <Col span={24}>
            <Card title="备品备件品牌/材料设备供货商分布 (TOP10)" bordered={false} style={{ height: '400px' }}>
              <div style={{ height: '320px' }}>
                <Bar {...barConfig} />
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default App;