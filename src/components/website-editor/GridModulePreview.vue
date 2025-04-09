<template>
  <div class="grid-module-preview">
    <div v-if="moduleType === 'register'" class="register-module">
      <h3 class="module-title">{{ config.title || '用户注册' }}</h3>
      <div class="form-container" :class="config.layout">
        <div class="form-field">
          <label>用户名</label>
          <input type="text" placeholder="请输入用户名">
        </div>
        <div class="form-field">
          <label>手机号</label>
          <input type="tel" placeholder="请输入手机号">
        </div>
        <div class="form-field">
          <label>密码</label>
          <input type="password" placeholder="请输入密码">
        </div>
        <div v-if="config.showCaptcha" class="form-field captcha">
          <label>验证码</label>
          <div class="captcha-container">
            <input type="text" placeholder="请输入验证码">
            <div class="captcha-image">1234</div>
          </div>
        </div>
        <button class="submit-btn">{{ config.buttonText || '立即注册' }}</button>
      </div>
    </div>

    <div v-else-if="moduleType === 'news'" class="news-module">
      <h3 class="module-title">{{ config.title || '新闻列表' }}</h3>
      <div class="news-list" :class="config.layout">
        <div v-for="i in displayCount" :key="i" class="news-item">
          <div v-if="config.layout === 'image' || config.layout === 'card'" class="news-image"></div>
          <div class="news-content">
            <div class="news-title">新闻标题示例 {{ i }}</div>
            <div v-if="config.showDate" class="news-date">2023-10-{{ 10 + i }}</div>
            <div v-if="config.layout === 'card'" class="news-summary">这是一段新闻摘要内容的示例，用于展示新闻列表的效果预览。</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="moduleType === 'signup'" class="signup-module">
      <h3 class="module-title">{{ config.title || '活动报名' }}</h3>
      <div class="event-info">
        <div class="event-image"></div>
        <div class="event-details">
          <div class="event-title">{{ config.eventTitle || '2023年技术交流大会' }}</div>
          <div class="event-time">{{ config.eventTime || '2023年11月20日 14:00-17:00' }}</div>
          <div class="event-location">{{ config.eventLocation || '上海市浦东新区科技园区' }}</div>
        </div>
      </div>
      <div class="signup-form">
        <div class="form-field">
          <label>姓名</label>
          <input type="text" placeholder="请输入姓名">
        </div>
        <div class="form-field">
          <label>联系方式</label>
          <input type="tel" placeholder="请输入手机号">
        </div>
        <div class="form-field">
          <label>单位</label>
          <input type="text" placeholder="请输入单位名称">
        </div>
        <button class="submit-btn">{{ config.buttonText || '立即报名' }}</button>
      </div>
    </div>

    <div v-else-if="moduleType === 'gallery'" class="gallery-module">
      <h3 class="module-title">{{ config.title || '图片画廊' }}</h3>
      <div class="gallery-grid">
        <div v-for="i in 6" :key="i" class="gallery-item"></div>
      </div>
    </div>

    <div v-else-if="moduleType === 'contact'" class="contact-module">
      <h3 class="module-title">{{ config.title || '联系我们' }}</h3>
      <div class="contact-info">
        <div class="contact-item">
          <i class="el-icon-location"></i>
          <span>{{ config.address || '上海市浦东新区科技园区88号' }}</span>
        </div>
        <div class="contact-item">
          <i class="el-icon-phone"></i>
          <span>{{ config.phone || '021-12345678' }}</span>
        </div>
        <div class="contact-item">
          <i class="el-icon-message"></i>
          <span>{{ config.email || 'contact@example.com' }}</span>
        </div>
      </div>
      <div class="contact-map"></div>
    </div>

    <div v-else class="default-module">
      <h3 class="module-title">{{ config.title || moduleType + '模块' }}</h3>
      <div class="module-placeholder">
        <i :class="moduleIcon"></i>
        <div class="placeholder-text">{{ moduleType }}模块预览</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridModulePreview',
  props: {
    moduleType: {
      type: String,
      required: true
    },
    config: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    displayCount() {
      return this.config.count || 5;
    },
    moduleIcon() {
      const iconMap = {
        'register': 'el-icon-user-solid',
        'news': 'el-icon-document',
        'signup': 'el-icon-date',
        'gallery': 'el-icon-picture',
        'contact': 'el-icon-phone',
        'forum': 'el-icon-chat-dot-square',
        'product': 'el-icon-goods',
        'team': 'el-icon-user',
        'testimonial': 'el-icon-star-on',
        'faq': 'el-icon-question'
      };
      return iconMap[this.moduleType] || 'el-icon-s-grid';
    }
  }
}
</script>

<style scoped>
.grid-module-preview {
  border: 1px solid v-bind('config.showBorder ? config.borderColor || "#DCDFE6" : "transparent"');
  border-radius: 4px;
  background-color: v-bind('config.bgColor || "#FFFFFF"');
  padding: v-bind('config.padding + "px" || "15px"');
}

.module-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-top: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 8px;
}

/* 注册模块样式 */
.register-module .form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.register-module .form-container.horizontal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 15px;
}

.form-field {
  margin-bottom: 10px;
}

.form-field label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #606266;
}

.form-field input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
}

.captcha-container {
  display: flex;
  gap: 10px;
}

.captcha-image {
  flex: 0 0 80px;
  height: 32px;
  background-color: #F5F7FA;
  border: 1px solid #DCDFE6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #409EFF;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
}

.submit-btn {
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #66b1ff;
}

/* 新闻列表样式 */
.news-module .news-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.news-item {
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 15px;
  display: flex;
  gap: 10px;
}

.news-item:last-child {
  border-bottom: none;
}

.news-image {
  width: 80px;
  height: 60px;
  background-color: #F5F7FA;
  flex-shrink: 0;
}

.news-list.image .news-image {
  width: 100%;
  height: 120px;
  margin-bottom: 10px;
}

.news-list.card {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.news-list.card .news-item {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  padding: 10px;
  flex-direction: column;
}

.news-list.card .news-image {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}

.news-content {
  flex: 1;
}

.news-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 5px;
  font-weight: 500;
}

.news-date {
  font-size: 12px;
  color: #909399;
}

.news-summary {
  font-size: 12px;
  color: #606266;
  margin-top: 5px;
  line-height: 1.4;
}

/* 活动报名样式 */
.event-info {
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
}

.event-image {
  width: 120px;
  height: 80px;
  background-color: #F5F7FA;
  flex-shrink: 0;
}

.event-details {
  flex: 1;
}

.event-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.event-time, .event-location {
  font-size: 13px;
  color: #606266;
  margin-bottom: 5px;
}

/* 图片画廊样式 */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.gallery-item {
  height: 90px;
  background-color: #F5F7FA;
  border-radius: 4px;
}

/* 联系我们样式 */
.contact-info {
  margin-bottom: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.contact-item i {
  margin-right: 10px;
  color: #409EFF;
  font-size: 18px;
}

.contact-map {
  height: 150px;
  background-color: #F5F7FA;
  border-radius: 4px;
}

/* 默认模块样式 */
.module-placeholder {
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #F5F7FA;
  border-radius: 4px;
}

.module-placeholder i {
  font-size: 40px;
  color: #C0C4CC;
  margin-bottom: 10px;
}

.placeholder-text {
  font-size: 14px;
  color: #909399;
}
</style> 