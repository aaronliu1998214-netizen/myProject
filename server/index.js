const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { readData, saveData, generateId, getCurrentTime } = require('./dataStore');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 确保uploads目录存在
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// 模拟JWT验证中间件
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ code: 401, message: '未提供认证token' });
  }
  // 模拟从token解析用户
  req.user = {
    user_id: 1,
    user_name: '张三',
    role_id: 1,
  };
  next();
}

// ==================== 物资管理相关接口 ====================

// 获取物资管理首页概览数据
app.get('/api/material/overview', authMiddleware, (req, res) => {
  const data = readData();
  
  // 统计数据
  const sparePartsInStock = data.spareParts.filter(sp => {
    const material = data.materials.find(m => m.material_id === sp.material_id);
    return material && material.status === 'INSTOCKED';
  }).length;
  
  const equipmentInStock = data.equipment.filter(eq => {
    const material = data.materials.find(m => m.material_id === eq.material_id);
    return material && material.status === 'INSTOCKED';
  }).length;
  
  const todayNewInStock = data.materials.filter(m => {
    const today = new Date().toISOString().split('T')[0];
    return m.create_time.startsWith(today) && m.status === 'PENDING_INSTOCK';
  }).length;
  
  const pendingApproval = data.outstockApplies.filter(a => 
    a.approval_status === 'PENDING_LV1' || a.approval_status === 'PENDING_LV2'
  ).length;
  
  const todayOutStock = data.materials.filter(m => {
    const today = new Date().toISOString().split('T')[0];
    return m.outstock_time && m.outstock_time.startsWith(today);
  }).length;

  // 根据角色获取待办事项
  const todos = [];
  switch (req.user.role_id) {
    case 1: // 物资录入员
      todos.push(
        { id: 1, title: '驳回申请处理', description: '3个备品备件入库申请需要重新审核', role: '录入员' },
        { id: 2, title: '待审批结果', description: '5个出库申请等待审批结果', role: '录入员' }
      );
      break;
    case 2: // 一级审批人
      todos.push(
        { id: 1, title: '待一级审批', description: '5个出库申请等待一级审批', role: '审批人' },
        { id: 2, title: '已处理审批', description: '查看本人处理过的审批记录', role: '审批人' }
      );
      break;
    case 3: // 二级审批人
      todos.push(
        { id: 1, title: '待二级审批', description: '3个出库申请等待二级审批', role: '审批人' },
        { id: 2, title: '已处理审批', description: '查看本人处理过的审批记录', role: '审批人' }
      );
      break;
    case 4: // 物资管理员
      todos.push(
        { id: 1, title: '待入库核验', description: '8个物资需要入库核验', role: '管理员' },
        { id: 2, title: '待出库确认', description: '5个出库申请需要确认', role: '管理员' }
      );
      break;
    case 5: // 系统管理员
      todos.push(
        { id: 1, title: '用户管理', description: '管理系统用户、角色及权限', role: '系统管理员' },
        { id: 2, title: '系统配置', description: '维护系统基础配置', role: '系统管理员' }
      );
      break;
  }

  res.json({
    code: 200,
    data: {
      metrics: {
        sparePartsInStock,
        equipmentInStock,
        todayNewInStock,
        pendingApproval,
        todayOutStock,
      },
      todos,
    },
    message: 'success',
  });
});

// ==================== 入库管理相关接口 ====================

