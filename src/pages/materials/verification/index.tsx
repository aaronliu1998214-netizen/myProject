import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Modal,
  message,
  Row,
  Col,
  Input,
  Space,
  Descriptions,
  Timeline,
} from 'antd';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

// 模拟数据
const mockData = [
  {
    key: '1',
    type: '备品备件',
    info: 'Intel i7-12700K 处理器',
    inStock: 5,
    outStock: 0,
    remaining: 5,
    createTime: '2024-01-01 10:00:00',
    operator: '张三',
    details: {
      type: '处理器',
      brand: 'Intel',
      spec: 'i7-12700K',
      supplier: '京东',
      price: 2599,
      partNumber: 'CPU-001',
      serialNumber: 'SN-001',
      inTime: '2024-01-01',
    },
    records: [
      {
        time: '2024-01-01 10:00:00',
        content: '发起入库申请',
        operator: '张三',
      },
      {
        time: '2024-01-01 09:30:00',
        content: '填写入库表单',
        operator: '张三',
      },
    ],
  },
  {
    key: '2',
    type: '材料设备',
    info: 'Dell R740 服务器',
    inStock: 5,
    outStock: 0,
    remaining: 5,
    createTime: '2024-01-02 14:30:00',
    operator: '李四',
    details: {
      projectName: '项目A',
      projectCode: 'PROJ-001',
      materialName: '服务器',
      spec: 'Dell R740',
      unit: '台',
      purchaseQuantity: 5,
      unitPrice: 12000,
      subtotal: 60000,
      supplier: '京东',
      inQuantity: 5,
      inTime: '2024-01-02',
    },
    records: [
      {
        time: '2024-01-02 14:30:00',
        content: '发起入库申请',
        operator: '李四',
      },
      {
        time: '2024-01-02 14:00:00',
        content: '填写入库表单',
        operator: '李四',
      },
    ],
  },
  {
    key: '3',
    type: '备品备件',
    info: 'Samsung 970 EVO Plus 1TB 硬盘',
    inStock: 10,
    outStock: 0,
    remaining: 10,
    createTime: '2024-01-03 09:15:00',
    operator: '王五',
    details: {
      type: '硬盘',
      brand: 'Samsung',
      spec: '970 EVO Plus 1TB',
      supplier: '天猫',
      price: 699,
      partNumber: 'HDD-001',
      serialNumber: 'SN-002',
      inTime: '2024-01-03',
    },
    records: [
      {
        time: '2024-01-03 09:15:00',
        content: '发起入库申请',
        operator: '王五',
      },
      {
        time: '2024-01-03 08:45:00',
        content: '填写入库表单',
        operator: '王五',
      },
    ],
  },
];

const App: React.FC = () => {
  const [data, setData] = useState(mockData);
  const [filters, setFilters] = useState({
    type: '',
    keyword: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 打开详情模态框
  const openDetailModal = (record: any) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  // 核验入库
  const handleVerification = (record: any) => {
    confirm({
      title: '确认核验入库',
      icon: <ExclamationCircleOutlined />,
      content: `确定要核验 ${record.info} 吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 模拟核验成功
        setData(data.map((item) => 
          item.key === record.key 
            ? { ...item, status: '已入库' }
            : item
        ));
        message.success('核验成功');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  // 筛选数据
  const filteredData = data.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      return item.info.toLowerCase().includes(keyword);
    }
    return true;
  });

  // 分页数据
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 表格列定义
  const columns = [
    {
      title: '物资类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color={type === '备品备件' ? 'blue' : 'green'}>{type}</Tag>,
    },
    {
      title: '物资信息',
      dataIndex: 'info',
      key: 'info',
    },
    {
      title: '数量',
      key: 'quantity',
      render:  (_:string, record: any)  => (
        <div>
          入库: {record.inStock}<br />
          已出: {record.outStock}<br />
          剩余: {record.remaining}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '操作',
      key: 'action',
      render:  (_:string, record: any)  => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleVerification(record)}
          >
            核验入库
          </Button>
          <Button onClick={() => openDetailModal(record)}>查看详情</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="入库核验" bordered={false}>
        {/* 筛选条件 */}
        <Card type="inner" title="筛选条件" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <label style={{ marginRight: '8px' }}>物资类型：</label>
              <select
                className="ant-select"
                style={{ width: '150px', padding: '4px' }}
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">全部</option>
                <option value="备品备件">备品备件</option>
                <option value="材料设备">材料设备</option>
              </select>
            </Col>
            <Col span={12}>
              <label style={{ marginRight: '8px' }}>关键词：</label>
              <Input
                placeholder="物资信息"
                style={{ width: '300px' }}
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              />
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ marginRight: '8px' }}>
                查询
              </Button>
              <Button
                onClick={() => setFilters({ type: '', keyword: '' })}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredData.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="物资详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            <Descriptions title="基础信息" bordered style={{ marginBottom: '24px' }}>
              {selectedRecord.type === '备品备件' ? (
                <>
                  <Descriptions.Item label="备件类型">{selectedRecord.details.type}</Descriptions.Item>
                  <Descriptions.Item label="品牌">{selectedRecord.details.brand}</Descriptions.Item>
                  <Descriptions.Item label="规格参数">{selectedRecord.details.spec}</Descriptions.Item>
                  <Descriptions.Item label="供应商">{selectedRecord.details.supplier}</Descriptions.Item>
                  <Descriptions.Item label="采购价格">¥{selectedRecord.details.price}</Descriptions.Item>
                  <Descriptions.Item label="备件号">{selectedRecord.details.partNumber}</Descriptions.Item>
                  <Descriptions.Item label="序列号">{selectedRecord.details.serialNumber}</Descriptions.Item>
                  <Descriptions.Item label="入库时间">{selectedRecord.details.inTime}</Descriptions.Item>
                </>
              ) : (
                <>
                  <Descriptions.Item label="项目名称">{selectedRecord.details.projectName}</Descriptions.Item>
                  <Descriptions.Item label="项目编号">{selectedRecord.details.projectCode}</Descriptions.Item>
                  <Descriptions.Item label="物资名称">{selectedRecord.details.materialName}</Descriptions.Item>
                  <Descriptions.Item label="规格型号">{selectedRecord.details.spec}</Descriptions.Item>
                  <Descriptions.Item label="单位">{selectedRecord.details.unit}</Descriptions.Item>
                  <Descriptions.Item label="采购数量">{selectedRecord.details.purchaseQuantity}</Descriptions.Item>
                  <Descriptions.Item label="单价">¥{selectedRecord.details.unitPrice}</Descriptions.Item>
                  <Descriptions.Item label="小计">¥{selectedRecord.details.subtotal}</Descriptions.Item>
                  <Descriptions.Item label="供货商">{selectedRecord.details.supplier}</Descriptions.Item>
                  <Descriptions.Item label="入库数量">{selectedRecord.details.inQuantity}</Descriptions.Item>
                  <Descriptions.Item label="入库时间">{selectedRecord.details.inTime}</Descriptions.Item>
                </>
              )}
            </Descriptions>

            <Descriptions title="数量信息" bordered style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="入库数量">{selectedRecord.inStock}</Descriptions.Item>
              <Descriptions.Item label="已出数量">{selectedRecord.outStock}</Descriptions.Item>
              <Descriptions.Item label="剩余数量">{selectedRecord.remaining}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginBottom: '16px' }}>
              <h3>流转记录</h3>
              <Timeline>
                {selectedRecord.records.map((record: any, index: number) => (
                  <Timeline.Item key={index}>
                    <div>
                      <div>{record.content}</div>
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                        {record.time} - {record.operator}
                      </div>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;