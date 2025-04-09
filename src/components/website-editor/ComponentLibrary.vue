<template>
  <div class="component-library">
    <div class="component-category" v-for="(category, index) in categories" :key="index">
      <h3 class="category-title">{{ category.name }}</h3>
      <div class="component-grid">
        <div 
          class="component-item" 
          v-for="(component, compIndex) in category.components" 
          :key="compIndex"
          @click="selectComponent(component)"
        >
          <div class="component-icon">
            <i :class="component.icon"></i>
          </div>
          <div class="component-name">{{ component.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentLibrary',
  
  data() {
    return {
      categories: [
        {
          name: '基础组件',
          components: [
            { name: '文本', type: 'text', icon: 'el-icon-document' },
            { name: '图片', type: 'image', icon: 'el-icon-picture' },
            { name: '按钮', type: 'button', icon: 'el-icon-thumb' },
            { name: '分隔线', type: 'divider', icon: 'el-icon-minus' }
          ]
        },
        {
          name: '布局组件',
          components: [
            { name: '单栏', type: 'single-column', icon: 'el-icon-s-grid' },
            { name: '两栏', type: 'two-column', icon: 'el-icon-menu' },
            { name: '三栏', type: 'three-column', icon: 'el-icon-s-unfold' },
            { name: '容器', type: 'container', icon: 'el-icon-s-cooperation' }
          ]
        },
        {
          name: '功能组件',
          components: [
            { name: '头部', type: 'header', icon: 'el-icon-s-platform' },
            { name: '日程', type: 'agenda', icon: 'el-icon-date' },
            { name: '嘉宾', type: 'speakers', icon: 'el-icon-user' },
            { name: '注册表单', type: 'registration', icon: 'el-icon-s-order' },
            { name: '地图', type: 'map', icon: 'el-icon-location' },
            { name: '图库', type: 'gallery', icon: 'el-icon-picture-outline-round' }
          ]
        }
      ]
    };
  },
  
  methods: {
    selectComponent(component) {
      this.$emit('select-component', component.type);
    }
  }
};
</script>

<style lang="scss" scoped>
.component-library {
  padding: 15px;
  
  .component-category {
    margin-bottom: 20px;
    
    .category-title {
      font-size: 16px;
      margin-bottom: 10px;
      color: #606266;
      font-weight: 500;
    }
    
    .component-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    
    .component-item {
      background-color: #f5f7fa;
      border-radius: 4px;
      padding: 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background-color: #e6f1fc;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      
      .component-icon {
        font-size: 24px;
        color: #409eff;
        margin-bottom: 5px;
      }
      
      .component-name {
        font-size: 12px;
        color: #606266;
      }
    }
  }
}
</style> 