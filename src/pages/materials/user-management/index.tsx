import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

const { Option } = Select;

// 角色选项
const roleOptions = [
  { value: 1, label: '物资录入员' },
  { value: 2, label: '出库审批人（负责人）' },
  { value: 3, label: '出库审批人（部门负责人）' },
  { value: 4, label: '物资管理员' },
  { value: 5, label: '系统管理员' },
];

// 部门选项
const deptOptions = [
  { value: 1, label: '技术部' },
  { value: 2, label: '采购部' },
  { value: 3, label: '管理部' },
];

// 模拟数据
const mockData = [
  {
    key: '1',
    user_id: 1,
    user_code: 'zhangsan',
    user_name: '张三',
    role_id: 1,
    role_name: '物资录入员',
    dept_id: 1,
    dept_name: '技术部',
    phone: '13800138000',
    status: 'active',
  },
  {
    key: '2',
    user_id: 2,
    user_code: 'lisi',
    user_name: '李四',
    role_id: 2,
    role_name: '出库审批人（负责人）',
    dept_id: 1,
    dept_name: '技术部',
    phone: '13800138001',
    status: 'active',
  },
  {
    key: '3',
    user_id: 3,
    user_code: 'wangwu',
    user_name: '王五',
    role_id: 3,
    role_name: '出库审批人（部门负责人）',
    dept_id: 2,
    dept_name: '采购部',
    phone: '13800138002',
    status: 'active',
  },
  {
    key: '4',
    user_id: 4,
    user_code: 'zhaoliu',
    user_name: '赵六',
    role_id: 4,
    role_name: '物资管理员',
    dept_id: 3,
    dept_name: '管理部',
    phone: '13800138003',
    status: 'active',
  },
  {
    key: '5',
    user_id: 5,
    user_code: 'sunqi',
    user_name: '孙七',
    role_id: 5,
    role_name: '系统管理员',
    dept_id: 3,
    dept_name: '管理部',
    phone: '13800138004',
    status: 'active',
  },
];

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(mockData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // 打开新增/编辑模态框
  const openModal = (record?: any) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue({
        user_code: record.user_code,
        user_name: record.user_name,
        role_id: record.role_id,
        dept_id: record.dept_id,
        phone: record.phone,
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingRecord) {
        // 编辑模式
        setData(data.map((item) => (item.key === editingRecord.key ? {
          ...item,
          ...values,
          role_name: roleOptions.find(r => r.value === values.role_id)?.label,
          dept_name: deptOptions.find(d => d.value === values.dept_id)?.label,
        } : item)));
        message.success('修改成功');
      } else {
        // 新增模式
        const newRecord = {
          key: String(data.length + 1),
          user_id: data.length + 1,
          ...values,
          role_name: roleOptions.find(r => r.value === values.role_id)?.label,
          dept_name: deptOptions.find(d => d.value === values.dept_id)?.label,
          status: 'active',
        };
        setData([...data, newRecord]);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 切换用户状态
  const toggleStatus = (record: any) => {
    setData(data.map((item) => (item.key === record.key ? {
      ...item,
      status: item.status === 'active' ? 'inactive' : 'active',
    } : item)));
    message.success(`${record.user_name} ${record.status === 'active' ? '已禁用' : '已启用'}`);
  };

  // 删除用户
  const deleteUser = (record: any) => {
    setData(data.filter((item) => item.key !== record.key));
    message.success('删除成功');
  };

  // 表格列定义
  const columns = [
    {
      title: '用户编码',
      dataIndex: 'user_code',
      key: 'user_code',
    },
    {
      title: '用户名称',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '角色',
      dataIndex: 'role_name',
      key: 'role_name',
      render: (roleName: string) => <Tag color="blue">{roleName}</Tag>,
    },
    {
      title: '部门',
      dataIndex: 'dept_name',
      key: 'dept_name',
      render: (deptName: string) => <Tag color="green">{deptName}</Tag>,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 'red';
        return <Tag color={color}>{status === 'active' ? '启用' : '禁用'}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Button
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => toggleStatus(record)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteUser(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="用户角色权限管理" bordered={false}>
        <div style={{ marginBottom: '24px', textAlign: 'right' }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal()}
          >
            新增用户
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />

        {/* 新增/编辑模态框 */}
        <Modal
          title={editingRecord ? '编辑用户' : '新增用户'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
            >
              确定
            </Button>,
          ]}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="user_code"
              label="用户编码"
              rules={[{ required: true, message: '请输入用户编码' }]}
            >
              <Input placeholder="请输入用户编码" />
            </Form.Item>
            <Form.Item
              name="user_name"
              label="用户名称"
              rules={[{ required: true, message: '请输入用户名称' }]}
            >
              <Input placeholder="请输入用户名称" />
            </Form.Item>
            <Form.Item
              name="role_id"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                {roleOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="dept_id"
              label="部门"
              rules={[{ required: true, message: '请选择部门' }]}
            >
              <Select placeholder="请选择部门">
                {deptOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="phone"
              label="电话"
              rules={[{ required: true, message: '请输入电话' }]}
            >
              <Input placeholder="请输入电话" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default App;