// 备品备件入库
app.post('/api/material/spare/instock', authMiddleware, (req, res) => {
  const data = readData();
  const { 
    spare_type, brand, spec, supplier, purchase_price,
    part_number, serial_number, instock_time, operateType, material_id 
  } = req.body;

  // 序列号唯一性校验
  const partNumberExists = data.spareParts.some(sp => 
    sp.part_number === part_number && sp.material_id !== material_id
  );
  if (partNumberExists) {
    return res.status(400).json({ code: 400, message: '备件号已存在' });
  }

  const serialNumberExists = data.spareParts.some(sp => 
    sp.serial_number === serial_number && sp.material_id !== material_id
  );
  if (serialNumberExists) {
    return res.status(400).json({ code: 400, message: '序列号已存在' });
  }

  let materialId = material_id;
  
  if (material_id) {
    // 编辑模式
    const material = data.materials.find(m => m.material_id === material_id);
    if (!material) {
      return res.status(404).json({ code: 404, message: '物资不存在' });
    }
    if (material.status !== 'PENDING_INSTOCK') {
      return res.status(400).json({ code: 400, message: '已入库状态不可修改' });
    }
    
    // 更新备品备件信息
    const spareIndex = data.spareParts.findIndex(sp => sp.material_id === material_id);
    if (spareIndex !== -1) {
      data.spareParts[spareIndex] = {
        ...data.spareParts[spareIndex],
        spare_type, brand, spec, supplier, purchase_price,
        part_number, serial_number, instock_time,
      };
    }
  } else {
    // 新增模式
    materialId = generateId();
    const newMaterial = {
      material_id: materialId,
      material_type: 'SPARE',
      status: operateType === 'submitVerify' ? 'PENDING_INSTOCK' : 'DRAFT',
      create_user_id: req.user.user_id,
      create_time: getCurrentTime(),
      verify_user_id: null,
      verify_time: null,
      outstock_user_id: null,
      outstock_time: null,
      remark: '',
    };
    
    const newSpare = {
      spare_id: generateId(),
      material_id: materialId,
      spare_type, brand, spec, supplier, purchase_price,
      part_number, serial_number, instock_time,
    };
    
    data.materials.push(newMaterial);
    data.spareParts.push(newSpare);
    
    // 记录流转日志
    data.flowLogs.push({
      log_id: generateId(),
      material_id: materialId,
      pre_status: '',
      next_status: operateType === 'submitVerify' ? 'PENDING_INSTOCK' : 'DRAFT',
      operate_user_id: req.user.user_id,
      operate_time: getCurrentTime(),
      remark: operateType === 'submitVerify' ? '提交入库申请' : '保存草稿',
    });
  }
  
  saveData(data);
  
  res.json({
    code: 200,
    data: {
      material_id: materialId,
      status: operateType === 'submitVerify' ? 'PENDING_INSTOCK' : 'DRAFT',
    },
    message: operateType === 'submitVerify' ? '提交成功' : '草稿保存成功',
  });
});

// 材料设备入库
app.post('/api/material/equip/instock', authMiddleware, (req, res) => {
  const data = readData();
  const { 
    project_name, project_code, material_name, model, unit,
    purchase_num, unit_price, supplier, instock_num, instock_time,
    operateType, material_id 
  } = req.body;

  // 入库数量校验
  if (instock_num > purchase_num) {
    return res.status(400).json({ code: 400, message: '入库数量不能大于采购数量' });
  }

  let materialId = material_id;
  const subtotal = unit_price * purchase_num;
  
  if (material_id) {
    // 编辑模式
    const material = data.materials.find(m => m.material_id === material_id);
    if (!material) {
      return res.status(404).json({ code: 404, message: '物资不存在' });
    }
    if (material.status !== 'PENDING_INSTOCK') {
      return res.status(400).json({ code: 400, message: '已入库状态不可修改' });
    }
    
    // 更新材料设备信息
    const equipIndex = data.equipment.findIndex(eq => eq.material_id === material_id);
    if (equipIndex !== -1) {
      data.equipment[equipIndex] = {
        ...data.equipment[equipIndex],
        project_name, project_code, material_name, model, unit,
        purchase_num, unit_price, subtotal, supplier, instock_num,
        used_num: 0,
        instock_time,
      };
    }
  } else {
    // 新增模式
    materialId = generateId();
    const newMaterial = {
      material_id: materialId,
      material_type: 'EQUIP',
      status: operateType === 'submitVerify' ? 'PENDING_INSTOCK' : 'DRAFT',
      create_user_id: req.user.user_id,
      create_time: getCurrentTime(),
      verify_user_id: null,
      verify_time: null,
      outstock_user_id: null,
      outstock_time: null,
      remark: '',
    };
    
    const newEquip = {
      equip_id: generateId(),
      material_id: materialId,
      project_name, project_code, material_name, model, unit,
      purchase_num, unit_price, subtotal, supplier, instock_num,
      used_num: 0,
      instock_time,
    };
    
    data.materials.push(newMaterial);
    data.equipment.push(newEquip);
    
    // 记录流转日志
    data.flowLogs.push({
      log_id: generateId(),
      material_id: materialId,
      pre_status: '',
      next_status: operateType === 'submitVerify' ? 'PENDING_INSTOCK' : 'DRAFT',
      operate_user_id: req.user.user_id,
      operate_time: getCurrentTime(),
      remark: operateType === 'submitVerify' ? '提交入库申请' : '保存草稿',
    });
  }
  
  saveData(data);
  
  res.json({
    code: 200,
    data: {
      material_id: materialId,
      status: operateType === 'submitVerify' ? 'PENDING_INSTOCK' : 'DRAFT',
    },
    message: operateType === 'submitVerify' ? '提交成功' : '草稿保存成功',
  });
});

