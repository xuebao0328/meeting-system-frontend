<template>
  <div class="user-center">
    <!-- 顶部导航栏 -->
    <header class="top-bar">
      <div class="page-title">个人中心</div>
      <div class="user-info">
        <div class="notification-icon">
          <i class="el-icon-bell"></i>
          <span class="badge" v-if="unreadCount">{{ unreadCount }}</span>
        </div>
        <div class="user-profile">
          <img src="/avatar-placeholder.png" alt="头像" class="avatar" />
          <span class="username">{{ userProfileInfo.name }}</span>
        </div>
      </div>
    </header>

    <!-- 内容区域 -->
    <div class="content-container">
      <!-- 个人信息卡片 -->
      <el-card class="info-card">
        <div class="info-header">
          <div class="avatar-section">
            <div class="avatar">
              <img src="/avatar-placeholder.png" alt="用户头像" />
            </div>
          </div>
          <div class="info-section">
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">姓名：</span>
                <span class="info-value">{{ userProfileInfo.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">性别：</span>
                <span class="info-value">{{ userProfileInfo.gender }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">手机号码：</span>
                <span class="info-value">{{ userProfileInfo.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">电子邮箱：</span>
                <span class="info-value">{{ userProfileInfo.email }}</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">身份证号：</span>
                <span class="info-value">{{ userProfileInfo.idNumber }}</span>
              </div>
            </div>
          </div>
          <div class="edit-button-wrapper">
            <el-button 
              icon="el-icon-edit" 
              class="edit-button"
              @click="editUserProfile"
            >
              编辑
            </el-button>
          </div>
        </div>
      </el-card>
      
      <!-- 标签页和表格 -->
      <el-card class="tabs-card">
        <el-tabs v-model="activeProfileTab" @tab-click="handleProfileTabChange">
          <el-tab-pane label="缴费状态" name="1">
            <el-table 
              :data="meetingData" 
              class="meeting-table"
              :stripe="true"
              border
            >
              <el-table-column 
                prop="name" 
                label="会议名称" 
                width="30%" 
                :show-overflow-tooltip="true"
              />
              <el-table-column 
                prop="amount" 
                label="缴费金额" 
              />
              <el-table-column 
                prop="status" 
                label="状态" 
              >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === '待支付' ? 'warning' : 'success'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column 
                prop="time" 
                label="支付时间" 
              />
              <el-table-column 
                prop="operation" 
                label="操作" 
              >
                <template slot-scope="scope">
                  <el-button v-if="scope.row.operation" type="text" size="small">
                    {{ scope.row.operation }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="meetingData.length">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="历史记录" name="2">
            <el-table 
              :data="meetingData" 
              class="meeting-table"
              :stripe="true"
            >
              <el-table-column 
                prop="name" 
                label="会议名称" 
                width="30%" 
                :show-overflow-tooltip="true"
              />
              <el-table-column 
                prop="amount" 
                label="缴费金额" 
              />
              <el-table-column 
                prop="status" 
                label="状态" 
              >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.status === '待支付' ? 'warning' : 'success'">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column 
                prop="time" 
                label="支付时间" 
              />
              <el-table-column 
                prop="operation" 
                label="操作" 
              >
                <template slot-scope="scope">
                  <el-button v-if="scope.row.operation" type="text" size="small">
                    {{ scope.row.operation }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="meetingData.length">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCenter',
  data() {
    return {
      unreadCount: 3,
      activeProfileTab: '1',
      currentPage: 1,
      pageSize: 10,
      userProfileInfo: {
        name: '张三',
        gender: '男',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        idNumber: '110101199001011234'
      },
      meetingData: [
        {
          name: '2023年度科技创新大会',
          amount: '￥1200',
          status: '已支付',
          time: '2023-04-15 14:30',
          operation: '查看详情'
        },
        {
          name: '人工智能与未来发展论坛',
          amount: '￥980',
          status: '已支付',
          time: '2023-06-20 09:45',
          operation: '查看详情'
        },
        {
          name: '国际医疗器械展览会',
          amount: '￥1500',
          status: '待支付',
          time: '-',
          operation: '去支付'
        },
        {
          name: '绿色能源与可持续发展大会',
          amount: '￥800',
          status: '已支付',
          time: '2023-09-05 11:20',
          operation: '查看详情'
        },
        {
          name: '数字经济与产业变革峰会',
          amount: '￥1350',
          status: '已支付',
          time: '2023-10-12 15:40',
          operation: '查看详情'
        }
      ]
    };
  },
  methods: {
    editUserProfile() {
      // 编辑用户资料的逻辑
      console.log('编辑用户资料');
    },
    handleProfileTabChange(tab) {
      console.log('切换到标签: ', tab.name);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      console.log('每页显示数量: ', size);
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      console.log('当前页码: ', page);
    }
  }
};
</script>

<style scoped>
.user-center {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 顶部导航栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
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
  background-color: #f56c6c;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 500;
}

/* 内容区域 */
.content-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 个人信息卡片 */
.info-card {
  margin-bottom: 20px;
}

.info-header {
  display: flex;
  align-items: flex-start;
}

.avatar-section {
  margin-right: 30px;
}

.avatar-section .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-section .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  flex: 1;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
}

.info-item {
  margin-right: 40px;
  min-width: 200px;
}

.info-label {
  color: #606266;
}

.info-value {
  font-weight: 500;
  color: #303133;
}

.edit-button-wrapper {
  margin-left: auto;
}

.edit-button {
  padding: 7px 15px;
}

/* 标签页和表格 */
.tabs-card {
  margin-bottom: 20px;
}

.meeting-table {
  width: 100%;
  margin-bottom: 20px;
}

.pagination-container {
  text-align: right;
  padding: 10px 0;
}
</style> 