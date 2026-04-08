import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Table,
  Tag,
  Modal,
  message,
  Space,
  Upload,
  Input as AntInput,
} from 'antd';
import { InboxOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = AntInput;
const { Dragger } = Upload;

// 模拟数据 - 我的申请
const myApplications = [
  {
    key: '1',
    materialCode: 'CPU-001',
    materialName: 'Intel i7-12700K 处理器',
    materialType: '备品备件',
    status: '待审批',
    applyTime: '2024-01-01 10:00:00',
    purpose: '项目A服务器升级',
  },
  {
    key: '2',
    materialCode: 'PROJ-001',
    materialName: 'Dell R740 服务器',
    materialType: '材料设备',
    status: '已通过',
    applyTime: '2024-01-02 14:30:00',
    purpose: '项目B部署',
  },
  {
    key: '3',
    materialCode: 'HDD-001',
    materialName: 'Samsung 970 EVO Plus 1TB 硬盘',
    materialType: '备品备件',
    status: '已驳回',
    applyTime: '2024-01-03 09:15:00',
    purpose: '项目C存储扩容',
  },
];

// 模拟数据 - 待审批
const pendingApprovals = [
  {
    key: '1',
    materialCode: 'CPU-001',
    materialName: 'Intel i7-12700K 处理器',
    materialType: '备品备件',
    applicantId: '1001',
    applicantName: '张三',
    applyTime: '2024-01-01 10:00:00',
    purpose: '项目A服务器升级',
  },
  {
    key: '2',
    materialCode: 'RAM-001',
    materialName: 'Kingston 16GB DDR4 3200 内存',
    materialType: '备品备件',
    applicantId: '1002',
    applicantName: '李四',
    applyTime: '2024-01-02 11:20:00',
    purpose: '项目B内存扩容',
  },
];

// 模拟数据 - 待确认
const pendingConfirmations = [
  {
    key: '1',
    materialCode: 'PROJ-001',
    materialName: 'Dell R740 服务器',
    materialType: '材料设备',
    applyTime: '2024-01-02 14:30:00',
    purpose: '项目B部署',
    currentStock: 5,
    applyQuantity: 2,
  },
  {
    key: '2',
    materialCode: 'CPU-001',
    materialName: 'Intel i7-12700K 处理器',
    materialType: '备品备件',
    applyTime: '2024-01-01 10:00:00',
    purpose: '项目A服务器升级',
    currentStock: 3,
    applyQuantity: 1,
  },
];

// 模拟数据 - 可出库物资
const availableMaterials = [
  {
    key: '1',
    code: 'CPU-001',
    name: 'Intel i7-12700K 处理器',
    type: '备品备件',
    stock: 3,
  },
  {
    key: '2',
    code: 'HDD-001',
    name: 'Samsung 970 EVO Plus 1TB 硬盘',
    type: '备品备件',
    stock: 7,
  },
  {
    key: '3',
    code: 'PROJ-001',
    name: 'Dell R740 服务器',
    type: '材料设备',
    stock: 5,
  },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('apply');
  const [form] = Form.useForm();
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [isApplyModalVisible, setIsApplyModalVisible] = useState(false);
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [selectedConfirmation, setSelectedConfirmation] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [confirmOpinion, setConfirmOpinion] = useState('');

  // 打开申请模态框
  const openApplyModal = () => {
    form.resetFields();
    setSelectedMaterial(null);
    setIsApplyModalVisible(true);
  };

  // 选择物资
  const handleMaterialSelect = (material: any) => {
    setSelectedMaterial(material);
    form.setFieldsValue({
      materialType: material.type,
    });
  };

  // 提交申请
  const handleSubmitApply = async () => {
    try {
      await form.validateFields();
      message.success('申请提交成功');
      setIsApplyModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    try {
      const values = await form.validateFields();
      localStorage.setItem('outboundDraft', JSON.stringify(values));
      message.success('草稿保存成功');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 打开审批模态框
  const openApproveModal = (record: any) => {
    setSelectedApproval(record);
    setRejectReason('');
    setIsApproveModalVisible(true);
  };

  // 审批通过
  const handleApprove = () => {
    message.success('审批通过');
    setIsApproveModalVisible(false);
  };

  // 驳回申请
  const handleReject = () => {
    if (rejectReason.length < 5) {
      message.error('驳回原因至少5个字');
      return;
    }
    message.success('已驳回');
    setIsApproveModalVisible(false);
  };

  // 打开确认模态框
  const openConfirmModal = (record: any) => {
    setSelectedConfirmation(record);
    setConfirmOpinion('');
    setIsConfirmModalVisible(true);
  };

  // 确认出库
  const handleConfirm = () => {
    if (!confirmOpinion) {
      message.error('请填写出库确认意见');
      return;
    }
    message.success('出库确认成功');
    setIsConfirmModalVisible(false);
  };

  // 表格列定义 - 我的申请
  const applyColumns = [
    {
      title: '物资编号',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '物资类型',
      dataIndex: 'materialType',
      key: 'materialType',
      render: (type: string) => <Tag color={type === '备品备件' ? 'blue' : 'green'}>{type}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        switch (status) {
          case '待审批':
            color = 'orange';
            break;
          case '已通过':
            color = 'green';
            break;
          case '已驳回':
            color = 'red';
            break;
          default:
            color = 'blue';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
    },
    {
      title: '出库用途',
      dataIndex: 'purpose',
      key: 'purpose',
    },
  ];

  // 表格列定义 - 待审批
  const approveColumns = [
    {
      title: '物资编号',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '物资类型',
      dataIndex: 'materialType',
      key: 'materialType',
      render: (type: string) => <Tag color={type === '备品备件' ? 'blue' : 'green'}>{type}</Tag>,
    },
    {
      title: '申请人',
      key: 'applicant',
      render: (_:string, record: any) => `${record.applicantName} (${record.applicantId})`,
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
    },
    {
      title: '出库用途',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: '操作',
      key: 'action',
      render: (_:string, record: any)  => (
        <Space size="middle">
          <Button onClick={() => openApproveModal(record)}>审批</Button>
        </Space>
      ),
    },
  ];

  // 表格列定义 - 待确认
  const confirmColumns = [
    {
      title: '物资编号',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: '物资名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '物资类型',
      dataIndex: 'materialType',
      key: 'materialType',
      render: (type: string) => <Tag color={type === '备品备件' ? 'blue' : 'green'}>{type}</Tag>,
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
    },
    {
      title: '出库用途',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: '当前库存',
      dataIndex: 'currentStock',
      key: 'currentStock',
    },
    {
      title: '申请数量',
      dataIndex: 'applyQuantity',
      key: 'applyQuantity',
    },
    {
      title: '操作',
      key: 'action',
      render: (_:string, record: any)  => (
        <Space size="middle">
          <Button onClick={() => openConfirmModal(record)}>确认出库</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="物资出库申请/审批" bordered={false}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 出库申请模块 */}
          <TabPane tab="出库申请" key="apply">
            <Card type="inner" title="我的申请" style={{ marginBottom: '24px' }}>
              <Table columns={applyColumns} dataSource={myApplications} />
            </Card>
            <div style={{ marginBottom: '24px', textAlign: 'right' }}>
              <Button type="primary" onClick={openApplyModal}>发起出库申请</Button>
            </div>
          </TabPane>

          {/* 审批操作模块 */}
          <TabPane tab="审批操作" key="approve">
            <Card type="inner" title="待审批申请" style={{ marginBottom: '24px' }}>
              <Table columns={approveColumns} dataSource={pendingApprovals} />
            </Card>
          </TabPane>

          {/* 出库确认模块 */}
          <TabPane tab="出库确认" key="confirm">
            <Card type="inner" title="待确认出库" style={{ marginBottom: '24px' }}>
              <Table columns={confirmColumns} dataSource={pendingConfirmations} />
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* 申请模态框 */}
      <Modal
        title="发起出库申请"
        open={isApplyModalVisible}
        onCancel={() => setIsApplyModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Card type="inner" title="选择物资" style={{ marginBottom: '24px' }}>
            <Input placeholder="搜索物资（备件号/序列号/物资名称/项目编号）" style={{ marginBottom: '16px' }} />
            <Table
              columns={[
                { title: '编号', dataIndex: 'code', key: 'code' },
                { title: '名称', dataIndex: 'name', key: 'name' },
                { title: '类型', dataIndex: 'type', key: 'type' },
                { title: '库存', dataIndex: 'stock', key: 'stock' },
                { title: '操作', key: 'action', render: (_, record) => <Button onClick={() => handleMaterialSelect(record)}>选择</Button> },
              ]}
              dataSource={availableMaterials}
              rowKey="key"
            />
          </Card>

          <Form.Item name="materialType" label="物资类型" hidden>
            <Input />
          </Form.Item>

          {selectedMaterial?.type === '备品备件' && (
            <>
              <Form.Item name="outTime" label="出库时间" rules={[{ required: true, message: '请选择出库时间' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="price" label="采购价格" rules={[{ required: true, message: '请输入采购价格' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="project" label="调用项目" rules={[{ required: true, message: '请输入调用项目' }]}>
                <Input placeholder="请输入调用项目" />
              </Form.Item>
              <Form.Item name="receiver" label="领用人" rules={[{ required: true, message: '请输入领用人' }]}>
                <Input placeholder="请输入领用人" />
              </Form.Item>
              <Form.Item name="report" label="现场服务报告单">
                <Dragger name="file" action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持上传PDF、Word文档</p>
                </Dragger>
              </Form.Item>
              <Form.Item name="photo" label="现场开箱照片">
                <Dragger name="file" action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持上传JPG、PNG图片</p>
                </Dragger>
              </Form.Item>
              <Form.Item name="remark" label="备注">
                <TextArea rows={4} placeholder="请输入备注" />
              </Form.Item>
            </>
          )}

          {selectedMaterial?.type === '材料设备' && (
            <>
              <Form.Item name="outQuantity" label="出库数量" rules={[{ required: true, message: '请输入出库数量' }]}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="outTime" label="出库时间" rules={[{ required: true, message: '请选择出库时间' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="handoverTime" label="移交客户时间" rules={[{ required: true, message: '请选择移交客户时间' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="handler" label="经办人" rules={[{ required: true, message: '请输入经办人' }]}>
                <Input placeholder="请输入经办人" />
              </Form.Item>
              <Form.Item name="materialPhoto" label="物资照片">
                <Dragger name="file" action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持上传JPG、PNG图片</p>
                </Dragger>
              </Form.Item>
              <Form.Item name="receipt" label="客户签收单">
                <Dragger name="file" action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                  <p className="ant-upload-hint">支持上传PDF、Word文档</p>
                </Dragger>
              </Form.Item>
            </>
          )}

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Button style={{ marginRight: '8px' }} onClick={handleSaveDraft}>
              保存草稿
            </Button>
            <Button type="primary" onClick={handleSubmitApply}>
              提交审批
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 审批模态框 */}
      <Modal
        title="审批申请"
        open={isApproveModalVisible}
        onCancel={() => setIsApproveModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedApproval && (
          <div>
            <Card type="inner" title="申请信息" style={{ marginBottom: '24px' }}>
              <p>物资编号: {selectedApproval.materialCode}</p>
              <p>物资名称: {selectedApproval.materialName}</p>
              <p>物资类型: {selectedApproval.materialType}</p>
              <p>申请人: {selectedApproval.applicantName} ({selectedApproval.applicantId})</p>
              <p>申请时间: {selectedApproval.applyTime}</p>
              <p>出库用途: {selectedApproval.purpose}</p>
            </Card>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>驳回原因（必填，至少5个字）：</label>
              <TextArea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请输入驳回原因"
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                style={{ marginRight: '8px' }}
                onClick={handleApprove}
              >
                审批通过
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleReject}
              >
                驳回
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 确认模态框 */}
      <Modal
        title="确认出库"
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedConfirmation && (
          <div>
            <Card type="inner" title="申请信息" style={{ marginBottom: '24px' }}>
              <p>物资编号: {selectedConfirmation.materialCode}</p>
              <p>物资名称: {selectedConfirmation.materialName}</p>
              <p>物资类型: {selectedConfirmation.materialType}</p>
              <p>申请时间: {selectedConfirmation.applyTime}</p>
              <p>出库用途: {selectedConfirmation.purpose}</p>
              <p>当前库存: {selectedConfirmation.currentStock}</p>
              <p>申请数量: {selectedConfirmation.applyQuantity}</p>
            </Card>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>出库确认意见：</label>
              <TextArea
                rows={4}
                value={confirmOpinion}
                onChange={(e) => setConfirmOpinion(e.target.value)}
                placeholder="请输入出库确认意见"
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleConfirm}>
                确认出库
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default App;