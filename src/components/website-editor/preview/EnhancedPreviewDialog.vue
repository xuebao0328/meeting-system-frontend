<template>
  <el-dialog 
    title="网站预览" 
    :visible.sync="visible" 
    :fullscreen="isFullscreen"
    custom-class="enhanced-preview-dialog"
    :before-close="handleClose"
    :show-close="!isFullscreen"
    :append-to-body="true">
    
    <div class="preview-toolbar" v-show="!hideControls || controlsVisible">
      <div class="toolbar-left">
        <el-select v-model="pageId" placeholder="选择页面" @change="updatePreview" size="small">
          <el-option 
            v-for="page in pages" 
            :key="page.id" 
            :label="page.name" 
            :value="page.id">
          </el-option>
        </el-select>
        
        <el-select v-model="deviceType" placeholder="设备类型" @change="updateDeviceType" size="small">
          <el-option-group label="电脑">
            <el-option label="桌面端" value="desktop"></el-option>
          </el-option-group>
          <el-option-group label="平板">
            <el-option label="iPad" value="ipad"></el-option>
            <el-option label="iPad Pro" value="ipad-pro"></el-option>
          </el-option-group>
          <el-option-group label="手机">
            <el-option label="iPhone 14 Pro" value="iphone14-pro"></el-option>
            <el-option label="iPhone 13/12" value="iphone13"></el-option>
            <el-option label="iPhone SE" value="iphoneSE"></el-option>
            <el-option label="Android手机" value="android"></el-option>
          </el-option-group>
        </el-select>
        
        <div v-if="isMobileDevice" class="orientation-switcher">
          <el-tooltip content="切换为竖屏" placement="top" v-if="isLandscape">
            <el-button size="small" icon="el-icon-mobile" @click="setOrientation('portrait')"></el-button>
          </el-tooltip>
          <el-tooltip content="切换为横屏" placement="top" v-else>
            <el-button size="small" icon="el-icon-mobile-phone" @click="setOrientation('landscape')"></el-button>
          </el-tooltip>
        </div>
      </div>
      
      <div class="toolbar-center">
        <el-button-group>
          <el-button size="small" icon="el-icon-refresh" @click="refreshPreview">刷新</el-button>
          <el-button 
            size="small" 
            :icon="isFullscreen ? 'el-icon-close' : 'el-icon-full-screen'" 
            @click="toggleFullScreen">
            {{isFullscreen ? '退出全屏' : '全屏预览'}}
          </el-button>
          <el-button size="small" :icon="hideControls ? 'el-icon-view' : 'el-icon-hide'" @click="toggleControls">
            {{hideControls ? '显示控制项' : '隐藏控制项'}}
          </el-button>
        </el-button-group>
      </div>
      
      <div class="toolbar-right">
        <el-popover
          placement="bottom"
          width="300"
          trigger="click">
          <div class="qrcode-container">
            <div class="qrcode-image">
              <img :src="`/api/qrcode?text=${encodeURIComponent(previewUrl)}`" alt="预览二维码" />
            </div>
            <p class="qrcode-tip">使用手机扫码，在真实设备上查看</p>
          </div>
          <el-button slot="reference" size="small" icon="el-icon-mobile">扫码预览</el-button>
        </el-popover>
        
        <el-button size="small" icon="el-icon-link" @click="copyPreviewLink">复制链接</el-button>
      </div>
    </div>
    
    <div class="preview-container" @mousemove="showControlsTemporarily" :class="{'controls-hidden': hideControls && !controlsVisible, 'fullscreen': isFullscreen}">
      <div class="device-simulator" :class="[deviceClass, orientationClass]">
        <!-- iPhone顶部状态栏 -->
        <div v-if="isIphoneDevice" class="iphone-status-bar">
          <div class="status-bar-time">9:41</div>
          <div v-if="hasNotch" class="status-bar-notch"></div>
          <div class="status-bar-right">
            <div class="network-signal">
              <i class="signal-bar"></i>
              <i class="signal-bar"></i>
              <i class="signal-bar"></i>
              <i class="signal-bar"></i>
            </div>
            <div class="wifi-signal"></div>
            <div class="battery-icon">
              <div class="battery-level" style="width: 60%"></div>
            </div>
          </div>
        </div>
        
        <!-- 设备框架 -->
        <div class="device-frame">
          <!-- iPhone侧边按钮 -->
          <div v-if="isIphoneDevice" class="iphone-buttons">
            <div class="side-button power-button"></div>
            <div class="side-button volume-up"></div>
            <div class="side-button volume-down"></div>
          </div>
          
          <!-- 屏幕内容 -->
          <iframe 
            :src="previewUrl" 
            frameborder="0" 
            ref="previewIframe" 
            class="preview-iframe">
          </iframe>
          
          <!-- iPhone底部指示条 -->
          <div v-if="isIphoneDevice && hasHomeIndicator" class="home-indicator"></div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EnhancedPreviewDialog',
  
  props: {
    meetingId: {
      type: [String, Number],
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
      default: 'desktop'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      pageId: this.initialPageId,
      deviceType: this.initialDevice,
      previewUrl: '',
      isFullscreen: false,
      hideControls: false,
      controlsVisible: false,
      controlsTimer: null,
      orientation: 'portrait',
      urlParams: {}
    }
  },
  
  computed: {
    isLandscape() {
      return this.orientation === 'landscape';
    },
    
    isMobileDevice() {
      return ['iphone14-pro', 'iphone13', 'iphoneSE', 'android'].includes(this.deviceType);
    },
    
    isIphoneDevice() {
      return ['iphone14-pro', 'iphone13', 'iphoneSE'].includes(this.deviceType);
    },
    
    hasNotch() {
      return ['iphone14-pro', 'iphone13'].includes(this.deviceType);
    },
    
    hasHomeIndicator() {
      return ['iphone14-pro', 'iphone13'].includes(this.deviceType);
    },
    
    deviceClass() {
      return `device-${this.deviceType}`;
    },
    
    orientationClass() {
      return `orientation-${this.orientation}`;
    },
    
    normalizedMeetingId() {
      return String(this.meetingId);
    },
    
    normalizedPageId() {
      return String(this.pageId);
    },
    
    previewUrl() {
      return `/preview/${this.normalizedMeetingId}/${this.normalizedPageId}`;
    }
  },
  
  watch: {
    visible(newVal) {
      if (newVal) {
        this.pageId = this.initialPageId;
        this.deviceType = this.initialDevice;
        this.updatePreview();
        
        // 监听ESC键退出全屏
        document.addEventListener('keydown', this.handleKeyDown);
      } else {
        document.removeEventListener('keydown', this.handleKeyDown);
      }
    }
  },
  
  mounted() {
    if (this.visible) {
      this.updatePreview();
    }
  },
  
  methods: {
    updatePreview() {
      this.updatePreviewUrl();
      this.$emit('update:pageId', this.pageId);
    },
    
    updatePreviewUrl() {
      const timestamp = new Date().getTime();
      const deviceParam = this.getDeviceParam();
      
      // 构建URL参数
      const params = {
        pageId: this.pageId,
        device: deviceParam,
        orientation: this.orientation,
        quality: 'high',
        t: timestamp,
        ...this.urlParams
      };
      
      // 将参数转换为查询字符串
      const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      this.previewUrl = `/api/meetings/${this.normalizedMeetingId}/website/preview?${queryString}`;
    },
    
    getDeviceParam() {
      // 将内部设备类型映射到API参数
      const deviceMap = {
        'desktop': 'pc',
        'ipad': 'tablet',
        'ipad-pro': 'tablet',
        'iphone14-pro': 'mobile',
        'iphone13': 'mobile',
        'iphoneSE': 'mobile',
        'android': 'mobile'
      };
      
      return deviceMap[this.deviceType] || 'pc';
    },
    
    updateDeviceType() {
      this.updatePreview();
    },
    
    refreshPreview() {
      this.updatePreviewUrl();
      
      if (this.$refs.previewIframe) {
        this.$refs.previewIframe.contentWindow.location.reload();
      }
    },
    
    toggleFullScreen() {
      this.isFullscreen = !this.isFullscreen;
      
      if (this.isFullscreen) {
        // 全屏模式下默认隐藏控制栏
        this.hideControls = true;
        this.controlsVisible = false;
      } else {
        // 退出全屏时显示控制栏
        this.hideControls = false;
      }
    },
    
    toggleControls() {
      this.hideControls = !this.hideControls;
      if (!this.hideControls) {
        this.controlsVisible = false;
      }
    },
    
    showControlsTemporarily() {
      if (this.hideControls && this.isFullscreen) {
        this.controlsVisible = true;
        
        // 清除之前的定时器
        if (this.controlsTimer) {
          clearTimeout(this.controlsTimer);
        }
        
        // 设置新的定时器，3秒后隐藏控制栏
        this.controlsTimer = setTimeout(() => {
          this.controlsVisible = false;
        }, 3000);
      }
    },
    
    setOrientation(orientation) {
      this.orientation = orientation;
      this.updatePreview();
    },
    
    copyPreviewLink() {
      const baseUrl = window.location.origin;
      const previewLink = `${baseUrl}/preview/${this.normalizedMeetingId}/${this.normalizedPageId}?device=${this.getDeviceParam()}&orientation=${this.orientation}`;
      
      const textarea = document.createElement('textarea');
      textarea.value = previewLink;
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        this.$message.success('预览链接已复制到剪贴板');
      } catch (err) {
        this.$message.error('复制失败，请手动复制');
        console.error('复制失败:', err);
      }
      
      document.body.removeChild(textarea);
    },
    
    handleKeyDown(event) {
      // ESC键退出全屏
      if (event.key === 'Escape' && this.isFullscreen) {
        this.isFullscreen = false;
        this.hideControls = false;
      }
    },
    
    handleClose() {
      // 清除定时器
      if (this.controlsTimer) {
        clearTimeout(this.controlsTimer);
        this.controlsTimer = null;
      }
      
      // 移除事件监听
      document.removeEventListener('keydown', this.handleKeyDown);
      
      // 重置状态
      this.isFullscreen = false;
      this.hideControls = false;
      this.controlsVisible = false;
      
      this.$emit('update:visible', false);
      this.$emit('close');
    },
    
    openEnhancedPreview() {
      window.open(`/preview/${this.normalizedMeetingId}/${this.normalizedPageId}`, '_blank');
    }
  }
}
</script>

