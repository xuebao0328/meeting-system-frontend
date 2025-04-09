<template>
  <div class="banner-block" @click="$emit('select')" :class="mobileStyle">
    <div class="banner" :style="{ background: background }">
      <h2 class="title">{{ title }}</h2>
      <div class="subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BannerBlock',
  props: {
    title: {
      type: String,
      default: '横幅标题'
    },
    subtitle: {
      type: String,
      default: '副标题'
    },
    background: {
      type: String,
      default: '#f5f5f5'
    },
    mobileStyle: {
      type: String,
      default: 'standard'
    }
  }
}
</script>

<style scoped>
.banner-block {
  position: relative;
}

.banner {
  padding: 40px 20px;
  text-align: center;
  border-radius: 4px;
}

.banner-block.compact .banner {
  padding: 20px 15px;
}

.banner-block.full-width .banner {
  border-radius: 0;
}

.title {
  margin: 0 0 10px;
  font-size: 24px;
}

.banner-block.compact .title {
  font-size: 18px;
}

.subtitle {
  font-size: 16px;
  color: #666;
}

.banner-block.compact .subtitle {
  font-size: 14px;
}
</style> 