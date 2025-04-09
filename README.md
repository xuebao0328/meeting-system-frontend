# 会议管理系统前端项目

基于 Vue.js 实现的会议管理系统前端项目。

## 项目结构

```
frontend/
├── public/          # 静态资源
├── src/             # 源代码
│   ├── api/         # API 接口
│   ├── assets/      # 资源文件
│   ├── components/  # 公共组件
│   ├── router/      # 路由配置
│   ├── store/       # Vuex 状态管理
│   ├── styles/      # 样式文件
│   ├── utils/       # 工具函数
│   └── views/       # 页面组件
├── .gitignore       # Git 忽略文件
├── package.json     # 项目配置
└── README.md        # 项目说明
```

## 开发指南

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.14.0

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
# 启动开发服务器
npm run serve
```

### 构建生产版本

```bash
# 构建生产版本
npm run build
```

## 开发规范

### Git 工作流

1. 从 main 分支创建新的功能分支
```bash
git checkout main
git pull
git checkout -b feature/xxx
```

2. 在功能分支上开发
```bash
git add .
git commit -m "feat: 添加xxx功能"
```

3. 提交前先拉取最新代码
```bash
git checkout main
git pull
git checkout feature/xxx
git rebase main
```

4. 推送到远程仓库
```bash
git push origin feature/xxx
```

5. 在 GitHub 上创建 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 Vue 官方风格指南

### 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

type 类型：
- feat: 新功能
- fix: 修复 Bug
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- test: 增加测试
- chore: 构建过程或辅助工具的变动

## 项目功能

### 已实现功能

- 用户认证
  - 账号密码登录
  - 手机验证码登录
  - 用户注册（手机号/邮箱）
  - 手机验证码发送

### 开发中功能

- 会议管理
  - 会议列表
  - 会议详情
  - 会议设置

## API 文档

后端 API 接口文档：[API 文档](http://localhost:8080/swagger-ui.html)

## 常见问题

1. 如何处理跨域问题？
   - 开发环境已配置代理，见 `vue.config.js`
   - 生产环境需要后端配置 CORS

2. 如何处理登录状态？
   - 使用 Vuex 管理登录状态
   - Token 存储在 localStorage
   - 路由守卫检查登录状态

## 联系方式

如有问题，请联系项目负责人或在 GitHub Issues 中提出。
