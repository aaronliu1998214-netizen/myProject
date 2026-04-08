const fs = require('fs');
const path = require('path');

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data.json');

// 初始数据结构
const initialData = {
  materials: [],
  spareParts: [],
  equipment: [],
  outstockApplies: [],
  approvalRecords: [],
  flowLogs: [],
  users: [
    {
      user_id: 1,
      user_name: '张三',
      user_code: 'zhangsan',
      password: '123456',
      role_id: 1,
      dept_id: 1,
      dept_name: '技术部',
      phone: '13800138000',
      create_time: '2024-01-01 10:00:00',
      status: 'active',
      permissions: [
        'material:spare:create',
        'material:spare:edit',
        'material:equip:create',
        'material:equip:edit',
        'outstock:apply',
      ],
    },
    {
      user_id: 2,
      user_name: '李四',
      user_code: 'lisi',
      password: '123456',
      role_id: 2,
      dept_id: 1,
      dept_name: '技术部',
      phone: '13800138001',
      create_time: '2024-01-02 10:00:00',
      status: 'active',
      permissions: ['approval:level1'],
    },
    {
      user_id: 3,
      user_name: '王五',
      user_code: 'wangwu',
      password: '123456',
      role_id: 3,
      dept_id: 2,
      dept_name: '采购部',
      phone: '13800138002',
      create_time: '2024-01-03 10:00:00',
      status: 'active',
      permissions: ['approval:level2'],
    },
    {
      user_id: 4,
      user_name: '赵六',
      user_code: 'zhaoliu',
      password: '123456',
      role_id: 4,
      dept_id: 3,
      dept_name: '管理部',
      phone: '13800138003',
      create_time: '2024-01-04 10:00:00',
      status: 'active',
      permissions: ['material:verify', 'outstock:confirm', 'material:query', 'analysis:view'],
    },
    {
      user_id: 5,
      user_name: '孙七',
      user_code: 'sunqi',
      password: '123456',
      role_id: 5,
      dept_id: 3,
      dept_name: '管理部',
      phone: '13800138004',
      create_time: '2024-01-05 10:00:00',
      status: 'active',
      permissions: ['user:manage', 'system:config', 'report:export'],
    },
  ],
  depts: [
    { dept_id: 1, dept_name: '技术部' },
    { dept_id: 2, dept_name: '采购部' },
    { dept_id: 3, dept_name: '管理部' },
  ],
};

// 读取数据
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return { ...initialData };
  } catch (error) {
    console.error('读取数据失败:', error);
    return { ...initialData };
  }
}

// 保存数据
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

// 生成唯一ID
function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// 获取当前时间
function getCurrentTime() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

module.exports = {
  readData,
  saveData,
  generateId,
  getCurrentTime,
  initialData,
};