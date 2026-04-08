import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  InputNumber,
  Tag,
  Modal,
  message,
  Row,
  Col,
  Space,
} from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 备件类型选项
const sparePartTypes = [
  '处理器',
  '硬盘',
  '内存',
  '主板',
  '板卡',
  '电源电池',
  '风扇',
  '终端外设',
  '整机',
];

// 模拟数据
const mockData = [
  {
    key: '1',
    type: '处理器',
    brand: 'Intel',
    spec: 'i7-12700K',
    supplier: '京东',
    price: 2599,
    partNumber: 'CPU-001',
    serialNumber: 'SN-001',
    inStock: 5,
    outStock: 2,
    remaining: 3,
    status: '已入库',
    inTime: '2024-01-01',
  },
  {
    key: '2',
    type: '硬盘',
    brand: 'Samsung',
    spec: '970 EVO Plus 1TB',
    supplier: '天猫',
    price: 699,
    partNumber: 'HDD-001',
    serialNumber: 'SN-002',
    inStock: 10,
    outStock: 3,
    remaining: 7,
    status: '待入库',
    inTime: '2024-01-02',
  },
  {
    key: '3',
    type: '内存',
    brand: 'Kingston',
    spec: '16GB DDR4 3200',
    supplier: '京东',
    price: 399,
    partNumber: 'RAM-001',
    serialNumber: 'SN-003',
    inStock: 8,
    outStock: 1,
    remaining: 7,
    status: '已入库',
    inTime: '2024-01-03',
  },
];

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: null,
    keyword: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 表单验证规则
  const rules = {
    type: [{ required: true, message: '请选择备件类型' }],
    brand: [{ required: true, message: '请输入品牌' }],
    spec: [{ required: true, message: '请输入规格参数' }],
    supplier: [{ required: true, message: '请输入供应商' }],
    price: [{ required: true, message: '请输入采购价格' }],
    partNumber: [{ required: true, message: '请输入备件号' }],
    serialNumber: [{ required: true, message: '请输入序列号' }],
    inTime: [{ required: true, message: '请选择入库时间' }],
  };

  // 打开新增/编辑模态框
  const openModal = (record?: any) => {
    if (record) {
      if (record.status !== '待入库') {
        message.warning('已入库状态不可修改');
        return;
      }
      setEditingRecord(record);
      form.setFieldsValue({
        ...record,
        inTime: dayjs(record.inTime),
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
      form.setFieldsValue({
        inTime: dayjs(),
      });
    }
    setIsModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const newRecord = {
        ...values,
        key: editingRecord ? editingRecord.key : String(data.length + 1),
        inStock: 1,
        outStock: 0,
        remaining: 1,
        status: '待入库',
        inTime: values.inTime.format('YYYY-MM-DD'),
      };

      if (editingRecord) {
        setData(data.map((item) => (item.key === editingRecord.key ? newRecord : item)));
        message.success('修改成功');
      } else {
        setData([...data, newRecord]);
        message.success('提交成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      localStorage.setItem('sparePartDraft', JSON.stringify(values));
      message.success('草稿保存成功');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem('sparePartDraft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      form.setFieldsValue({
        ...parsedDraft,
        inTime: dayjs(parsedDraft.inTime),
      });
    }
  }, []);

  // 筛选数据
  const filteredData = data.filter((item) => {
    if (filters.type && item.type !== filters.type) return false;
    if (filters.status && item.status !== filters.status) return false;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      return (
        item.brand.toLowerCase().includes(keyword) ||
        item.spec.toLowerCase().includes(keyword) ||
        item.partNumber.toLowerCase().includes(keyword) ||
        item.serialNumber.toLowerCase().includes(keyword)
      );
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
      title: '备件类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '规格参数',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '采购价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '备件号',
      dataIndex: 'partNumber',
      key: 'partNumber',
    },
    {
      title: '序列号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        switch (status) {
          case '待入库':
            color = 'orange';
            break;
          case '已入库':
            color = 'green';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '入库时间',
      dataIndex: 'inTime',
      key: 'inTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_:string, record: any)  => (
        <Space size="middle">
          <Button onClick={() => openModal(record)}>修改</Button>
          <Button type="primary">查看详情</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="备品备件入库/修改" bordered={false}>
        {/* 筛选条件 */}
        <Card type="inner" title="筛选条件" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item label="备件类型">
                <Select
                  placeholder="请选择备件类型"
                  style={{ width: '100%' }}
                  value={filters.type}
                  onChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <Option value="">全部</Option>
                  {sparePartTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态">
                <Select
                  placeholder="请选择状态"
                  style={{ width: '100%' }}
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <Option value="">全部</Option>
                  <Option value="待入库">待入库</Option>
                  <Option value="已入库">已入库</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="入库时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="关键词">
                <Input
                  placeholder="品牌/规格/备件号/序列号"
                  value={filters.keyword}
                  onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ marginRight: '8px' }}>
                查询
              </Button>
              <Button
                onClick={() => setFilters({ type: '', status: '', dateRange: null, keyword: '' })}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 操作按钮 */}
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" onClick={() => openModal()}>新增备件</Button>
        </div>

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

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingRecord ? '修改备件信息' : '新增备件'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            inTime: dayjs(),
          }}
        >
          <Form.Item name="type" label="备件类型" rules={rules.type}>
            <Select placeholder="请选择备件类型">
              {sparePartTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="brand" label="品牌" rules={rules.brand}>
            <Input placeholder="请输入品牌" />
          </Form.Item>
          <Form.Item name="spec" label="规格参数" rules={rules.spec}>
            <Input placeholder="请输入规格参数" />
          </Form.Item>
          <Form.Item name="supplier" label="供应商" rules={rules.supplier}>
            <Input placeholder="请输入供应商" />
          </Form.Item>
          <Form.Item name="price" label="采购价格" rules={rules.price}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入采购价格" />
          </Form.Item>
          <Form.Item name="partNumber" label="备件号" rules={rules.partNumber}>
            <Input placeholder="请输入备件号" />
          </Form.Item>
          <Form.Item name="serialNumber" label="序列号" rules={rules.serialNumber}>
            <Input placeholder="请输入序列号" />
          </Form.Item>
          <Form.Item name="inTime" label="入库时间" rules={rules.inTime}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Button style={{ marginRight: '8px' }} onClick={handleSaveDraft}>
              保存草稿
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              提交入库申请
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default App;