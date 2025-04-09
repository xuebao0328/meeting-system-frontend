<!-- swiper -->
<template>
  <div class="carousel-element">
    <div :id="element.id" class="swiper-container">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="(slide, index) in element.props.slides"
          :key="index"
        >
          <img
            :src="slide.src"
            alt=""
            style="
              user-select: none;
              pointer-events: none;
              max-width: 100%;
              max-height: 100%;
              margin: 0 auto;
              display: block;
            "
          />
        </div>
      </div>
      <div class="swiper-button-prev" v-if="element.props.navigation"></div>
      <div class="swiper-button-next" v-if="element.props.navigation"></div>
      <div class="swiper-pagination" v-if="element.props.pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from "swiper";
import "swiper/css/swiper.min.css";

export default {
  props: ["element"],
  data() {
    return {};
  },
  computed: {
    slides() {
      return this.element.props.slides;
    },
  },
  watch: {
    slides: {
      handler() {
        this.$nextTick(() => {
          if (this.swiper) {
            this.swiper.destroy();
            this.initSwiper();
          }
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.initSwiper();
  },
  methods: {
    initSwiper() {
      const options = {
        autoplay: this.element.props.autoplay,
        loop: this.element.props.loop,
        direction: this.element.props.direction,
        slidesPerView: this.element.props.slidesPerView,
        spaceBetween: this.element.props.spaceBetween,
        allowTouchMove: false,
      };
      if (this.element.props.pagination) {
        options.pagination = {
          el: ".swiper-pagination",
          clickable: true,
        };
      }
      if (this.element.props.navigation) {
        options.navigation = {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        };
      }
      this.swiper = new Swiper(`#${this.element.id}`, options);
    },
  },
  destroyed() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  },
};
</script>

<style scoped>
.carousel-element {
  width: 100%;
  height: 100%;
  .swiper-container {
    width: 100%;
    height: 100%;
    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