// 物资入库核验
app.put('/api/material/verify/:id', authMiddleware, (req, res) => {
  const data = readData();
  const { id } = req.params;
  const { verify_opinion } = req.body;
  
  const material = data.materials.find(m => m.material_id === parseInt(id));
  if (!material) {
    return res.status(404).json({ code: 404, message: '物资不存在' });
  }
  
  if (material.status !== 'PENDING_INSTOCK') {
    return res.status(400).json({ code: 400, message: '物资状态不允许核验' });
  }
  
  // 更新物资状态
  material.status = 'INSTOCKED';
  material.verify_user_id = req.user.user_id;
  material.verify_time = getCurrentTime();
  material.remark = verify_opinion;
  
  // 记录流转日志
  data.flowLogs.push({
    log_id: generateId(),
    material_id: material.material_id,
    pre_status: 'PENDING_INSTOCK',
    next_status: 'INSTOCKED',
    operate_user_id: req.user.user_id,
    operate_time: getCurrentTime(),
    remark: verify_opinion || '入库核验通过',
  });
  
  saveData(data);
  
  res.json({
    code: 200,
    data: {
      status: 'INSTOCKED',
    },
    message: '核验成功',
  });
});

// ==================== 出库申请审批相关接口 ====================

// 发起物资出库申请
app.post('/api/material/outstock/apply', authMiddleware, (req, res) => {
  const data = readData();
  const { material_id, outstock_type, outstock_info, attach_url } = req.body;
  
  const material = data.materials.find(m => m.material_id === material_id);
  if (!material) {
    return res.status(404).json({ code: 404, message: '物资不存在' });
  }
  
  if (material.status !== 'INSTOCKED') {
    return res.status(400).json({ code: 400, message: '物资不在库，无法申请出库' });
  }
  
  // 校验出库数量
  if (outstock_type === 'EQUIP') {
    const equip = data.equipment.find(eq => eq.material_id === material_id);
    if (equip && outstock_info.outstock_num > (equip.instock_num - equip.used_num)) {
      return res.status(400).json({ code: 400, message: '出库数量不能超过当前在库数量' });
    }
  }
  
  const applyId = generateId();
  const newApply = {
    apply_id: applyId,
    material_id,
    apply_user_id: req.user.user_id,
    apply_time: getCurrentTime(),
    outstock_type,
    outstock_info,
    attach_url,
    approval_status: 'PENDING_LV1',
    is_latest: 1,
  };
  
  data.outstockApplies.push(newApply);
  
  // 记录流转日志
  data.flowLogs.push({
    log_id: generateId(),
    material_id,
    pre_status: 'INSTOCKED',
    next_status: 'PENDING_LV1',
    operate_user_id: req.user.user_id,
    operate_time: getCurrentTime(),
    remark: '发起出库申请',
  });
  
  saveData(data);
  
  res.json({
    code: 200,
    data: {
      apply_id: applyId,
      approval_status: 'PENDING_LV1',
    },
    message: '申请提交成功',
  });
});

