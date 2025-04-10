<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100vh;
}

/* Element UI 日期时间选择器样式覆盖 */
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}

/* 确保日期选择器弹出层能正确显示，设置更高的z-index值 */
.el-picker-panel {
  z-index: 3500 !important;
}

/* 确保日期选择器下拉面板正确显示 */
.el-picker-panel.el-date-picker,
.el-picker-panel.el-time-picker {
  position: fixed !important;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  margin-top: 5px;
}

/* 修复日期时间选择器的输入框样式 */
.el-input__inner {
  width: 100% !important;
  box-sizing: border-box !important;
}

/* 确保弹出层的箭头正确显示 */
.el-popper .popper__arrow {
  display: block !important;
}

/* 确保日期时间选择器的宽度足够 */
.el-date-editor--datetime {
  min-width: 220px !important;
}

/* 修复所有弹出层的层级问题 */
.el-select-dropdown,
.el-scrollbar,
.el-dialog,
.el-message-box,
.el-popover,
.el-dropdown-menu,
.el-date-table {
  z-index: 3500 !important;
}
</style> 