<template>
  <div class="countdown-container">
    <div class="countdown-values" v-if="!isExpired">
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">{{ days }}</span>
        <span class="countdown-label" :style="fontStyle">天</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">{{ hours }}</span>
        <span class="countdown-label" :style="fontStyle">时</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">{{ minutes }}</span>
        <span class="countdown-label" :style="fontStyle">分</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">{{ seconds }}</span>
        <span class="countdown-label" :style="fontStyle">秒</span>
      </div>
    </div>
    <div class="countdown-values" v-else>
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">00</span>
        <span class="countdown-label" :style="fontStyle">天</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">00</span>
        <span class="countdown-label" :style="fontStyle">时</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">00</span>
        <span class="countdown-label" :style="fontStyle">分</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number" :style="fontStyle">00</span>
        <span class="countdown-label" :style="fontStyle">秒</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CountdownElement",
  props: ["element"],
  data() {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      timer: null,
      isExpired: false,
    };
  },
  computed: {
    fontStyle() {
      return {
        "text-align": this.element.props.textAlign,
        color: this.element.props.color,
        "font-family": this.element.props.fontFamily,
        "font-size": this.element.props.fontSize + "px",
        "font-weight": this.element.props.fontWeight,
      };
    },
  },
  watch: {
    "element.props.endtime": {
      handler() {
        this.clearTimer();
        this.isExpired = false;
        this.days = "00";
        this.hours = "00";
        this.minutes = "00";
        this.seconds = "00";
        this.startCountdown();
      },
      deep: true,
    },
  },
  mounted() {
    this.startCountdown();
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    startCountdown() {
      this.calculateTime();
      this.timer = setInterval(() => {
        this.calculateTime();
      }, 1000);
    },
    calculateTime() {
      const endTime = new Date(this.element.props.endtime).getTime();
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        this.clearTimer();
        this.isExpired = true;
        this.days = "00";
        this.hours = "00";
        this.minutes = "00";
        this.seconds = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.days = days < 10 ? `0${days}` : `${days}`;
      this.hours = hours < 10 ? `0${hours}` : `${hours}`;
      this.minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      this.seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
};
</script>

<style scoped>
.countdown-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-values {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.countdown-item {
  display: flex;
  align-items: center;
}

.countdown-number {
  background-color: #f7f7f7;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 20px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
  margin-right: 10px;
}

.countdown-label {
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}

.countdown-expired {
  margin-top: 10px;
  color: #ff4d4f;
  font-weight: bold;
}
</style>