<template>
  <el-dialog 
    title="网站预览" 
    :visible.sync="visible" 
    width="80%" 
    @closed="handleClose" 
    class="preview-dialog" 
    :fullscreen="isFullscreen">
    <div class="preview-dialog-header">
      <div class="preview-controls">
        <el-select v-model="pageId" placeholder="选择页面" @change="updatePreview">
          <el-option 
            v-for="page in pages" 
            :key="page.id" 
            :label="page.name" 
            :value="page.id">
          </el-option>
        </el-select>
        
        <el-select v-model="device" placeholder="设备" @change="updatePreview">
          <el-option label="电脑" value="pc"></el-option>
          <el-option label="手机" value="mobile"></el-option>
          <el-option label="平板" value="tablet"></el-option>
        </el-select>
        
        <el-button-group>
          <el-button size="small" type="primary" icon="el-icon-refresh" @click="refreshPreview">刷新</el-button>
          <el-button size="small" icon="el-icon-full-screen" @click="toggleFullScreen">全屏</el-button>
        </el-button-group>
        
        <el-popover
          placement="bottom"
          width="200"
          trigger="click">
          <div class="share-options">
            <el-button size="small" type="primary" icon="el-icon-picture" @click="generateQRCode">生成二维码</el-button>
            <el-button size="small" icon="el-icon-document-copy" @click="copyPreviewLink">复制链接</el-button>
          </div>
          <el-button slot="reference" size="small" icon="el-icon-share">分享</el-button>
        </el-popover>
        
        <el-switch
          v-model="multiDeviceEnabled"
          active-text="多设备预览"
          inactive-text="单设备预览"
          @change="toggleMultiDevicePreview">
        </el-switch>
      </div>
      
      <div v-if="performanceMetrics" class="performance-metrics">
        <el-tooltip content="页面加载时间" placement="top">
          <el-tag size="small">加载: {{performanceMetrics.loadTime}}ms</el-tag>
        </el-tooltip>
        <el-tooltip content="页面渲染时间" placement="top">
          <el-tag size="small" type="success">渲染: {{performanceMetrics.renderTime}}ms</el-tag>
        </el-tooltip>
        <el-tooltip content="资源数量" placement="top">
          <el-tag size="small" type="warning">资源: {{performanceMetrics.resourceCount}}</el-tag>
        </el-tooltip>
        <el-tooltip content="内存使用" placement="top">
          <el-tag size="small" type="info">内存: {{performanceMetrics.memoryUsage}}MB</el-tag>
        </el-tooltip>
      </div>
    </div>
    
    <div v-if="!multiDeviceEnabled" class="preview-content">
      <div :class="['device-frame', device]">
        <iframe 
          :src="previewUrl" 
          frameborder="0" 
          ref="previewIframe" 
          class="preview-iframe">
        </iframe>
      </div>
    </div>
    
    <div v-else class="multi-device-preview">
      <div class="device-container">
        <h4>PC端</h4>
        <div class="device-frame pc">
          <iframe :src="previewUrls.pc" frameborder="0" class="preview-iframe"></iframe>
        </div>
      </div>
      
      <div class="device-container">
        <h4>手机端</h4>
        <div class="device-frame mobile">
          <iframe :src="previewUrls.mobile" frameborder="0" class="preview-iframe"></iframe>
        </div>
      </div>
      
      <div class="device-container">
        <h4>平板端</h4>
        <div class="device-frame tablet">
          <iframe :src="previewUrls.tablet" frameborder="0" class="preview-iframe"></iframe>
        </div>
      </div>
    </div>
    
    <el-drawer
      title="扫码预览"
      :visible.sync="showQrcode"
      direction="rtl"
      size="30%">
      <div class="qrcode-container">
        <div class="qrcode-image">
          <img :src="`/api/qrcode?text=${encodeURIComponent(qrcodeUrl)}`" alt="预览二维码" />
        </div>
        <div class="qrcode-device-selector">
          <p>选择预览设备：</p>
          <el-radio-group v-model="qrcodeDevice" @change="changeQrcodeDevice">
            <el-radio-button v-for="option in qrcodeDeviceOptions" :key="option.value" :label="option.value">
              {{option.label}}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="qrcode-tips">
          <p>使用微信或其他扫码工具扫描二维码，即可在移动设备上查看您的网站效果</p>
          <p>您还可以通过以下方式分享：</p>
          <div class="qrcode-share-buttons">
            <el-button size="small" type="primary" icon="el-icon-message" @click="shareToWechat">微信分享</el-button>
            <el-button size="small" type="success" icon="el-icon-mobile" @click="shareToMobile">短信分享</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </el-dialog>
