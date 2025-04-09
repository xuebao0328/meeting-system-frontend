<template>
  <div class="image-block" @click="$emit('select')" :class="mobileStyle">
    <div class="image-container">
      <template v-if="src">
        <img :src="src" :alt="alt" class="preview-image">
        <div class="image-actions">
          <el-button size="small" type="danger" @click="removePicture">删除</el-button>
        </div>
      </template>
      <el-upload
        v-else
        class="image-uploader"
        action="/api/upload"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload">
        <i class="el-icon-plus upload-icon"></i>
        <div class="upload-text">点击上传图片</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageBlock',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    mobileStyle: {
      type: String,
      default: 'standard'
    }
  },
  methods: {
    handleUploadSuccess(res) {
      // 这里假设上传接口返回 { url: 'image-url' }
      this.$emit('update', { src: res.url })
    },
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('只能上传图片文件!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    removePicture() {
      this.$emit('update', { src: '', alt: '' })
    }
  }
}
</script>

<style lang="scss" scoped>
.image-block {
  padding: 20px;
  position: relative;
  
  .image-container {
    position: relative;
    min-height: 200px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    &:hover {
      border-color: #409EFF;
      
      .image-actions {
        opacity: 1;
      }
    }
  }

  .preview-image {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
  }
  
  &.compact {
    padding: 10px;
    
    .image-container {
      min-height: 150px;
    }
    
    .preview-image {
      max-height: 200px;
    }
  }
  
  &.full-width {
    padding: 0;
    
    .image-container {
      border: none;
      border-radius: 0;
    }
    
    .preview-image {
      width: 100%;
      object-fit: cover;
    }
  }

  .image-actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s;
    background: rgba(0, 0, 0, 0.6);
    padding: 10px;
    border-radius: 4px;
  }

  .image-uploader {
    text-align: center;
    padding: 20px;
    cursor: pointer;

    .upload-icon {
      font-size: 28px;
      color: #8c939d;
      margin-bottom: 10px;
    }

    .upload-text {
      color: #8c939d;
    }

    &:hover {
      color: #409EFF;
      .upload-icon, .upload-text {
        color: #409EFF;
      }
    }
  }
}
</style> 