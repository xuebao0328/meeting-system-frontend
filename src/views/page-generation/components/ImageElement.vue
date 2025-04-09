<template>
  <div class="image-element">
    <a href="javascript:void(0)">
      <img :src="element.props.src" :style="imgStyle">
    </a>
  </div>
</template>

<script>
export default {
  props: ['element'],
  computed: {
    imgStyle() {
      return {
        width: `${this.element.props.width}px`,
        height: `${this.element.props.height}px`,
        'object-fit': this.element.props['objectFit'],
      }
    },
  },
  methods: {
  }
}
</script> 

<style scoped>
.image-element {
    user-select: none;
    outline: none;
    caret-color: transparent;
    pointer-events: none;
    img {
       max-width: 100%;
    }
}
</style>

