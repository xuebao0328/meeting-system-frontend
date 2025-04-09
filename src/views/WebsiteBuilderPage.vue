<template>
  <div class="website-builder">
    <div v-if="!isLoading">
      <div v-if="isProfessionalVersion" class="professional-banner">
        <div class="pro-badge">专业版</div>
        <div class="pro-title">专业网站编辑器</div>
        <el-button 
          type="primary" 
          size="small" 
          icon="el-icon-back" 
          @click="backToStandard">
          返回标准版
        </el-button>
      </div>
      
      <website-editor 
        v-if="pageData"
        :page-data="pageData"
        :is-professional-version="isProfessionalVersion"
        @save="handleSave"
      />
    </div>
    <div v-else class="loading-container">
      <div class="loading-spinner">加载中...</div>
    </div>
  </div>
</template>

<script>
import WebsiteEditor from '@/components/WebsiteEditor.vue'

// 使用一个全局变量来防止重复加载
window.professionalPageLoaded = window.professionalPageLoaded || false;

export default {
  name: 'WebsiteBuilderPage',
  components: {
    WebsiteEditor
  },
  props: {
    isProfessionalVersion: {
      type: Boolean,
      default: false
    },
    pageId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      pageData: null,
      isLoading: true
    }
  },
  created() {
    // 如果是专业版页面且已经加载过，则直接停止不做任何操作
    if (this.isProfessionalVersion && window.professionalPageLoaded) {
      console.log('专业版页面已加载，不再重复初始化');
      this.initPageData();
      this.isLoading = false;
      return;
    }
    
    // 专业版页面第一次加载
    if (this.isProfessionalVersion) {
      console.log('首次加载专业版页面');
      // 设置标志，防止之后重复加载导致刷新
      window.professionalPageLoaded = true;
    }
    
    // 初始化页面数据
    this.initPageData();
    this.isLoading = false;
  },
  methods: {
    initPageData() {
      // 如果是专业版，尝试从localStorage加载数据
      if (this.isProfessionalVersion) {
        const savedData = localStorage.getItem('websiteEditorData');
        const savedContent = localStorage.getItem('websiteEditorContent');
        
        if (savedData && savedContent) {
          try {
            const pageData = JSON.parse(savedData);
            const content = JSON.parse(savedContent);
            
            this.pageData = {
              ...pageData,
              content: content
            };
            
            // 使用后清除数据
            localStorage.removeItem('websiteEditorData');
            localStorage.removeItem('websiteEditorContent');
            
            console.log('专业版加载保存的数据');
            return;
          } catch (error) {
            console.error('解析保存的数据失败:', error);
          }
        }
      }
      
      // 如果有pageId参数，应该根据pageId从API获取数据
      const id = this.pageId || '1';
      
      // 模拟初始数据，实际应该从API获取
      this.pageData = {
        id: id,
        title: this.isProfessionalVersion ? '专业网站页面' : '网站页面',
        content: [],
        settings: {
          theme: 'default',
          layout: 'standard'
        }
      }
      
      // 在专业版中添加一些专业功能设置
      if (this.isProfessionalVersion) {
        this.pageData.settings.proFeatures = {
          enabledCustomCode: true,
          advancedAnimations: true,
          seoTools: true
        };
      }
    },
    handleSave(data) {
      console.log('保存页面数据:', data);
      // 实现保存逻辑
      this.$message.success('保存成功！');
    },
    backToStandard() {
      // 返回标准版编辑器，使用硬跳转避免Vue Router可能导致的问题
      const baseUrl = window.location.origin;
      window.location.href = `${baseUrl}/website-builder`;
    }
  }
}
</script>

<style scoped>
.website-builder {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.loading-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner {
  font-size: 18px;
  color: #409EFF;
}

.professional-banner {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #1a6fc9, #3a8ee6);
  color: white;
  padding: 8px 20px;
}

.pro-badge {
  background: #f6bd16;
  color: #1a237e;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-right: 10px;
}

.pro-title {
  font-size: 16px;
  font-weight: bold;
  flex: 1;
}

.website-builder-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  margin: 0;
  padding: 0;
  background: #fff;
}

.full-height-card {
  flex: 1;
  margin: 0;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.full-height-card :deep(.el-card__body) {
  height: calc(100% - 40px);
  padding: 0;
}

.editor-header {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  border-bottom: 1px solid #EBEEF5;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meeting-title {
  font-size: 14px;
  color: #606266;
}

.preview-btn {
  color: #409EFF;
}

:deep(.el-card__header) {
  padding: 0;
  display: none;
}
</style> 