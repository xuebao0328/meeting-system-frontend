<template>
  <el-dialog
    title="页面预览"
    :visible.sync="visible"
    width="90%"
    class="preview-dialog"
    :fullscreen="isFullScreen"
    @close="handleClose">
    
    <!-- 顶部工具栏 -->
    <div class="preview-toolbar">
      <el-radio-group v-model="deviceType" size="small">
        <el-radio-button label="mobile">手机</el-radio-button>
        <el-radio-button label="tablet">平板</el-radio-button>
        <el-radio-button label="desktop">PC</el-radio-button>
      </el-radio-group>
      
      <div class="toolbar-actions">
        <el-tooltip content="刷新预览" placement="top">
          <el-button size="small" icon="el-icon-refresh" circle @click="refreshPreview"></el-button>
        </el-tooltip>
        <el-tooltip content="复制链接" placement="top">
          <el-button size="small" icon="el-icon-document-copy" circle @click="copyLink"></el-button>
        </el-tooltip>
        <el-tooltip :content="isFullScreen ? '退出全屏' : '全屏预览'" placement="top">
          <el-button 
            size="small" 
            :icon="isFullScreen ? 'el-icon-close' : 'el-icon-full-screen'" 
            circle 
            @click="toggleFullScreen">
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <!-- 预览区域 -->
    <div class="preview-container" :class="deviceType">
      <div class="preview-frame" :style="frameStyle">
        <iframe 
          :src="previewUrl" 
          frameborder="0"
          ref="previewFrame">
        </iframe>
      </div>
    </div>
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
    pageData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      deviceType: 'mobile',
      isFullScreen: false,
      deviceSizes: {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1280, height: 800 }
      }
    }
  },
  computed: {
    previewUrl() {
      return `${window.location.origin}/preview/${this.pageData.id}?t=${Date.now()}`
    },
    frameStyle() {
      const size = this.deviceSizes[this.deviceType]
      return {
        width: `${size.width}px`,
        height: `${size.height}px`
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    refreshPreview() {
      this.$refs.previewFrame.contentWindow.location.reload()
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(this.previewUrl)
        this.$message.success('链接已复制到剪贴板')
      } catch (err) {
        // 降级方案
        const textarea = document.createElement('textarea')
        textarea.value = this.previewUrl
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
          this.$message.success('链接已复制到剪贴板')
        } catch (e) {
          this.$message.error('复制失败，请手动复制')
        }
        document.body.removeChild(textarea)
      }
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-dialog {
  .preview-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .preview-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;
    min-height: 500px;

    .preview-frame {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      overflow: hidden;

      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style> 