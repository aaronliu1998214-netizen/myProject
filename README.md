# 物资管理系统

## 项目概述

本项目是一个基于 React + Node.js 的企业级物资管理系统,提供物资入库、出库、审批、核验等全流程管理功能。

## 项目结构

```
myapp/
├── config/                  # 配置文件目录
│   ├── config.ts           # 主配置文件
│   ├── routes.ts           # 路由配置
│   ├── proxy.ts            # 代理配置
│   └── defaultSettings.ts  # 默认设置
├── mock/                   # Mock数据
├── public/                 # 静态资源
├── server/                 # 后端服务
│   ├── index.js            # 后端主入口
│   ├── dataStore.js        # 数据存储模块
│   ├── package.json        # 后端依赖配置
│   └── data.json           # 数据存储文件
├── src/                    # 前端源码
│   ├── assets/             # 资源文件
│   ├── components/         # 公共组件
│   ├── locales/            # 国际化文件
│   └── pages/              # 页面组件
│       └── materials/      # 物资管理模块
│           ├── dashboard/          # 物资台账首页
│           ├── spare-parts/        # 备品备件入库
│           ├── equipment/          # 材料设备入库
│           ├── verification/       # 入库核验
│           ├── outbound/           # 出库申请
│           ├── search/             # 物资查询
│           ├── analysis/           # 数据分析
│           └── user-management/     # 用户角色权限管理
└── package.json            # 前端依赖配置
```

## 技术栈选型

### 物资管理模块技术栈

| 技术分类 | 技术选型 | 版本 | 说明 |
|---------|---------|------|------|
| **前端框架** | React | 18.2.0 | 用于构建用户界面的JavaScript库 |
| **UI组件库** | Ant Design | 5.12.7 | 企业级UI设计语言和React组件库 |
| | @ant-design/pro-components | 2.6.44 | 高级业务组件库,提供ProTable、ProForm等 |
| **图表库** | ECharts | 5.6.0 | 数据可视化图表库 |
| | @ant-design/plots | 2.1.5 | Ant Design图表组件库 |
| **后端语言** | Node.js | >=12.0.0 | JavaScript运行时环境 |
| **后端框架** | Express | 4.18.2 | Web应用框架 |
| **数据存储** | JSON文件 | - | 用于模拟数据库存储 |
| **构建工具** | UmiJS Max | 4.1.0 | 企业级前端应用框架 |
| **状态管理** | React Hooks | - | React内置状态管理 |
| **HTTP客户端** | Fetch API | - | 浏览器内置API |
| **日期处理** | dayjs | 1.11.10 | 轻量级日期处理库 |

## 构建步骤

### 前置要求

- Node.js >= 12.0.0
- npm 或 pnpm

### 安装依赖

```bash
# 安装前端依赖
npm install

# 或使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
# 启动前端开发服务器
npm run start:dev

# 启动后端服务
cd server
npm install
npm start
```

前端服务默认运行在 `http://localhost:8000`
后端服务默认运行在 `http://localhost:3001`

### 构建生产版本

```bash
# 构建前端生产版本
npm run build

# 构建产物将生成在 dist 目录
```

### 代码检查

```bash
# 运行ESLint检查
npm run lint

# 运行TypeScript类型检查
npm run tsc

# 自动修复代码格式
npm run lint:fix
```

## 部署流程

### 前端部署

1. **构建生产版本**
```bash
npm run build
```

2. **部署到静态服务器**
```bash
# 将 dist 目录部署到 Nginx、Apache 或其他静态服务器
# 配置服务器支持 SPA 路由,所有请求重定向到 index.html
```

3. **Nginx 配置示例**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 后端部署

1. **安装依赖**
```bash
cd server
npm install --production
```

2. **使用 PM2 启动服务**
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start index.js --name material-server

# 查看服务状态
pm2 status

# 查看日志
pm2 logs material-server
```

3. **配置环境变量**
```bash
# 创建 .env 文件
PORT=3001
NODE_ENV=production
```

4. **配置反向代理**
```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 物资状态流转规则

### 物资状态定义

