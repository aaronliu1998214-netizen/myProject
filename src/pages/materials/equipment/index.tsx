import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Table,
  Tag,
  Modal,
  message,
  Row,
  Col,
  Space,
} from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

// 模拟数据
const mockData = [
  {
    key: '1',
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
    inStock: 5,
    outStock: 2,
    remaining: 3,
    status: '已入库',
    inTime: '2024-01-01',
  },
  {
    key: '2',
    projectName: '项目B',
    projectCode: 'PROJ-002',
    materialName: '网络交换机',
    spec: 'Cisco 2960X',
    unit: '台',
    purchaseQuantity: 10,
    unitPrice: 3000,
    subtotal: 30000,
    supplier: '天猫',
    inQuantity: 8,
    inStock: 8,
    outStock: 0,
    remaining: 8,
    status: '待入库',
    inTime: '2024-01-02',
  },
  {
    key: '3',
    projectName: '项目C',
    projectCode: 'PROJ-003',
    materialName: '显示器',
    spec: 'Dell 27英寸',
    unit: '台',
    purchaseQuantity: 20,
    unitPrice: 1500,
    subtotal: 30000,
    supplier: '京东',
    inQuantity: 20,
    inStock: 20,
    outStock: 5,
    remaining: 15,
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
    status: '',
    dateRange: null,
    keyword: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 表单验证规则
  const rules = {
    projectName: [{ required: true, message: '请输入项目名称' }],
    projectCode: [{ required: true, message: '请输入项目编号' }],
    materialName: [{ required: true, message: '请输入物资名称' }],
    spec: [{ required: true, message: '请输入规格型号' }],
    unit: [{ required: true, message: '请输入单位' }],
    purchaseQuantity: [{ required: true, message: '请输入采购数量' }],
    unitPrice: [{ required: true, message: '请输入单价' }],
    supplier: [{ required: true, message: '请输入供货商' }],
    inQuantity: [{ required: true, message: '请输入入库数量' }],
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
      
      // 验证入库数量是否小于等于采购数量
      if (values.inQuantity > values.purchaseQuantity) {
        message.error('入库数量不能大于采购数量');
        return;
      }

      const newRecord = {
        ...values,
        key: editingRecord ? editingRecord.key : String(data.length + 1),
        subtotal: values.unitPrice * values.purchaseQuantity,
        inStock: values.inQuantity,
        outStock: 0,
        remaining: values.inQuantity,
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
      localStorage.setItem('equipmentDraft', JSON.stringify(values));
      message.success('草稿保存成功');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 自动计算小计
  const handleCalculateSubtotal = (unitPrice: number, purchaseQuantity: any) => {
    if (unitPrice && purchaseQuantity) {
      form.setFieldsValue({ subtotal: unitPrice * purchaseQuantity });
    }
  };

  // 加载草稿
  useEffect(() => {
    const draft = localStorage.getItem('equipmentDraft');
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
    if (filters.status && item.status !== filters.status) return false;
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      return (
        item.projectCode.toLowerCase().includes(keyword) ||
        item.projectName.toLowerCase().includes(keyword) ||
        item.materialName.toLowerCase().includes(keyword) ||
        item.supplier.toLowerCase().includes(keyword)
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
      title: '项目编号',
      dataIndex: 'projectCode',
      key: 'projectCode',
    },
    {
      title: '项目名称',
      dataIndex: 'projectName',
      key: 'projectName',
    },
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '规格型号',
      dataIndex: 'spec',
      key: 'spec',
    },
    {
      title: '供货商',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: '数量',
      key: 'quantity',
      render: (_:any, record:any) => (
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
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button onClick={() => openModal(record)}>修改</Button>
          <Button type="primary">查看详情</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="材料设备入库/修改" bordered={false}>
        {/* 筛选条件 */}
        <Card type="inner" title="筛选条件" style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item label="状态">
                <select
                  className="ant-select"
                  style={{ width: '100%', padding: '4px' }}
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">全部</option>
                  <option value="待入库">待入库</option>
                  <option value="已入库">已入库</option>
                </select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="入库时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="关键词">
                <Input
                  placeholder="项目编号/项目名称/物资名称/供货商"
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
                onClick={() => setFilters({ status: '', dateRange: null, keyword: '' })}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 操作按钮 */}
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button type="primary" onClick={() => openModal()}>新增材料设备</Button>
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
        title={editingRecord ? '修改材料设备信息' : '新增材料设备'}
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
          <Form.Item name="projectName" label="项目名称" rules={rules.projectName}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item name="projectCode" label="项目编号" rules={rules.projectCode}>
            <Input placeholder="请输入项目编号" />
          </Form.Item>
          <Form.Item name="materialName" label="物资名称" rules={rules.materialName}>
            <Input placeholder="请输入物资名称" />
          </Form.Item>
          <Form.Item name="spec" label="规格型号" rules={rules.spec}>
            <Input placeholder="请输入规格型号" />
          </Form.Item>
          <Form.Item name="unit" label="单位" rules={rules.unit}>
            <Input placeholder="请输入单位" />
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="purchaseQuantity" label="采购数量" rules={rules.purchaseQuantity}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入采购数量"
                  onChange={(value) => {
                    const unitPrice = form.getFieldValue('unitPrice');
                    if (value && unitPrice) {
                      handleCalculateSubtotal(unitPrice, value);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unitPrice" label="单价" rules={rules.unitPrice}>
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入单价"
                  onChange={(value) => {
                    const purchaseQuantity = form.getFieldValue('purchaseQuantity');
                    if (value && purchaseQuantity) {
                      handleCalculateSubtotal(value as number, purchaseQuantity as number);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="subtotal" label="小计" rules={[{ required: true, message: '小计不能为空' }]}>
                <InputNumber style={{ width: '100%' }} placeholder="小计" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="supplier" label="供货商" rules={rules.supplier}>
            <Input placeholder="请输入供货商" />
          </Form.Item>
          <Form.Item name="inQuantity" label="入库数量" rules={rules.inQuantity}>
            <InputNumber style={{ width: '100%' }} placeholder="请输入入库数量" />
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