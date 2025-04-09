<template>
  <div class="list-block" @click="$emit('select')" :class="mobileStyle">
    <el-button size="small" @click="addItem">添加项目</el-button>
    <div class="list-items">
      <div v-for="(item, index) in items" :key="index" class="list-item">
        <el-input v-model="item.text" @input="updateItems">
          <template slot="append">
            <el-button icon="el-icon-delete" @click="removeItem(index)"></el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListBlock',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    mobileStyle: {
      type: String,
      default: 'standard'
    }
  },
  methods: {
    addItem() {
      const newItems = [...this.items, { text: '新项目' }]
      this.$emit('update', { items: newItems })
    },
    removeItem(index) {
      const newItems = [...this.items]
      newItems.splice(index, 1)
      this.$emit('update', { items: newItems })
    },
    updateItems() {
      this.$emit('update', { items: [...this.items] })
    }
  }
}
</script>

<style scoped>
.list-block {
  padding: 10px;
  position: relative;
}

.list-items {
  margin-top: 10px;
}

.list-item {
  margin-bottom: 10px;
}

.list-block.compact .list-item {
  font-size: 14px;
}

.list-block.compact .list-item .el-input {
  font-size: 12px;
}

.list-block.full-width {
  padding: 0;
}
</style> 