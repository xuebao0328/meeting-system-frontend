# 会议管理系统前端项目

基于 Vue.js 实现的现代化会议管理系统前端项目。

## 功能特性

- 🔐 多方式登录
  - 账号密码登录
  - 手机验证码登录
  - 子账号登录（开发中）

- 📝 用户注册
  - 手机号注册
  - 邮箱注册
  - 验证码功能

- 🎨 现代化 UI
  - 响应式设计
  - 暗色主题支持
  - 多语言支持（中文/英文）

## 技术栈

- Vue.js
- Vue Router
- Vuex/Pinia
- Axios
- SCSS
- Element Plus

## 开发环境要求

- Node.js >= 14.0.0
- npm >= 6.14.0

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/xuebao0328/meeting-system-fronten-1d.git
cd meeting-system-fronten-1d
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 开发规范

1. **分支管理**
   - main: 主分支，用于发布
   - develop: 开发分支
   - feature/*: 新功能分支
   - bugfix/*: 问题修复分支

2. **提交规范**
   ```
   feat: 添加新功能
   fix: 修复问题
   docs: 修改文档
   style: 修改样式
   refactor: 代码重构
   test: 添加测试
   chore: 修改构建过程或辅助工具
   ```

3. **代码风格**
   - 使用 ESLint 进行代码检查
   - 使用 Prettier 进行代码格式化
   - 遵循 Vue 官方风格指南

## 项目结构

```
src/
├── api/          # API 接口
├── assets/       # 静态资源
├── components/   # 公共组件
├── router/       # 路由配置
├── store/        # 状态管理
├── styles/       # 全局样式
├── utils/        # 工具函数
└── views/        # 页面组件
```

## API 接口

### 认证相关

1. 登录
```javascript
POST /api/auth/login
{
  "loginMethod": "account" | "phone",
  "username": "用户名/手机号/邮箱",
  "password": "密码",
  // 或
  "phone": "手机号",
  "verificationCode": "验证码"
}
```

2. 注册
```javascript
POST /api/auth/register
{
  "username": "用户名",
  "email": "邮箱",
  "password": "密码",
  // 或
  "phone": "手机号",
  "verificationCode": "验证码"
}
```

3. 发送验证码
```javascript
POST /api/auth/send-code
{
  "phone": "手机号"
}
```

## 环境变量配置

创建 `.env.local` 文件：
```
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=会议管理系统
```

## 常见问题

1. 如何切换开发/生产环境？
   - 开发环境：使用 `.env.development`
   - 生产环境：使用 `.env.production`

2. 如何处理跨域问题？
   - 开发环境：通过 Vite 的 proxy 配置
   - 生产环境：后端配置 CORS

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request