| 状态代码 | 状态名称 | 说明 |
|---------|---------|------|
| DRAFT | 草稿 | 物资信息已保存但未提交审核 |
| PENDING_INSTOCK | 待入库 | 物资已提交入库申请,等待核验 |
| INSTOCKED | 已入库 | 物资已完成入库核验,在库中 |
| PENDING_LV1 | 待一级审批 | 出库申请等待一级审批 |
| PENDING_LV2 | 待二级审批 | 出库申请等待二级审批 |
| APPROVED | 已审批 | 出库申请已通过所有审批 |
| REJECTED | 已驳回 | 出库申请被驳回 |
| OUTSTOCKED | 已出库 | 物资已出库 |

### 物资入库流程

```
DRAFT (草稿)
    ↓ 提交入库申请
PENDING_INSTOCK (待入库)
    ↓ 物资管理员核验通过
INSTOCKED (已入库)
```

**流转规则:**
1. 物资录入员创建物资信息,初始状态为 DRAFT
2. 提交入库申请后,状态变更为 PENDING_INSTOCK
3. 物资管理员进行入库核验:
   - 核验通过: 状态变更为 INSTOCKED
   - 核验不通过: 保持 PENDING_INSTOCK 状态,需重新提交

### 物资出库流程

```
INSTOCKED (已入库)
    ↓ 发起出库申请
PENDING_LV1 (待一级审批)
    ↓ 一级审批通过
PENDING_LV2 (待二级审批)
    ↓ 二级审批通过
APPROVED (已审批)
    ↓ 物资管理员确认出库
OUTSTOCKED (已出库)
```

**流转规则:**
1. 物资在 INSTOCKED 状态下可发起出库申请
2. 出库申请需经过两级审批:
   - 一级审批人审批: 通过则进入二级审批,驳回则状态变更为 REJECTED
   - 二级审批人审批: 通过则状态变更为 APPROVED,驳回则状态变更为 REJECTED
3. 审批通过后,物资管理员确认出库,状态变更为 OUTSTOCKED
4. 已驳回的申请可重新发起,重新进入审批流程

### 状态转换矩阵

| 当前状态 | 可转换状态 | 触发条件 | 操作角色 |
|---------|-----------|---------|---------|
| DRAFT | PENDING_INSTOCK | 提交入库申请 | 物资录入员 |
| PENDING_INSTOCK | INSTOCKED | 入库核验通过 | 物资管理员 |
| INSTOCKED | PENDING_LV1 | 发起出库申请 | 物资录入员 |
| PENDING_LV1 | PENDING_LV2 | 一级审批通过 | 一级审批人 |
| PENDING_LV1 | REJECTED | 一级审批驳回 | 一级审批人 |
| PENDING_LV2 | APPROVED | 二级审批通过 | 二级审批人 |
| PENDING_LV2 | REJECTED | 二级审批驳回 | 二级审批人 |
| APPROVED | OUTSTOCKED | 确认出库 | 物资管理员 |
| REJECTED | PENDING_LV1 | 重新发起申请 | 物资录入员 |

## 角色权限配置示例

### 角色定义

| 角色ID | 角色名称 | 说明 |
|-------|---------|------|
| 1 | 物资录入员 | 负责物资信息的录入和出库申请 |
| 2 | 一级审批人 | 负责出库申请的一级审批 |
| 3 | 二级审批人 | 负责出库申请的二级审批 |
| 4 | 物资管理员 | 负责物资入库核验和出库确认 |
| 5 | 系统管理员 | 负责用户管理和系统配置 |

### 权限定义

| 权限代码 | 权限名称 | 说明 |
|---------|---------|------|
| material:spare:create | 备品备件创建 | 创建备品备件入库记录 |
| material:spare:edit | 备品备件编辑 | 编辑备品备件信息 |
| material:equip:create | 材料设备创建 | 创建材料设备入库记录 |
| material:equip:edit | 材料设备编辑 | 编辑材料设备信息 |
| material:verify | 入库核验 | 对待入库物资进行核验 |
| outstock:apply | 出库申请 | 发起物资出库申请 |
| outstock:confirm | 出库确认 | 确认物资出库 |
| approval:level1 | 一级审批 | 对出库申请进行一级审批 |
| approval:level2 | 二级审批 | 对出库申请进行二级审批 |
| material:query | 物资查询 | 查询物资信息 |
| analysis:view | 数据分析 | 查看数据分析报表 |
| user:manage | 用户管理 | 管理系统用户 |
| system:config | 系统配置 | 配置系统参数 |
| report:export | 报表导出 | 导出数据报表 |

