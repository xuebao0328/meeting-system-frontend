<template>
  <div class="component-library">
    <div class="title">组件库
      <i class="el-icon-close" @click.stop="closeComponentLibrary" style="font-size: 20px;"></i>
    </div>
    <div class="component-list">
      <div
        v-for="(component, index) in components"
        :key="index"
        class="component-item"
        draggable="true"
        @dragstart="handleDragStart($event, component)"
        @dragend="handleDragEnd"
      >
        <div class="component-icon">
          <i :class="component.icon || 'el-icon-question'"></i>
        </div>
        <div class="component-label">{{ component.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    components: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    closeComponentLibrary() {
      this.$emit('close')
    },
    handleDragStart(e, component) {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: component.type,
          props: component.defaultProps,
          layout: {
            width: component.defaultProps.width || 100,
            height: component.defaultProps.height || 40,
          },
        })
      );
      e.target.style.opacity = "0.5";
    },

    handleDragEnd(e) {
      e.target.style.opacity = "1";
    },
  },
};
</script>

<style scoped>
.component-library {
  width: 240px;
  height: 100vh;
  border-right: 1px solid #e8e8e8;
  background: #fff;
}

.title {
  padding: 16px;
  font-weight: 500;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
    align-items: center;
    justify-content: space-between;
}

.component-list {
  padding: 8px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.component-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin: 4px 0;
  border-radius: 4px;
  cursor: move;
  transition: all 0.2s;
  background: #f8f9fa;

  &:hover {
    background: #e9ecef;
  }
}

.component-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.component-label {
  font-size: 14px;
  color: #333;
}
</style>