<style lang="scss" scoped>
.enhanced-preview-dialog {
  display: flex;
  flex-direction: column;
  background-color: #f6f8fa;
  margin: 0 !important;
  
  ::v-deep .el-dialog__header {
    padding: 10px 20px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    margin-right: 0;
  }
  
  ::v-deep .el-dialog__body {
    padding: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  &.is-fullscreen {
    ::v-deep .el-dialog__header {
      display: none;
    }
  }
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
  z-index: 100;
  transition: all 0.3s ease;
  
  .toolbar-left, .toolbar-center, .toolbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .orientation-switcher {
    margin-left: 5px;
  }
}

.controls-hidden {
  .preview-toolbar {
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
  }
  
  &.preview-toolbar.controlsVisible {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
}

.preview-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  background-color: #2c3e50;
  position: relative;
  padding: 20px;
  transition: padding 0.3s ease;
  
  &.fullscreen {
    padding: 40px;
  }
}

.device-simulator {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  
  // 基础设备样式
  .device-frame {
    background-color: #fff;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;
  }
  
  .preview-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }
  
  // iPhone通用样式
  &.device-iphone14-pro, &.device-iphone13, &.device-iphoneSE {
    .device-frame {
      border: 12px solid #1a1a1a;
      border-radius: 50px;
      position: relative;
    }
    
    .iphone-buttons {
      position: absolute;
      z-index: 10;
      
      .side-button {
        background-color: #1a1a1a;
        position: absolute;
        border-radius: 2px;
      }
      
      .power-button {
        width: 3px;
        height: 80px;
        right: -15px;
        top: 120px;
      }
      
      .volume-up {
        width: 3px;
        height: 60px;
        left: -15px;
        top: 120px;
      }
      
      .volume-down {
        width: 3px;
        height: 60px;
        left: -15px;
        top: 200px;
      }
    }
  }
  
  // iPhone 14 Pro 特定样式
  &.device-iphone14-pro {
    .device-frame {
      width: 390px;
      height: 844px;
    }
    
    .iphone-status-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 47px;
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 14px;
      z-index: 5;
      pointer-events: none;
    }
    
    .status-bar-notch {
      position: absolute;
      width: 126px;
      height: 34px;
      background-color: #000;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 16px;
      z-index: 6;
    }
    
    .home-indicator {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 134px;
      height: 5px;
      background-color: #000;
      border-radius: 3px;
      z-index: 5;
    }
  }
  
  // iPhone 13/12 特定样式
  &.device-iphone13 {
    .device-frame {
      width: 390px;
      height: 844px;
    }
    
    .status-bar-notch {
      width: 156px;
      height: 34px;
    }
  }
  
  // iPhone SE 特定样式
  &.device-iphoneSE {
    .device-frame {
      width: 375px;
      height: 667px;
      border-radius: 40px;
    }
    
    &:before {
      content: '';
      position: absolute;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #f2f2f2;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 5;
      border: 2px solid #d1d1d1;
    }
  }
  
  // Android 特定样式
  &.device-android {
    .device-frame {
      width: 360px;
      height: 780px;
      border: 12px solid #1a1a1a;
      border-radius: 30px;
    }
  }
  
  // iPad 特定样式
  &.device-ipad {
    .device-frame {
      width: 768px;
      height: 1024px;
      border: 20px solid #1a1a1a;
      border-radius: 20px;
    }
  }
  
  // iPad Pro 特定样式
  &.device-ipad-pro {
    .device-frame {
      width: 834px;
      height: 1112px;
      border: 20px solid #1a1a1a;
      border-radius: 25px;
    }
  }
  
  // 桌面端特定样式
  &.device-desktop {
    .device-frame {
      width: 1280px;
      height: 800px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
    }
  }
  
  // 横屏样式
  &.orientation-landscape {
    transform: rotate(90deg);
    
    &.device-iphone14-pro, &.device-iphone13 {
      .device-frame {
        width: 844px;
        height: 390px;
      }
      
      .iphone-buttons {
        transform: rotate(-90deg);
        
        .power-button {
          right: auto;
          top: auto;
          left: 120px;
          bottom: -15px;
          width: 80px;
          height: 3px;
        }
        
        .volume-up {
          left: auto;
          top: auto;
          right: 120px;
          top: -15px;
          width: 60px;
          height: 3px;
        }
        
        .volume-down {
          left: auto;
          top: auto;
          right: 200px;
          top: -15px;
          width: 60px;
          height: 3px;
        }
      }
    }
    
    &.device-iphoneSE {
      .device-frame {
        width: 667px;
        height: 375px;
      }
    }
    
    &.device-android {
      .device-frame {
        width: 780px;
        height: 360px;
      }
    }
    
    &.device-ipad {
      .device-frame {
        width: 1024px;
        height: 768px;
      }
    }
    
    &.device-ipad-pro {
      .device-frame {
        width: 1112px;
        height: 834px;
      }
    }
  }
}

