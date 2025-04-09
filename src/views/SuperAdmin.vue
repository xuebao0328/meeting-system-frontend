<template>
  <div class="super-admin-container" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-chart-line"></i>
          <span>会议管理系统</span>
        </div>
        <button class="toggle-sidebar" @click="toggleSidebar">
          <i class="fas" :class="sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
        </button>
      </div>
      
      <div class="sidebar-content">
        <div class="nav-group">
          <div class="nav-title">主菜单</div>
          <ul class="nav-items">
            <li 
              class="nav-item" 
              :class="{ active: currentTab === 'dashboard' }"
              @click="switchTab('dashboard')"
            >
              <i class="fas fa-tachometer-alt"></i>
              <span>控制面板</span>
            </li>
            <li 
              class="nav-item" 
              :class="{ active: currentTab === 'accounts' }"
              @click="switchTab('accounts')"
            >
              <i class="fas fa-users"></i>
              <span>账户管理</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-calendar-alt"></i>
              <span>会议管理</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-money-bill-wave"></i>
              <span>财务管理</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-chart-bar"></i>
              <span>统计分析</span>
            </li>
          </ul>
        </div>
        
        <div class="nav-group">
          <div class="nav-title">系统</div>
          <ul class="nav-items">
            <li class="nav-item">
              <i class="fas fa-cog"></i>
              <span>系统设置</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-bell"></i>
              <span>通知管理</span>
            </li>
            <li class="nav-item">
              <i class="fas fa-shield-alt"></i>
              <span>安全设置</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="avatar">SA</div>
          <div class="user-info">
            <div class="user-name">超级管理员</div>
            <div class="user-role">系统管理员</div>
          </div>
        </div>
        <button class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="top-bar">
        <div class="page-title">
          <h1 v-if="currentTab === 'dashboard'">控制面板</h1>
          <h1 v-else-if="currentTab === 'accounts'">账户管理</h1>
        </div>
        
        <div class="top-actions">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索...">
          </div>
          
          <div class="notifications">
            <i class="fas fa-bell"></i>
            <span class="badge">3</span>
          </div>
          
          <div class="settings">
            <i class="fas fa-cog"></i>
          </div>
        </div>
      </div>
      
      <!-- 控制面板内容 -->
      <div v-if="currentTab === 'dashboard'" class="dashboard-section">
        <div class="dashboard-header">
          <h2>仪表盘概览</h2>
          <div class="time-filter">
            <button 
              class="time-btn" 
              :class="{ active: activeTimeFilter === 'day' }"
              @click="changeTimeFilter('day')"
            >
              今日
            </button>
            <button 
              class="time-btn" 
              :class="{ active: activeTimeFilter === 'week' }"
              @click="changeTimeFilter('week')"
            >
              本周
            </button>
            <button 
              class="time-btn" 
              :class="{ active: activeTimeFilter === 'month' }"
              @click="changeTimeFilter('month')"
            >
              本月
            </button>
            <button 
              class="time-btn" 
              :class="{ active: activeTimeFilter === 'year' }"
              @click="changeTimeFilter('year')"
            >
              本年
            </button>
          </div>
        </div>
        
        <!-- 统计卡片 -->
        <div class="stat-cards">
          <div v-for="stat in statsData" :key="stat.id" class="stat-card">
            <div class="stat-icon" :class="`${stat.type}-icon`">
              <i class="fas" :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-change" :class="{ increase: stat.isIncrease, decrease: !stat.isIncrease }">
                <i class="fas" :class="stat.isIncrease ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                {{ stat.change }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 图表区域 -->
        <div class="chart-container">
          <div class="chart-card">
            <div class="chart-header">
              <h3>用户增长趋势</h3>
              <div class="chart-actions">
                <button class="chart-action-btn">
                  <i class="fas fa-download"></i>
                </button>
                <button class="chart-action-btn">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="chart-placeholder">
              <span class="placeholder-text">用户增长趋势图表</span>
            </div>
          </div>
          
          <div class="chart-card">
            <div class="chart-header">
              <h3>会议类型分布</h3>
              <div class="chart-actions">
                <button class="chart-action-btn">
                  <i class="fas fa-download"></i>
                </button>
                <button class="chart-action-btn">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="chart-placeholder">
              <span class="placeholder-text">会议类型饼图</span>
            </div>
          </div>
          
          <div class="chart-card wide">
            <div class="chart-header">
              <h3>收入与支出分析</h3>
              <div class="chart-actions">
                <button class="chart-action-btn">
                  <i class="fas fa-download"></i>
                </button>
                <button class="chart-action-btn">
                  <i class="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div class="chart-placeholder">
              <span class="placeholder-text">收入支出柱状图</span>
            </div>
          </div>
        </div>
        
        <!-- 最近活动 -->
        <div class="recent-activity">
          <div class="section-header">
            <h3>最近活动</h3>
            <button class="view-all-btn">查看全部</button>
          </div>
          
          <div class="activity-list">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <div class="activity-icon">
                <i class="fas" :class="activity.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-desc">{{ activity.description }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 账户管理内容 -->
      <div v-if="currentTab === 'accounts'" class="account-section">
        <div class="filter-bar">
          <div class="search-input">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="搜索账户...">
          </div>
          
          <div class="filter-actions">
            <button class="filter-btn">
              <i class="fas fa-filter"></i>
              筛选
            </button>
            <button class="add-btn" @click="openEditModal()">
              <i class="fas fa-plus"></i>
              新增账户
            </button>
          </div>
        </div>
        
        <!-- 账户表格 -->
        <table class="accounts-table">
          <thead>
            <tr>
              <th>账户</th>
              <th>角色</th>
              <th>状态</th>
              <th>注册日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in accounts" :key="account.id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar">{{ account.initials }}</div>
                  <div class="user-info">
                    <div class="user-name">{{ account.name }}</div>
                    <div class="user-email">{{ account.email }}</div>
                  </div>
                </div>
              </td>
              <td>{{ account.role }}</td>
              <td>
                <div class="status-badge" :class="{
                  'status-active': account.status === 'active',
                  'status-inactive': account.status === 'inactive',
                  'status-pending': account.status === 'pending'
                }">
                  {{ account.status === 'active' ? '活跃' : 
                     account.status === 'inactive' ? '禁用' : '待验证' }}
                </div>
              </td>
              <td>{{ account.registered }}</td>
              <td>
                <div class="action-cell">
                  <button class="action-btn edit-btn" @click="openEditModal(account)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-btn delete-btn" @click="deleteAccount(account.id)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- 分页控制 -->
        <div class="pagination">
          <div class="page-info">
            显示 {{ accounts.length }} 个账户中的 {{ (currentPage - 1) * 5 + 1 }} - {{ Math.min(currentPage * 5, accounts.length) }} 个
          </div>
          
          <div class="page-controls">
            <button 
              class="page-btn" 
              :class="{ disabled: currentPage === 1 }"
              @click="changePage(currentPage - 1)"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            
            <button 
              v-for="page in paginationRange" 
              :key="page"
              class="page-btn" 
              :class="{ active: page === currentPage }"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
            
            <button 
              class="page-btn" 
              :class="{ disabled: currentPage === totalPages }"
              @click="changePage(currentPage + 1)"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 账户编辑模态框 -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ editingAccount && editingAccount.id ? '编辑账户' : '新增账户' }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="account-name">单位名称</label>
            <input 
              type="text" 
              id="account-name" 
              v-model="editingAccount.name" 
              placeholder="请输入单位名称"
            >
          </div>
          
          <div class="form-group">
            <label for="account-email">邮箱</label>
            <input 
              type="email" 
              id="account-email" 
              v-model="editingAccount.email" 
              placeholder="请输入邮箱"
            >
          </div>
          
          <div class="form-group">
            <label for="account-role">角色</label>
            <select id="account-role" v-model="editingAccount.role">
              <option value="管理员">管理员</option>
              <option value="高级用户">高级用户</option>
              <option value="标准用户">标准用户</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="account-status">状态</label>
            <select id="account-status" v-model="editingAccount.status">
              <option value="active">活跃</option>
              <option value="inactive">禁用</option>
              <option value="pending">待验证</option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="save-btn" @click="saveAccount">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuperAdmin',
  data() {
    return {
      currentTab: 'dashboard',
      sidebarOpen: true,
      activeTimeFilter: 'day',
      statsData: [
        { id: 1, type: 'account', icon: 'fa-user', value: '2,458', label: '活跃账号', isIncrease: true, change: '+12.5%' },
        { id: 2, type: 'meeting', icon: 'fa-calendar', value: '1,245', label: '进行中会议', isIncrease: true, change: '+8.3%' },
        { id: 3, type: 'revenue', icon: 'fa-money-bill', value: '¥358,254', label: '本月收入', isIncrease: true, change: '+15.2%' },
        { id: 4, type: 'support', icon: 'fa-service', value: '24', label: '待处理工单', isIncrease: false, change: '-5.7%' }
      ],
      activities: [
        { id: 1, title: '新企业账号注册', description: '北京科技有限公司完成了账号注册', time: '10分钟前', icon: 'fa-user' },
        { id: 2, title: '套餐升级', description: '上海创新科技从基础版升级到专业版', time: '1小时前', icon: 'fa-goods' },
        { id: 3, title: '系统警告', description: '数据库负载过高，已自动扩容', time: '3小时前', icon: 'fa-warning' },
        { id: 4, title: '大型会议创建', description: '2024全球技术峰会已创建，预计参会人数5000+', time: '5小时前', icon: 'fa-calendar' }
      ],
      accounts: [
        { id: 1, name: '北京科技有限公司', email: 'zhangming@example.com', role: '管理员', status: 'active', registered: '2024-01-15' },
        { id: 2, name: '上海创新科技有限公司', email: 'liwei@example.com', role: '管理员', status: 'active', registered: '2024-02-20' },
        { id: 3, name: '广州教育集团', email: 'wangfang@example.com', role: '管理员', status: 'suspended', registered: '2024-03-05' },
        { id: 4, name: '深圳医疗科技有限公司', email: 'zhaoqiang@example.com', role: '管理员', status: 'active', registered: '2024-03-15' },
        { id: 5, name: '杭州金融服务有限公司', email: 'qianduo@example.com', role: '管理员', status: 'active', registered: '2024-04-01' },
        { id: 6, name: '成都零售集团', email: 'sunliang@example.com', role: '管理员', status: 'expired', registered: '2024-04-15' },
        { id: 7, name: '西安制造有限公司', email: 'zhouhong@example.com', role: '管理员', status: 'pending', registered: '2024-05-01' }
      ],
      editingAccount: null,
      showModal: false,
      currentPage: 1,
      pageSize: 5,
      totalPages: 5
    }
  },
  computed: {
    paginationRange() {
      const totalPages = Math.ceil(this.accounts.length / this.pageSize);
      const range = [];
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    changeTimeFilter(filter) {
      this.activeTimeFilter = filter;
    },
    openEditModal(account) {
      this.editingAccount = account || { name: '', email: '', role: '管理员', status: 'active' };
      this.showModal = true;
    },
    closeModal() {
      this.editingAccount = null;
      this.showModal = false;
    },
    saveAccount() {
      if (this.editingAccount.id) {
        // 更新现有账户
        const index = this.accounts.findIndex(a => a.id === this.editingAccount.id);
        if (index !== -1) {
          this.accounts[index] = { ...this.editingAccount };
        }
      } else {
        // 新增新账户
        const newId = this.accounts.length > 0 ? Math.max(...this.accounts.map(a => a.id)) + 1 : 1;
        this.accounts.push({ ...this.editingAccount, id: newId });
      }
      this.closeModal();
    },
    deleteAccount(id) {
      this.accounts = this.accounts.filter(a => a.id !== id);
      this.closeModal();
    },
    changePage(page) {
      this.currentPage = page;
    }
  }
}
</script>

