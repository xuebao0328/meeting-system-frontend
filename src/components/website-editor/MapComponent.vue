<template>
  <div class="map-component">
    <h2 v-if="config.title" class="map-title">{{ config.title }}</h2>
    <div class="map-container" :style="{ height: config.height + 'px' }">
      <div class="map-placeholder">
        <i class="el-icon-location"></i>
        <div class="map-address" v-if="config.address">
          <div class="address-title">{{ config.venueName || '活动地点' }}</div>
          <div class="address-content">{{ config.address }}</div>
        </div>
      </div>
      <div class="map-overlay">
        <div class="overlay-text">
          <p>实际使用时将加载地图API</p>
          <p>{{ config.address || '地址未指定' }}</p>
          <p v-if="config.coordinates">坐标: {{ config.coordinates.lat }}, {{ config.coordinates.lng }}</p>
        </div>
      </div>
    </div>
    <div v-if="config.showContactInfo" class="contact-info">
      <div v-if="config.phone" class="contact-item">
        <i class="el-icon-phone"></i>
        <span>{{ config.phone }}</span>
      </div>
      <div v-if="config.email" class="contact-item">
        <i class="el-icon-message"></i>
        <span>{{ config.email }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapComponent',
  props: {
    config: {
      type: Object,
      default: () => ({
        title: '位置信息',
        venueName: '会议中心',
        address: '北京市海淀区中关村大街1号',
        height: 300,
        showContactInfo: true,
        phone: '010-12345678',
        email: 'contact@example.com',
        coordinates: {
          lat: 39.9,
          lng: 116.3
        }
      })
    }
  }
}
</script>

<style scoped>
.map-component {
  padding: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.map-title {
  font-size: 24px;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.map-container {
  position: relative;
  width: 100%;
  min-height: 250px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.map-placeholder {
  display: flex;
  align-items: center;
  padding: 20px;
  z-index: 1;
}

.map-placeholder .el-icon-location {
  font-size: 36px;
  color: #409EFF;
  margin-right: 15px;
}

.map-address {
  display: flex;
  flex-direction: column;
}

.address-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}

.address-content {
  font-size: 14px;
  color: #606266;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.overlay-text {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.overlay-text p {
  margin: 5px 0;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 10px 15px;
  border-radius: 4px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.05);
}

.contact-item i {
  color: #409EFF;
  font-size: 18px;
}

@media (max-width: 768px) {
  .map-container {
    min-height: 200px;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style> 