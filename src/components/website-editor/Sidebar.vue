<template>
  <div class="sidebar">
    <!-- 侧边栏选项卡 -->
    <el-tabs v-model="activeTab" stretch>
      <!-- 组件库 -->
      <el-tab-pane label="组件库" name="components">
        <el-scrollbar>
          <div class="component-category" v-for="(category, index) in componentCategories" :key="index">
            <h4>{{ category.name }}</h4>
            <div class="component-list">
              <div 
                v-for="(component, cIndex) in category.components" 
                :key="cIndex"
                class="component-item"
                draggable="true"
                @dragstart="handleDragStart($event, component)"
              >
                <i :class="component.icon"></i>
                <span>{{ component.name }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-tab-pane>

      <!-- 页面管理 -->
      <el-tab-pane label="页面管理" name="pages">
        <el-scrollbar>
          <div class="page-list">
            <div 
              v-for="(page, index) in pages" 
              :key="index"
              class="page-item"
              :class="{ active: activePage === page.id }"
              @click="handlePageClick(page.id)"
            >
              <i class="el-icon-document"></i>
              <span>{{ page.name }}</span>
              <el-button 
                type="text" 
                icon="el-icon-delete" 
                @click.stop="handleDeletePage(page.id)"
              ></el-button>
            </div>
            <el-button 
              type="primary" 
              class="add-page-btn"
              @click="handleAddPage"
            >
              <i class="el-icon-plus"></i>
              添加新页面
            </el-button>
          </div>
        </el-scrollbar>
      </el-tab-pane>

      <!-- 样式设置 -->
      <el-tab-pane label="样式设置" name="styles">
        <el-scrollbar>
          <div class="style-settings">
            <el-form label-width="80px" label-position="left" class="centered-form">
              <el-form-item label="主题色">
                <el-color-picker v-model="themeColor"></el-color-picker>
              </el-form-item>
              <el-form-item label="字体">
                <el-select v-model="fontFamily">
                  <el-option label="默认" value="inherit"></el-option>
                  <el-option label="Arial" value="Arial"></el-option>
                  <el-option label="微软雅黑" value="Microsoft YaHei"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="字号">
                <el-input-number v-model="fontSize" :min="12" :max="24"></el-input-number>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'components',
      componentCategories: [
        {
          name: '基础组件',
          components: [
            { name: '文本', type: 'text', icon: 'el-icon-document' },
            { name: '图片', type: 'image', icon: 'el-icon-picture' },
            { name: '按钮', type: 'button', icon: 'el-icon-thumb' }
          ]
        },
        {
          name: '表单组件',
          components: [
            { name: '输入框', type: 'input', icon: 'el-icon-edit' },
            { name: '选择器', type: 'select', icon: 'el-icon-s-operation' },
            { name: '单选框', type: 'radio', icon: 'el-icon-circle-check' }
          ]
        }
      ],
      pages: [],
      themeColor: '#409EFF',
      fontFamily: 'inherit',
      fontSize: 14
    }
  },
  methods: {
    handleDragStart(event, component) {
      event.dataTransfer.setData('component', JSON.stringify(component));
    },
    handlePageClick(pageId) {
      this.activePage = pageId;
      this.$emit('page-change', pageId);
    },
    handleAddPage() {
      const newPage = {
        id: Date.now(),
        name: `新页面${this.pages.length + 1}`
      };
      this.pages.push(newPage);
      this.handlePageClick(newPage.id);
    },
    handleDeletePage(pageId) {
      this.pages = this.pages.filter(page => page.id !== pageId);
      if (this.activePage === pageId && this.pages.length > 0) {
        this.handlePageClick(this.pages[0].id);
      }
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  border-right: 1px solid #ebeef5;
}

.component-category {
  margin-bottom: 20px;
}

.component-item {
  padding: 8px;
  cursor: move;
  border-radius: 4px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.component-item:hover {
  background-color: #f5f7fa;
}

.page-list {
  padding: 10px;
}

.page-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
  cursor: pointer;
}

.page-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.add-page-btn {
  width: 100%;
  margin-top: 10px;
}

.style-settings {
  padding: 20px;
}

.centered-form {
  text-align: center;
}
</style> 