<style scoped>
.super-admin-container {
  display: flex;
  min-height: 100vh;
  background-color: #151718;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #E4E5E7;
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background: rgba(29, 31, 33, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px 0;
  z-index: 10;
  transition: all 0.3s;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-header {
  padding: 0 25px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo i {
  font-size: 20px;
  color: #E4E5E7;
}

.logo span {
  font-size: 18px;
  font-weight: 700;
  color: #E4E5E7;
  letter-spacing: -0.5px;
}

.toggle-sidebar {
  background: none;
  border: none;
  color: #9DA0A5;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.toggle-sidebar:hover {
  color: #E4E5E7;
}

.sidebar-content {
  margin-top: 20px;
}

.nav-group {
  margin-bottom: 20px;
}

.nav-title {
  font-size: 14px;
  font-weight: 700;
  color: #9DA0A5;
  margin-bottom: 10px;
}

.nav-items {
  list-style: none;
  padding: 0;
}

.nav-item {
  padding: 14px 25px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  margin: 6px 0;
  border-radius: 0 10px 10px 0;
  position: relative;
  color: #9DA0A5;
}

.nav-item i {
  font-size: 20px;
  margin-right: 12px;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.04);
  color: #E4E5E7;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(64, 137, 255, 0.15), rgba(64, 137, 255, 0.05));
  color: #4089FF;
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background-color: #4089FF;
  border-radius: 0 2px 2px 0;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #2D3748;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: #E4E5E7;
  margin-bottom: 3px;
}

.user-role {
  font-size: 13px;
  color: #9DA0A5;
}

.logout-btn {
  background: none;
  border: none;
  color: #9DA0A5;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.logout-btn:hover {
  color: #E4E5E7;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  padding: 30px;
  max-width: calc(100% - 260px);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  background: rgba(29, 31, 33, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 15px 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #E4E5E7;
  letter-spacing: -0.5px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 8px 15px;
  width: 200px;
  transition: all 0.3s;
}

.search-box i {
  color: #9DA0A5;
  margin-right: 8px;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  color: #E4E5E7;
  font-size: 14px;
  width: 100%;
}

.search-box:focus-within {
  background-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(64, 137, 255, 0.2);
}

.notifications {
  position: relative;
  cursor: pointer;
  font-size: 20px;
  color: #9DA0A5;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.notifications:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #E4E5E7;
}

.notifications .badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #FF5C5C;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid #151718;
}

.settings {
  font-size: 20px;
  color: #9DA0A5;
  cursor: pointer;
  transition: color 0.3s;
}

.settings:hover {
  color: #E4E5E7;
}

/* 控制面板样式 */
.dashboard-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #E4E5E7;
  letter-spacing: -0.5px;
  margin: 0;
}

.time-filter {
  display: flex;
  gap: 10px;
  background-color: rgba(255, 255, 255, 0.06);
  padding: 5px;
  border-radius: 10px;
}

.time-btn {
  padding: 8px 16px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  color: #9DA0A5;
}

.time-btn:hover {
  background-color: rgba(255, 255, 255, 0.04);
  color: #E4E5E7;
}

.time-btn.active {
  background-color: rgba(64, 137, 255, 0.15);
  color: #4089FF;
  font-weight: 600;
}

/* 数据卡片样式 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background-color: #1D1F21;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border-color: rgba(64, 137, 255, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 26px;
  color: white;
}

.account-icon {
  background: linear-gradient(135deg, #4089FF, #60A5FA);
}

.meeting-icon {
  background: linear-gradient(135deg, #7C3AED, #A78BFA);
}

.revenue-icon {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.support-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #E4E5E7;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #9DA0A5;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.increase {
  color: #10B981;
}

.decrease {
  color: #FF5C5C;
}

/* 图表区域样式 */
.chart-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  background-color: #1D1F21;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.chart-card.wide {
  grid-column: span 2;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #E4E5E7;
  margin: 0;
}

