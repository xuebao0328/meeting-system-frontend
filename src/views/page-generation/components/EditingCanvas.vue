<template>
  <div class="scroll-content">
    <div
      class="editing-canvas-container"
      @click="handleCanvasClick"
      :style="containerStyle"
    >
      <div
        class="editing-canvas"
        @drop.prevent="handleDrop"
        @dragover.prevent
        :style="canvasStyle"
      >
        <!-- 网格背景 -->
        <div
          class="canvas-grid"
          v-if="pageConfig.showGrid"
          :style="gridStyle"
        ></div>
        <!-- 画布元素 -->
        <div
          v-for="element in pageElements"
          :key="element.id"
          class="canvas-element"
          :style="elementStyle(element)"
          @click.stop="selectElement(element)"
          @mousedown="startDragging(element, $event)"
        >
          <component
            :is="element.type + '-element'"
            :element="element"
            @update="handleElementUpdate"
          />
          <!-- 选中状态指示器 -->
          <div
            v-if="selectedElementId === element.id"
            class="selected-indicator"
          >
            <div
              class="resize-handle"
              v-for="(dir, index) in resizeDirections"
              :key="index"
              :data-direction="dir"
              @mousedown="startResizing(element, dir, $event)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextElement from "./TextElement.vue";
import ImageElement from "./ImageElement.vue";
import ShapeElement from "./ShapeElement.vue";
import MapElement from "./MapElement.vue";
import VideoElement from "./VideoElement.vue";
import AudioElement from "./AudioElement.vue";
import CarouselElement from "./CarouselElement.vue";
import CountdownElement from "./CountdownElement.vue";
import ImageTextNavigationElement from "./ImageTextNavigationElement.vue";
import WebsiteNavigationElement from "./WebsiteNavigationElement.vue";
import FooterElement from "./FooterElement.vue";
import { v4 as uuidv4 } from "uuid";
import { mapState } from "vuex";
export default {
  components: {
    TextElement,
    ImageElement,
    ShapeElement,
    MapElement,
    VideoElement,
    CarouselElement,
    AudioElement,
    CountdownElement,
    ImageTextNavigationElement,
    WebsiteNavigationElement,
    FooterElement,
  },
  data() {
    return {
      isResizing: false,
      selectedElementId: null,
      isDragging: false,
      resizeDirections: ["n", "ne", "e", "se", "s", "sw", "w", "nw"],
      snapLines: [],
    };
  },
  computed: {
    ...mapState("data", ["pageElements", "pageConfig"]),
    containerStyle() {
      let width = "";
      let height = "";
      if (this.pageConfig.width < window.innerWidth) {
        width = window.innerWidth + window.innerWidth * 0.1 + "px";
      } else {
        width = this.pageConfig.width + this.pageConfig.width * 0.1 + "px";
      }
      if (this.pageConfig.height < window.innerHeight) {
        height = window.innerHeight + window.innerHeight * 0.1 + "px";
      } else {
        height = this.pageConfig.height + this.pageConfig.height * 0.1 + "px";
      }
      return {
        width,
        height,
      };
    },
    canvasStyle() {
      return {
        width: `${this.pageConfig.width}px`,
        height: `${this.pageConfig.height}px`,
        backgroundColor: this.pageConfig.backgroundColor,
      };
    },
    gridStyle() {
      if (!this.pageConfig.showGrid) return {};

      return {
        backgroundImage: `linear-gradient(${this.pageConfig.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${this.pageConfig.gridColor} 1px, transparent 1px)`,
        backgroundSize: `${this.pageConfig.gridSize}px ${this.pageConfig.gridSize}px`,
      };
    },
  },
  methods: {
    startResizing(element, direction, e) {
      this.isResizing = true;

      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = element.props.width;
      const startHeight = element.props.height;
      const startLeft = element.x;
      const startTop = element.y;

      const moveHandler = (moveE) => {
        const deltaX = moveE.clientX - startX;
        const deltaY = moveE.clientY - startY;
        // const SNAP_THRESHOLD = 5
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = startLeft;
        let newY = startTop;

        switch (direction) {
          case "e":
            newWidth = startWidth + deltaX;

            break;
          case "w":
            newWidth = startWidth - deltaX;
            newX = startLeft + deltaX;

            break;
          case "n":
            newHeight = startHeight - deltaY;
            newY = startTop + deltaY;

            break;
          case "s":
            newHeight = startHeight + deltaY;

            break;
          case "ne":
            newWidth = startWidth + deltaX;
            newHeight = startHeight - deltaY;
            newY = startTop + deltaY;

            break;
          case "nw":
            newWidth = startWidth - deltaX;
            newHeight = startHeight - deltaY;
            newX = startLeft + deltaX;
            newY = startTop + deltaY;

            break;
          case "se":
            newWidth = startWidth + deltaX;
            newHeight = startHeight + deltaY;

            break;
          case "sw":
            newWidth = startWidth - deltaX;
            newHeight = startHeight + deltaY;
            newX = startLeft + deltaX;
            newY = startTop;

            break;
        }

        newWidth = Math.max(20, newWidth);
        newHeight = Math.max(20, newHeight);

        this.$emit("element-resize", {
          id: element.id,
          props: {
            width: newWidth,
            height: newHeight,
          },
          x: newX,
          y: newY,
        });
      };

      const upHandler = () => {
        this.isResizing = false;
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
      };

      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
    },
    handleCanvasClick() {
      if (this.selectedElementId) {
        this.selectedElementId = null;
        this.$emit("select-element", null);
        this.$emit("close-menu");
      } else {
        this.$emit("close-menu");
      }
    },
    handleElementUpdate(updatedProps) {
      this.$emit("element-update", {
        id: this.selectedElementId,
        ...updatedProps,
      });
    },
    handleDrop(e) {
      const componentData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const newElement = {
        id: this.generateId(),
        type: componentData.type,
        x: e.offsetX - componentData.layout.width / 2,
        y: e.offsetY - componentData.layout.height / 2,
        props: componentData.props,
      };
      this.$emit("add-element", newElement);
    },
    elementStyle(element) {
      return {
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${
          element.type === "website-navigation" || element.type === "footer"
            ? "100%"
            : element.props.width + "px"
        }`,
        height: `${element.props.height}px`,
        zIndex: element.props.zIndex || 1,
      };
    },
    selectElement(element) {
      this.selectedElementId = element.id;
      this.$emit("select-element", element);
    },
    startDragging(element, e) {
      if (
        this.isResizing ||
        element.type === "website-navigation" ||
        element.type === "footer"
      )
        return;

      this.isDragging = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = element.x;
      const startTop = element.y;

      const moveHandler = (moveE) => {
        const deltaX = moveE.clientX - startX;
        const deltaY = moveE.clientY - startY;
        let newX = startLeft + deltaX;
        let newY = startTop + deltaY;

        const SNAP_THRESHOLD = 5;

        const canvasWidth = this.pageConfig.width;
        const canvasHeight = this.pageConfig.height;

        if (Math.abs(newX) < SNAP_THRESHOLD) newX = 0;
        if (
          Math.abs(canvasWidth - (newX + element.props.width)) < SNAP_THRESHOLD
        )
          newX = canvasWidth - element.props.width;

        if (Math.abs(newY) < SNAP_THRESHOLD) newY = 0;
        if (
          Math.abs(canvasHeight - (newY + element.props.height)) <
          SNAP_THRESHOLD
        )
          newY = canvasHeight - element.props.height;

        const centerX = canvasWidth / 2;
        if (Math.abs(newX + element.props.width / 2 - centerX) < SNAP_THRESHOLD)
          newX = centerX - element.props.width / 2;

        this.pageElements.forEach((other) => {
          if (other.id === element.id) return;
          const elementCenterX = newX + element.props.width / 2;
          const otherCenterX = other.x + other.props.width / 2;
          const elementCenterY = newY + element.props.height / 2;
          const otherCenterY = other.y + other.props.height / 2;

          if (Math.abs(newX - (other.x + other.props.width)) < SNAP_THRESHOLD) {
            newX = other.x + other.props.width;
          }
          if (Math.abs(newX + element.props.width - other.x) < SNAP_THRESHOLD) {
            newX = other.x - element.props.width;
          }
          if (
            Math.abs(newY - (other.y + other.props.height)) < SNAP_THRESHOLD
          ) {
            newY = other.y + other.props.height;
          }
          if (
            Math.abs(newY + element.props.height - other.y) < SNAP_THRESHOLD
          ) {
            newY = other.y - element.props.height;
          }
          if (
            Math.abs(newX - (other.x + other.props.width / 2)) < SNAP_THRESHOLD
          ) {
            newX = other.x + other.props.width / 2;
          }
          if (
            Math.abs(
              newX + element.props.width - (other.x + other.props.width / 2)
            ) < SNAP_THRESHOLD
          ) {
            newX = other.x + other.props.width / 2 - element.props.width;
          }
          if (Math.abs(newY - otherCenterY) < SNAP_THRESHOLD) {
            newY = otherCenterY;
          }
          if (
            Math.abs(newY + element.props.height - otherCenterY) <
            SNAP_THRESHOLD
          ) {
            newY = otherCenterY - element.props.height;
          }

          if (Math.abs(elementCenterX - otherCenterX) < SNAP_THRESHOLD) {
            newX = otherCenterX - element.props.width / 2;
          }
          if (Math.abs(elementCenterY - otherCenterY) < SNAP_THRESHOLD) {
            newY = otherCenterY - element.props.height / 2;
          }
        });

        this.$emit("update-position", {
          id: element.id,
          x: newX,
          y: newY,
        });
      };

      const upHandler = () => {
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
        this.isDragging = false;
      };

      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
    },
    generateId() {
      return uuidv4();
    },
  },
};
</script>

<style scoped>
.scroll-content {
  width: 100%;
  height: 100%;
  cursor: grab;
  background: #373737;
  overflow-y: scroll;
}
.editing-canvas-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.editing-canvas {
  /* position: relative; */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.canvas-grid {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  position: absolute;
  width: 100%;
  height: 100%;
}

.canvas-element {
  position: absolute;
  cursor: move;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }
}

.selected-indicator {
  position: absolute;
  inset: 0;
  border: 2px solid #409eff;
  pointer-events: none;
  z-index: 1;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 2px solid #409eff;
  border-radius: 50%;
  z-index: 10;
  box-sizing: content-box;
  pointer-events: auto;

  &[data-direction="n"] {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }

  &[data-direction="ne"] {
    top: -6px;
    right: -6px;
    cursor: ne-resize;
  }

  &[data-direction="e"] {
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    cursor: e-resize;
  }

  &[data-direction="se"] {
    bottom: -6px;
    right: -6px;
    cursor: se-resize;
  }

  &[data-direction="s"] {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: s-resize;
  }

  &[data-direction="sw"] {
    bottom: -6px;
    left: -6px;
    cursor: sw-resize;
  }

  &[data-direction="w"] {
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    cursor: w-resize;
  }

  &[data-direction="nw"] {
    top: -6px;
    left: -6px;
    cursor: nw-resize;
  }
}
</style>
