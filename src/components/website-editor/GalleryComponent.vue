<template>
  <div class="gallery-component">
    <h2 v-if="config.title" class="gallery-title">{{ config.title }}</h2>
    <div class="gallery-container" :class="config.layout || 'grid'">
      <div v-for="(image, index) in images" :key="index" class="gallery-item">
        <div class="image-container">
          <img :src="image.url || 'https://via.placeholder.com/300x200'" :alt="image.alt || '图片'" />
        </div>
        <div v-if="config.showCaptions && image.caption" class="image-caption">
          {{ image.caption }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GalleryComponent',
  props: {
    config: {
      type: Object,
      default: () => ({
        title: '图片画廊',
        layout: 'grid', // grid, masonry, carousel
        showCaptions: true,
        columns: 3
      })
    }
  },
  computed: {
    images() {
      return this.config.images || [
        {
          url: 'https://via.placeholder.com/800x600/3498db/ffffff',
          alt: '图片1',
          caption: '图片说明文字1'
        },
        {
          url: 'https://via.placeholder.com/800x600/e74c3c/ffffff',
          alt: '图片2',
          caption: '图片说明文字2'
        },
        {
          url: 'https://via.placeholder.com/800x600/27ae60/ffffff',
          alt: '图片3',
          caption: '图片说明文字3'
        },
        {
          url: 'https://via.placeholder.com/800x600/f39c12/ffffff',
          alt: '图片4',
          caption: '图片说明文字4'
        },
        {
          url: 'https://via.placeholder.com/800x600/9b59b6/ffffff',
          alt: '图片5',
          caption: '图片说明文字5'
        },
        {
          url: 'https://via.placeholder.com/800x600/1abc9c/ffffff',
          alt: '图片6',
          caption: '图片说明文字6'
        }
      ];
    }
  }
}
</script>

<style scoped>
.gallery-component {
  padding: 20px;
}

.gallery-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.gallery-container {
  width: 100%;
}

.gallery-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(100% / 3 - 20px), 1fr));
  gap: 20px;
}

.gallery-container.masonry {
  column-count: 3;
  column-gap: 20px;
}

.gallery-container.masonry .gallery-item {
  break-inside: avoid;
  margin-bottom: 20px;
}

.gallery-item {
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  background-color: #fff;
  transition: transform 0.3s;
}

.gallery-item:hover {
  transform: scale(1.03);
}

.image-container {
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s;
}

.gallery-item:hover .image-container img {
  transform: scale(1.1);
}

.image-caption {
  padding: 10px;
  font-size: 14px;
  color: #606266;
  background-color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 768px) {
  .gallery-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(calc(100% / 2 - 10px), 1fr));
    gap: 10px;
  }
  
  .gallery-container.masonry {
    column-count: 2;
  }
}

@media (max-width: 480px) {
  .gallery-container.grid {
    grid-template-columns: 1fr;
  }
  
  .gallery-container.masonry {
    column-count: 1;
  }
}
</style> 