.chart-actions {
  display: flex;
  gap: 10px;
}

.chart-action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: rgba(255, 255, 255, 0.06);
  color: #9DA0A5;
  cursor: pointer;
  transition: all 0.3s;
}

.chart-action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #E4E5E7;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.placeholder-text {
  color: #9DA0A5;
  font-size: 14px;
}

/* 最近活动样式 */
.recent-activity {
  background-color: #1D1F21;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #E4E5E7;
  margin: 0;
}

.view-all-btn {
  color: #4089FF;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.3s;
}

.view-all-btn:hover {
  color: #60A5FA;
  text-decoration: underline;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.activity-item:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 18px;
  color: white;
  background: linear-gradient(135deg, #4089FF, #60A5FA);
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #E4E5E7;
  margin-bottom: 5px;
}

.activity-desc {
  font-size: 14px;
  color: #9DA0A5;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 12px;
  color: #6B7280;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-container {
    grid-template-columns: 1fr;
  }
  
  .chart-card.wide {
    grid-column: auto;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }
  
  .logo {
    display: none;
  }
  
  .nav-item span {
    display: none;
  }
  
  .main-content {
    max-width: calc(100% - 80px);
  }
  
  .stat-cards {
    grid-template-columns: 1fr;
  }
  
  .search-box {
    display: none;
  }
}

