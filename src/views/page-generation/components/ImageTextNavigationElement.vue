<template>
  <div class="navigation-container" :style="style">
    <div
      v-for="(item, index) in element.props.children"
      :key="index"
      class="nav-item"
    >
      <a href="javascript:void(0)" class="item-link">
        <img :src="item.imgUrl" alt="导航图片" class="nav-image" />
        <div
          class="nav-title"
          :style="{
            'text-align': element.props.textAlign,
            color: element.props.color,
            'font-family': element.props.fontFamily,
            'font-size': element.props.fontSize + 'px',
            'font-weight': element.props.fontWeight,
          }"
        >
          {{ item.content }}
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "ImageTextNavigationElement",
  props: ["element"],
  watch: {
    "element.props.children": {
      handler() {},
      deep: true,
    },
  },
  computed: {
    style() {
      return {
        width: `${this.element.props.width}px`,
        height: `${this.element.props.height}px`,
        gridTemplateColumns: `repeat(${this.element.props.cols}, 1fr)`,
        gap: `${this.element.props.gap}px`,
      };
    },
  },
};
</script>

<style scoped>
.navigation-container {
  display: grid;
  grid-auto-rows: 1fr;
}

.nav-item {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.nav-image {
  width: 100%;
  height: calc(100% - 30px);
  object-fit: contain;
  object-position: center;
  overflow: hidden;
}

.nav-title {
  height: 30px;
  line-height: 30px;
  overflow: hidden;
}

.item-link {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
  outline: none;
  caret-color: transparent;
  pointer-events: none;
  img {
    user-select: none;
    outline: none;
    caret-color: transparent;
    pointer-events: none;
  }
}
</style>