// 查询本人出库申请列表
app.get('/api/material/outstock/my-list', authMiddleware, (req, res) => {
  const data = readData();
  const { approval_status, keyword, pageNum = 1, pageSize = 10 } = req.query;
  
  let filtered = data.outstockApplies.filter(a => a.apply_user_id === req.user.user_id);
  
  if (approval_status) {
    filtered = filtered.filter(a => a.approval_status === approval_status);
  }
  
  if (keyword) {
    filtered = filtered.filter(a => {
      const material = data.materials.find(m => m.material_id === a.material_id);
      if (!material) return false;
      
      if (material.material_type === 'SPARE') {
        const spare = data.spareParts.find(sp => sp.material_id === a.material_id);
        return spare && (
          spare.brand.includes(keyword) ||
          spare.spec.includes(keyword) ||
          spare.part_number.includes(keyword)
        );
      } else {
        const equip = data.equipment.find(eq => eq.material_id === a.material_id);
        return equip && (
          equip.material_name.includes(keyword) ||
          equip.project_name.includes(keyword)
        );
      }
    });
  }
  
  const total = filtered.length;
  const start = (pageNum - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filtered.slice(start, end);
  
  // 补充物资信息
  const enrichedList = list.map(a => {
    const material = data.materials.find(m => m.material_id === a.material_id);
    let materialInfo = {};
    
    if (material.material_type === 'SPARE') {
      const spare = data.spareParts.find(sp => sp.material_id === a.material_id);
      materialInfo = {
        materialCode: spare?.part_number,
        materialName: `${spare?.brand} ${spare?.spec}`,
        materialType: '备品备件',
      };
    } else {
      const equip = data.equipment.find(eq => eq.material_id === a.material_id);
      materialInfo = {
        materialCode: equip?.project_code,
        materialName: equip?.material_name,
        materialType: '材料设备',
      };
    }
    
    return {
      ...a,
      ...materialInfo,
      status: a.approval_status,
    };
  });
  
  res.json({
    code: 200,
    data: {
      list: enrichedList,
      total,
      pageNum: parseInt(pageNum),
      pageSize: parseInt(pageSize),
    },
    message: 'success',
  });
});

// 查询待审批出库申请列表
app.get('/api/approval/list', authMiddleware, (req, res) => {
  const data = readData();
  const { approval_node, pageNum = 1, pageSize = 10 } = req.query;
  
  let filtered = data.outstockApplies;
  
  if (approval_node === 'LEVEL1') {
    filtered = filtered.filter(a => a.approval_status === 'PENDING_LV1');
  } else if (approval_node === 'LEVEL2') {
    filtered = filtered.filter(a => a.approval_status === 'PENDING_LV2');
  }
  
  const total = filtered.length;
  const start = (pageNum - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filtered.slice(start, end);
  
  // 补充物资和申请人信息
  const enrichedList = list.map(a => {
    const material = data.materials.find(m => m.material_id === a.material_id);
    const applicant = data.users.find(u => u.user_id === a.apply_user_id);
    let materialInfo = {};
    
    if (material.material_type === 'SPARE') {
      const spare = data.spareParts.find(sp => sp.material_id === a.material_id);
      materialInfo = {
        materialCode: spare?.part_number,
        materialName: `${spare?.brand} ${spare?.spec}`,
        materialType: '备品备件',
      };
    } else {
      const equip = data.equipment.find(eq => eq.material_id === a.material_id);
      materialInfo = {
        materialCode: equip?.project_code,
        materialName: equip?.material_name,
        materialType: '材料设备',
      };
    }
    
    return {
      ...a,
      ...materialInfo,
      applicantId: applicant?.user_code,
      applicantName: applicant?.user_name,
    };
  });
  
  res.json({
    code: 200,
    data: {
      list: enrichedList,
      total,
      pageNum: parseInt(pageNum),
      pageSize: parseInt(pageSize),
    },
    message: 'success',
  });
});

// 处理出库审批
app.put('/api/approval/handle/:id', authMiddleware, (req, res) => {
  const data = readData();
  const { id } = req.params;
  const { operate_type, approval_opinion, reject_reason } = req.body;
  
  const apply = data.outstockApplies.find(a => a.apply_id === parseInt(id));
  if (!apply) {
    return res.status(404).json({ code: 404, message: '申请不存在' });
  }
  
  if (operate_type === 'REJECT') {
    if (!reject_reason || reject_reason.length < 5) {
      return res.status(400).json({ code: 400, message: '驳回原因至少5个字' });
    }
    apply.approval_status = 'REJECTED';
  } else if (operate_type === 'APPROVE') {
    if (apply.approval_status === 'PENDING_LV1') {
      apply.approval_status = 'PENDING_LV2';
    } else if (apply.approval_status === 'PENDING_LV2') {
      apply.approval_status = 'APPROVED';
    }
  }
  
  // 记录审批记录
  data.approvalRecords.push({
    record_id: generateId(),
    apply_id: parseInt(id),
    approval_node: apply.approval_status === 'PENDING_LV2' ? 'LEVEL1' : 'LEVEL2',
    operate_user_id: req.user.user_id,
    operate_type,
    operate_time: getCurrentTime(),
    approval_opinion,
    reject_reason,
  });
  
  // 记录流转日志
  data.flowLogs.push({
    log_id: generateId(),
    material_id: apply.material_id,
    pre_status: apply.approval_status === 'PENDING_LV2' ? 'PENDING_LV1' : 'PENDING_LV2',
    next_status: apply.approval_status,
    operate_user_id: req.user.user_id,
    operate_time: getCurrentTime(),
    remark: operate_type === 'APPROVE' ? '审批通过' : `驳回: ${reject_reason}`,
  });
  
  saveData(data);
  
  res.json({
    code: 200,
    data: {
      approval_status: apply.approval_status,
    },
    message: operate_type === 'APPROVE' ? '审批通过' : '已驳回',
  });
});

// 查询待确认出库申请列表
app.get('/api/material/outstock/pending-confirm', authMiddleware, (req, res) => {
  const data = readData();
  const { keyword, material_type, pageNum = 1, pageSize = 10 } = req.query;
  
  let filtered = data.outstockApplies.filter(a => a.approval_status === 'APPROVED');
  
  if (material_type) {
    filtered = filtered.filter(a => a.outstock_type === material_type);
  }
  
  if (keyword) {
    filtered = filtered.filter(a => {
      const material = data.materials.find(m => m.material_id === a.material_id);
      if (!material) return false;
      
      if (material.material_type === 'SPARE') {
        const spare = data.spareParts.find(sp => sp.material_id === a.material_id);
        return spare && (
          spare.brand.includes(keyword) ||
          spare.spec.includes(keyword)
        );
      } else {
        const equip = data.equipment.find(eq => eq.material_id === a.material_id);
        return equip && equip.material_name.includes(keyword);
      }
    });
  }
  
  const total = filtered.length;
  const start = (pageNum - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filtered.slice(start, end);
  
  // 补充物资信息
  const enrichedList = list.map(a => {
    const material = data.materials.find(m => m.material_id === a.material_id);
    let materialInfo = {};
    
    if (material.material_type === 'SPARE') {
      const spare = data.spareParts.find(sp => sp.material_id === a.material_id);
      materialInfo = {
        materialCode: spare?.part_number,
        materialName: `${spare?.brand} ${spare?.spec}`,
        materialType: '备品备件',
        currentStock: 1,
        applyQuantity: 1,
      };
    } else {
      const equip = data.equipment.find(eq => eq.material_id === a.material_id);
      materialInfo = {
        materialCode: equip?.project_code,
        materialName: equip?.material_name,
        materialType: '材料设备',
        currentStock: equip.instock_num - equip.used_num,
        applyQuantity: a.outstock_info.outstock_num,
      };
    }
    
    return {
      ...a,
      ...materialInfo,
    };
  });
  
  res.json({
    code: 200,
    data: {
      list: enrichedList,
      total,
      pageNum: parseInt(pageNum),
      pageSize: parseInt(pageSize),
    },
    message: 'success',
  });
});

// 出库确认
app.put('/api/material/outstock/confirm/:id', authMiddleware, (req, res) => {
  const data = readData();
  const { id } = req.params;
  const { outstock_opinion } = req.body;
  
  if (!outstock_opinion) {
    return res.status(400).json({ code: 400, message: '出库确认意见不能为空' });
  }
  
  const apply = data.outstockApplies.find(a => a.apply_id === parseInt(id));
  if (!apply) {
    return res.status(404).json({ code: 404, message: '申请不存在' });
  }
  
  if (apply.approval_status !== 'APPROVED') {
    return res.status(400).json({ code: 400, message: '申请未通过审批，无法确认出库' });
  }
  
  const material = data.materials.find(m => m.material_id === apply.material_id);
  if (!material) {
    return res.status(404).json({ code: 404, message: '物资不存在' });
  }
  
  // 更新物资状态
  material.status = 'OUTSTOCKED';
  material.outstock_user_id = req.user.user_id;
  material.outstock_time = getCurrentTime();
  material.remark = outstock_opinion;
  
  // 更新材料设备已出数量
  if (material.material_type === 'EQUIP') {
    const equip = data.equipment.find(eq => eq.material_id === apply.material_id);
    if (equip) {
      equip.used_num += apply.outstock_info.outstock_num;
    }
  }
  
  // 更新申请状态
  apply.approval_status = 'CONFIRMED';
  
  // 记录流转日志
  data.flowLogs.push({
    log_id: generateId(),
    material_id: apply.material_id,
    pre_status: 'APPROVED',
    next_status: 'OUTSTOCKED',
    operate_user_id: req.user.user_id,
    operate_time: getCurrentTime(),
    remark: outstock_opinion,
  });
  
  saveData(data);
  
  res.json({
    code: 200,
    data: {
      status: 'OUTSTOCKED',
    },
    message: '出库确认成功',
  });
});

// ==================== 物资查询相关接口 ====================

// 物资全量查询
app.get('/api/material/list', authMiddleware, (req, res) => {
  const data = readData();
  const { material_type, status, startTime, endTime, keyword, pageNum = 1, pageSize = 10 } = req.query;
  
  let filtered = [...data.materials];
  
  if (material_type) {
    filtered = filtered.filter(m => m.material_type === material_type);
  }
  
  if (status) {
    filtered = filtered.filter(m => m.status === status);
  }
  
  if (startTime && endTime) {
    filtered = filtered.filter(m => {
      return m.create_time >= startTime && m.create_time <= endTime;
    });
  }
  
  if (keyword) {
    filtered = filtered.filter(m => {
      if (m.material_type === 'SPARE') {
        const spare = data.spareParts.find(sp => sp.material_id === m.material_id);
        return spare && (
          spare.part_number.toLowerCase().includes(keyword.toLowerCase()) ||
          spare.serial_number.toLowerCase().includes(keyword.toLowerCase()) ||
          `${spare.brand} ${spare.spec}`.toLowerCase().includes(keyword.toLowerCase())
        );
      } else {
        const equip = data.equipment.find(eq => eq.material_id === m.material_id);
        return equip && (
          equip.project_code.toLowerCase().includes(keyword.toLowerCase()) ||
          equip.project_name.toLowerCase().includes(keyword.toLowerCase()) ||
          equip.material_name.toLowerCase().includes(keyword.toLowerCase())
        );
      }
    });
  }
  
  const total = filtered.length;
  const start = (pageNum - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filtered.slice(start, end);
  
  // 补充物资详情
  const enrichedList = list.map(m => {
    let details = {};
    let quantityInfo = {};
    
    if (m.material_type === 'SPARE') {
      const spare = data.spareParts.find(sp => sp.material_id === m.material_id);
      details = {
        info: `${spare?.brand} ${spare?.spec}`,
        spareDetails: spare,
      };
      quantityInfo = {
        inStock: 1,
        outStock: m.status === 'OUTSTOCKED' ? 1 : 0,
        remaining: m.status === 'OUTSTOCKED' ? 0 : 1,
      };
    } else {
      const equip = data.equipment.find(eq => eq.material_id === m.material_id);
      details = {
        info: equip?.material_name,
        equipDetails: equip,
      };
      quantityInfo = {
        inStock: equip?.instock_num,
        outStock: equip?.used_num,
        remaining: equip?.instock_num - equip?.used_num,
      };
    }
    
    return {
      ...m,
      ...details,
      ...quantityInfo,
    };
  });
  
  res.json({
    code: 200,
    data: {
      list: enrichedList,
      total,
      pageNum: parseInt(pageNum),
      pageSize: parseInt(pageSize),
    },
    message: 'success',
  });
});

// 查询物资台账详情
app.get('/api/material/detail/:id', authMiddleware, (req, res) => {
  const data = readData();
  const { id } = req.params;
  
  const material = data.materials.find(m => m.material_id === parseInt(id));
  if (!material) {
    return res.status(404).json({ code: 404, message: '物资不存在' });
  }
  
  let details = {};
  if (material.material_type === 'SPARE') {
    const spare = data.spareParts.find(sp => sp.material_id === material.material_id);
    details = { spareDetails: spare };
  } else {
    const equip = data.equipment.find(eq => eq.material_id === material.material_id);
    details = { equipDetails: equip };
  }
  
  // 获取出库申请记录
  const outstockApplies = data.outstockApplies.filter(a => a.material_id === material.material_id);
  
  // 获取审批记录
  const approvalRecords = data.approvalRecords.filter(r => {
    const apply = outstockApplies.find(a => a.apply_id === r.apply_id);
    return apply !== undefined;
  });
  
  // 获取流转记录
  const flowLogs = data.flowLogs.filter(l => l.material_id === material.material_id);
  
  res.json({
    code: 200,
    data: {
      material,
      ...details,
      outstockApplies,
      approvalRecords,
      flowLogs,
    },
    message: 'success',
  });
});

// ==================== 数据分析和报表导出接口 ====================

// 获取数据分析仪表板数据
app.get('/api/material/analytics', authMiddleware, (req, res) => {
  const data = readData();
  const { timeRange, material_type, startTime, endTime } = req.query;
  
  // 统计数据
  const sparePartsInStock = data.spareParts.filter(sp => {
    const material = data.materials.find(m => m.material_id === sp.material_id);
    return material && material.status === 'INSTOCKED';
  }).length;
  
  const equipmentInStock = data.equipment.filter(eq => {
    const material = data.materials.find(m => m.material_id === eq.material_id);
    return material && material.status === 'INSTOCKED';
  }).length;
  
  const pendingVerification = data.materials.filter(m => m.status === 'PENDING_INSTOCK').length;
  const pendingApproval = data.outstockApplies.filter(a => 
    a.approval_status === 'PENDING_LV1' || a.approval_status === 'PENDING_LV2'
  ).length;
  const totalOutbound = data.materials.filter(m => m.status === 'OUTSTOCKED').length;
  
  // 饼图数据
  const pieData = [
    { type: '备品备件-待入库', value: data.spareParts.filter(sp => {
      const m = data.materials.find(mat => mat.material_id === sp.material_id);
      return m && m.status === 'PENDING_INSTOCK';
    }).length },
    { type: '备品备件-已入库', value: data.spareParts.filter(sp => {
      const m = data.materials.find(mat => mat.material_id === sp.material_id);
      return m && m.status === 'INSTOCKED';
    }).length },
    { type: '备品备件-已出库', value: data.spareParts.filter(sp => {
      const m = data.materials.find(mat => mat.material_id === sp.material_id);
      return m && m.status === 'OUTSTOCKED';
    }).length },
    { type: '材料设备-待入库', value: data.equipment.filter(eq => {
      const m = data.materials.find(mat => mat.material_id === eq.material_id);
      return m && m.status === 'PENDING_INSTOCK';
    }).length },
    { type: '材料设备-已入库', value: data.equipment.filter(eq => {
      const m = data.materials.find(mat => mat.material_id === eq.material_id);
      return m && m.status === 'INSTOCKED';
    }).length },
    { type: '材料设备-已出库', value: data.equipment.filter(eq => {
      const m = data.materials.find(mat => mat.material_id === eq.material_id);
      return m && m.status === 'OUTSTOCKED';
    }).length },
  ];
  
  // 折线图数据（模拟）
  const lineData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    lineData.push({
      date: dateStr,
      inStock: Math.floor(Math.random() * 10) + 1,
      outStock: Math.floor(Math.random() * 5) + 1,
    });
  }
  
  // 柱状图数据
  const brandCount = {};
  data.spareParts.forEach(sp => {
    brandCount[sp.brand] = (brandCount[sp.brand] || 0) + 1;
  });
  const barData = Object.entries(brandCount).map(([name, value]) => ({ name, value }));
  
  res.json({
    code: 200,
    data: {
      metrics: {
        sparePartsInStock,
        equipmentInStock,
        pendingVerification,
        pendingApproval,
        totalOutbound,
        stockSnapshot: {
          in: data.materials.filter(m => m.status === 'INSTOCKED').length,
          out: data.materials.filter(m => m.status === 'OUTSTOCKED').length,
          remaining: data.materials.filter(m => m.status === 'INSTOCKED').length,
        },
      },
      charts: {
        pie: pieData,
        line: lineData,
        bar: barData,
      },
    },
    message: 'success',
  });
});

// 导出物资管理报表
app.get('/api/material/export', authMiddleware, (req, res) => {
  const { exportType } = req.query;
  
  // 模拟生成文件
  const fileName = `material_report_${Date.now()}.${exportType}`;
  const downloadUrl = `http://localhost:${PORT}/downloads/${fileName}`;
  
  res.json({
    code: 200,
    data: {
      downloadUrl,
      fileName,
    },
    message: '导出成功',
  });
});

// ==================== 文件上传接口 ====================

// 上传附件
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '未上传文件' });
  }
  
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  
  res.json({
    code: 200,
    data: {
      fileName: req.file.originalname,
      fileUrl,
    },
    message: '上传成功',
  });
});

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 启动服务器
app.listen(PORT, () => {
  console.log(`物资管理系统后端服务启动成功，端口: ${PORT}`);
  console.log(`API文档: http://localhost:${PORT}/api`);
});