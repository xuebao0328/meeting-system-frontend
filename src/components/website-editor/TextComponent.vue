<template>
  <div class="text-component" :style="textStyles">
    <div v-html="formattedContent"></div>
  </div>
</template>

<script>
export default {
  name: 'TextComponent',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  computed: {
    textStyles() {
      const styles = {};
      if (this.config.textColor) {
        styles.color = this.config.textColor;
      }
      if (this.config.fontSize) {
        styles.fontSize = this.config.fontSize;
      }
      return styles;
    },
    formattedContent() {
      if (!this.config.content) return '';
      // 将换行符转换为<br>标签
      return this.config.content.replace(/\n/g, '<br>');
    }
  }
}
</script>

<style scoped>
.text-component {
  padding: 20px;
  line-height: 1.6;
}
</style> 