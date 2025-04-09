<template>
    <div class="shape-element-container">
        <div class="shape-element">
            <div class="shape-element-content rect" v-if="shape === 'rect'" :style="rectStyle"></div>
            <div class="shape-element-content circle" v-if="shape === 'circle'" :style="circleStyle"></div>
            <div class="shape-element-content triangle" v-if="shape === 'triangle'" :style="triangleStyle"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShapeElement',
    props: ['element'],
    computed: {
        rectStyle() {
            return {
                width: `${this.element.props.width}px`,
                height: `${this.element.props.height}px`,
                backgroundColor: this.element.props.backgroundColor
            }
        },
        circleStyle() {
            return {
                width: `${this.element.props.width}px`,
                height: `${this.element.props.height}px`,
                backgroundColor: this.element.props.backgroundColor,
                borderRadius: '50%'
            }
        },
        triangleStyle() {
            return {
                width: 0,
                height: 0,
                borderLeft: `${this.element.props.width / 2}px solid transparent`,
                borderRight: `${this.element.props.width / 2}px solid transparent`,
                borderBottom: `${this.element.props.height}px solid ${this.element.props.backgroundColor}`
            }
        },
        shape() {
            return this.element.props.shape
        }
    },

}
</script>

<style scoped>
.shape-element-container {
    width: 100%;
    height: 100%;
    user-select: none;
    outline: none;
    caret-color: transparent;
    pointer-events: none;
}
.shape-element  {
    width: 100%;
    height: 100%;
}

</style>