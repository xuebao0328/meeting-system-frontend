<template>
  <div class="register-container">
    <div class="register-box">
      <h2>注册</h2>
      <div class="register-tabs">
        <button 
          :class="{ active: registerMode === 'phone' }" 
          @click="registerMode = 'phone'"
        >
          手机号注册
        </button>
        <button 
          :class="{ active: registerMode === 'email' }" 
          @click="registerMode = 'email'"
        >
          邮箱注册
        </button>
      </div>

      <!-- 手机号注册表单 -->
      <form v-if="registerMode === 'phone'" @submit.prevent="handleRegister">
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
        <button type="submit" class="register-button">注册</button>
      </form>

      <!-- 邮箱注册表单 -->
      <form v-else @submit.prevent="handleRegister">
        <div class="form-group">
          <input
            v-model="emailForm.email"
            type="email"
            placeholder="邮箱"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="emailForm.password"
            type="password"
            placeholder="设置密码"
            required
            minlength="6"
          />
        </div>
        <div class="form-group">
          <input
            v-model="emailForm.confirmPassword"
            type="password"
            placeholder="确认密码"
            required
            minlength="6"
          />
          <div class="password-hint" v-if="emailForm.password">
            <p :class="{ valid: passwordValid }">密码长度至少6位</p>
            <p :class="{ valid: passwordsMatch }">两次密码输入一致</p>
          </div>
        </div>
        <button type="submit" class="register-button" :disabled="!canRegister">注册</button>
      </form>

      <div class="form-footer">
        <router-link to="/login">已有账号？立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { register, sendVerificationCode } from '@/api/auth';

export default {
  name: 'RegisterView',
  data() {
    return {
      registerMode: 'phone',
      phoneForm: {
        phone: '',
        verificationCode: ''
      },
      emailForm: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      countdown: 0
    };
  },
  computed: {
    passwordValid() {
      return this.emailForm.password.length >= 6;
    },
    passwordsMatch() {
      return this.emailForm.password && this.emailForm.password === this.emailForm.confirmPassword;
    },
    canRegister() {
      return this.registerMode === 'phone' || 
             (this.passwordValid && this.passwordsMatch && this.emailForm.email);
    }
  },
  methods: {
    async handleRegister() {
      try {
        if (this.registerMode === 'email') {
          if (!this.passwordValid) {
            this.$message.error('密码长度至少6位');
            return;
          }
          if (!this.passwordsMatch) {
            this.$message.error('两次输入的密码不一致');
            return;
          }
        }

        const registerData = this.registerMode === 'phone'
          ? {
              registerMode: 'phone',
              ...this.phoneForm
            }
          : {
              registerMode: 'email',
              email: this.emailForm.email,
              password: this.emailForm.password
            };

        const response = await register(registerData);
        
        // 注册成功提示
        this.$message.success('注册成功！正在为您跳转...');
        
        // 注册成功后自动登录
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          this.$router.push('/');
        }, 1500);
      } catch (error) {
        console.error('注册失败:', error);
        const errorMessage = error.response && error.response.data && error.response.data.message || '注册失败，请重试';
        this.$message.error(errorMessage);
      }
    },
    async sendCode() {
      if (!this.phoneForm.phone) {
        this.$message.error('请输入手机号');
        return;
      }
      
      try {
        await sendVerificationCode(this.phoneForm.phone);
        this.startCountdown();
        this.$message.success('验证码已发送');
      } catch (error) {
        console.error('发送验证码失败:', error);
        const errorMessage = error.response && error.response.data && error.response.data.message || '发送验证码失败，请重试';
        this.$message.error(errorMessage);
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-box {
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

.register-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.register-tabs button {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.register-tabs button.active {
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

.register-button {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.register-button:hover {
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

.password-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.password-hint p {
  margin: 4px 0;
  display: flex;
  align-items: center;
}

.password-hint p::before {
  content: "•";
  margin-right: 4px;
}

.password-hint p.valid {
  color: #67C23A;
}

.password-hint p.valid::before {
  content: "✓";
  color: #67C23A;
}

.register-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 