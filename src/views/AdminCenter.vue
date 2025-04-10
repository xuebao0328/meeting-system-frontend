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
            <span class="username" @click="goToUserCenter" style="cursor: pointer;">{{ username }}</span>
            <el-dropdown trigger="click">
              <i class="el-icon-arrow-down el-icon--right" style="cursor: pointer;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="goToUserCenter">个人中心</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
            <div v-if="loading" class="loading-container">
              <i class="el-icon-loading"></i>
              <p>加载会议数据中...</p>
            </div>
            <div v-else-if="filteredMeetings.length === 0" class="empty-state">
              <div class="empty-icon">📅</div>
              <p>{{ meetingSearch || meetingStatusFilter || meetingDateFilter ? '暂无符合条件的会议' : '暂无会议数据，点击"创建新会议"添加' }}</p>
            </div>
            <table v-else class="meetings-table">
              <thead>
                <tr>
                  <th width="20%">会议信息</th>
                  <th width="10%">会议类型</th>
                  <th width="15%">时间</th>
                  <th width="10%">地点</th>
                  <th width="10%">状态</th>
                  <th width="10%">负责人</th>
                  <th width="8%">参会人数</th>
                  <th width="8%">分会场数量</th>
                  <th width="8%">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="meeting in filteredMeetings" :key="meeting.id">
                  <td>
                    <div class="meeting-name-cell">
                      <i class="el-icon-document"></i>
                      <div class="meeting-name-content">
                      <span class="meeting-title">{{ meeting.title }}</span>
                        <div class="meeting-info-row" v-if="meeting.description">
                          <span class="meeting-description-preview">
                            {{ meeting.description.substring(0, 50) }}{{ meeting.description.length > 50 ? '...' : '' }}
                        </span>
                        </div>
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
                    <span class="meeting-manager">
                      <i class="el-icon-user"></i>
                      {{ meeting.manager || '未指定' }}
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
                      <button class="action-button edit-button" @click="editMeeting(meeting)" title="编辑">
                        <i class="el-icon-edit"></i>
                      </button>
                      <button class="action-button view-button" @click="viewMeetingDetail(meeting)" title="查看">
                        <i class="el-icon-view"></i>
                      </button>
                      <button class="action-button settings-button" @click="goToMeetingSettings(meeting)" title="设置">
                        <i class="el-icon-setting"></i>
                      </button>
                      <button class="action-button delete-button" @click="confirmDeleteMeeting(meeting)" title="删除">
                        <i class="el-icon-delete"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 创建会议弹窗 -->
        <div v-if="showCreateMeetingModal" class="modal-overlay" @click.self="showCreateMeetingModal = false">
          <div class="modal create-meeting-modal" @click.stop>
            <div class="modal-header">
              <div class="mac-window-controls">
                <button class="mac-close-button" @click="showCreateMeetingModal = false" title="关闭">
                  <span class="mac-close-icon"></span>
                </button>
                <button class="mac-minimize-button" title="最小化">
                  <span class="mac-minimize-icon"></span>
                </button>
                <button class="mac-maximize-button" title="最大化">
                  <span class="mac-maximize-icon"></span>
              </button>
            </div>
              <h3>创建新会议</h3>
              <div class="header-placeholder"></div>
            </div>
            
            <div class="modal-body">
              <!-- 基本信息 -->
              <div class="form-card">
                <div class="form-card-header">
                  <div class="form-card-title">
                    <i class="el-icon-document"></i>
                    <span>基本信息</span>
                  </div>
                </div>
                
                <div class="form-card-body">
                <div class="form-row">
                    <div class="form-group full">
                      <label>会议名称 <span class="required-mark">*</span></label>
                    <div class="input-with-icon">
                      <i class="el-icon-document"></i>
                        <input type="text" v-model.trim="newMeeting.title" placeholder="请输入会议名称" @input="validateTitle">
                    </div>
                    <span v-if="titleError" class="error-message">{{ titleError }}</span>
                  </div>
                  </div>
                  
                  <div class="form-section-divider"></div>
                  
                  <div class="form-row">
                  <div class="form-group half">
                      <label>会议类型 <span class="required-mark">*</span></label>
                      <div class="select-with-icon">
                        <i class="el-icon-menu"></i>
                    <select v-model="newMeeting.type">
                          <option value="domestic">国内会议</option>
                          <option value="international">国际会议</option>
                          <option value="both">国内、国际会议</option>
                    </select>
                      </div>
                    </div>
                    <div class="form-group half">
                      <label>会议状态 <span class="required-mark">*</span></label>
                      <div class="select-with-icon">
                        <i class="el-icon-time"></i>
                        <select v-model="newMeeting.status">
                          <option value="preparing">筹备中</option>
                          <option value="ongoing">进行中</option>
                          <option value="finished">已结束</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-section-divider"></div>
                  
                  <div class="form-row">
                    <div class="form-group full">
                      <label>会议负责人 <span class="required-mark">*</span></label>
                      <div class="input-with-icon">
                        <i class="el-icon-user"></i>
                        <input type="text" v-model="newMeeting.manager" placeholder="请输入会议负责人姓名" @input="validateManager">
                      </div>
                      <span v-if="managerError" class="error-message">{{ managerError }}</span>
                    </div>
                  </div>
                  
                  <div class="form-row">
                    <div class="form-group full">
                      <label>会议描述</label>
                      <div class="textarea-with-count">
                        <textarea 
                          v-model="newMeeting.description" 
                          placeholder="请简要描述会议内容、目的和亮点"
                          rows="3"
                        ></textarea>
                        <div class="char-count">{{ newMeeting.description ? newMeeting.description.length : 0 }}/500</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 时间地点 -->
              <div class="form-card">
                <div class="form-card-header">
                  <div class="form-card-title">
                    <i class="el-icon-date"></i>
                    <span>时间地点</span>
                  </div>
                </div>
                
                <div class="form-card-body">
                <div class="form-row">
                  <div class="form-group half">
                      <label>会议开始时间 <span class="required-mark">*</span></label>
                      <div class="date-picker-wrapper">
                    <el-date-picker
                      v-model="newMeeting.startTime"
                      type="datetime"
                      placeholder="选择开始时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @change="validateStartTime"
                      :picker-options="pickerOptions"
                          style="width: 100%">
                        </el-date-picker>
                      </div>
                    <span v-if="startTimeError" class="error-message">{{ startTimeError }}</span>
                  </div>
                  <div class="form-group half">
                      <label>会议结束时间 <span class="required-mark">*</span></label>
                      <div class="date-picker-wrapper">
                        <el-date-picker
                          v-model="newMeeting.endTime"
                          type="datetime"
                          placeholder="选择结束时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          @change="validateEndTime"
                          :picker-options="pickerOptions"
                          style="width: 100%">
                        </el-date-picker>
                      </div>
                    <span v-if="endTimeError" class="error-message">{{ endTimeError }}</span>
                  </div>
                </div>
                  
                  <div class="form-section-divider"></div>
                  
                <div class="form-row">
                  <div class="form-group full">
                      <label>会议地点 <span class="required-mark">*</span></label>
                      <div class="input-with-icon">
                        <i class="el-icon-location"></i>
                    <input type="text" v-model="newMeeting.location" placeholder="请输入会议地点" @input="validateLocation">
                      </div>
                    <span v-if="locationError" class="error-message">{{ locationError }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分会场设置 -->
              <div class="form-card">
                <div class="form-card-header">
                  <div class="form-card-title">
                    <i class="el-icon-office-building"></i>
                    <span>分会场设置</span>
                        </div>
                  <button class="add-venue-button" @click="addSubVenue">
                    <i class="el-icon-plus"></i> 添加分会场
                  </button>
                        </div>
                
                <div class="form-card-body">
                  <div v-if="newMeeting.subVenues.length === 0" class="empty-venues">
                    <div class="empty-icon"><i class="el-icon-place"></i></div>
                    <div class="empty-text">暂无分会场，点击"添加分会场"创建</div>
                      </div>
                  
                  <div v-else class="sub-venues-list">
                    <div v-for="(venue, index) in newMeeting.subVenues" :key="index" class="sub-venue-card">
                      <div class="venue-header">
                        <div class="venue-title">分会场 #{{ index + 1 }}</div>
                        <button class="venue-delete" @click="removeSubVenue(index)">
                          <i class="el-icon-delete"></i>
                        </button>
                      </div>
                      <div class="venue-content">
                      <div class="form-row">
                        <div class="form-group half">
                            <label>分会场名称 <span class="required-mark">*</span></label>
                            <div class="input-with-icon">
                              <i class="el-icon-house"></i>
                              <input type="text" v-model="venue.name" placeholder="请输入分会场名称">
                            </div>
                        </div>
                        <div class="form-group half">
                            <label>允许参加人数 <span class="required-mark">*</span></label>
                            <div class="input-with-icon">
                              <i class="el-icon-user"></i>
                              <input type="number" min="1" v-model="venue.capacity" placeholder="请输入允许参加人数">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
            
            <div class="modal-footer">
              <div class="buttons-container">
                <button class="draft-button" @click="saveDraft">
                  <i class="el-icon-document-copy"></i> 保存草稿
                </button>
              <button class="cancel-button" @click="showCreateMeetingModal = false">取消</button>
                <button class="submit-button" @click="handleSubmit">
                  创建会议 <i class="el-icon-check"></i>
                </button>
              </div>
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
import { getMeetings, createMeeting, updateMeeting, deleteMeeting, handleApiError } from '@/api/meeting';
import { logout } from '@/api/auth';

export default {
  name: 'AdminCenter',
  data() {
    return {
      activeMenu: 'meetings',
      unreadCount: 5,
      meetings: [],
      loading: false,
      showCreateMeetingModal: false,
      meetingSearch: '',
      meetingStatusFilter: '',
      meetingDateFilter: '',
      currentStep: 1,
      username: '管理员',
      newMeeting: {
        title: '',
        type: 'domestic',
        status: 'preparing',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        manager: '',
        subVenues: [],
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
      startTimeError: '',
      endTimeError: '',
      locationError: '',
      managerError: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
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
    this.fetchUserInfo();
    this.initMeetings();
  },
  methods: {
    fetchUserInfo() {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          this.username = user.username || '管理员';
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    initMeetings() {
      this.loading = true;
      // 添加时间戳参数以避免缓存
      const params = {
        timestamp: new Date().getTime()
      };
      
      getMeetings(params)
        .then(response => {
          console.log('会议列表API响应:', response);
          // 正确处理会议数据，兼容多种返回格式
          let meetingsData = [];
          if (response && Array.isArray(response.meetings)) {
            meetingsData = response.meetings;
          } else if (Array.isArray(response)) {
            meetingsData = response;
          } else if (response && response.code === 200 && Array.isArray(response.data)) {
            meetingsData = response.data;
          } else {
            this.$message.error('获取会议列表失败：数据格式不正确');
            console.error('无法解析会议数据:', response);
            this.loading = false;
            return;
          }
          
          // 为每个会议添加类型文本和状态文本
          this.meetings = meetingsData.map(meeting => {
            return {
              ...meeting,
              typeText: this.getTypeText(meeting.type),
              statusText: this.getStatusText(meeting.status)
            };
          });
          
          console.log('处理后的会议数据:', this.meetings);
        })
        .catch(error => {
          this.$message.error(handleApiError(error) || '获取会议列表失败');
          console.error('获取会议列表错误:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    editMeeting(meeting) {
      // 深拷贝会议对象，避免直接修改列表中的数据
      this.newMeeting = JSON.parse(JSON.stringify(meeting));
      
      // 确保会议对象中的subVenues字段是数组
      if (!this.newMeeting.subVenues) {
        this.newMeeting.subVenues = [];
      }
      
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
    handleSubmit() {
      if (this.validateForm()) {
        // 构建要提交的会议数据
        const meetingData = { ...this.newMeeting };
        
        // 显示加载中状态
        const loading = this.$loading({
          lock: true,
          text: '创建会议中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        
        // 调用API创建新会议
        createMeeting(meetingData)
          .then(response => {
            console.log('创建会议API响应:', response);
            // 修改判断条件，兼容多种响应格式
            if (response && (response.code === 200 || response.id || (typeof response === 'object' && !response.error))) {
        this.$message.success('会议创建成功');
              this.closeModal();
              this.initMeetings(); // 修改为正确的刷新方法名
            } else {
              this.$message.error(response && response.msg ? response.msg : '创建会议失败');
              console.error('会议创建失败:', response);
            }
          })
          .catch(error => {
            console.error('会议创建错误:', error);
            this.$message.error(handleApiError(error) || '创建会议失败，请稍后重试');
          })
          .finally(() => {
            loading.close();
          });
      }
    },
    resetForm() {
      this.newMeeting = {
        title: '',
        type: 'domestic',
        status: 'preparing',
        startTime: '',
        endTime: '',
        location: '',
        description: '',
        manager: '',
        subVenues: [],
      };
      this.titleError = '';
      this.startTimeError = '';
      this.endTimeError = '';
      this.locationError = '';
      this.managerError = '';
      
      console.log('表单已重置，newMeeting:', this.newMeeting);
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
      console.log('startTime值为:', this.newMeeting.startTime);
      if (!this.newMeeting.startTime) {
        this.startTimeError = '会议开始时间不能为空';
      } else {
        this.startTimeError = '';
        // 如果结束时间已经设置，验证开始时间是否早于结束时间
        if (this.newMeeting.endTime) {
          const startTime = new Date(this.newMeeting.startTime);
          const endTime = new Date(this.newMeeting.endTime);
          if (startTime >= endTime) {
            this.startTimeError = '开始时间必须早于结束时间';
          }
        }
      }
    },
    validateEndTime() {
      console.log('endTime值为:', this.newMeeting.endTime);
      if (!this.newMeeting.endTime) {
        this.endTimeError = '会议结束时间不能为空';
      } else {
        this.endTimeError = '';
        // 如果开始时间已经设置，验证结束时间是否晚于开始时间
        if (this.newMeeting.startTime) {
          const startTime = new Date(this.newMeeting.startTime);
          const endTime = new Date(this.newMeeting.endTime);
          if (endTime <= startTime) {
            this.endTimeError = '结束时间必须晚于开始时间';
          }
        }
      }
    },
    validateManager() {
      this.managerError = this.newMeeting.manager ? '' : '会议负责人不能为空';
    },
    openCreateMeetingModal() {
      console.log('Opening create meeting modal');
      // 确保先重置表单
      this.resetForm();
      // 初始化默认开始和结束时间
      const now = new Date();
      const formattedNow = this.formatDateTime(now);
      const oneWeekLater = new Date(now);
      oneWeekLater.setDate(now.getDate() + 7);
      const formattedOneWeekLater = this.formatDateTime(oneWeekLater);
      
      this.newMeeting.startTime = formattedNow;
      this.newMeeting.endTime = formattedOneWeekLater;
      // 设置当前用户为管理员
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      this.newMeeting.manager = userInfo.username || '';
      
      // 然后显示模态窗口
      this.showCreateMeetingModal = true;
      console.log('showCreateMeetingModal:', this.showCreateMeetingModal);
      // 使Vue在下一个事件循环中更新DOM
      this.$nextTick(() => {
        console.log('表单重置后的newMeeting:', this.newMeeting);
        // 确保日期选择器正确渲染
        const datePickers = document.querySelectorAll('.el-date-editor');
        datePickers.forEach(picker => {
          picker.style.width = '100%';
        });
        
        // 额外对日期选择器容器进行处理
        const datePickerWrappers = document.querySelectorAll('.date-picker-wrapper');
        datePickerWrappers.forEach(wrapper => {
          wrapper.style.position = 'relative';
          wrapper.style.width = '100%';
          wrapper.style.zIndex = '100';
          
          // 查找其中的日期选择器并设置宽度
          const datePickerElement = wrapper.querySelector('.el-date-editor');
          if (datePickerElement) {
            datePickerElement.style.width = '100%';
          }
          
          // 确保输入框宽度正确
          const inputElement = wrapper.querySelector('.el-input__inner');
          if (inputElement) {
            inputElement.style.width = '100%';
          }
        });
        
        // 设置创建会议模态框的z-index，确保在日期选择器之下
        const modalElement = document.querySelector('.create-meeting-modal');
        if (modalElement) {
          modalElement.style.zIndex = '2001';
        }
      });
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
      this.$router.push('/user-center');
    },
    logout() {
      logout(); // 调用API中的logout方法清除token
      this.$message.success('退出登录成功');
      this.$router.push('/'); // 跳转到首页
    },
    validateForm() {
      // 验证必填字段
      this.validateTitle();
      this.validateStartTime();
      this.validateEndTime();
      this.validateLocation();
      this.validateManager();
      
      // 验证分会场字段
      let subVenuesValid = true;
      if (this.newMeeting.subVenues && this.newMeeting.subVenues.length > 0) {
        for (const venue of this.newMeeting.subVenues) {
          if (!venue.name || !venue.capacity) {
            subVenuesValid = false;
            break;
          }
        }
      }
      
      // 判断是否有错误
      const hasErrors = this.titleError || this.startTimeError || this.endTimeError || 
                        this.locationError || this.managerError || !subVenuesValid;
      
      if (hasErrors) {
        // 显示错误信息
        if (!subVenuesValid) {
          this.$message.error('请完善分会场必填信息');
        } else {
          this.$message.error('请完善必填信息');
        }
        return false;
      }
      
      return true;
    },
    closeModal() {
      this.showCreateMeetingModal = false;
      // 重置表单，避免下次打开时显示上次的数据
      this.resetForm();
    },
    handleStartTimeChange(value) {
      console.log('开始时间变化:', value);
      this.validateStartTime();
    },
    handleEndTimeChange(value) {
      console.log('结束时间变化:', value);
      this.validateEndTime();
    },
    // 获取会议类型文本
    getTypeText(type) {
      const typeMap = {
        'domestic': '国内会议',
        'international': '国际会议',
        'both': '国内、国际会议',
        'offline': '线下会议',
        'online': '线上会议',
        'hybrid': '混合会议'
      };
      return typeMap[type] || type || '未知类型';
    },
    
    // 获取会议状态文本
    getStatusText(status) {
      const statusMap = {
        'preparing': '筹备中',
        'ongoing': '进行中',
        'finished': '已结束',
        'upcoming': '筹备中',
        'confirmed': '已确认',
        'completed': '已结束',
        'draft': '草稿'
      };
      return statusMap[status] || status || '未知状态';
    },
    // 确认删除会议
    confirmDeleteMeeting(meeting) {
      this.$confirm(`确定要删除会议"${meeting.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteMeeting(meeting.id);
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    
    // 删除会议
    deleteMeeting(id) {
      const loading = this.$loading({
        lock: true,
        text: '删除中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      console.log('删除会议，ID:', id);
      
      deleteMeeting(id)
        .then(response => {
          console.log('删除会议API响应:', response);
          
          // 兼容多种响应格式
          const isSuccess = 
            // 标准响应格式
            (response && response.code === 200) || 
            // 消息格式
            (response && response.message === '会议删除成功') ||
            // 字符串格式
            (typeof response === 'string' && response.includes('成功')) ||
            // 简单对象格式
            (response && !response.error);
          
          if (isSuccess) {
            this.$message.success('删除成功');
            // 延迟一点再刷新，确保后端处理完成
            setTimeout(() => {
              this.initMeetings();
            }, 300);
          } else {
            console.error('删除会议失败，响应:', response);
            this.$message.error((response && response.msg) || '删除失败');
            // 尝试刷新列表，因为可能已经成功删除
            setTimeout(() => {
              this.initMeetings();
            }, 500);
          }
        })
        .catch(error => {
          console.error('删除会议发生错误:', error);
          this.$message.error(handleApiError(error));
          // 同样尝试刷新，因为错误可能是前端解析问题
          setTimeout(() => {
            this.initMeetings();
          }, 500);
        })
        .finally(() => {
          loading.close();
        });
    },
    // 格式化日期时间为 yyyy-MM-dd HH:mm:ss
    formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
  border-radius: 16px;
  padding: 24px;
  overflow-x: auto;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.meetings-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.meetings-table th, .meetings-table td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eaedf2;
  vertical-align: middle;
}

.meetings-table th {
  background-color: #f8f9fc;
  font-weight: 600;
  color: #5e6c84;
  font-size: 14px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.meetings-table th:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.meetings-table th:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.meetings-table tr {
  transition: background-color 0.2s;
}

.meetings-table tbody tr:hover {
  background-color: #f8faff;
}

.meeting-name-cell {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.meeting-name-cell i {
  color: #007aff;
  font-size: 18px;
  margin-top: 3px;
}

.meeting-name-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 100%;
}

.meeting-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.meeting-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meeting-description-preview {
  font-size: 13px;
  color: #7a869a;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
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
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  white-space: nowrap;
}

.meeting-type-badge {
  background-color: #f0f7ff;
  color: #007aff;
}

.meeting-type-badge.domestic {
  background-color: #e0f7fa;
  color: #00acc1;
}

.meeting-type-badge.international {
  background-color: #f3e5f5;
  color: #ab47bc;
}

.meeting-type-badge.both {
  background-color: #e8f5e9;
  color: #43a047;
}

.meeting-type-badge.offline {
  background-color: #e3f2fd;
  color: #2196f3;
}

.meeting-type-badge.online {
  background-color: #e8eaf6;
  color: #3f51b5;
}

.meeting-type-badge.hybrid {
  background-color: #fff8e1;
  color: #ffa000;
}

.meeting-status-badge {
  background-color: #eeeeee;
  color: #757575;
}

.meeting-status-badge.upcoming, 
.meeting-status-badge.preparing {
  background-color: #e3f2fd;
  color: #1976d2;
}

.meeting-status-badge.confirmed, 
.meeting-status-badge.ongoing {
  background-color: #e8f5e9;
  color: #388e3c;
}

.meeting-status-badge.completed, 
.meeting-status-badge.finished {
  background-color: #f5f5f5;
  color: #616161;
}

.meeting-status-badge.draft {
  background-color: #fff3e0;
  color: #ff9800;
}

.table-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background-color: #f0f7ff;
  color: #007aff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #e0f0ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 122, 255, 0.15);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.action-button.edit-button {
  background-color: #f0f7ff;
  color: #007aff;
}

.action-button.view-button {
  background-color: #f0f9f6;
  color: #00c48c;
}

.action-button.settings-button {
  background-color: #f6f7f9;
  color: #5e6c84;
}

.action-button.delete-button {
  background-color: #ff3b30;
  color: white;
}

.action-button.delete-button:hover {
  background-color: #e60000;
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
  z-index: 2000;
}

.modal {
  background-color: #fff;
  border-radius: 12px;
  width: 800px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 2001;
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eaedf2;
  background-color: #f8f8f8;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  user-select: none;
}

.modal-header h3 {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin: 0;
  flex: 1;
  text-align: center;
}

.modal-body {
  padding: 20px 24px;
}

.mac-window-controls {
  padding-left: 8px;
}

.modal-footer {
  padding: 20px 24px;
  margin-top: 16px;
  border-top: 1px solid #eaedf2;
}

.buttons-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.draft-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: white;
  color: #7a869a;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.draft-button:hover {
  background-color: #f5f7fa;
}

.cancel-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: white;
  color: #ff3b30;
  border: 1px solid #ff3b30;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #fff8f8;
}

.submit-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background-color: #34c759;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-button:hover {
  background-color: #28a745;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.loading-container i {
  font-size: 32px;
  color: #409EFF;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 16px;
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

.steps-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 10px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s;
  padding: 15px 0;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  right: -50%;
  width: 100%;
  height: 2px;
  background-color: #ddd;
  z-index: 0;
}

.step-item.active:not(:last-child)::after,
.step-item.completed:not(:last-child)::after {
  background-color: #007aff;
}

.step-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f5f7fa;
  border: 2px solid #ddd;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.step-item.active .step-number {
  background-color: #007aff;
  color: white;
  border-color: #007aff;
}

.step-item.completed .step-number {
  background-color: #007aff;
  color: white;
  border-color: #007aff;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.step-item.active .step-title {
  color: #007aff;
  font-weight: 600;
}

.required-mark {
  color: #ff3b30;
  font-weight: bold;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.tags-input-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background-color: #f0f7ff;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.3s;
}

.tag-item i {
  cursor: pointer;
  font-size: 12px;
}

.tag-item:hover {
  background-color: #e0f0ff;
}

.tags-input-wrapper {
  display: flex;
  gap: 10px;
}

.add-tag-btn {
  padding: 8px 16px;
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-tag-btn:hover {
  background-color: #005bb5;
}

.radio-group {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.empty-venues {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #ddd;
  padding: 30px;
  margin: 20px 0;
}

.empty-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-text {
  color: #999;
}

.sub-venue-card {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #eee;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.venue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.venue-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.venue-delete {
  padding: 6px;
  background-color: #fff0f0;
  color: #ff3b30;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.venue-delete:hover {
  background-color: #ffe0e0;
}

.venue-content {
  padding: 16px;
}

/* 添加日期选择器样式 */
.date-picker-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 5px;
  z-index: 100;
}

/* 确保日期选择器显示正常 */
.date-picker-wrapper >>> .el-input {
  width: 100%;
}

.date-picker-wrapper >>> .el-input__inner {
  width: 100%;
}

/* 确保日期选择器弹出面板在顶层显示 */
.el-picker-panel {
  z-index: 3000 !important;
}

.el-date-picker {
  width: 100% !important;
}

/* 修复弹出层样式 */
.modal-overlay {
  z-index: 2000;
}

.modal {
  z-index: 2001;
}

/* 修复el-date-picker中的图标显示 */
.date-picker-wrapper >>> .el-input__icon {
  line-height: 40px;
}

/* 新的卡片式表单样式 */
.form-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
}

.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  background-color: #f7f8fa;
  border-bottom: 1px solid #eaedf2;
}

.form-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.form-card-title i {
  font-size: 18px;
  color: #007aff;
}

.form-card-body {
  padding: 24px;
}

/* 输入框样式优化 */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon i {
  position: absolute;
  left: 12px;
  color: #7a869a;
  font-size: 16px;
  z-index: 1;
}

.input-with-icon input {
  padding-left: 40px;
  height: 40px;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  transition: all 0.3s;
}

.input-with-icon input:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* 下拉选择框样式优化 */
.select-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.select-with-icon i {
  position: absolute;
  left: 12px;
  color: #7a869a;
  font-size: 16px;
  z-index: 1;
}

.select-with-icon select {
  padding-left: 40px;
  height: 40px;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237a869a'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: all 0.3s;
}

.select-with-icon select:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* 文本区域样式优化 */
.textarea-with-count {
  position: relative;
}

.textarea-with-count textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  min-height: 100px;
  transition: all 0.3s;
}

.textarea-with-count textarea:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.textarea-with-count .char-count {
  position: absolute;
  bottom: -22px;
  right: 0;
  font-size: 12px;
  color: #7a869a;
}

/* 添加分会场按钮样式 */
.add-venue-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background-color: #f0f7ff;
  color: #007aff;
  border: 1px solid #d0e2ff;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-venue-button:hover {
  background-color: #e0f0ff;
}

.add-venue-button i {
  font-size: 14px;
}

/* 分会场卡片样式优化 */
.sub-venue-card {
  background-color: #f9f9fc;
  border: 1px solid #e0e5ee;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.venue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f1f4f8;
  border-bottom: 1px solid #e0e5ee;
}

.venue-title {
  font-weight: 600;
  color: #2c3e50;
}

.venue-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #fff2f2;
  color: #ff3b30;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

/* Mac风格窗口控制按钮 */
.mac-window-controls {
  display: flex;
  gap: 8px;
}

.mac-close-button,
.mac-minimize-button,
.mac-maximize-button {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.mac-close-button {
  background-color: #ff5f56;
}

.mac-minimize-button {
  background-color: #ffbd2e;
}

.mac-maximize-button {
  background-color: #27c93f;
}

.mac-close-button:hover {
  background-color: #ff3026;
}

.mac-minimize-button:hover {
  background-color: #ffac00;
}

.mac-maximize-button:hover {
  background-color: #1aab2f;
}

.mac-close-button:hover .mac-close-icon,
.mac-minimize-button:hover .mac-minimize-icon,
.mac-maximize-button:hover .mac-maximize-icon {
  opacity: 1;
}

.mac-close-icon,
.mac-minimize-icon,
.mac-maximize-icon {
  opacity: 0;
  position: relative;
  width: 8px;
  height: 8px;
}

.mac-close-icon:before,
.mac-close-icon:after {
  content: '';
  position: absolute;
  width: 8px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.5);
  top: 3.5px;
  left: 0;
}

.mac-close-icon:before {
  transform: rotate(45deg);
}

.mac-close-icon:after {
  transform: rotate(-45deg);
}

.mac-minimize-icon:before {
  content: '';
  position: absolute;
  width: 8px;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.5);
  top: 3.5px;
  left: 0;
}

.mac-maximize-icon:before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
}

.header-placeholder {
  width: 36px; /* 与mac-window-controls宽度保持一致 */
}

.date-time-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  transition: border-color 0.2s;
}

.date-time-input:hover {
  border-color: #c0c4cc;
}

.date-time-input:focus {
  outline: none;
  border-color: #409eff;
}

.meeting-manager {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #555;
}

.meeting-manager i {
  font-size: 16px;
  color: #3498db;
}
</style> 