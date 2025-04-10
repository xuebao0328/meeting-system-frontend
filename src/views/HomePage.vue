<template>
  <div class="home-page">
    <!-- 顶部白色条框 -->
    <div class="header-bar">
      <nav class="top-nav">
        <div class="logo">
          <img src="../assets/logo.png" alt="Logo" class="logo-image" />
          <span class="logo-text">学路达会议服务系统</span>
        </div>
        <div class="nav-links">
          <router-link to="/" class="nav-link">{{ t('productServices') }}</router-link>
          <router-link to="/solutions" class="nav-link">{{ t('solutions') }}</router-link>
          <router-link to="/cases" class="nav-link">{{ t('cases') }}</router-link>
          <router-link to="/pricing" class="nav-link">{{ t('pricing') }}</router-link>
          <router-link to="/events" class="nav-link">{{ t('events') }}</router-link>
          <router-link to="/about" class="nav-link">{{ t('aboutUs') }}</router-link>
        </div>
        <div class="auth-buttons">
          <button class="lang-toggle" @click="toggleLanguage">
            {{ currentLang === 'zh' ? 'EN' : '中文' }}
          </button>
          <button class="theme-toggle" @click="toggleTheme">
            <i :class="isDarkTheme ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          <button class="login-button" @click="showLoginModal = true">{{ t('login') }}</button>
          <button class="register-button" @click="showRegisterModal = true">{{ t('register') }}</button>
        </div>
      </nav>
    </div>

    <!-- 登录弹窗 -->
    <div v-if="showLoginModal" class="modal-overlay" :class="{ 'confetti-active': showConfetti }" @click="showLoginModal = false">
      <div class="login-modal" :class="{ 'explode': showConfetti }" @click.stop>
        <div class="login-header">
          <h2 class="login-title">登录你的账号</h2>
          <p class="login-subtitle">还没有账户？<a href="#" @click.prevent="switchToRegister" class="login-link">免费注册</a></p>
        </div>

        <div class="login-tabs">
          <div class="tab-item" :class="{ active: loginMethod === 'account' }" @click="loginMethod = 'account'">
            账号密码登录
          </div>
          <div class="tab-item" :class="{ active: loginMethod === 'phone' }" @click="loginMethod = 'phone'">
            验证码登录
          </div>
          <div class="tab-item" :class="{ active: loginMethod === 'subAccount' }" @click="loginMethod = 'subAccount'">
            子账号登录
          </div>
        </div>

        <!-- 账号密码登录 -->
        <template v-if="loginMethod === 'account'">
          <div class="input-container">
            <div class="input-wrapper">
              <div class="input-icon">
                <span class="user-icon">👤</span>
              </div>
              <input 
                type="text" 
                placeholder="用户名/邮箱/手机号" 
                v-model="loginForm.account" 
                @keyup.enter="loginAction"
              />
            </div>
          </div>

          <div class="input-container">
            <div class="input-wrapper">
              <div class="input-icon">
                <span class="lock-icon">🔒</span>
              </div>
              <input 
                type="password" 
                placeholder="密码" 
                v-model="loginForm.password" 
                @keyup.enter="loginAction"
              />
            </div>
          </div>
        </template>

        <!-- 验证码登录 -->
        <template v-if="loginMethod === 'phone'">
          <div class="input-container">
            <div class="input-wrapper">
              <div class="input-icon">
                <span class="phone-icon">📱</span>
              </div>
              <input type="text" placeholder="请输入手机号" v-model="loginForm.phone" />
            </div>
          </div>

          <div class="input-container">
            <div class="verification-code">
              <div class="input-wrapper code-input">
                <input type="text" placeholder="验证码" v-model="loginForm.verificationCode" />
              </div>
              <button class="get-code-btn" @click="getLoginCode">{{ loginCountDown > 0 ? `${loginCountDown}s后重新获取` : '获取验证码' }}</button>
            </div>
          </div>
        </template>

        <!-- 子账号登录 -->
        <template v-if="loginMethod === 'subAccount'">
          <div class="input-container">
            <div class="input-wrapper">
              <div class="input-icon">
                <span class="user-icon">👤</span>
              </div>
              <input type="text" placeholder="主账号（用户名/手机号/邮箱）" v-model="loginForm.masterAccount" />
            </div>
          </div>

          <div class="input-container">
            <div class="input-wrapper">
              <div class="input-icon">
                <span class="user-icon">👤</span>
              </div>
              <input type="text" placeholder="子账号（用户名/手机号/邮箱）" v-model="loginForm.subAccount" />
            </div>
          </div>

          <div class="input-container">
            <div class="input-wrapper">
              <div class="input-icon">
                <span class="key-icon">🔑</span>
              </div>
              <input type="password" placeholder="请输入授权口令" v-model="loginForm.authToken" />
            </div>
          </div>
        </template>

        <div class="error-message" v-if="loginError">{{ loginError }}</div>

        <div class="login-options">
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="rememberMe" />
            <label for="remember">记住我</label>
          </div>
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>

        <button class="login-button-large" @click="loginAction">登录</button>

        <div class="other-login-options">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="social-login">
            <button class="social-btn wechat" @click="showDevelopingTip">
              <span>微信登录</span>
            </button>
            <button class="social-btn twitter" @click="showDevelopingTip">
              <span>Twitter</span>
            </button>
          </div>
        </div>
      </div>
      <!-- 添加彩带元素 -->
      <div v-if="showConfetti" class="confetti-container">
        <div v-for="n in 100" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
      </div>
    </div>

    <!-- 注册弹窗 -->
    <div v-if="showRegisterModal" class="modal-overlay" @click="showRegisterModal = false">
      <div class="login-modal" @click.stop>
        <div class="login-header">
          <h2 class="login-title">注册你的即时账户</h2>
          <p class="login-subtitle">已有账户？<a href="#" @click.prevent="switchToLogin" class="login-link">前去登录</a></p>
        </div>

        <div class="login-tabs">
          <div class="tab-item" :class="{ active: registerMode === 'phone' }" @click="registerMode = 'phone'">
            手机注册
          </div>
          <div class="tab-item" :class="{ active: registerMode === 'email' }" @click="registerMode = 'email'">
            邮箱注册
          </div>
        </div>

        <div class="input-container">
          <div class="input-wrapper">
            <div class="input-icon">
              <span class="phone-icon">📱</span>
            </div>
            <input type="text" :placeholder="registerMode === 'phone' ? '请输入手机号' : '请输入邮箱'" v-model="registerForm.account" />
          </div>
        </div>

        <div class="input-container" v-if="registerMode === 'phone'">
          <div class="verification-code">
            <div class="input-wrapper code-input">
              <input type="text" placeholder="验证码" v-model="registerForm.verificationCode" />
            </div>
            <button class="get-code-btn" @click="getRegisterCode">{{ registerCountDown > 0 ? `${registerCountDown}s后重新获取` : '25s后重新获取' }}</button>
          </div>
        </div>

        <div class="input-container" v-if="registerMode === 'email'">
          <div class="input-wrapper">
            <div class="input-icon">
              <span class="lock-icon">🔒</span>
            </div>
            <input type="password" placeholder="请设置密码" v-model="registerForm.password" minlength="6" />
          </div>
        </div>

        <div class="input-container" v-if="registerMode === 'email'">
          <div class="input-wrapper">
            <div class="input-icon">
              <span class="lock-icon">🔒</span>
            </div>
            <input type="password" placeholder="请确认密码" v-model="registerForm.confirmPassword" minlength="6" />
          </div>
          <div class="password-hint" v-if="registerForm.password">
            <p :class="{ valid: passwordValid }">密码长度至少6位</p>
            <p :class="{ valid: passwordsMatch }">两次密码输入一致</p>
          </div>
        </div>

        <div class="error-message" v-if="registerError">{{ registerError }}</div>

        <div class="agreement-checkbox">
          <input type="checkbox" id="agreement" v-model="agreedToTerms" />
          <label for="agreement">已阅读并同意以下协议 <a href="#" class="terms-link">服务条款</a>、<a href="#" class="terms-link">隐私协议</a></label>
        </div>

        <button class="login-button-large" @click="registerAction">下一步</button>

        <div class="other-login-options">
          <div class="divider">
            <span>其他方式</span>
          </div>
          <div class="social-login">
            <button class="social-btn wechat">
              <span>微信登录</span>
            </button>
            <button class="social-btn twitter">
              <span>Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 注册成功弹窗 -->
    <el-dialog
      :visible.sync="showSuccessDialog"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="success-dialog"
    >
      <div class="success-content">
        <i class="el-icon-success success-icon"></i>
        <h3>注册成功！</h3>
        <p>欢迎加入学路达会议服务系统</p>
        <p class="redirect-text">正在为您跳转到首页...</p>
      </div>
    </el-dialog>

    <!-- 添加提示框 -->
    <div v-if="showTip" class="tip-message">
      {{ tipMessage }}
    </div>

    <!-- 主体区域 -->
    <main class="main">
      <!-- Hero区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">{{ t('heroTitle') }}</h1>
          <h2 class="hero-subtitle">{{ t('heroSubtitle') }}</h2>
          <p class="hero-description">{{ t('heroDescription') }}</p>
          <div class="hero-buttons">
            <button class="primary-button" @click="showRegisterModal = true">{{ t('startFree') }}</button>
            <button class="secondary-button">{{ t('learnMore') }}</button>
          </div>
        </div>
        <div class="hero-image">
          <img src="../assets/logo.png" alt="会议管理系统界面" />
        </div>
      </section>

      <!-- 主要特性 -->
      <section class="features-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('coreFeatures') }}</h2>
          <p class="section-subtitle">{{ t('coverageProcess') }}</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-user-check"></i>
            </div>
            <div class="feature-content">
              <h3>{{ t('registrationManagement') }}</h3>
              <p>{{ t('registrationDesc') }}</p>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <div class="feature-content">
              <h3>{{ t('dataAnalysis') }}</h3>
              <p>{{ t('dataAnalysisDesc') }}</p>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-hotel"></i>
            </div>
            <div class="feature-content">
              <h3>{{ t('hotelManagement') }}</h3>
              <p>{{ t('hotelManagementDesc') }}</p>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-id-card"></i>
            </div>
            <div class="feature-content">
              <h3>{{ t('badgePrinting') }}</h3>
              <p>{{ t('badgePrintingDesc') }}</p>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-file-invoice"></i>
            </div>
            <div class="feature-content">
              <h3>{{ t('invoiceManagement') }}</h3>
              <p>{{ t('invoiceManagementDesc') }}</p>
            </div>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-mobile-alt"></i>
            </div>
            <div class="feature-content">
              <h3>{{ t('mobileSupport') }}</h3>
              <p>{{ t('mobileSupportDesc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 产品展示区域 -->
      <section class="product-showcase">
        <div class="showcase-item">
          <div class="showcase-content">
            <h2>智能会议管理</h2>
            <p>强大的管理工具，让您轻松控制会议全流程</p>
            <ul class="showcase-features">
              <li><i class="fas fa-check"></i> 多渠道发布会议信息</li>
              <li><i class="fas fa-check"></i> 自动化报名审核流程</li>
              <li><i class="fas fa-check"></i> 实时掌握会议动态</li>
            </ul>
            <div class="showcase-links">
              <a href="#">了解更多 <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
          <div class="showcase-image">
            <img src="../assets/logo.png" alt="智能会议管理" />
          </div>
        </div>
        
        <div class="showcase-item reverse">
          <div class="showcase-content">
            <h2>一键分析报告</h2>
            <p>智能数据分析，为决策提供有力支持</p>
            <ul class="showcase-features">
              <li><i class="fas fa-check"></i> 参会者数据可视化</li>
              <li><i class="fas fa-check"></i> 自定义数据报表</li>
              <li><i class="fas fa-check"></i> 会议投资回报分析</li>
            </ul>
            <div class="showcase-links">
              <a href="#">了解更多 <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
          <div class="showcase-image">
            <img src="../assets/logo.png" alt="一键分析报告" />
          </div>
        </div>
        
        <div class="showcase-item">
          <div class="showcase-content">
            <h2>现场签到系统</h2>
            <p>高效的签到流程，提升参会体验</p>
            <ul class="showcase-features">
              <li><i class="fas fa-check"></i> 多种签到方式支持</li>
              <li><i class="fas fa-check"></i> 自动打印胸卡</li>
              <li><i class="fas fa-check"></i> 实时同步签到数据</li>
            </ul>
            <div class="showcase-links">
              <a href="#">了解更多 <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
          <div class="showcase-image">
            <img src="../assets/logo.png" alt="现场签到系统" />
          </div>
        </div>
      </section>

      <!-- 使用流程 -->
      <section class="workflow-section">
        <div class="section-header">
          <h2 class="section-title">简单三步，开启专业会议</h2>
          <p class="section-subtitle">高效直观的使用流程，快速上手</p>
        </div>
        
        <div class="workflow-steps">
          <div class="workflow-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>创建会议</h3>
              <p>简单几步设置会议基本信息、日程安排和报名表单</p>
            </div>
          </div>
          
          <div class="step-connector">
            <i class="fas fa-long-arrow-alt-right"></i>
          </div>
          
          <div class="workflow-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>发布管理</h3>
              <p>多渠道发布会议信息，实时统计报名情况</p>
            </div>
          </div>
          
          <div class="step-connector">
            <i class="fas fa-long-arrow-alt-right"></i>
          </div>
          
          <div class="workflow-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>签到落地</h3>
              <p>现场电子签到，胸卡打印，数据实时同步</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 客户好评 -->
      <section class="testimonials-section">
        <div class="section-header">
          <h2 class="section-title">{{ t('testimonialTitle') }}</h2>
          <p class="section-subtitle">{{ t('testimonialSubtitle') }}</p>
        </div>
        
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-author">
                <div class="author-info">
                  <p class="author-name">张明</p>
                  <p class="author-title">清华大学</p>
                </div>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"学路达会议服务系统改变了我们的工作流程，从无法想象没有它如何工作，从传统系统切换过来很简单，我在管理和操作上都有了智能化的加持。"</p>
            </div>
          </div>
          
          <div class="testimonial-card highlight">
            <div class="testimonial-header">
              <div class="testimonial-author">
                <div class="author-info">
                  <p class="author-name">李华</p>
                  <p class="author-title">北京大学</p>
                </div>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"我非常喜欢学路达给出的智能建议，它发现了我们流程中的不一致，然后给出了优化建议，这让我们的会议管理效率提升了50%！"</p>
            </div>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-author">
                <div class="author-info">
                  <p class="author-name">王芳</p>
                  <p class="author-title">中国科学院</p>
                </div>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"在我目前使用过的所有会议管理系统里，学路达是最值得的。运行速度快，响应及时，操作也很顺手，快捷键设置合理，还能自动化处理很多流程。"</p>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-author">
                <div class="author-info">
                  <p class="author-name">陈晓</p>
                  <p class="author-title">复旦大学</p>
                </div>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"Tab 补全功能太棒了，有时候只需要输入几个字母就能完成整个表单，这让我的工作效率提升了很多。"</p>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-author">
                <div class="author-info">
                  <p class="author-name">刘强</p>
                  <p class="author-title">浙江大学</p>
                </div>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"学路达带来了我们工作流程提升最大的改变，它总能预判下一步，让我无需思维切换就能完成复杂的会议管理任务。"</p>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="testimonial-header">
              <div class="testimonial-author">
                <div class="author-info">
                  <p class="author-name">赵雪</p>
                  <p class="author-title">南京大学</p>
                </div>
              </div>
            </div>
            <div class="testimonial-content">
              <p>"完全改变了我对会议管理系统的认知，智能化程度令人惊叹。我已经把它推荐给了我认识的所有会务组织者。"</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 数据统计 -->
      <section class="stats-section">
        <div class="stat-item">
          <div class="stat-number">10,000<span class="stat-plus">+</span></div>
          <div class="stat-label">成功会议</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-number">5,000,000<span class="stat-plus">+</span></div>
          <div class="stat-label">服务参会人次</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-number">98<span class="stat-percent">%</span></div>
          <div class="stat-label">客户满意度</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-number">200<span class="stat-plus">+</span></div>
          <div class="stat-label">行业深度覆盖</div>
        </div>
      </section>

      <!-- CTA区域 -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">准备好提升您的会议管理体验了吗？</h2>
          <p class="cta-description">立即注册，免费体验专业的会议管理系统</p>
          <div class="cta-buttons">
            <button class="cta-button primary" @click="showRegisterModal = true">免费开始使用</button>
            <button class="cta-button secondary">联系销售顾问</button>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">学路达会议服务系统</h3>
          <p class="footer-description">专业会议管理系统，致力于为企业和组织提供高效、智能的会议管理解决方案</p>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">产品</h4>
          <ul class="footer-links">
            <li><a href="#">会议管理</a></li>
            <li><a href="#">嘉宾管理</a></li>
            <li><a href="#">酒店管理</a></li>
            <li><a href="#">签到系统</a></li>
            <li><a href="#">数据分析</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">解决方案</h4>
          <ul class="footer-links">
            <li><a href="#">学术会议</a></li>
            <li><a href="#">企业活动</a></li>
            <li><a href="#">展览展示</a></li>
            <li><a href="#">政府会议</a></li>
            <li><a href="#">国际峰会</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-subtitle">联系我们</h4>
          <ul class="footer-links">
            <li><a href="#">服务热线: 400-123-4567</a></li>
            <li><a href="#">邮箱: info@xuelu.com</a></li>
            <li><a href="#">地址: 北京市海淀区中关村</a></li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
      <p class="copyright">© 2023 学路达会议服务系统. 保留所有权利.</p>
        <div class="footer-legal">
          <a href="#">隐私政策</a>
          <a href="#">用户协议</a>
          <a href="#">网站地图</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { login, register, sendVerificationCode } from '@/api/auth';

export default {
  name: 'HomePage',
  data() {
    return {
      currentLang: localStorage.getItem('lang') || 'zh',
      isDarkTheme: true,
      showLoginModal: false,
      showRegisterModal: false,
      showSuccessModal: false,
      showSuccessDialog: false,
      loginForm: {
        account: '',
        password: '',
        phone: '',
        verificationCode: '',
        masterAccount: '',
        subAccount: '',
        authToken: ''
      },
      registerForm: {
        account: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
      },
      loginError: '',
      registerError: '',
      loginMethod: 'account',
      registerMode: 'phone',
      loginCountDown: 0,
      registerCountDown: 0,
      agreedToTerms: false,
      rememberMe: false,
      successMessage: '',
      translations: {
        zh: {
          login: '登录',
          register: '注册',
          productServices: '产品服务',
          solutions: '解决方案',
          cases: '精彩案例',
          pricing: '价格',
          events: '活动',
          aboutUs: '关于我们',
          heroTitle: '智能会议管理系统',
          heroSubtitle: '让会议管理更简单、更高效',
          heroDescription: '为您的会议提供全方位的智能管理解决方案，从会议筹备到会后跟进，一站式服务。',
          startFree: '免费开始使用',
          learnMore: '了解更多功能',
          coreFeatures: '核心功能',
          coverageProcess: '覆盖会议全流程',
          registrationManagement: '会议注册管理',
          registrationDesc: '灵活定制报名表单，多渠道发布，支持限额报名和审核流程',
          dataAnalysis: '数据统计分析',
          dataAnalysisDesc: '实时跟踪会议数据，直观图表展示，深度分析参会情况',
          hotelManagement: '酒店住宿管理',
          hotelManagementDesc: '一键管理酒店预订，自动匹配房型，追踪入住情况',
          badgePrinting: '胸卡打印系统',
          badgePrintingDesc: '专业胸卡模板设计，支持现场快速打印，多种打印选项',
          invoiceManagement: '发票管理系统',
          invoiceManagementDesc: '自动生成电子发票，多种支付方式对接，简化财务流程',
          mobileSupport: '移动端全支持',
          mobileSupportDesc: '移动端完美适配，随时随地管理会议，扫码签到，推送提醒',
          testimonialTitle: '深受全球顶尖开发者喜爱',
          testimonialSubtitle: '世界各地的工程师都主动选择使用我们的服务',
          switchToEn: 'English',
          switchToZh: '中文'
        },
        en: {
          login: 'Login',
          register: 'Register',
          productServices: 'Products & Services',
          solutions: 'Solutions',
          cases: 'Case Studies',
          pricing: 'Pricing',
          events: 'Events',
          aboutUs: 'About Us',
          heroTitle: 'Intelligent Conference Management System',
          heroSubtitle: 'Making Conference Management Simpler and More Efficient',
          heroDescription: 'Providing comprehensive intelligent management solutions for your conferences, from preparation to follow-up, all in one place.',
          startFree: 'Start Free Trial',
          learnMore: 'Learn More',
          coreFeatures: 'Core Features',
          coverageProcess: 'Covering the Entire Conference Process',
          registrationManagement: 'Registration Management',
          registrationDesc: 'Flexible registration forms, multi-channel publishing, quota management and review process',
          dataAnalysis: 'Data Analysis',
          dataAnalysisDesc: 'Real-time conference data tracking, intuitive charts, in-depth attendance analysis',
          hotelManagement: 'Hotel Management',
          hotelManagementDesc: 'One-click hotel booking management, automatic room matching, check-in tracking',
          badgePrinting: 'Badge Printing',
          badgePrintingDesc: 'Professional badge template design, quick on-site printing, multiple printing options',
          invoiceManagement: 'Invoice Management',
          invoiceManagementDesc: 'Automatic e-invoice generation, multiple payment methods, simplified financial process',
          mobileSupport: 'Mobile Support',
          mobileSupportDesc: 'Perfect mobile adaptation, manage conferences anywhere, QR code check-in, push notifications',
          testimonialTitle: 'Loved by Top Developers Worldwide',
          testimonialSubtitle: 'Engineers around the world actively choose our services',
          switchToEn: 'English',
          switchToZh: '中文'
        }
      },
      showConfetti: false,
      showTip: false,
      tipMessage: '',
    };
  },
  mounted() {
    const savedTheme = localStorage.getItem('theme');
    const savedLang = localStorage.getItem('language');
    
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.applyTheme();
    }
    
    if (savedLang) {
      this.currentLang = savedLang;
    }
    
    // 检查是否有记住的账号
    const rememberedAccount = localStorage.getItem('rememberedAccount');
    if (rememberedAccount) {
      this.loginForm.account = rememberedAccount;  // 使用account字段
      this.rememberMe = true;
    }
  },
  beforeDestroy() {
    // 移除了轮播相关方法
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      this.applyTheme();
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    },
    applyTheme() {
      document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
    },
    loginAction() {
      try {
        this.loginError = '';
        
        // 表单验证
        if (this.loginMethod === 'account' && (!this.loginForm.account || !this.loginForm.password)) {
          this.loginError = '请填写完整的登录信息';
          return;
        }

        if (this.loginMethod === 'phone' && (!this.loginForm.phone || !this.loginForm.verificationCode)) {
          this.loginError = '请填写完整的手机号和验证码';
          return;
        }
        
        // 根据登录方式构造请求参数
        const loginData = {
          loginMethod: this.loginMethod
        };
        
        if (this.loginMethod === 'account') {
          loginData.account = this.loginForm.account;
          loginData.password = this.loginForm.password;
        } else if (this.loginMethod === 'phone') {
          loginData.phone = this.loginForm.phone;
          loginData.verificationCode = this.loginForm.verificationCode;
        }
        
        // 调用登录API
        login(loginData).then(response => {
          // 保存token和用户信息
          const { token, user } = response;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // 登录成功，显示成功动画
          this.showConfetti = true;
          
          // 3秒后跳转到会议管理页面
          setTimeout(() => {
            this.showLoginModal = false;
            this.showConfetti = false;
            this.$router.push('/admin-center');
          }, 2000);
        }).catch(error => {
          this.loginError = error.message || '登录失败，请检查您的信息';
          console.error('登录错误:', error);
        });
      } catch (error) {
        this.loginError = error.message || '登录失败，请检查您的信息';
        console.error('登录错误:', error);
      }
    },
    
    // 发送登录验证码
    getLoginCode() {
      if (this.loginCountDown > 0) return;
      
      if (!this.loginForm.phone) {
        this.loginError = '请输入手机号';
          return;
        }
        
      sendVerificationCode(this.loginForm.phone).then(() => {
        // 开始倒计时
        this.loginCountDown = 60;
        const timer = setInterval(() => {
          this.loginCountDown--;
          if (this.loginCountDown <= 0) {
            clearInterval(timer);
          }
        }, 1000);
      }).catch(error => {
        this.loginError = error.message || '验证码发送失败';
        console.error('验证码发送错误:', error);
      });
    },
    
    // 注册操作
    registerAction: async function() {
      if (!this.agreedToTerms) {
        this.showTip = true;
        this.tipMessage = "请先阅读并同意服务条款和隐私协议";
        setTimeout(() => {
          this.showTip = false;
        }, 2000);
          return;
        }
        
      try {
        if (this.registerMode === 'phone') {
          // 手机注册逻辑
          await this.registerWithPhone();
        } else {
          // 邮箱注册逻辑
          await this.registerWithEmail();
        }
      } catch (error) {
        console.error('注册失败:', error);
        this.registerError = error.message || '注册失败，请稍后重试';
      }
    },
    
    // 添加手机注册方法
    registerWithPhone: async function() {
      // 表单验证
      if (!this.registerForm.account) {
        this.registerError = '请输入手机号';
        return;
      }
      
      if (!this.registerForm.verificationCode) {
        this.registerError = '请输入验证码';
        return;
      }
      
      // 调用注册API
      const registerData = {
        registerMode: 'phone',
        phone: this.registerForm.account,
        verificationCode: this.registerForm.verificationCode
      };
      
      const response = await register(registerData);
      this.handleRegisterSuccess(response);
    },
    
    // 添加邮箱注册方法
    registerWithEmail: async function() {
      // 表单验证
      if (!this.registerForm.account) {
        this.registerError = '请输入邮箱';
        return;
      }
      
      if (!this.registerForm.password) {
        this.registerError = '请设置密码';
          return;
        }
      
      if (!this.passwordValid()) {
        this.registerError = '密码长度至少为6位';
          return;
        }
      
      if (!this.passwordsMatch()) {
        this.registerError = '两次输入的密码不一致';
        return;
      }
      
      // 调用注册API
      const registerData = {
        registerMode: 'email',
        email: this.registerForm.account,
        password: this.registerForm.password
      };
      
      const response = await register(registerData);
      this.handleRegisterSuccess(response);
    },
    
    // 处理注册成功响应
    handleRegisterSuccess: function(response) {
      // 保存token和用户信息
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      // 显示注册成功弹窗
      this.showRegisterModal = false;
      this.showSuccessDialog = true;
      
      // 3秒后跳转到管理中心
      setTimeout(() => {
        this.showSuccessDialog = false;
        this.$router.push('/admin-center');
      }, 3000);
    },
    
    // 发送注册验证码
    getRegisterCode() {
      if (this.registerCountDown > 0) return;
      
        if (!this.registerForm.account) {
        this.registerError = '请输入手机号';
        return;
      }
      
      sendVerificationCode(this.registerForm.account).then(() => {
        // 开始倒计时
        this.registerCountDown = 60;
      const timer = setInterval(() => {
        this.registerCountDown--;
        if (this.registerCountDown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      }).catch(error => {
        this.registerError = error.message || '验证码发送失败';
        console.error('验证码发送错误:', error);
      });
    },

    hideErrorAfterDelay(errorType) {
      setTimeout(() => {
        this[errorType] = '';
      }, 3000);
    },

    loginSuccess() {
      this.showConfetti = true;
      setTimeout(() => {
        this.showLoginModal = false;
        this.$router.push('/admin-center');
      }, 800);
    },

    clearLoginForm() {
      this.loginForm = {
        account: '',
        password: '',
        phone: '',
        verificationCode: '',
        masterAccount: '',
        subAccount: '',
        authToken: ''
      };
      this.loginError = '';
      this.rememberMe = false;
    },
    clearRegisterForm() {
      this.registerForm = {
        account: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
      };
      this.registerError = '';
      this.agreedToTerms = false;
    },
    switchToRegister() {
      this.showLoginModal = false;
      this.clearLoginForm();
      setTimeout(() => {
        this.showRegisterModal = true;
      }, 300);
    },
    switchToLogin() {
      this.showRegisterModal = false;
      this.clearRegisterForm();
      setTimeout(() => {
        this.showLoginModal = true;
      }, 300);
    },
    handleSuccessConfirm() {
      this.showSuccessModal = false;
      // 跳转到会务组中心页面
      this.$router.push('/admin-center');
    },
    toggleLanguage() {
      this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh'
      localStorage.setItem('lang', this.currentLang)
    },
    t(key) {
      return this.translations[this.currentLang][key]
    },
    getConfettiStyle(index) {
      const colors = ['#4089FF', '#60A5FA', '#34D399', '#FBBF24', '#EC4899'];
      const angle = (index / 100) * 360;
      const distance = 30 + Math.random() * 50;
      const delay = Math.random() * 0.3;
      const rotateSpeed = -360 + Math.random() * 720;
      
      return {
        backgroundColor: colors[index % colors.length],
        left: '50%',
        top: '50%',
        transform: `rotate(${angle}deg)`,
        '--distance': `${distance}vw`,
        '--delay': `${delay}s`,
        '--rotate': `${rotateSpeed}deg`,
      };
    },
    showDevelopingTip() {
      this.tipMessage = '功能正在开发中';
      this.showTip = true;
      setTimeout(() => {
        this.showTip = false;
      }, 3000);
    },
    passwordValid() {
      return this.registerForm.password && this.registerForm.password.length >= 6;
    },
    passwordsMatch() {
      return this.registerForm.password && this.registerForm.password === this.registerForm.confirmPassword;
    },
    resetRegisterForm() {
      this.registerForm = {
        account: '',
        password: '',
        confirmPassword: '',
        verificationCode: ''
      };
      this.registerError = '';
    }
  },
  watch: {
    showLoginModal(newVal) {
      if (!newVal) {
        this.clearLoginForm();
      }
    },
    showRegisterModal(newVal) {
      if (!newVal) {
        this.clearRegisterForm();
      }
    }
  }
}
</script>

<style>
:root {
  /* 明亮主题变量 */
  --light-bg-primary: #ffffff;
  --light-bg-secondary: #f3f4f6;
  --light-bg-tertiary: #e5e7eb;
  --light-text-primary: #111827;
  --light-text-secondary: #4b5563;
  --light-border-color: #e5e7eb;
  --light-header-bg: rgba(255, 255, 255, 0.9);
  
  /* 暗黑主题变量 */
  --dark-bg-primary: #151718;
  --dark-bg-secondary: #1D1F21;
  --dark-bg-tertiary: #25282A;
  --dark-text-primary: #E4E5E7;
  --dark-text-secondary: #9DA0A5;
  --dark-border-color: rgba(255, 255, 255, 0.06);
  --dark-header-bg: rgba(29, 31, 33, 0.9);
}

[data-theme="light"] {
  --bg-primary: var(--light-bg-primary);
  --bg-secondary: var(--light-bg-secondary);
  --bg-tertiary: var(--light-bg-tertiary);
  --text-primary: var(--light-text-primary);
  --text-secondary: var(--light-text-secondary);
  --border-color: var(--light-border-color);
  --header-bg: var(--light-header-bg);
}

[data-theme="dark"] {
  --bg-primary: var(--dark-bg-primary);
  --bg-secondary: var(--dark-bg-secondary);
  --bg-tertiary: var(--dark-bg-tertiary);
  --text-primary: var(--dark-text-primary);
  --text-secondary: var(--dark-text-secondary);
  --border-color: var(--dark-border-color);
  --header-bg: var(--dark-header-bg);
}
</style>

<style scoped>
/* 基础布局样式 */
.home-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.header-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: var(--header-bg);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--border-color);
}

.top-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-image {
  height: 40px;
  width: auto;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--text-primary);
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* 主要内容区域样式 */
.main {
  margin-top: 80px; /* 为固定定位的header留出空间 */
  flex: 1;
  padding: 2rem;
}

/* Hero区域样式 */
.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.hero-subtitle {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
}

/* 按钮样式 */
.primary-button, .secondary-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
}

.primary-button {
  background: linear-gradient(135deg, #4089FF, #60A5FA);
  color: white;
  border: none;
}

.secondary-button {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 137, 255, 0.25);
}

.secondary-button:hover {
  background-color: var(--bg-secondary);
}

/* 特性部分样式 */
.features-section {
  background-color: var(--bg-secondary);
  padding: 4rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.feature-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4089FF, #60A5FA);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.feature-icon i {
  font-size: 24px;
  color: white;
}

.feature-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.feature-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 产品展示区域样式 */
.product-showcase {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
}

.showcase-item {
  display: flex;
  align-items: center;
  gap: 4rem;
  margin-bottom: 6rem;
}

.showcase-item.reverse {
  flex-direction: row-reverse;
}

.showcase-content {
  flex: 1;
}

.showcase-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.showcase-content p {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.showcase-features {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.showcase-features li {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.showcase-features i {
  color: #4089FF;
}

.showcase-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.showcase-image img {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
}

/* 工作流程部分样式 */
.workflow-section {
  background-color: var(--bg-secondary);
  padding: 4rem 2rem;
}

.workflow-steps {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
}

.workflow-step {
  flex: 1;
  text-align: center;
  padding: 2rem;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4089FF, #60A5FA);
  color: white;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.step-content p {
  color: var(--text-secondary);
}

.step-connector {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 24px;
}

/* 客户评价部分样式 */
.testimonials-section {
  padding: 6rem 2rem;
  background: linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary));
  overflow: hidden;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4089FF, #60A5FA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.testimonials-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.testimonial-card {
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
  animation-delay: calc(var(--card-index, 0) * 0.1s);
}

.testimonial-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4089FF, #60A5FA);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.testimonial-card:hover::before {
  transform: scaleX(1);
}

.testimonial-card.highlight {
  background: linear-gradient(135deg, 
    rgba(64, 137, 255, 0.1), 
    rgba(96, 165, 250, 0.1)
  );
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(64, 137, 255, 0.15);
}

.testimonial-card.highlight:hover {
  transform: translateY(-15px);
  box-shadow: 0 25px 50px rgba(64, 137, 255, 0.2);
}

.testimonial-header {
  margin-bottom: 1.5rem;
}

.testimonial-author {
  display: flex;
  align-items: center;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.author-title {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.testimonial-card:hover .author-name {
  opacity: 1;
}

.testimonial-card:hover .author-title {
  opacity: 0.9;
}

.testimonial-content {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
  position: relative;
}

.testimonial-content p {
  margin: 0;
  position: relative;
  z-index: 1;
}

.testimonial-content::before {
  content: '"';
  font-size: 4rem;
  color: rgba(64, 137, 255, 0.1);
  position: absolute;
  left: -0.5rem;
  top: -1.5rem;
  font-family: serif;
  transition: all 0.3s ease;
}

.testimonial-card:hover .testimonial-content::before {
  color: rgba(64, 137, 255, 0.2);
  transform: scale(1.1);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .testimonials-section {
    padding: 4rem 1rem;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .testimonial-card.highlight {
    transform: translateY(0);
  }

  .testimonial-card:hover {
    transform: translateY(-5px);
  }
}

/* 数据统计部分样式 */
.stats-section {
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  padding: 4rem 2rem;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-plus, .stat-percent {
  font-size: 2rem;
  color: #4089FF;
  margin-left: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* CTA部分样式 */
.cta-section {
  background: linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary));
  padding: 4rem 2rem;
  text-align: center;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* 页脚样式 */
.footer {
  background-color: var(--bg-secondary);
  padding: 4rem 2rem 2rem;
  border-top: 1px solid var(--border-color);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.footer-description {
  color: var(--text-secondary);
  line-height: 1.6;
}

.footer-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--text-primary);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
}

.footer-legal {
  display: flex;
  gap: 2rem;
}

.footer-legal a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-legal a:hover {
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .nav-links {
    display: none;
  }

  .workflow-steps {
    flex-direction: column;
    gap: 2rem;
  }

  .step-connector {
    transform: rotate(90deg);
    margin: 1rem 0;
  }

  .showcase-item {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .showcase-item.reverse {
    flex-direction: column;
  }
}

/* 主题切换按钮样式 */
.theme-toggle {
  padding: 8px;
  font-size: 18px;
  color: var(--text-primary);
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-toggle:hover {
  transform: rotate(30deg);
}

/* 登录和注册按钮样式 */
.login-button, .register-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
}

.login-button {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.register-button {
  background: linear-gradient(135deg, #4089FF, #60A5FA);
  color: white;
  border: none;
}

.login-button:hover {
  background-color: var(--bg-secondary);
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 137, 255, 0.25);
}

/* 语言切换按钮样式 */
.lang-toggle {
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-primary);
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 8px;
}

.lang-toggle:hover {
  background-color: var(--bg-secondary);
  transform: translateY(-2px);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.modal-overlay.confetti-active {
  background: transparent;
  transition: background 0.5s ease;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.login-modal {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #666;
  font-size: 0.9rem;
}

.login-link {
  color: #4089FF;
  text-decoration: none;
  font-weight: 500;
}

.login-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 1rem 0.5rem;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  white-space: nowrap;
  min-width: 100px;
}

.tab-item.active {
  color: #4089FF;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #4089FF;
}

.input-container {
  margin-bottom: 1.5rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  border-color: #4089FF;
  box-shadow: 0 0 0 2px rgba(64, 137, 255, 0.1);
}

.input-icon {
  margin-right: 0.5rem;
  color: #999;
}

.input-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #333;
}

.verification-code {
  display: flex;
  gap: 1rem;
}

.code-input {
  flex: 1;
}

.get-code-btn {
  padding: 0 1rem;
  border: none;
  background: #4089FF;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;
}

.get-code-btn:hover {
  background: #3078ee;
}

.agreement-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.terms-link {
  color: #4089FF;
  text-decoration: none;
}

.login-button-large {
  width: 100%;
  padding: 1rem;
  border: none;
  background: #4089FF;
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1.5rem;
}

.login-button-large:hover {
  background: #3078ee;
  transform: translateY(-2px);
}

.other-login-options {
  text-align: center;
}

.divider {
  position: relative;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: #eee;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: #999;
  font-size: 0.9rem;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-btn:hover {
  background: #f8f8f8;
  transform: translateY(-2px);
}

.social-btn.wechat {
  color: #07C160;
}

.social-btn.twitter {
  color: #1DA1F2;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.forgot-password {
  color: #4089FF;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 1rem 0.5rem;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  white-space: nowrap;
  min-width: 100px;
}

@media (max-width: 480px) {
  .login-tabs {
    flex-direction: column;
  }
  
  .tab-item {
    width: 100%;
    border-bottom: 1px solid #eee;
  }
  
  .tab-item:last-child {
    border-bottom: none;
  }
}

/* 彩带动画相关样式 */
.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1001;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 16px;
  background-color: #4089FF;
  opacity: 0;
  transform-origin: center;
  animation: confetti-explosion 1.5s ease-out forwards;
}

.login-modal.explode {
  animation: modal-explode 0.5s ease-out forwards;
}

@keyframes confetti-explosion {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--rotate)) translateX(0);
  }
  25% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--rotate)) translateX(var(--distance));
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(calc(var(--rotate) * 2)) translateX(var(--distance)) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(calc(var(--rotate) * 3)) translateX(var(--distance)) translateY(100vh);
  }
}

@keyframes modal-explode {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 提示框样式 */
.tip-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 2000;
  animation: fadeInOut 3s ease-in-out;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  15% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  85% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

.password-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  padding-left: 10px;
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

.success-dialog {
  border-radius: 8px;
  overflow: hidden;
}

.success-content {
  text-align: center;
  padding: 20px;
}

.success-icon {
  font-size: 48px;
  color: #67C23A;
  margin-bottom: 20px;
}

.success-content h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.success-content p {
  color: #666;
  margin-bottom: 5px;
}

.redirect-text {
  color: #999;
  font-size: 14px;
}
</style>
