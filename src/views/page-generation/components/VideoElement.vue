<template>
    <div class="video-element">
        <video ref="videoElement" @play="isPlaying = true" @pause="isPlaying = false" :style="videoStyle"
            :src="element.props.src" :width="element.props.width" :height="element.props.height"
            :autoplay="element.props.autoplay" :loop="element.props.loop" :muted="element.props.muted"
            :controls="element.props.controls"></video>
        <div class="video-element-play-button" v-if="element.props.showPlayButton">
            <img :src="element.props.playButtonSrc" alt="play" v-if="!isPlaying" @click="playVideo" />
            <img :src="element.props.pauseButtonSrc" alt="pause" v-else @click="pauseVideo" />
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
        videoStyle() {
            return {
                width: `${this.element.props.width}px`,
                height: `${this.element.props.height}px`,
                'object-fit': this.element.props['objectFit']
            }
        }
    },
    watch: {
        'element.props.volume': {
            handler(newVal) {
                
                this.$refs.videoElement.volume = newVal / 100
            },
        }
    },
    methods: {
        playVideo() {
            
            if (this.element.props.src) {
                this.$refs.videoElement.play()
            }
        },
        pauseVideo() {
            if (this.element.props.src) {
                this.$refs.videoElement.pause()
            }
        }
    }
}
</script>

<style scoped>
.video-element {
    width: 100%;
    position: relative;
    .video-element-play-button{
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