### 角色权限配置

#### 1. 物资录入员 (role_id: 1)

**权限列表:**
- material:spare:create - 备品备件创建
- material:spare:edit - 备品备件编辑
- material:equip:create - 材料设备创建
- material:equip:edit - 材料设备编辑
- outstock:apply - 出库申请
- material:query - 物资查询

**功能说明:**
- 创建和编辑备品备件入库信息
- 创建和编辑材料设备入库信息
- 发起物资出库申请
- 查询物资信息

**示例用户:** 张三 (zhangsan)

#### 2. 一级审批人 (role_id: 2)

**权限列表:**
- approval:level1 - 一级审批
- material:query - 物资查询

**功能说明:**
- 对出库申请进行一级审批
- 查询物资信息

**示例用户:** 李四 (lisi)

#### 3. 二级审批人 (role_id: 3)

**权限列表:**
- approval:level2 - 二级审批
- material:query - 物资查询

**功能说明:**
- 对出库申请进行二级审批
- 查询物资信息

**示例用户:** 王五 (wangwu)

#### 4. 物资管理员 (role_id: 4)

**权限列表:**
- material:verify - 入库核验
- outstock:confirm - 出库确认
- material:query - 物资查询
- analysis:view - 数据分析

**功能说明:**
- 对待入库物资进行核验
- 确认已审批物资出库
- 查询物资信息
- 查看数据分析报表

**示例用户:** 赵六 (zhaoliu)

#### 5. 系统管理员 (role_id: 5)

**权限列表:**
- user:manage - 用户管理
- system:config - 系统配置
- report:export - 报表导出
- material:query - 物资查询

**功能说明:**
- 管理系统用户、角色及权限
- 配置系统参数
- 导出数据报表
- 查询物资信息

**示例用户:** 孙七 (sunqi)

### 权限矩阵

| 功能模块 | 物资录入员 | 一级审批人 | 二级审批人 | 物资管理员 | 系统管理员 |
|---------|-----------|-----------|-----------|-----------|-----------|
| 备品备件入库 | ✓ | - | - | - | - |
| 材料设备入库 | ✓ | - | - | - | - |
| 入库核验 | - | - | - | ✓ | - |
| 出库申请 | ✓ | - | - | - | - |
| 一级审批 | - | ✓ | - | - | - |
| 二级审批 | - | - | ✓ | - | - |
| 出库确认 | - | - | - | ✓ | - |
| 物资查询 | ✓ | ✓ | ✓ | ✓ | ✓ |
| 数据分析 | - | - | - | ✓ | - |
| 用户管理 | - | - | - | - | ✓ |
| 系统配置 | - | - | - | - | ✓ |
| 报表导出 | - | - | - | - | ✓ |

## API 接口说明

### 物资管理接口

#### 1. 获取物资概览数据
```
GET /api/material/overview
```

#### 2. 备品备件入库
```
POST /api/material/spare/instock
```

#### 3. 材料设备入库
```
POST /api/material/equip/instock
```

#### 4. 物资入库核验
```
PUT /api/material/verify/:id
```

#### 5. 发起物资出库申请
```
POST /api/material/outstock/apply
```

#### 6. 查询本人出库申请列表
```
GET /api/material/outstock/my-list
```

#### 7. 查询待审批出库申请列表
```
GET /api/approval/list
```

#### 8. 处理出库审批
```
PUT /api/approval/handle/:id
```

#### 9. 查询待确认出库申请列表
```
GET /api/material/outstock/pending-confirm
```

## 常见问题

### 1. 如何添加新的用户角色?

在 `server/dataStore.js` 的 `initialData.users` 中添加新用户,并设置对应的 `role_id` 和 `permissions`。

### 2. 如何修改物资审批流程?

修改 `server/index.js` 中的审批逻辑,调整状态转换规则和审批节点。

### 3. 如何扩展数据库?

当前使用 JSON 文件存储数据,如需使用真实数据库,可修改 `server/dataStore.js` 中的 `readData` 和 `saveData` 函数,连接 MySQL、PostgreSQL 或 MongoDB 等数据库。

## 技术支持

如有问题,请联系开发团队或提交 Issue。

