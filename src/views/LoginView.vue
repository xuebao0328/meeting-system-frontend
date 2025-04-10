<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <div class="login-tabs">
        <button 
          :class="{ active: loginMethod === 'account' }" 
          @click="loginMethod = 'account'"
        >
          账号密码登录
        </button>
        <button 
          :class="{ active: loginMethod === 'phone' }" 
          @click="loginMethod = 'phone'"
        >
          手机验证码登录
        </button>
      </div>

      <!-- 账号密码登录表单 -->
      <form v-if="loginMethod === 'account'" @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            v-model="accountForm.username"
            type="text"
            placeholder="用户名/邮箱/手机号"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="accountForm.password"
            type="password"
            placeholder="密码"
            required
          />
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>

      <!-- 手机验证码登录表单 -->
      <form v-else @submit.prevent="handleLogin">
        <div class="form-group">
          <input
            v-model="phoneForm.phone"
            type="text"
            placeholder="手机号"
            required
          />
        </div>
        <div class="form-group verification-code">
          <input
            v-model="phoneForm.verificationCode"
            type="text"
            placeholder="验证码"
            required
          />
          <button 
            type="button" 
            @click="sendCode" 
            :disabled="countdown > 0"
            class="send-code-button"
          >
            {{ countdown > 0 ? `${countdown}s后重新发送` : '发送验证码' }}
          </button>
        </div>
        <button type="submit" class="login-button">登录</button>
      </form>

      <div class="form-footer">
        <router-link to="/register">还没有账号？立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { login, sendVerificationCode } from '@/api/auth';

export default {
  name: 'LoginView',
  data() {
    return {
      loginMethod: 'account',
      accountForm: {
        username: '',
        password: ''
      },
      phoneForm: {
        phone: '',
        verificationCode: ''
      },
      countdown: 0
    };
  },
  methods: {
    async handleLogin() {
      try {
        const loginData = this.loginMethod === 'account' 
          ? { 
              loginMethod: 'account',
              ...this.accountForm 
            }
          : { 
              loginMethod: 'phone',
              ...this.phoneForm 
            };

        const response = await login(loginData);
        
        // 保存 token 和用户信息
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // 跳转到首页
        this.$router.push('/');
      } catch (error) {
        console.error('登录失败:', error);
        alert(error.response && error.response.data && error.response.data.message || '登录失败，请重试');
      }
    },
    async sendCode() {
      if (!this.phoneForm.phone) {
        alert('请输入手机号');
        return;
      }
      
      try {
        await sendVerificationCode(this.phoneForm.phone);
        this.startCountdown();
      } catch (error) {
        console.error('发送验证码失败:', error);
        alert(error.response && error.response.data && error.response.data.message || '发送验证码失败，请重试');
      }
    },
    startCountdown() {
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.login-tabs button {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.login-tabs button.active {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.verification-code {
  display: flex;
  gap: 10px;
}

.verification-code input {
  flex: 1;
}

.send-code-button {
  padding: 0 15px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.send-code-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background: #40a9ff;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

.form-footer a {
  color: #1890ff;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}
</style> 