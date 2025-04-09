<template>
    <div class="map-element" :style="mapStyle" :id="element.id"></div>
</template>

<script>
export default {
    props: ['element'],
    computed: {
        mapStyle() {
            return {
                width: `${this.element.props.width}px`,
                height: `${this.element.props.height}px`,
                position: 'relative'
            }
        }
    },
    data() {
        return {
            mapInstance: null
        }
    },
    mounted() {
        this.initMap()
    },
    watch: {
        'element.props.address': {
            deep: true,
            handler() {
                this.initMap()
            }
        }
    },
    methods: {
        initMap() {
            try {
                if (!this.mapInstance) {
                    this.mapInstance = new BMap.Map(this.element.id);
                    this.mapInstance.disableDragging();
                    const existingOverlays = this.mapInstance.getOverlays();
                    if (existingOverlays.length > 0) {
                        this.mapInstance.clearOverlays();
                    }
                }
                const geocoder = new BMap.Geocoder();
                if (this.element.props.address) {
                    geocoder.getPoint(this.element.props.address, (point) => {
                        if (point) {
                            this.mapInstance.centerAndZoom(point, 15);
                            const marker = new BMap.Marker(point);
                            this.mapInstance.addOverlay(marker);
                            marker.addEventListener('click', () => {
                                const infoWindow = new BMap.InfoWindow(
                                    `<div style="max-width:200px">${this.element.props.address}</div><div style="max-width:200px; font-size:14px; color: #999; margin-top: 5px;">${this.element.props.mapInfo}</div>`,
                                    { width: 200 }
                                );
                                this.mapInstance.openInfoWindow(infoWindow, point);
                            });
                        }
                    }, this.element.props.address);
                } else {
                    const point = new BMap.Point(116.404, 39.915);
                    setTimeout(() => {
                        this.mapInstance.centerAndZoom(point, this.element.props.zoom || 15);
                        this.mapInstance.enableScrollWheelZoom(true);
                        const marker = new BMap.Marker(point);
                        this.mapInstance.addOverlay(marker);
                         marker.addEventListener('click', () => {
                        const infoWindow = new BMap.InfoWindow(
                            `<div style="padding:10px;max-width:200px">默认位置</div>`,
                            { width: 200 }
                        );
                        this.mapInstance.openInfoWindow(infoWindow, point);
                    });
                    }, 100);
                }
            } catch (error) {
                console.error('地图初始化失败:', error);
            }
        },
    },
    beforeDestroy() {
        if (this.mapInstance) {
            this.mapInstance.clearOverlays();
            // this.mapInstance.removeEventListener();
            const container = document.getElementById(this.element.id);
            if (container) {
                container.innerHTML = '';
            }
            this.mapInstance = null;
        }
    }
}
</script>
