<template>
  <div class="image-component">
    <img 
      v-if="config.src"
      :src="config.src" 
      :alt="config.alt || ''" 
      class="image-content"
    />
    <div v-else class="image-placeholder">
      <i class="el-icon-picture"></i>
      <span>请选择图片</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageComponent',
  props: {
    config: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.image-component {
  padding: 10px;
  text-align: center;
}

.image-content {
  max-width: 100%;
  height: auto;
}

.image-placeholder {
  padding: 50px;
  background-color: #f5f7fa;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  color: #909399;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-placeholder i {
  font-size: 40px;
  margin-bottom: 10px;
}
</style> 