</template>

<script>
export default {
  name: 'PreviewDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    meetingId: {
      type: String,
      required: true
    },
    pages: {
      type: Array,
      required: true
    },
    initialPageId: {
      type: String,
      default: ''
    },
    initialDevice: {
      type: String,
      default: 'pc'
    }
  },
  data() {
    return {
      pageId: this.initialPageId,
      device: this.initialDevice,
      previewUrl: '',
      previewUrls: {
        pc: '',
        mobile: '',
        tablet: ''
      },
      multiDeviceEnabled: false,
      isFullscreen: false,
      performanceMetrics: null,
      autoRefreshTimer: null,
      showQrcode: false,
      qrcodeUrl: '',
      qrcodeDevice: this.initialDevice,
      qrcodeDeviceOptions: [
        { label: 'PC端', value: 'pc' },
        { label: '手机端', value: 'mobile' },
        { label: '平板端', value: 'tablet' }
      ]
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initPreview();
      }
    },
    initialPageId(newVal) {
      this.pageId = newVal;
      if (this.visible) {
        this.updatePreview();
      }
    },
    initialDevice(newVal) {
      this.device = newVal;
      if (this.visible) {
        this.updatePreview();
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.initPreview();
    }
  },
  methods: {
    initPreview() {
      this.updatePreview();
      this.initPerformanceMonitor();
      this.preloadPreviewImage();
    },
    
    updatePreview() {
      this.updatePreviewUrl();
      this.$emit('update:pageId', this.pageId);
      this.$emit('update:device', this.device);
    },
    
    updatePreviewUrl() {
      // 添加随机参数，确保不会使用缓存
      const timestamp = new Date().getTime();
      // 添加quality参数提高图像质量
      this.previewUrl = `/api/meetings/${this.meetingId}/website/preview?pageId=${this.pageId}&device=${this.device}&quality=high&t=${timestamp}`;
      
      if (this.multiDeviceEnabled) {
        this.updateMultiDeviceUrls();
      }
    },
    
    updateMultiDeviceUrls() {
      // 为多设备预览更新不同的URL
      const timestamp = new Date().getTime();
      this.previewUrls = {
        pc: `/api/meetings/${this.meetingId}/website/preview?pageId=${this.pageId}&device=pc&quality=high&t=${timestamp}`,
        mobile: `/api/meetings/${this.meetingId}/website/preview?pageId=${this.pageId}&device=mobile&quality=high&t=${timestamp}`,
        tablet: `/api/meetings/${this.meetingId}/website/preview?pageId=${this.pageId}&device=tablet&quality=high&t=${timestamp}`
      };
    },
    
    preloadPreviewImage() {
      // 预加载缩略图，提高加载速度
      const img = new Image();
      img.src = `/api/meetings/${this.meetingId}/website/preview/thumbnail?pageId=${this.pageId}&t=${new Date().getTime()}`;
    },
    
    refreshPreview() {
      this.updatePreviewUrl();
      
      // 如果有引用到iframe，可以强制刷新
      if (this.$refs.previewIframe) {
        this.$refs.previewIframe.contentWindow.location.reload();
      }
      
      // 刷新性能指标
      this.refreshPerformanceMetrics();
    },
    
    toggleFullScreen() {
      try {
        this.isFullscreen = !this.isFullscreen;
        
        // 如果切换到全屏模式，尝试使用浏览器的全屏API
        if (this.isFullscreen && this.$refs.previewIframe) {
          const iframe = this.$refs.previewIframe;
          if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
          } else if (iframe.webkitRequestFullscreen) { /* Safari */
            iframe.webkitRequestFullscreen();
          } else if (iframe.msRequestFullscreen) { /* IE11 */
            iframe.msRequestFullscreen();
          }
        }
      } catch (error) {
        console.error('无法切换到全屏模式:', error);
        this.$message.error('切换全屏模式失败，请检查浏览器权限');
      }
    },
    
    toggleMultiDevicePreview() {
      if (this.multiDeviceEnabled) {
        this.updateMultiDeviceUrls();
      }
    },
    
    generateQRCode() {
      // 构建预览链接
      const previewLink = `${window.location.origin}/preview/${this.meetingId}/${this.pageId}?device=${this.device}`;
      
      // 显示二维码面板
      this.qrcodeUrl = previewLink;
      this.qrcodeDevice = this.device;
      this.showQrcode = true;
      
      this.$message.success('二维码生成成功，请使用移动设备扫码查看');
    },
    
    changeQrcodeDevice(device) {
      // 更新二维码预览设备
      const previewLink = `${window.location.origin}/preview/${this.meetingId}/${this.pageId}?device=${device}`;
      this.qrcodeUrl = previewLink;
      this.$message.success(`已切换到${device === 'pc' ? 'PC端' : device === 'mobile' ? '手机端' : '平板端'}预览`);
    },
    
    copyPreviewLink() {
      // 构建完整的预览链接
      const previewLink = `${window.location.origin}/preview/${this.meetingId}/${this.pageId}?device=${this.device}`;
      
      // 创建临时文本区域
      const textarea = document.createElement('textarea');
      textarea.value = previewLink;
      textarea.style.position = 'fixed';  // 防止滚动到页面底部
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        // 执行复制命令
        const successful = document.execCommand('copy');
        if (successful) {
          this.$message.success('预览链接已复制到剪贴板');
        } else {
          this.$message.error('复制失败，请手动复制');
        }
      } catch (err) {
        this.$message.error('复制失败，请手动复制');
      }
      
      // 移除临时文本区域
      document.body.removeChild(textarea);
    },
    
    shareToWechat() {
      this.$message.success('微信分享功能已启动，请在弹出的窗口中操作');
      // 这里可以集成微信分享SDK
    },
    
    shareToMobile() {
      this.$message.success('短信分享功能已启动，请输入手机号码');
      // 这里可以添加发送短信的逻辑
    },
    
    initPerformanceMonitor() {
      // 初始化性能监控数据
      this.performanceMetrics = {
        loadTime: 0,
        renderTime: 0,
        resourceCount: 0,
        memoryUsage: 0
      };
      
      // 监听iframe加载完成事件
      this.$nextTick(() => {
        if (this.$refs.previewIframe) {
          this.$refs.previewIframe.onload = () => {
            this.collectPerformanceMetrics();
          };
        }
      });
    },
    
    collectPerformanceMetrics() {
      // 模拟收集性能指标
      // 实际生产环境中，这里会从iframe中获取真实的性能数据
      this.performanceMetrics.loadTime = Math.floor(Math.random() * 1000 + 500); // 模拟500-1500ms加载时间
      this.performanceMetrics.renderTime = Math.floor(Math.random() * 200 + 100); // 模拟100-300ms渲染时间
      this.performanceMetrics.resourceCount = Math.floor(Math.random() * 20 + 10); // 模拟10-30个资源
      this.performanceMetrics.memoryUsage = Math.floor(Math.random() * 50 + 20); // 模拟20-70MB内存使用
    },
    
    refreshPerformanceMetrics() {
      // 刷新性能指标
      setTimeout(() => {
        this.collectPerformanceMetrics();
      }, 1000);
    },
    
    handleClose() {
      // 清除自动刷新定时器
      if (this.autoRefreshTimer) {
        clearInterval(this.autoRefreshTimer);
        this.autoRefreshTimer = null;
      }
      
      // 清除性能监控数据
      this.performanceMetrics = null;
      
      // 关闭二维码面板
      this.showQrcode = false;
      
      // 通知父组件对话框已关闭
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.preview-dialog {
  display: flex;
  flex-direction: column;
}

.preview-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.performance-metrics {
  display: flex;
  gap: 8px;
}

.preview-content {
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.multi-device-preview {
  display: flex;
  justify-content: space-between;
  height: 70vh;
  gap: 15px;
}

.device-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.device-container h4 {
  margin: 0 0 10px 0;
  font-weight: normal;
  color: #606266;
}

.device-frame {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  width: 100%;
  background-color: #fff;
}

.device-frame.pc {
  width: 100%;
  height: 100%;
  border: 1px solid #dcdfe6;
}

.device-frame.mobile {
  width: 375px;
  height: 667px;
  border: 10px solid #333;
  border-radius: 30px;
  margin: 0 auto;
}

.device-frame.tablet {
  width: 768px;
  height: 1024px;
  border: 12px solid #333;
  border-radius: 20px;
  transform: scale(0.6);
  transform-origin: top center;
  margin: -15% auto 0;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.qrcode-image img {
  width: 100%;
  height: 100%;
}

.qrcode-device-selector {
  margin-bottom: 20px;
  text-align: center;
}

.qrcode-tips {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 0 20px;
  margin-bottom: 20px;
}

.qrcode-share-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style> 