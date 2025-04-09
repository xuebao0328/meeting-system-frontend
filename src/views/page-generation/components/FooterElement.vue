<template>
    <div class="website-navigation-element" style="width: 100%; height: 100%; display: flex;" :style="{justifyContent: style.align}">
        <nav class="nav-container" :style="{width: style.width, height: style.height, backgroundColor: style.backgroundColor}">
            <ul class="nav-list">
                <li v-for="(item, index) in element.props.children" :key="index" class="nav-item" :style="{padding: style.padding}">
                    <a href="javascript:void(0)" class="nav-link" :style="{color: style.color, fontSize: style.fontSize, fontWeight: style.fontWeight, fontFamily: style.fontFamily}">
                        {{ item.name }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    name: 'WebsiteNavigationElement',
    props: ['element'],
    computed: {
        style() {
            return {
                width: `${this.element.props.width}px`,
                height: `${this.element.props.height}px`,
                backgroundColor: this.element.props.backgroundColor,
                align: this.element.props.align === 'left' ? 'flex-start' : this.element.props.align === 'center' ? 'center' : 'flex-end',
                padding: `0 ${this.element.props.space}px`,
                color: this.element.props.color,
                fontSize: `${this.element.props.fontSize}px`,
                fontWeight: this.element.props.fontWeight,
                fontFamily: this.element.props.fontFamily
            }
        }
    }
}
</script>


<style scoped>
.website-navigation-element {
}
.nav-container {
    display: flex;
    align-items: center;
}
.nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.nav-link {
    color: #2c3e50;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-link:hover {
    color: #42b983;
}

.nav-link.router-link-exact-active {
    color: #42b983;
    border-bottom: 2px solid;
}
</style>