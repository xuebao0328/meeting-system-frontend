<template>
    <div :style="textStyle" class="text-element" v-html="element.props.content">
    </div>
</template>

<script>
export default {
    props: ['element'],
    computed: {
        textStyle() {
            return {
                fontSize: `${this.element.props.fontSize}px`,
                color: this.element.props.color,
                whiteSpace: 'pre-wrap',
                textAlign: this.element.props.textAlign,
                fontWeight: this.element.props.fontWeight,
                fontStyle: this.element.props.fontStyle,
                fontFamily: this.element.props.fontFamily
            }
        }
    },
    methods: {
        handleInput(e) {
            this.$emit('update', {
                props: {
                    content: e.target.innerText
                }
            })
        }
    },
}
</script>

<style scoped lang="scss">
.text-element {
    user-select: none;
    outline: none;
    caret-color: transparent;
    pointer-events: none;
    :deep(p) {
        margin: 0;
    }
}
</style>