.status-bar-time {
  font-weight: 600;
  font-size: 15px;
}

.status-bar-right {
  display: flex;
  align-items: center;
  gap: 5px;
}

.network-signal {
  display: flex;
  align-items: flex-end;
  height: 12px;
  gap: 1px;
  
  .signal-bar {
    width: 3px;
    background-color: white;
    border-radius: 1px;
    
    &:nth-child(1) { height: 5px; }
    &:nth-child(2) { height: 7px; }
    &:nth-child(3) { height: 9px; }
    &:nth-child(4) { height: 11px; }
  }
}

.wifi-signal {
  width: 15px;
  height: 15px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    border: 2px solid white;
    border-radius: 50%;
    width: 6px;
    height: 6px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  
  &:after {
    content: '';
    position: absolute;
    border: 2px solid white;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.battery-icon {
  width: 22px;
  height: 10px;
  border: 1px solid white;
  border-radius: 2px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 4px;
    background-color: white;
    right: -3px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 0 2px 2px 0;
  }
  
  .battery-level {
    position: absolute;
    left: 1px;
    top: 1px;
    bottom: 1px;
    background-color: white;
  }
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  
  .qrcode-image {
    width: 200px;
    height: 200px;
    margin-bottom: 15px;
    
    img {
      width: 100%;
      height: 100%;
    }
  }
  
  .qrcode-tip {
    font-size: 14px;
    color: #606266;
    text-align: center;
  }
}
</style> 