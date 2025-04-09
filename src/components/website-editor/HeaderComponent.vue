<template>
  <div class="header-component" :style="headerStyles">
    <div class="header-content">
      <h1 v-if="config.title">{{ config.title }}</h1>
      <h2 v-if="config.subtitle">{{ config.subtitle }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  computed: {
    headerStyles() {
      const styles = {};
      if (this.config.backgroundColor) {
        styles.backgroundColor = this.config.backgroundColor;
      }
      if (this.config.backgroundImage) {
        styles.backgroundImage = `url(${this.config.backgroundImage})`;
        styles.backgroundSize = 'cover';
        styles.backgroundPosition = 'center';
      }
      return styles;
    }
  }
}
</script>

<style scoped>
.header-component {
  padding: 50px 20px;
  text-align: center;
  background-color: #f0f0f0;
  color: #ffffff;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 32px;
  margin-bottom: 15px;
}

h2 {
  font-size: 18px;
  font-weight: normal;
  opacity: 0.8;
}
</style> 