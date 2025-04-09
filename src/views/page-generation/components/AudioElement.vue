<template>
    <div class="audio-element">
        <audio :src="element.props.src" :autoplay="element.props.autoplay" ref="audioElement" :loop="element.props.loop" :style="audioStyle" @play="isPlaying = true" @pause="isPlaying = false"></audio>
        <div class="audio-element-play-button" v-if="element.props.showPlayButton">
            <img :src="element.props.playButtonSrc" alt="play" v-if="!isPlaying" @click="playAudio" />
            <img :src="element.props.pauseButtonSrc" alt="pause" v-else @click="pauseAudio" />
        </div>
    </div>
</template>

<script>
export default {
    props: ['element'],
     data() {
        return {
            isPlaying: false
        }
    },
    computed: {
        audioStyle() {
            return {
                width: `${this.element.props.width}px`,
                height: `${this.element.props.height}px`
            }
        },
    },
    watch: {
        'element.props.volume': {
            handler(newVal) {
                
                this.$refs.audioElement.volume = newVal / 100
            },
        }
    },
    methods: {
        playAudio() {
            if (this.element.props.src) {
                this.$refs.audioElement.play()
            }
        },
        pauseAudio() {
            if (this.element.props.src) {
                this.$refs.audioElement.pause()
            }
        }
    }
}
</script>

<style scoped>
.audio-element {
    width: 100%;
    height: 100%;
    audio {
        width: 100%;
        height: 100%;
    }
    .audio-element-play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        max-width: 100%;
        max-height: 100%;
        cursor: pointer;
        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>

