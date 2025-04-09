<template>
  <div class="text-block" @click="$emit('select')">
    <el-input
      type="textarea"
      v-model="localContent"
      @input="updateContent"
      :rows="3"
      :placeholder="placeholder"
      :class="{'compact': mobileStyle === 'compact'}">
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'TextBlock',
  props: {
    content: {
      type: String,
      default: ''
    },
    mobileStyle: {
      type: String,
      default: 'standard'
    }
  },
  computed: {
    placeholder() {
      return this.content || '请输入文本内容';
    }
  },
  data() {
    return {
      localContent: this.content
    }
  },
  watch: {
    content(newVal) {
      this.localContent = newVal;
    }
  },
  methods: {
    updateContent(value) {
      this.$emit('update', { content: value })
    }
  }
}
</script>

<style scoped>
.text-block {
  position: relative;
  padding: 10px;
}

.text-block .el-textarea.compact {
  font-size: 14px;
}

.text-block .el-textarea.compact ::v-deep .el-textarea__inner {
  padding: 5px;
}
</style> 