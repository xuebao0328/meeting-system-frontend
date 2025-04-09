<template>
  <div class="admin-center">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="../assets/logo.png" alt="Logo" class="logo-image" />
        <span class="logo-text">会务组中心</span>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-item" :class="{ active: activeMenu === 'meetings' }" @click="activeMenu = 'meetings'">
          <i class="el-icon-date"></i>
          <span>会议管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'permissions' }" @click="activeMenu = 'permissions'">
          <i class="el-icon-key"></i>
          <span>权限管理</span>
        </div>
      </nav>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <div class="page-title">{{ pageTitle }}</div>
        <div class="user-info">
          <div class="notification-icon">
            <i class="el-icon-bell"></i>
            <span class="badge" v-if="unreadCount">{{ unreadCount }}</span>
          </div>
          <div class="user-profile">
            <img src="path/to/avatar.png" alt="Avatar" class="avatar" />
            <span class="username" @click="goToUserCenter" style="cursor: pointer;">管理员</span>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="content">
        <!-- 会议管理模块 -->
        <div v-if="activeMenu === 'meetings'" class="meetings-section">
          <div class="section-header">
            <button class="primary-button" @click="openCreateMeetingModal">
              <i class="el-icon-plus"></i>创建新会议
            </button>
          </div>
          
          <!-- 搜索和筛选区域 -->
          <div class="search-filter-section">
            <div class="search-box">
              <input 
                type="text" 
                v-model="meetingSearch" 
                placeholder="搜索会议名称、地点..."
                class="search-input"
              >
            </div>
            <div class="filter-box">
              <select v-model="meetingStatusFilter" class="filter-select">
                <option value="">全部状态</option>
                <option value="upcoming">筹备中</option>
                <option value="confirmed">已确认</option>
                <option value="draft">草稿</option>
                <option value="completed">已结束</option>
              </select>
              <input 
                type="date" 
                v-model="meetingDateFilter"
                class="filter-select"
              >
            </div>
          </div>

          <!-- 会议卡片区域 -->
          <div class="meetings-table-container">
            <div v-if="filteredMeetings.length === 0" class="empty-state">
              <div class="empty-icon">📅</div>
              <p>暂无符合条件的会议</p>
            </div>
            <table v-else class="meetings-table">
              <thead>
                <tr>
                  <th width="20%">会议信息</th>
                  <th width="12%">会议类型</th>
                  <th width="15%">时间</th>
                  <th width="15%">地点</th>
                  <th width="12%">状态</th>
                  <th width="10%">参会人数</th>
                  <th width="8%">分会场数量</th>
                  <th width="8%">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="meeting in filteredMeetings" :key="meeting.id">
                  <td>
                    <div class="meeting-name-cell">
                      <i class="el-icon-document"></i>
                      <span class="meeting-title">{{ meeting.title }}</span>
                      <div class="meeting-info-row">
                        <span v-if="meeting.description" class="meeting-description-preview">
                          {{ meeting.description.substring(0, 30) }}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="meeting-type-badge" :class="meeting.type">
                      {{ meeting.typeText }}
                    </span>
                  </td>
                  <td>
                    <span class="meeting-time">
                      <i class="el-icon-time"></i>
                      {{ meeting.startTime }} 至 {{ meeting.endTime }}
                    </span>
                  </td>
                  <td>
                    <span class="meeting-location">
                      <i class="el-icon-location"></i>
                      {{ meeting.location }}
                    </span>
                  </td>
                  <td>
                    <span class="meeting-status-badge" :class="meeting.status">
                      {{ meeting.statusText }}
                    </span>
                  </td>
                  <td>
                    <span class="meeting-attendees">
                      <i class="el-icon-user"></i>
                      {{ meeting.attendees || 0 }}
                    </span>
                  </td>
                  <td>
                    <span class="sub-venue-count">
                      {{ meeting.subVenues.length }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="action-button" @click="editMeeting(meeting)" title="编辑">
                        <i class="el-icon-edit"></i>
                      </button>
                      <button class="action-button" @click="viewMeetingDetail(meeting)" title="查看">
                        <i class="el-icon-view"></i>
                      </button>
                      <button class="action-button" @click="goToMeetingSettings(meeting)" title="设置">
                        <i class="el-icon-setting"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 创建会议弹窗 -->
        <div v-if="showCreateMeetingModal" class="modal-overlay" @click="showCreateMeetingModal = false">
          <div class="modal" @click.stop>
            <div class="modal-header">
              <h3>创建新会议</h3>
              <button class="close-button" @click="showCreateMeetingModal = false">
                <i class="el-icon-close"></i>
              </button>
            </div>
            <div class="modal-body">
              <!-- 基本信息 -->
              <div class="form-section">
                <h4>基本信息</h4>
                <div class="form-row">
                  <div class="form-group half">
                    <label>会议名称 <i class="el-icon-info" title="请输入会议的完整名称"></i></label>
                    <div class="input-with-icon">
                      <i class="el-icon-document"></i>
                      <input type="text" v-model="newMeeting.title" placeholder="请输入会议名称" @input="validateTitle">
                    </div>
                    <span v-if="titleError" class="error-message">{{ titleError }}</span>
                  </div>
                  <div class="form-group half">
                    <label>会议类型 <i class="el-icon-info" title="选择会议的类型"></i></label>
                    <select v-model="newMeeting.type">
                      <option value="offline">线下会议</option>
                      <option value="online">线上会议</option>
                      <option value="hybrid">混合会议</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 时间地点 -->
              <div class="form-section">
                <h4>时间地点</h4>
                <div class="form-row">
                  <div class="form-group half">
                    <label>会议开始时间 <i class="el-icon-info" title="选择会议的开始时间"></i></label>
                    <el-date-picker
                      v-model="newMeeting.startTime"
                      type="datetime"
                      placeholder="选择开始时间"
                      :picker-options="pickerOptions"
                    />
                    <span v-if="startTimeError" class="error-message">{{ startTimeError }}</span>
                  </div>
                  <div class="form-group half">
                    <label>会议结束时间 <i class="el-icon-info" title="选择会议的结束时间"></i></label>
                    <input type="datetime-local" v-model="newMeeting.endTime" @input="validateEndTime">
                    <span v-if="endTimeError" class="error-message">{{ endTimeError }}</span>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group full">
                    <label>会议地点 <i class="el-icon-info" title="输入会议的具体地点"></i></label>
                    <input type="text" v-model="newMeeting.location" placeholder="请输入会议地点" @input="validateLocation">
                    <span v-if="locationError" class="error-message">{{ locationError }}</span>
                  </div>
                </div>
              </div>

              <!-- 分会场设置 -->
              <div class="form-section">
                <h4>分会场设置</h4>
                <div class="form-row">
                  <div class="form-group full">
                    <label>当前分会场数量: {{ newMeeting.subVenues.length }}</label>
                    <div v-for="(venue, index) in newMeeting.subVenues" :key="index" class="sub-venue">
                      <div class="form-row">
                        <div class="form-group half">
                          <label>分会场名称</label>
                          <input type="text" v-model="venue.name" placeholder="请输入分会场名称">
                        </div>
                        <div class="form-group half">
                          <label>分会场地点</label>
                          <input type="text" v-model="venue.location" placeholder="请输入分会场地点">
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group half">
                          <label>会场人数</label>
                          <input type="number" v-model="venue.capacity" placeholder="请输入会场人数">
                        </div>
                        <div class="form-group half">
                          <button class="action-button" @click="removeSubVenue(index)">删除分会场</button>
                        </div>
                      </div>
                    </div>
                    <button class="primary-button" @click="addSubVenue">添加分会场</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="cancel-button" @click="showCreateMeetingModal = false">取消</button>
              <button class="submit-button" @click="createMeeting">创建</button>
            </div>
          </div>
        </div>

        <!-- 通知管理模块 -->
        <div v-if="activeMenu === 'notifications'" class="notifications-section">
          <div class="section-header">
            <button class="primary-button">发送新通知</button>
          </div>
          <div class="notification-list">
            <div class="notification-item" v-for="notice in notifications" :key="notice.id">
              <div class="notice-type" :class="notice.type">{{ notice.typeText }}</div>
              <div class="notice-content">
                <h4>{{ notice.title }}</h4>
                <p>{{ notice.content }}</p>
                <span class="notice-time">{{ notice.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 财务管理模块 -->
        <div v-if="activeMenu === 'finance'" class="finance-section">
          <div class="section-header">
            <button class="primary-button">添加记录</button>
          </div>
          <div class="finance-overview">
            <div class="finance-card">
              <h3>本月收入</h3>
              <div class="amount income">¥ 125,000</div>
            </div>
            <div class="finance-card">
              <h3>本月支出</h3>
              <div class="amount expense">¥ 85,000</div>
            </div>
            <div class="finance-card">
              <h3>结余</h3>
              <div class="amount balance">¥ 40,000</div>
            </div>
          </div>
          <div class="finance-table">
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>类型</th>
                  <th>描述</th>
                  <th>金额</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in financeRecords" :key="record.id">
                  <td>{{ record.date }}</td>
                  <td>{{ record.type }}</td>
                  <td>{{ record.description }}</td>
                  <td :class="record.amountType">{{ record.amount }}</td>
                  <td>{{ record.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminCenter',
  data() {
    return {
      activeMenu: 'meetings',
      unreadCount: 5,
      meetings: [],
      showCreateMeetingModal: false,
      meetingSearch: '',
      meetingStatusFilter: '',
      meetingDateFilter: '',
      newMeeting: {
        title: '',
        type: 'offline',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        status: 'draft',
        subVenues: []
      },
      notifications: [
        {
          id: 1,
          type: 'important',
          typeText: '重要',
          title: '会议日期变更通知',
          content: '关于2024年度技术峰会的时间调整通知',
          time: '2024-01-10 14:30'
        },
        {
          id: 2,
          type: 'normal',
          typeText: '普通',
          title: '场地预订确认',
          content: '产品发布会场地已确认预订成功',
          time: '2024-01-15 09:20'
        },
        {
          id: 3,
          type: 'urgent',
          typeText: '紧急',
          title: '紧急会议通知',
          content: '关于临时增加预算评审会议的通知',
          time: '2024-01-16 16:45'
        },
        {
          id: 4,
          type: 'normal',
          typeText: '普通',
          title: '会议材料提醒',
          content: '请各部门准备Q1季度回顾会议材料',
          time: '2024-01-17 11:30'
        }
      ],
      financeRecords: [
        {
          id: 1,
          date: '2024-01-10',
          type: '会议收入',
          description: '技术峰会报名费',
          amount: '¥50,000',
          amountType: 'income',
          status: '已确认'
        },
        {
          id: 2,
          date: '2024-01-12',
          type: '场地支出',
          description: '会议中心场地预订费',
          amount: '¥30,000',
          amountType: 'expense',
          status: '已支付'
        },
        {
          id: 3,
          date: '2024-01-15',
          type: '会议收入',
          description: '产品发布会赞助费',
          amount: '¥80,000',
          amountType: 'income',
          status: '待确认'
        },
        {
          id: 4,
          date: '2024-01-16',
          type: '设备支出',
          description: '会议设备租赁费',
          amount: '¥15,000',
          amountType: 'expense',
          status: '已支付'
        },
        {
          id: 5,
          date: '2024-01-17',
          type: '餐饮支出',
          description: '会议茶歇费用',
          amount: '¥8,000',
          amountType: 'expense',
          status: '待支付'
        }
      ],
      tagInput: '',
      titleError: '',
      timeError: '',
      locationError: '',
      startTimeError: '',
      endTimeError: '',
      pickerOptions: {
        // Add any necessary picker options here
      },
    }
  },
  computed: {
    pageTitle() {
      const titles = {
        meetings: '会议管理',
        permissions: '权限管理'
      }
      return titles[this.activeMenu]
    },
    filteredMeetings() {
      return this.meetings
        .filter(meeting => {
          const searchMatch = meeting.title.toLowerCase().includes(this.meetingSearch.toLowerCase()) ||
                             meeting.location.toLowerCase().includes(this.meetingSearch.toLowerCase());
          const statusMatch = this.meetingStatusFilter === '' || meeting.status === this.meetingStatusFilter;
          const dateMatch = this.meetingDateFilter === '' || (meeting.startTime && meeting.startTime.startsWith(this.meetingDateFilter));
          return searchMatch && statusMatch && dateMatch;
        })
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    },
    currentMeeting() {
      if (this.meetingId && this.meetings.length > 0) {
        return this.meetings.find(m => m.id === this.meetingId) || { title: '会议网站编辑' };
      }
      return { title: '会议网站编辑' };
    }
  },
  created() {
    this.initMeetings();
  },
  methods: {
    initMeetings() {
      this.meetings = [
        {
          id: 1,
          title: "2023年度技术研讨会",
          type: "offline",
          typeText: "线下会议",
          startTime: "2023-12-15 09:00",
          endTime: "2023-12-16 18:00",
          location: "上海浦东会展中心",
          description: "年度技术研讨与交流平台，探讨行业前沿技术和发展趋势。",
          status: "upcoming",
          statusText: "筹备中",
          attendees: 120,
          subVenues: [{ name: "主会场", location: "1号厅" }]
        },
        {
          id: 2,
          title: "产品发布会",
          type: "hybrid",
          typeText: "混合会议",
          startTime: "2023-11-20 14:00",
          endTime: "2023-11-20 17:30",
          location: "北京国际会议中心",
          description: "新一代产品发布会，展示最新技术成果和创新应用。",
          status: "confirmed",
          statusText: "已确认",
          attendees: 80,
          subVenues: [
            { name: "主会场", location: "多功能厅" },
            { name: "展示区", location: "展览大厅" }
          ]
        },
        {
          id: 3,
          title: "在线学习论坛",
          type: "online",
          typeText: "线上会议",
          startTime: "2023-10-05 10:00",
          endTime: "2023-10-05 16:00",
          location: "Zoom视频会议",
          description: "探讨在线教育的未来与发展，分享最新学习方法和工具。",
          status: "completed",
          statusText: "已结束",
          attendees: 200,
          subVenues: []
        }
      ];
    },
    editMeeting(meeting) {
      this.newMeeting = { ...meeting };
      this.showCreateMeetingModal = true;
    },
    toggleMeetingExpand(meeting) {
      this.$set(meeting, 'isExpanded', !meeting.isExpanded);
    },
    viewMeetingDetail(meeting) {
      this.$router.push({
        name: 'MeetingDetail',
        params: { id: meeting.id }
      });
    },
    manageMeeting(meeting) {
      this.$router.push({
        name: 'MeetingManage',
        params: { id: meeting.id }
      });
    },
    async createMeeting() {
      if (!this.validateForm()) return;

      this.loading = true;
      try {
        await api.createMeeting(this.newMeeting);
        this.$message.success('会议创建成功');
        this.showCreateMeetingModal = false;
        this.resetForm();
      } catch (error) {
        this.$message.error('会议创建失败，请重试');
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.newMeeting = {
        title: '',
        time: '',
        location: '',
        description: '',
        status: 'upcoming',
        type: 'offline',
        url: '',
        tags: [],
        subVenues: [],
        startTime: '',
        endTime: '',
      };
      this.tagInput = '';
    },
    addTag() {
      if (this.tagInput.trim() !== '') {
        this.newMeeting.tags = [...(this.newMeeting.tags || []), this.tagInput.trim()];
        this.tagInput = '';
      }
    },
    removeTag(index) {
      this.newMeeting.tags = this.newMeeting.tags.filter((_, i) => i !== index);
    },
    validateTitle() {
      this.titleError = this.newMeeting.title ? '' : '会议名称不能为空';
    },
    validateTime() {
      this.timeError = this.newMeeting.time ? '' : '会议时间不能为空';
    },
    validateLocation() {
      this.locationError = this.newMeeting.location ? '' : '会议地点不能为空';
    },
    validateStartTime() {
      this.startTimeError = this.newMeeting.startTime ? '' : '会议开始时间不能为空';
    },
    validateEndTime() {
      this.endTimeError = this.newMeeting.endTime ? '' : '会议结束时间不能为空';
    },
    openCreateMeetingModal() {
      console.log('Opening create meeting modal');
      this.resetForm();
      this.showCreateMeetingModal = true;
      console.log('showCreateMeetingModal:', this.showCreateMeetingModal);
    },
    addSubVenue() {
      this.newMeeting.subVenues.push({ name: '', location: '', capacity: 0 });
    },
    removeSubVenue(index) {
      this.newMeeting.subVenues.splice(index, 1);
    },
    saveDraft() {
      localStorage.setItem('meetingDraft', JSON.stringify(this.newMeeting));
      this.$message.success('草稿已保存');
    },
    loadDraft() {
      const draft = localStorage.getItem('meetingDraft');
      if (draft) {
        this.newMeeting = JSON.parse(draft);
        this.$message.info('草稿已加载');
      }
    },
    goToMeetingSettings(meeting) {
      console.log('Navigating to meeting settings:', meeting.id);
      this.$router.push({
        name: 'MeetingDetailSettings',
        params: { id: meeting.id },
      });
    },
    fetchMeetings() {
      this.initMeetings();
    },
    goToUserCenter() {
      console.log('跳转到用户中心页面');
      this.$router.push('/user-center');
    },
  }
}
</script>

<style scoped>
.admin-center {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  width: 240px;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  padding: 20px 0;
}

.sidebar-header {
  padding: 0 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}

.logo-image {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  object-fit: contain;
  border-radius: 4px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #1d1d1f;
}

.nav-item {
  padding: 15px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f7fa;
}

.nav-item.active {
  background-color: #e8f0fe;
  color: #007aff;
}

.icon {
  margin-right: 10px;
  font-size: 20px;
}

.main-content {
  flex: 1;
  padding: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-icon {
  position: relative;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff3b30;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.primary-button {
  padding: 10px 20px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #005bb5;
}

/* 会议卡片样式 */
.meetings-table-container {
  background: white;
  border-radius: 10px;
  padding: 20px;
  overflow-x: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.meetings-table {
  width: 100%;
  border-collapse: collapse;
}

.meetings-table th, .meetings-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

.meetings-table th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.meeting-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meeting-name-cell i {
  color: #999;
  font-size: 16px;
}

.meeting-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.meeting-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meeting-description-preview {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.meeting-url {
  color: #007aff;
  text-decoration: none;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.meeting-url:hover {
  text-decoration: underline;
}

.meeting-type-badge, .meeting-status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
}

.table-actions {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.action-button {
  padding: 6px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.action-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

/* 搜索和筛选区域样式 */
.search-filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
}

.filter-box {
  display: flex;
  gap: 20px;
}

.filter-select {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
}

/* 通知列表样式 */
.notification-list {
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

/* 财务概览样式 */
.finance-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.finance-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.amount {
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
}

.income { color: #34c759; }
.expense { color: #ff3b30; }
.balance { color: #007aff; }

/* 财务表格样式 */
.finance-table {
  background: white;
  border-radius: 10px;
  padding: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f5f7fa;
  font-weight: 600;
}

/* 创建会议弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 22px;
  color: #333;
  font-weight: bold;
}

.modal-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.cancel-button {
  background-color: #ff3b30;
  color: white;
}

.cancel-button:hover {
  background-color: #e60000;
}

.submit-button {
  background-color: #007aff;
  color: white;
}

.submit-button:hover {
  background-color: #005bb5;
}

.submit-button:active {
  transform: scale(0.95);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.empty-state .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 2px rgba(0,122,255,0.1);
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.full {
  flex: 1;
}

.form-group.half {
  flex: 0.5;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 2px rgba(0,122,255,0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 1;
}

.input-with-icon input {
  padding-left: 35px;
}

.error-message {
  color: #ff3b30;
  font-size: 12px;
  margin-top: 4px;
}

.input-error {
  border-color: #ff3b30 !important;
}

.form-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}

.form-section h4 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.primary-button {
  padding: 10px 20px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #005bb5;
}

.action-button {
  padding: 6px 12px;
  background-color: #ff3b30;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #e60000;
}

.username {
  font-weight: 500;
  cursor: pointer;
}

.username:hover {
  color: #409EFF;
  text-decoration: underline;
}
</style> 