/* 账户管理页面样式 */
.account-section {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  position: relative;
  width: 300px;
}

.search-input input {
  width: 100%;
  padding: 10px 15px;
  padding-left: 40px;
  background-color: #1D1F21;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #E4E5E7;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input input:focus {
  border-color: #4089FF;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 137, 255, 0.2);
}

.search-input i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6B7280;
}

.filter-actions {
  display: flex;
  gap: 15px;
}

.filter-btn, .add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn {
  background-color: #1D1F21;
  color: #9DA0A5;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.filter-btn:hover {
  background-color: #25282A;
  color: #E4E5E7;
}

.add-btn {
  background: linear-gradient(135deg, #4089FF, #60A5FA);
  color: white;
  border: none;
}

.add-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* 账户表格样式 */
.accounts-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.accounts-table th, .accounts-table td {
  padding: 15px 20px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.accounts-table th {
  background-color: #1D1F21;
  color: #9DA0A5;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.accounts-table tbody tr {
  background-color: #1D1F21;
  transition: background-color 0.3s;
}

.accounts-table tbody tr:hover {
  background-color: #25282A;
}

.accounts-table tbody tr:last-child td {
  border-bottom: none;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: #2D3748;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 15px;
  font-weight: 600;
  color: #E4E5E7;
  margin-bottom: 3px;
}

.user-email {
  font-size: 13px;
  color: #9DA0A5;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  width: fit-content;
}

.status-active {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.status-inactive {
  background-color: rgba(255, 92, 92, 0.1);
  color: #FF5C5C;
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.action-cell {
  display: flex;
  gap: 10px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: transparent;
  color: #9DA0A5;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.06);
  color: #E4E5E7;
}

.edit-btn:hover {
  background-color: rgba(64, 137, 255, 0.1);
  color: #4089FF;
  border-color: rgba(64, 137, 255, 0.2);
}

.delete-btn:hover {
  background-color: rgba(255, 92, 92, 0.1);
  color: #FF5C5C;
  border-color: rgba(255, 92, 92, 0.2);
}

/* 分页控制样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.page-info {
  color: #9DA0A5;
  font-size: 14px;
}

.page-controls {
  display: flex;
  gap: 5px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1D1F21;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #9DA0A5;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover {
  background-color: #25282A;
  color: #E4E5E7;
}

.page-btn.active {
  background-color: rgba(64, 137, 255, 0.15);
  color: #4089FF;
  border-color: rgba(64, 137, 255, 0.2);
}

.page-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 账户编辑模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 500px;
  background: linear-gradient(to bottom right, #1D1F21, #18191A);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: modalFadeIn 0.3s;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #E4E5E7;
}

.close-btn {
  background: none;
  border: none;
  color: #9DA0A5;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #E4E5E7;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #E4E5E7;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 12px 15px;
  background-color: #25282A;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #E4E5E7;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus, .form-group select:focus {
  border-color: #4089FF;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 137, 255, 0.2);
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239DA0A5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.cancel-btn, .save-btn {
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background-color: #25282A;
  color: #9DA0A5;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn:hover {
  background-color: #2D3034;
  color: #E4E5E7;
}

.save-btn {
  background: linear-gradient(135deg, #4089FF, #60A5FA);
  color: white;
  border: none;
}

.save-btn:hover {
  opacity: 0.9;
}
</style>
