<template>
  <div class="speakers-component">
    <h2 v-if="config.title" class="speakers-title">{{ config.title }}</h2>
    <div class="speakers-list" :class="config.layout || 'grid'">
      <div v-for="(speaker, index) in speakers" :key="index" class="speaker-card">
        <div class="speaker-avatar">
          <img :src="speaker.avatar || 'https://via.placeholder.com/150'" alt="Speaker Avatar">
        </div>
        <div class="speaker-info">
          <h3 class="speaker-name">{{ speaker.name }}</h3>
          <p class="speaker-title">{{ speaker.title }}</p>
          <p class="speaker-bio" v-if="config.showBio">{{ speaker.bio }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpeakersComponent',
  props: {
    config: {
      type: Object,
      default: () => ({
        title: '嘉宾介绍',
        layout: 'grid', // grid, list, card
        showBio: true
      })
    }
  },
  computed: {
    speakers() {
      return this.config.speakers || [
        {
          name: '张教授',
          title: '北京大学计算机科学系',
          avatar: '',
          bio: '计算机科学领域知名专家，在人工智能方向有深入研究。'
        },
        {
          name: '李博士',
          title: '科技公司CEO',
          avatar: '',
          bio: '连续创业者，曾创办多家科技企业，对科技创新有独到见解。'
        },
        {
          name: '王专家',
          title: '行业资深顾问',
          avatar: '',
          bio: '在行业内有20年工作经验，曾主导多个重大项目。'
        }
      ];
    }
  }
}
</script>

<style scoped>
.speakers-component {
  padding: 20px;
}

.speakers-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.speakers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.speakers-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.speakers-list.list {
  flex-direction: column;
}

.speaker-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
}

.speakers-list.list .speaker-card {
  flex-direction: row;
  align-items: center;
}

.speaker-card:hover {
  transform: translateY(-5px);
}

.speaker-avatar {
  text-align: center;
  padding: 20px;
}

.speaker-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.speakers-list.list .speaker-avatar {
  flex: 0 0 100px;
}

.speakers-list.list .speaker-avatar img {
  width: 80px;
  height: 80px;
}

.speaker-info {
  padding: 0 20px 20px;
  flex: 1;
}

.speaker-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #333;
}

.speaker-title {
  color: #666;
  font-size: 14px;
  margin: 0 0 10px;
}

.speaker-bio {
  font-size: 14px;
  line-height: 1.5;
  color: #606266;
}
</style> 