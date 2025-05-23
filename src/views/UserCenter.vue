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
          <el-dropdown trigger="click">
            <i class="el-icon-arrow-down el-icon--right" style="cursor: pointer;"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="goToAdminCenter">管理中心</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 内容区域 -->
    <div class="content-container">
      <div class="profile-section">
        <!-- 个人信息卡片 -->
        <el-card class="info-card" shadow="hover">
          <div class="card-header">
            <h3><i class="el-icon-user"></i> 个人资料</h3>
          </div>
          <div class="info-header">
            <div class="avatar-section">
              <div class="avatar">
                <img src="/avatar-placeholder.png" alt="用户头像" />
              </div>
              <div class="upload-avatar">
                <el-button type="text" icon="el-icon-camera">更换头像</el-button>
              </div>
            </div>
            <div class="info-section">
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-user-solid"></i> 姓名：</span>
                  <span class="info-value">{{ userProfileInfo.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-male"></i> 性别：</span>
                  <span class="info-value">{{ userProfileInfo.gender }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-mobile-phone"></i> 手机号码：</span>
                  <span class="info-value">{{ userProfileInfo.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-message"></i> 电子邮箱：</span>
                  <span class="info-value">{{ userProfileInfo.email }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="info-label"><i class="el-icon-document"></i> 身份证号：</span>
                  <span class="info-value">{{ userProfileInfo.idNumber }}</span>
                </div>
              </div>
            </div>
            <div class="edit-button-wrapper">
              <el-button 
                type="primary" 
                icon="el-icon-edit" 
                class="edit-button"
                @click="editUserProfile"
                round
              >
                编辑资料
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 会议记录卡片 -->
      <div class="meetings-section">
        <el-card class="tabs-card" shadow="hover">
          <div class="card-header">
            <h3><i class="el-icon-date"></i> 会议记录</h3>
          </div>
          <el-tabs v-model="activeProfileTab" @tab-click="handleProfileTabChange" type="border-card">
            <el-tab-pane label="缴费状态" name="1">
              <el-table 
                :data="meetingData" 
                class="meeting-table"
                :stripe="true"
                border
                style="width: 100%"
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
                    <el-tag :type="scope.row.status === '待支付' ? 'warning' : (scope.row.status === '已支付' ? 'success' : 'info')">
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
                    <el-button v-if="scope.row.operation" type="primary" size="mini" round>
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
                style="width: 100%"
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
                    <el-tag :type="scope.row.status === '待支付' ? 'warning' : (scope.row.status === '已支付' ? 'success' : 'info')">
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
                    <el-button v-if="scope.row.operation" type="primary" size="mini" round>
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

    <!-- 编辑个人信息弹窗 -->
    <el-dialog 
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      custom-class="mac-style-dialog"
      width="500px"
    >
      <div slot="title" class="dialog-title">
        <div class="mac-window-controls">
          <button class="mac-close-button" @click="cancelEdit" title="关闭">
            <span class="mac-close-icon"></span>
          </button>
          <button class="mac-minimize-button" title="最小化">
            <span class="mac-minimize-icon"></span>
          </button>
          <button class="mac-maximize-button" title="最大化">
            <span class="mac-maximize-icon"></span>
          </button>
        </div>
        <h3>编辑个人信息</h3>
        <div class="header-placeholder"></div>
      </div>

      <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="editForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入电子邮箱"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="editForm.idNumber" placeholder="请输入身份证号"></el-input>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <div class="buttons-container">
          <button class="dialog-btn warning-btn" @click="showChangePasswordDialog">
            <i class="el-icon-lock"></i> 修改密码
          </button>
          <div>
            <button class="dialog-btn cancel-btn" @click="cancelEdit">取消</button>
            <button class="dialog-btn submit-btn" @click="submitEditForm" :disabled="submitLoading">
              确定 <i class="el-icon-check" v-if="!submitLoading"></i>
              <i class="el-icon-loading" v-else></i>
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 修改密码弹窗 -->
    <el-dialog 
      :visible.sync="passwordDialogVisible"
      :close-on-click-modal="false"
      custom-class="mac-style-dialog"
      width="500px"
    >
      <div slot="title" class="dialog-title">
        <div class="mac-window-controls">
          <button class="mac-close-button" @click="cancelPasswordChange" title="关闭">
            <span class="mac-close-icon"></span>
          </button>
          <button class="mac-minimize-button" title="最小化">
            <span class="mac-minimize-icon"></span>
          </button>
          <button class="mac-maximize-button" title="最大化">
            <span class="mac-maximize-icon"></span>
          </button>
        </div>
        <h3>修改密码</h3>
        <div class="header-placeholder"></div>
      </div>

      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="120px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码" show-password></el-input>
        </el-form-item>
        <el-form-item v-if="!oldPasswordVerified" style="margin-bottom: 0;">
          <el-button type="primary" @click="verifyOldPassword" :loading="verifyLoading">验证原密码</el-button>
        </el-form-item>
        
        <template v-if="oldPasswordVerified">
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password></el-input>
          </el-form-item>
        </template>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <div class="buttons-container">
          <div style="flex: 1;"></div>
          <div>
            <button class="dialog-btn cancel-btn" @click="cancelPasswordChange">取消</button>
            <button class="dialog-btn submit-btn" @click="submitPasswordForm" :disabled="!oldPasswordVerified || passwordSubmitLoading">
              确定 <i class="el-icon-check" v-if="!passwordSubmitLoading"></i>
              <i class="el-icon-loading" v-else></i>
            </button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from '@/api/auth';

export default {
  name: 'UserCenter',
  data() {
    // 确认密码验证规则
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      unreadCount: 3,
      activeProfileTab: '1',
      currentPage: 1,
      pageSize: 10,
      userProfileInfo: {
        name: '',
        gender: '',
        phone: '',
        email: '',
        idNumber: ''
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
      ],
      
      // 编辑弹窗相关数据
      editDialogVisible: false,
      submitLoading: false,
      editForm: {
        name: '',
        gender: '',
        phone: '',
        email: '',
        idNumber: ''
      },
      editRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        idNumber: [
          { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号', trigger: 'blur' }
        ]
      },
      
      // 修改密码相关数据
      passwordDialogVisible: false,
      oldPasswordVerified: false,
      verifyLoading: false,
      passwordSubmitLoading: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    fetchUserInfo() {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          // 更新用户信息
          this.userProfileInfo = {
            name: user.username || '',
            gender: user.gender || '未知',
            phone: user.phone || '',
            email: user.email || '',
            idNumber: user.idNumber || ''
          };
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
    editUserProfile() {
      // 打开编辑弹窗并初始化表单数据
      this.editForm = {
        name: this.userProfileInfo.name,
        gender: this.userProfileInfo.gender,
        phone: this.userProfileInfo.phone,
        email: this.userProfileInfo.email,
        idNumber: this.userProfileInfo.idNumber
      };
      this.editDialogVisible = true;
    },
    cancelEdit() {
      this.editDialogVisible = false;
      this.$refs.editForm.resetFields();
    },
    submitEditForm() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          
          // 这里应调用后端API更新用户信息
          // 由于工具调用受限，我们模拟API调用行为
          setTimeout(() => {
            // 更新本地用户信息
            this.userProfileInfo = {
              ...this.editForm
            };
            
            // 将更新后的信息保存到localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
              try {
                const user = JSON.parse(userStr);
                user.username = this.editForm.name;
                user.gender = this.editForm.gender;
                user.phone = this.editForm.phone;
                user.email = this.editForm.email;
                user.idNumber = this.editForm.idNumber;
                localStorage.setItem('user', JSON.stringify(user));
              } catch (error) {
                console.error('保存用户信息失败:', error);
              }
            }
            
            this.$message.success('个人信息更新成功');
            this.submitLoading = false;
            this.editDialogVisible = false;
          }, 1000);
        }
      });
    },
    showChangePasswordDialog() {
      this.passwordDialogVisible = true;
      this.oldPasswordVerified = false;
      this.passwordForm = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetFields();
      }
    },
    cancelPasswordChange() {
      this.passwordDialogVisible = false;
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetFields();
      }
    },
    verifyOldPassword() {
      this.$refs.passwordForm.validateField('oldPassword', (errorMessage) => {
        if (!errorMessage) {
          this.verifyLoading = true;
          
          // 这里应调用后端API验证原密码是否正确
          // 由于工具调用受限，我们模拟API调用行为
          setTimeout(() => {
            // 假设验证成功
            this.oldPasswordVerified = true;
            this.verifyLoading = false;
            this.$message.success('原密码验证成功，请设置新密码');
          }, 1000);
        }
      });
    },
    submitPasswordForm() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.passwordSubmitLoading = true;
          
          // 这里应调用后端API更新密码
          // 由于工具调用受限，我们模拟API调用行为
          setTimeout(() => {
            this.$message.success('密码修改成功');
            this.passwordSubmitLoading = false;
            this.passwordDialogVisible = false;
          }, 1000);
        }
      });
    },
    handleProfileTabChange(tab) {
      console.log('切换到标签: ', tab.name);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      console.log('每页显示数量: ', size);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    goToAdminCenter() {
      this.$router.push('/admin-center');
    },
    logout() {
      logout(); // 调用API中的logout方法清除token
      this.$message.success('退出登录成功');
      this.$router.push('/'); // 跳转到首页
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
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.page-title:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #409EFF;
  border-radius: 2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  font-size: 20px;
  color: #606266;
}

.notification-icon:hover {
  color: #409EFF;
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #fff;
}

.username {
  font-weight: 500;
  color: #303133;
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
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
  display: flex;
  align-items: center;
}

.card-header i {
  margin-right: 8px;
  color: #409EFF;
}

.info-header {
  display: flex;
  align-items: flex-start;
}

.avatar-section {
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-section .avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 3px solid #fff;
}

.avatar-section .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-avatar {
  margin-top: 5px;
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
  color: #909399;
  display: inline-flex;
  align-items: center;
}

.info-label i {
  margin-right: 5px;
  font-size: 16px;
  color: #409EFF;
}

.info-value {
  font-weight: 500;
  color: #303133;
  margin-left: 5px;
}

.edit-button-wrapper {
  margin-left: auto;
}

.edit-button {
  padding: 9px 20px;
}

/* 标签页和表格 */
.tabs-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.meeting-table {
  width: 100%;
  margin-bottom: 20px;
}

.el-table th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 600;
}

.pagination-container {
  text-align: right;
  padding: 15px 0;
}

/* 弹窗样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.el-form-item {
  margin-bottom: 22px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .info-header {
    flex-direction: column;
  }
  
  .avatar-section {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .info-item {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .edit-button-wrapper {
    margin-left: 0;
    margin-top: 20px;
  }
}

/* Mac风格弹窗样式 */
.mac-style-dialog {
  border-radius: 8px;
  overflow: hidden;
}

.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.dialog-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.mac-window-controls {
  display: flex;
  gap: 8px;
}

.mac-close-button,
.mac-minimize-button,
.mac-maximize-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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

/* 弹窗底部按钮样式 */
.buttons-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.dialog-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s;
  margin-left: 10px;
}

.dialog-btn i {
  font-size: 14px;
}

.cancel-btn {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.cancel-btn:hover {
  background-color: #e6e8eb;
  color: #303133;
}

.submit-btn {
  background-color: #409EFF;
  color: white;
}

.submit-btn:hover {
  background-color: #66b1ff;
}

.warning-btn {
  background-color: #F39C12;
  color: white;
}

.warning-btn:hover {
  background-color: #F5B041;
}

.dialog-btn:disabled {
  background-color: #f5f7fa;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style> 