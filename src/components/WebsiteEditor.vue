<template>
  <div class="website-editor">
    <!-- 顶部工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <el-button-group>
          <el-button 
            type="primary" 
            icon="el-icon-document-add" 
            @click="addSection">
            添加板块
          </el-button>
          <el-button 
            type="primary"
            icon="el-icon-view"
            @click="preview">
            预览
          </el-button>
          <el-button 
            type="success" 
            icon="el-icon-check" 
            @click="saveWebsite">
            保存
          </el-button>
        </el-button-group>
    </div>
    
      <!-- 编辑模式切换 -->
      <div class="edit-mode-switcher">
        <el-radio-group v-model="editMode" size="small" @change="changeEditMode">
          <el-radio-button label="pc">
            <i class="el-icon-monitor"></i> PC端
          </el-radio-button>
          <el-radio-button label="mobile">
            <i class="el-icon-mobile"></i> 移动端
          </el-radio-button>
        </el-radio-group>
        
        <!-- PC端编辑模式版本切换 -->
        <el-select 
          v-if="editMode === 'pc' && !isProfessionalVersion" 
          v-model="pcEditorVersion" 
          size="small" 
          style="margin-left: 10px;"
          @change="changePcEditorVersion">
          <el-option label="标准版" value="standard"></el-option>
          <el-option label="专业版" value="professional"></el-option>
        </el-select>
      </div>
    </div>
    
    <!-- PC端编辑模式 -->
    <div v-if="editMode === 'pc'" class="editor-main pc-mode">
      <!-- 标准版编辑器 -->
      <template v-if="!isProfessionalVersion && pcEditorVersion !== 'professional'">
        <!-- 左侧组件面板 -->
        <div 
        class="component-panel" 
        :class="{'collapsed': !componentPanelExpanded}"
        @mouseenter="componentPanelExpanded = true"
        @mouseleave="componentPanelExpanded = false"
        @click.stop>
        <div class="panel-toggle">
          <i :class="componentPanelExpanded ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
          </div>
        <div class="panel-content">
          <!-- 页面管理器部分 -->
          <div class="page-manager-section">
            <h3>页面管理</h3>
            <div class="page-list">
              <div 
                v-for="page in pages" 
                :key="page.id"
                class="page-item"
                :class="{'active': currentPageId === page.id}"
                @click="switchToPage(page)">
                <span class="page-title">{{ page.title }}</span>
                <div class="page-actions" v-if="componentPanelExpanded">
                  <i class="el-icon-edit" title="重命名" @click.stop="showRenamePageDialog(page)"></i>
                  <i class="el-icon-document-copy" title="复制" @click.stop="copyPage(page)"></i>
                  <i class="el-icon-delete" title="删除" :class="{'disabled': page.isHomePage}" @click.stop="confirmDeletePage(page)"></i>
                </div>
              </div>
              <div class="add-page-btn" @click="showAddPageDialog">
                <i class="el-icon-plus"></i>
                <span v-show="componentPanelExpanded">添加页面</span>
              </div>
            </div>
            
            <!-- 页面设置 -->
            <div class="page-settings" v-if="currentPageId">
              <h3>页面设置</h3>
              <el-form label-position="top" size="small">
                <el-form-item label="显示导航栏">
                  <el-switch v-model="pageNavbarVisible" @change="toggleNavbar"></el-switch>
                </el-form-item>
                <el-form-item label="页面标题" v-if="componentPanelExpanded">
                  <el-input v-model="currentPageTitle" size="small" placeholder="页面标题" @blur="updatePageTitle"></el-input>
                </el-form-item>
                <el-form-item label="设为首页" v-if="componentPanelExpanded">
                  <el-switch v-model="currentPageIsHome" @change="setAsHomePage"></el-switch>
                </el-form-item>
              </el-form>
            </div>
          </div>
          
          <div class="components-section">
            <h3>组件列表</h3>
            <div class="component-list">
              <div 
                v-for="component in availableComponents" 
                :key="component.type"
                class="component-item"
                draggable="true"
                @dragstart="handleDragStart($event, component)">
                <i :class="component.icon"></i>
                <span v-show="componentPanelExpanded">{{ component.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
        
        <!-- 中间内容编辑区 -->
        <div class="content-editor" @drop="handleDrop" @dragover.prevent>
              <div 
            v-for="(section, index) in pageContent" 
                :key="index"
            class="section-wrapper">
            <div class="section-toolbar">
              <el-button-group>
                <el-button 
                  size="mini" 
                  icon="el-icon-arrow-up"
                  @click="moveSection(index, -1)"
                  :disabled="index === 0">
                </el-button>
                <el-button 
                  size="mini" 
                  icon="el-icon-arrow-down"
                  @click="moveSection(index, 1)"
                  :disabled="index === pageContent.length - 1">
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeSection(index)">
                </el-button>
              </el-button-group>
                  </div>
            <component 
              :is="section.type"
              v-bind="section.props"
              @update="updateSection(index, $event)">
            </component>
                </div>
                </div>
        
        <!-- 右侧属性面板 -->
        
      </template>
      
      <!-- 专业版编辑器 -->
      <template v-else>
        <div class="page-builder">
          <div class="left-container">
            <i class="el-icon-menu" @click="componentLibraryVisible = !componentLibraryVisible"></i>
          </div>
          <editing-canvas @select-element="selectedElementFn" @update-position="updateElementPosition"
            @add-element="addElementToCanvas" @close-menu="closeMenu" @element-resize="handleElementResize" />
          <div class="right-container">
            <i class="el-icon-set-up" @click="propertyEditorVisible = true"></i>
          </div>
          <component-library :components="availableComponents" class="component-library" @close="componentLibraryVisible = false;"
            :style="{ left: componentLibraryVisible ? '0' : '-200px' }" />
          <property-editor class="property-editor" @close="propertyEditorVisible = false;" :style="{ right: propertyEditorVisible ? '0' : '-500px' }"
            @update:page-config="handlePageConfigUpdate" @update="handleElementUpdate" @convert-to-json="convertToJson"
            @delete="deleteElement" @updateCommon="updateCommonFn" />
          <common-library ref="commonLibrary" class="common-library"
            :style="{ left: commonLibraryVisible ? '0' : '-200px' }" />
        </div>
        
        <!-- 添加页面对话框 -->
        <el-dialog :visible.sync="isAddPageDialog" :append-to-body="true" @close="resetAddForm" title="新建页面" width="50%">
          <el-form :model="pageForm" label-width="120px" :rules="rules" ref="addFormRef">
            <el-form-item label="页面名称" prop="title">
              <el-input v-model="pageForm.title"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="addPage">保存</el-button>
        </el-dialog>
      </template>
    </div>
    
    <!-- 移动端编辑模式 -->
    <div v-else class="editor-main mobile-mode">
      <!-- 顶部设备切换 -->
      <div class="mobile-device-bar">
        <el-select v-model="mobileDevice" placeholder="选择设备" size="small" @change="changeMobileDevice">
          <el-option label="iPhone 14 Pro" value="iphone-14-pro"></el-option>
          <el-option label="iPhone 13/12" value="iphone-13"></el-option>
          <el-option label="iPhone SE" value="iphone-se"></el-option>
          <el-option label="Android手机" value="android"></el-option>
        </el-select>
        
        <!-- 移动端视图模式切换 -->
        <el-radio-group v-model="mobileViewMode" size="small" @change="changeMobileViewMode">
          <el-radio-button label="edit">页面编辑</el-radio-button>
          <el-radio-button label="grid">宫格模式</el-radio-button>
        </el-radio-group>
          </div>
      
      <!-- 移动端页面编辑模式 -->
      <div v-if="mobileViewMode === 'edit'" class="mobile-edit-view">
        <div class="mobile-device-frame" :class="mobileDevice">
          <!-- 设备状态栏 -->
          <div class="device-status-bar">
            <span class="status-time">12:30</span>
            <span class="status-icons">
              <i class="el-icon-connection"></i>
              <i class="el-icon-battery-full"></i>
            </span>
          </div>
          
          <!-- 移动端内容编辑区 -->
          <div class="mobile-content-area">
            <div 
              v-for="(section, index) in pageContent" 
              :key="index"
              class="mobile-section"
              @click="selectSection(index)">
              <component 
                :is="section.type"
                v-bind="section.props"
                @update="updateSection(index, $event)">
              </component>
              
              <div class="mobile-section-overlay" v-if="selectedSectionIndex === index">
                <div class="mobile-section-tools">
                  <el-button-group>
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="editSelectedSection"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeSection(index)"></el-button>
                  </el-button-group>
                </div>
        </div>
      </div>
      
            <div class="mobile-add-section">
              <el-button type="primary" icon="el-icon-plus" circle @click="showMobileComponentPicker"></el-button>
        </div>
            </div>
          
          <!-- 设备底部指示条 -->
          <div class="device-bottom-bar"></div>
        </div>
        
        <!-- 移动端编辑侧边栏 -->
        <div class="mobile-edit-sidebar" v-if="selectedSection">
          <h3>编辑组件</h3>
          <el-form label-position="left" label-width="80px" class="centered-form">
            <el-form-item label="标题">
              <el-input v-model="selectedSection.props.title"></el-input>
            </el-form-item>
            <component 
              :is="selectedSection.type + 'Properties'"
              :value="selectedSection.props"
              @input="updateSectionProps">
            </component>
            
            <!-- 移动端专用设置 -->
            <div class="mobile-specific-settings">
              <h4>移动端设置</h4>
              <el-form-item label="显示在移动端">
                <el-switch v-model="selectedSection.props.mobileVisible"></el-switch>
              </el-form-item>
              <el-form-item label="移动端样式">
                <el-select v-model="selectedSection.props.mobileStyle" placeholder="选择样式">
                  <el-option label="标准" value="standard"></el-option>
                  <el-option label="紧凑" value="compact"></el-option>
                  <el-option label="全宽" value="full-width"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
      </div>
    </div>
    
      <!-- 宫格模式 -->
      <div v-else class="mobile-grid-view">
        <div class="grid-container">
        <div 
            v-for="(section, index) in pageContent" 
          :key="index"
            class="grid-item"
            @click="selectSection(index)">
            <grid-module-preview 
              :module-type="section.type"
              :config="section.props"
            />
            <div class="grid-item-title">{{ section.props.title || getDefaultTitle(section.type) }}</div>
            <div class="grid-item-actions" v-if="selectedSectionIndex === index">
              <el-button-group>
                <el-button type="primary" size="mini" icon="el-icon-arrow-up" @click.stop="moveSection(index, -1)" :disabled="index === 0"></el-button>
                <el-button type="primary" size="mini" icon="el-icon-arrow-down" @click.stop="moveSection(index, 1)" :disabled="index === pageContent.length - 1"></el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click.stop="removeSection(index)"></el-button>
              </el-button-group>
          </div>
        </div>
          
          <div class="grid-add-item" @click="showMobileComponentPicker">
          <i class="el-icon-plus"></i>
            <span>添加组件</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 组件选择器对话框 -->
    <el-dialog
      title="选择组件"
      :visible.sync="componentPickerVisible"
      width="60%">
      <div class="component-picker-grid">
        <div 
          v-for="component in availableComponents" 
          :key="component.type"
          class="component-picker-item"
          @click="addComponentFromPicker(component)">
          <i :class="component.icon"></i>
          <span>{{ component.label }}</span>
      </div>
      </div>
    </el-dialog>
    
    <!-- 预览对话框 -->
    <preview-dialog
      :visible.sync="previewVisible"
      :page-data="pageData"
    />
  </div>
</template>

<script>
import PreviewDialog from './website-editor/preview/PreviewDialog.vue'
import GridModulePreview from './website-editor/GridModulePreview.vue'
// 导入各种组件
import TextBlock from './blocks/TextBlock.vue'
import ImageBlock from './blocks/ImageBlock.vue'
import BannerBlock from './blocks/BannerBlock.vue'
import ListBlock from './blocks/ListBlock.vue'

// 导入专业版编辑器组件
import ComponentLibrary from '../views/page-generation/components/ComponentLibrary.vue'
import EditingCanvas from '../views/page-generation/components/EditingCanvas.vue'
import PropertyEditor from '../views/page-generation/components/PropertyEditor.vue'
import CommonLibrary from '../views/page-generation/components/CommonLibrary.vue'

// 导入专业版元素组件
import TextElement from '../views/page-generation/components/TextElement.vue'
import ImageElement from '../views/page-generation/components/ImageElement.vue'
import ShapeElement from '../views/page-generation/components/ShapeElement.vue'
import MapElement from '../views/page-generation/components/MapElement.vue'
import VideoElement from '../views/page-generation/components/VideoElement.vue'
import AudioElement from '../views/page-generation/components/AudioElement.vue'
import CarouselElement from '../views/page-generation/components/CarouselElement.vue'
import CountdownElement from '../views/page-generation/components/CountdownElement.vue'
import ImageTextNavigationElement from '../views/page-generation/components/ImageTextNavigationElement.vue'
import WebsiteNavigationElement from '../views/page-generation/components/WebsiteNavigationElement.vue'
import FooterElement from '../views/page-generation/components/FooterElement.vue'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { mapState } from 'vuex'
import { v4 as uuidv4 } from 'uuid'

// 如果有API模块，取消注释以下行
// import { 
//   updateWebPage,
//   getPageList,
//   addWebPage,
//   getWebPage,
//   deletePage,
//   getGlobalCommon,
//   saveOrUpdate,
// } from "@/api"

export default {
  name: 'WebsiteEditor',
  components: {
    PreviewDialog,
    GridModulePreview,
    TextBlock,
    ImageBlock,
    BannerBlock,
    ListBlock,
    // 专业版组件
    ComponentLibrary,
    EditingCanvas,
    PropertyEditor,
    CommonLibrary,
    // 专业版元素组件
    TextElement,
    ImageElement,
    ShapeElement,
    MapElement,
    VideoElement,
    AudioElement,
    CarouselElement,
    CountdownElement,
    ImageTextNavigationElement,
    WebsiteNavigationElement,
    FooterElement,
    Swiper,
    SwiperSlide
  },
  props: {
    pageData: {
      type: Object,
      required: true
    },
    isProfessionalVersion: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      previewVisible: false,
      selectedSectionIndex: null,
      pageContent: [],
      editMode: 'pc', // 默认PC端编辑模式
      pcEditorVersion: 'standard', // 默认标准版PC端编辑器
      mobileDevice: 'iphone-13', // 默认移动设备
      mobileViewMode: 'edit', // 默认移动端视图模式 (edit / grid)
      componentPickerVisible: false, // 组件选择器对话框
      componentPanelExpanded: true, // 组件面板是否展开
      // 页面相关数据
      pages: [
        { id: 'page1', title: '首页', isHomePage: true },
        { id: 'page2', title: '关于我们', isHomePage: false },
        { id: 'page3', title: '产品展示', isHomePage: false },
        { id: 'page4', title: '联系我们', isHomePage: false }
      ],
      currentPageId: 'page1',
      currentPageTitle: '首页',
      currentPageIsHome: true,
      pageNavbarVisible: true,
      // 专业版相关属性
      swiperOption: {
        slidesPerView: 10,
        spaceBetween: 10,
        autoplay: false,
      },
      componentLibraryVisible: true,
      propertyEditorVisible: true,
      commonLibraryVisible: false,
      pageManagementVisible: false,
      primaryMenuVisible: false,
      zIndexCounter: 0,
      isAddPageDialog: false,
      isInitialized: false, // 防止重复初始化
      pageForm: {
        title: ""
      },
      rules: {
        title: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
      },
      availableComponents: [
        // 专业版组件
        {
          type: "text",
          label: "文本组件",
          icon: "el-icon-document",
          defaultProps: {
            width: 200,
            height: 150,
            content: "文本",
            fontSize: 14,
            color: "#333",
            textAlign: "left",
            fontWeight: "normal",
            fontStyle: "normal",
            fontFamily: "Arial",
            linkUrl: "",
            linkType: "",
            commonId: "",
          }
        },
        {
          type: "image",
          label: "图片组件",
          icon: "el-icon-picture",
          defaultProps: {
            src: require("@/assets/images/image.png"),
            width: 200,
            height: 150,
            linkUrl: "",
            linkType: "",
            objectFit: "none",
            commonId: "",
          }
        },
        {
          type: "shape",
          label: "形状组件",
          icon: "el-icon-circle-plus",
          defaultProps: {
            width: 200,
            height: 150,
            backgroundColor: "#f0f0f0",
            shape: "rect",
            commonId: "",
          }
        },
        {
          type: "map",
          label: "地图组件",
          icon: "el-icon-map-location",
          ak: "",
          defaultProps: {
            width: 500,
            height: 300,
            address: "",
            zoom: 15,
            title: "",
            mapInfo: "",
            commonId: "",
          }
        },
        {
          type: "video",
          label: "视频组件",
          icon: "el-icon-video-camera",
          defaultProps: {
            src: "",
            width: 500,
            height: 300,
            autoplay: false,
            loop: false,
            muted: false,
            controls: false,
            showPlayButton: true,
            playButtonSrc: require("@/assets/images/play.png"),
            pauseButtonSrc: require("@/assets/images/pause.png"),
            objectFit: "none",
            commonId: "",
            volume: 100,
          }
        },
        {
          type: "carousel",
          label: "轮播图组件",
          icon: "el-icon-copy-document",
          defaultProps: {
            id: "",
            width: 500,
            height: 300,
            speed: 3000,
            autoplay: false,
            loop: false,
            direction: "horizontal",
            slides: [{ src: require("@/assets/images/image.png") }],
            pagination: false,
            navigation: false,
            slidesPerView: 1,
            spaceBetween: 0,
            commonId: "",
          }
        },
        {
          type: "audio",
          label: "音频组件",
          icon: "el-icon-headset",
          defaultProps: {
            src: "",
            width: 300,
            height: 54,
            loop: false,
            volume: 100,
            showPlayButton: true,
            playButtonSrc: require("@/assets/images/play.png"),
            pauseButtonSrc: require("@/assets/images/pause.png"),
            autoplay: false,
            controls: false,
            commonId: "",
          }
        },
        {
          type: "countdown",
          label: "倒计时组件",
          icon: "el-icon-time",
          defaultProps: {
            width: 300,
            height: 300,
            title: "",
            endtime: new Date().getTime() + 1000 * 60 * 60 * 24,
            commonId: "",
            fontFamily: "Arial",
            fontSize: 14,
            color: "#333",
            fontWeight: "normal",
            textAlign: "center",
          }
        },
        {
          type: "image-text-navigation",
          label: "图文导航",
          icon: "el-icon-s-grid",
          defaultProps: {
            width: 500,
            height: 90,
            fontFamily: "Arial",
            fontSize: 14,
            color: "#333",
            fontWeight: "normal",
            textAlign: "center",
            cols: 3,
            gap: 15,
            children: [
              {
                imgUrl: require("@/assets/images/image.png"),
                content: "图文导航",
                linkUrl: "",
              }
            ],
            commonId: "",
          }
        }
      ]
    }
  },
  computed: {
    selectedSection() {
      return this.selectedSectionIndex !== null 
        ? this.pageContent[this.selectedSectionIndex] 
        : null
    },
    // 专业版需要的计算属性
    ...mapState("data", [
      "currentPage",
      "pageElements",
      "pageConfig",
      "selectedElement",
      "pageList",
      "navigatorId",
      "footerId",
    ])
  },
  created() {
    // 初始化页面内容
    this.pageContent = this.pageData.content || [];
    
    // 确保所有组件都有移动端属性
    this.pageContent.forEach(section => {
      if (section.props.mobileVisible === undefined) {
        this.$set(section.props, 'mobileVisible', true);
      }
      if (section.props.mobileStyle === undefined) {
        this.$set(section.props, 'mobileStyle', 'standard');
      }
    });

    // 如果是专业版，初始化专业版数据
    if ((this.isProfessionalVersion || this.pcEditorVersion === 'professional') && !this.isInitialized) {
      // 标记已初始化，防止重复初始化
      this.isInitialized = true;
      // 设置编辑器版本
      this.pcEditorVersion = 'professional';
      
      // 判断当前是否是专业版页面
      const isProfessionalPage = window.location.href.includes('/professional/');
      
      if (isProfessionalPage) {
        // 已经在专业版页面，直接初始化
        this.initProfessionalEditor();
      } else {
        // 避免循环跳转导致页面持续刷新
        // 记录已尝试跳转的状态，防止重复跳转
        if (!localStorage.getItem('redirectingToProfessional')) {
          localStorage.setItem('redirectingToProfessional', 'true');
          // 不在专业版页面，需要跳转
          this.changePcEditorVersion('professional');
        } else {
          // 已经尝试过跳转，但仍然不在专业版页面，强制切换到标准版
          this.pcEditorVersion = 'standard';
          localStorage.removeItem('redirectingToProfessional');
        }
      }
    }
  },
  mounted() {
    // 组件挂载后将isInitialized置为true，防止重复初始化
    this.isInitialized = true;
    console.log('WebsiteEditor组件已挂载', this.isProfessionalVersion ? '专业版' : '标准版');
  },
  beforeDestroy() {
    // 组件销毁前清理状态
    console.log('WebsiteEditor组件即将销毁');
    // 确保没有遗留的状态可能导致循环
    localStorage.removeItem('websiteEditorData');
    localStorage.removeItem('websiteEditorContent');
  },
  methods: {
    // 初始化专业版编辑器
    initProfessionalEditor() {
      console.log('初始化专业版编辑器', new Date().toLocaleTimeString());
      
      // 如果已经有专业版数据，则不再重复初始化
      if (this.pageElements && this.pageElements.length > 0) {
        console.log('已有专业版数据，跳过初始化');
        return;
      }
      
      let elements = [];
      
      // 将原有数据转换为专业版数据格式
      if (this.pageContent && this.pageContent.length > 0) {
        elements = this.pageContent.map((section, index) => {
          return {
            type: section.type.toLowerCase(),
            label: section.props.title || '未命名组件',
            id: uuidv4(),
            x: 0,
            y: index * 200,
            props: { ...section.props, zIndex: index + 1 }
          };
        });
      }
      
      // 设置专业版数据
      this.$store.commit('data/setPageElements', elements);
      this.$store.commit('data/setPageConfig', {
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff',
        showGrid: true,
        gridSize: 20,
        gridColor: 'rgba(0,0,0,0.1)',
        title: this.pageData.title || '',
        url: '',
        showWebsiteNavigation: false,
        showFooter: false
      });
      
      // 尝试初始化全局组件
      this.getGlobalCommonWebsiteNavigation();
      this.getGlobalCommonFooter();
    },
    // 编辑模式切换
    changeEditMode(mode) {
      console.log(`切换到${mode === 'pc' ? 'PC端' : '移动端'}编辑模式`);
      this.$message.success(`已切换到${mode === 'pc' ? 'PC端' : '移动端'}编辑模式`);
    },
    
    // 移动设备切换
    changeMobileDevice(device) {
      console.log(`切换到${device}设备预览`);
      this.$message.success(`已切换到${device}设备预览`);
    },
    
    // 移动端视图模式切换
    changeMobileViewMode(mode) {
      console.log(`切换到移动端${mode === 'edit' ? '页面编辑' : '宫格'}模式`);
      this.$message.success(`已切换到移动端${mode === 'edit' ? '页面编辑' : '宫格'}模式`);
    },
    
    // 选择组件
    selectSection(index) {
      this.selectedSectionIndex = index;
    },
    
    // 编辑选中的组件
    editSelectedSection() {
      // 在移动端模式下，显示侧边编辑栏
      if (this.editMode === 'mobile' && this.mobileViewMode === 'edit') {
        // 已经在显示侧边栏了，不需要额外操作
      }
    },
    
    // 显示移动端组件选择器
    showMobileComponentPicker() {
      this.componentPickerVisible = true;
    },
    
    // 从选择器添加组件
    addComponentFromPicker(component) {
      this.pageContent.push({
        type: component.type,
        props: { ...component.defaultProps }
      });
      this.componentPickerVisible = false;
    },
    
    // 获取组件默认标题
    getDefaultTitle(type) {
      const typeMap = {
        'TextBlock': '文本模块',
        'ImageBlock': '图片模块',
        'BannerBlock': '横幅模块',
        'ListBlock': '列表模块'
      };
      return typeMap[type] || '未命名模块';
    },
    
    // 以下是原有方法
    addSection() {
      // 打开添加组件的对话框或直接添加默认组件
      this.pageContent.push({
        type: 'TextBlock',
        props: {
          content: '新建文本块',
          style: {},
          mobileVisible: true,
          mobileStyle: 'standard'
        }
      });
    },
    handleDragStart(event, component) {
      event.dataTransfer.setData('componentType', component.type);
    },
    handleDrop(event) {
      const componentType = event.dataTransfer.getData('componentType');
      const component = this.availableComponents.find(c => c.type === componentType);
      if (component) {
        this.pageContent.push({
          type: componentType,
          props: { ...component.defaultProps }
        });
      }
    },
    moveSection(index, direction) {
      const newIndex = index + direction;
      if (newIndex >= 0 && newIndex < this.pageContent.length) {
        const temp = this.pageContent[index];
        this.$set(this.pageContent, index, this.pageContent[newIndex]);
        this.$set(this.pageContent, newIndex, temp);
      }
    },
    removeSection(index) {
      this.pageContent.splice(index, 1);
      if (this.selectedSectionIndex === index) {
        this.selectedSectionIndex = null;
      }
    },
    updateSection(index, data) {
      this.$set(this.pageContent[index], 'props', {
        ...this.pageContent[index].props,
        ...data
      });
    },
    updateSectionProps(props) {
      if (this.selectedSection) {
        this.$set(this.selectedSection, 'props', props);
      }
    },
    preview() {
      // 专业版预览功能
      if (this.isProfessionalVersion || this.pcEditorVersion === 'professional') {
        this.previewVisible = true;
      } else {
        this.openPreview();
      }
    },
    saveWebsite() {
      this.$emit('save', {
        ...this.pageData,
        content: this.pageContent
      });
    },
    changePcEditorVersion(version) {
      console.log(`切换到${version}版本PC端编辑器`);
      
      if (version === 'professional') {
        this.$message.success('正在跳转到专业版编辑器...');
        
        // 将当前页面数据保存到localStorage，以便专业版页面加载时使用
        localStorage.setItem('websiteEditorData', JSON.stringify(this.pageData));
        localStorage.setItem('websiteEditorContent', JSON.stringify(this.pageContent));
        
        // 使用硬跳转替代router，避免Vue框架内部状态导致的刷新问题
        const baseUrl = window.location.origin;
        const professionalUrl = `${baseUrl}/website-builder/professional/${this.pageData.id || 'new'}`;
          window.location.href = professionalUrl;
      } else {
        this.pcEditorVersion = 'standard';
        this.$message.success(`已切换到${version}版本PC端编辑器`);
      }
    },
    // 专业版方法
    selectedElementFn(element) {
      this.$store.commit('data/setSelectedElement', element);
    },
    
    updateElementPosition(element) {
      const elements = [...this.pageElements];
      const index = elements.findIndex(item => item.id === element.id);
      if (index > -1) {
        elements[index] = element;
        this.$store.commit('data/setPageElements', elements);
      }
    },
    
    addElementToCanvas(element) {
      const elements = [...this.pageElements, element];
      this.$store.commit('data/setPageElements', elements);
    },
    
    closeMenu() {
      this.componentLibraryVisible = false;
      this.commonLibraryVisible = false;
    },
    
    handleElementResize(element) {
      const elements = [...this.pageElements];
      const index = elements.findIndex(item => item.id === element.id);
      if (index > -1) {
        elements[index] = element;
        this.$store.commit('data/setPageElements', elements);
      }
    },
    
    handlePageConfigUpdate(config) {
      this.$store.commit('data/setPageConfig', {
        ...this.pageConfig,
        ...config
      });
    },
    
    handleElementUpdate(element) {
      const elements = [...this.pageElements];
      const index = elements.findIndex(item => item.id === element.id);
      if (index > -1) {
        elements[index] = element;
        this.$store.commit('data/setPageElements', elements);
      }
    },
    
    deleteElement(elementId) {
      const elements = [...this.pageElements].filter(item => item.id !== elementId);
      this.$store.commit('data/setPageElements', elements);
      this.$store.commit('data/setSelectedElement', null);
    },
    
    async convertToJson() {
      const pageConfig = {
        ...this.pageConfig,
        elements: this.pageElements,
      };
      
      this.$emit('save', {
        ...this.pageData,
        content: pageConfig
      });
    },
    
    updateCommonFn(element) {
      // 更新公共组件方法
      if (typeof saveOrUpdate === 'function') {
        saveOrUpdate({
          context: JSON.stringify(element),
          id: element.props.commonId,
        });
      }
    },
    addPage() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          // 如果有API连接
          if (typeof addWebPage === 'function') {
            addWebPage({
              webId: this.$route.query && this.$route.query.webId,
              pageContext: "",
              pageHtml: "",
              title: this.pageForm.title,
            }).then(() => {
              this.getPageListFn();
              this.isAddPageDialog = false;
            });
          } else {
            // 模拟添加页面
            const newPageId = uuidv4();
            const newPage = {
              id: newPageId,
              title: this.pageForm.title,
              pageContext: '',
              pageHtml: '',
              webId: (this.$route.query && this.$route.query.webId) || '1',
              url: ''
            };
            
            const pageList = [...(this.pageList || []), newPage];
            this.$store.commit('data/setPageList', pageList);
            this.$store.commit('data/setCurrentPage', newPage);
            
            this.isAddPageDialog = false;
          }
        }
      });
    },
    resetAddForm() {
      if (this.$refs.addFormRef) {
        this.$refs.addFormRef.resetFields();
      }
    },
    openAddPageDialog() {
      this.pageForm = {
        title: "",
      };
      this.isAddPageDialog = true;
    },
    selectPage(page) {
      if (typeof getWebPage === 'function') {
        getWebPage(page.id).then(res => {
          if (res.data && res.data.pageContext) {
            const pageData = res.data;
            const pageContext = JSON.parse(pageData.pageContext);
            this.$store.commit('data/setCurrentPage', {
              id: pageData.id,
              title: pageData.title,
              pageContext: pageData.pageContext,
              pageHtml: pageData.pageHtml,
              webId: pageData.webId,
              url: pageData.url,
            });
            this.$store.commit('data/setPageElements', pageContext.elements);
            this.$store.commit('data/setPageConfig', {
              width: pageContext.width,
              height: pageContext.height,
              backgroundColor: pageContext.backgroundColor,
              showGrid: pageContext.showGrid,
              gridSize: pageContext.gridSize,
              gridColor: pageContext.gridColor,
              title: pageData.title,
              url: pageData.url,
              showWebsiteNavigation: pageContext.showWebsiteNavigation,
              showFooter: pageContext.showFooter,
            });
            this.$store.commit('data/setSelectedElement', null);
          }
        });
      } else {
        // 模拟选择页面
      this.$store.commit('data/setCurrentPage', page);
      }
    },
    deletePageFn(page) {
      this.$confirm('确定要删除该页面吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (typeof deletePage === 'function') {
          deletePage(page.id).then(() => {
            this.getPageListFn();
          });
        } else {
          // 模拟删除页面
          const pageList = (this.pageList || []).filter(p => p.id !== page.id);
          this.$store.commit('data/setPageList', pageList);
          
          if (pageList.length > 0 && this.currentPage && this.currentPage.id === page.id) {
            this.selectPage(pageList[0]);
          }
        }
      });
    },
    getPageListFn() {
      if (typeof getPageList === 'function') {
        getPageList(this.$route.query && this.$route.query.webId).then(response => {
          if (response.rows.length > 0) {
            this.$store.commit('data/setPageList', response.rows);
            const pageId = this.currentPage ? this.currentPage.id : response.rows[0].id;
            getWebPage(pageId).then(res => {
              if (res.data && res.data.pageContext) {
                // 处理页面数据
                const pageData = res.data;
                const pageContext = JSON.parse(pageData.pageContext);
                this.$store.commit('data/setCurrentPage', {
                  id: pageData.id,
                  title: pageData.title,
                  pageContext: pageData.pageContext,
                  pageHtml: pageData.pageHtml,
                  webId: pageData.webId,
                  url: pageData.url,
                });
                this.$store.commit('data/setPageElements', pageContext.elements);
                this.$store.commit('data/setPageConfig', {
                  width: pageContext.width,
                  height: pageContext.height,
                  backgroundColor: pageContext.backgroundColor,
                  showGrid: pageContext.showGrid,
                  gridSize: pageContext.gridSize,
                  gridColor: pageContext.gridColor,
                  title: pageData.title,
                  url: pageData.url,
                  showWebsiteNavigation: pageContext.showWebsiteNavigation,
                  showFooter: pageContext.showFooter,
                });
                this.$store.commit('data/setSelectedElement', null);
              }
            });
          }
        });
      }
    },
    // 全局组件相关方法
    getGlobalCommonFooter() {
      if (typeof getGlobalCommon === 'function') {
        getGlobalCommon(this.$route.query && this.$route.query.webId, "footer").then(async (res) => {
          if (!res.data && typeof saveOrUpdate === 'function') {
            const res = await saveOrUpdate({
              context: JSON.stringify({
                type: "footer",
                label: "底部信息栏",
                id: this.generateId(),
                x: 0,
                y: this.pageConfig.height - 100,
                props: {
                  width: 300,
                  height: 100,
                  backgroundColor: "#f0f0f0",
                  zIndex: 1,
                  align: "center",
                }
              }),
              type: "footer",
              webId: this.$route.query && this.$route.query.webId,
            });
            this.$store.commit('data/setFooterId', res.data);
            this.getGlobalCommonFooter();
          } else if (res.data) {
            this.$store.commit('data/setFooterId', res.data.id);
            const elements = [...this.pageElements];
            const context = JSON.parse(res.data.context);
            const index = elements.findIndex((item) => item.id === context.id);
            if (index > -1) {
              elements[index] = context;
            } else {
              elements.push(context);
            }
            this.$store.commit('data/setPageElements', elements);
          }
        });
      }
    },
    getGlobalCommonWebsiteNavigation() {
      if (typeof getGlobalCommon === 'function') {
        getGlobalCommon(this.$route.query && this.$route.query.webId, "website-navigation").then(async (res) => {
          if (!res.data && typeof saveOrUpdate === 'function') {
            const res = await saveOrUpdate({
              context: JSON.stringify({
                type: "website-navigation",
                label: "网站导航栏",
                id: this.generateId(),
                x: 0,
                y: 0,
                props: {
                  width: 300,
                  height: 100,
                  backgroundColor: "#f0f0f0",
                  fontFamily: "Arial",
                  fontSize: 14,
                  color: "#333",
                  fontWeight: "normal",
                  zIndex: 1,
                  children: [],
                  align: "center",
                  space: 10,
                }
              }),
              type: "website-navigation",
              webId: this.$route.query && this.$route.query.webId,
            });
            this.$store.commit('data/setNavigationId', res.data);
            this.getGlobalCommonWebsiteNavigation();
          } else if (res.data) {
            this.$store.commit('data/setNavigationId', res.data.id);
            const elements = [...this.pageElements];
            const context = JSON.parse(res.data.context);
            const index = elements.findIndex((item) => item.id === context.id);
            if (index > -1) {
              elements[index] = context;
            } else {
              elements.push(context);
            }
            this.$store.commit('data/setPageElements', elements);
          }
        });
      }
    },
    generateId() {
      return uuidv4();
    },
    addCommon(item) {
      const context = JSON.parse(item.context);
      const newElements = [...this.pageElements, context];
      this.$store.commit('data/setPageElements', newElements);
    },
    
    // 页面管理相关方法
    switchToPage(page) {
      this.currentPageId = page.id;
      this.currentPageTitle = page.title;
      this.currentPageIsHome = page.isHomePage;
      // 在实际项目中，这里应该加载对应页面的内容
      console.log(`切换到页面: ${page.title}`);
    },
    
    showAddPageDialog() {
      this.$message.info('添加新页面');
      // 实际项目中应该弹出对话框
    },
    
    showRenamePageDialog(page) {
      this.$message.info(`重命名页面: ${page.title}`);
      // 实际项目中应该弹出对话框
    },
    
    copyPage(page) {
      this.$message.success(`复制页面: ${page.title}`);
      // 实际项目中应该复制页面内容
    },
    
    confirmDeletePage(page) {
      if (page.isHomePage) {
        this.$message.error('首页不能删除');
        return;
      }
      
      this.$confirm(`确定要删除页面"${page.title}"吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除页面的逻辑
        this.pages = this.pages.filter(p => p.id !== page.id);
        this.$message.success('删除成功');
        
        // 如果删除的是当前页面，则切换到第一个页面
        if (this.currentPageId === page.id) {
          this.switchToPage(this.pages[0]);
        }
      }).catch(() => {
        // 取消删除
      });
    },
    
    toggleNavbar() {
      console.log(`${this.pageNavbarVisible ? '显示' : '隐藏'}导航栏`);
      // 实际项目中应该更新页面配置
    },
    
    updatePageTitle() {
      const page = this.pages.find(p => p.id === this.currentPageId);
      if (page) {
        page.title = this.currentPageTitle;
        console.log(`更新页面标题: ${this.currentPageTitle}`);
      }
    },
    
    setAsHomePage() {
      if (this.currentPageIsHome) {
        // 如果当前页面被设为首页，则取消其他页面的首页状态
        this.pages.forEach(page => {
          if (page.id !== this.currentPageId) {
            page.isHomePage = false;
          } else {
            page.isHomePage = true;
          }
        });
        
        console.log(`设置"${this.currentPageTitle}"为首页`);
      } else {
        // 如果取消当前页面的首页状态，需要设置另一个页面为首页
        this.$message.warning('必须有一个页面作为首页');
        this.currentPageIsHome = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.website-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .editor-toolbar {
    padding: 10px;
    border-bottom: 1px solid #dcdfe6;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .edit-mode-switcher {
      margin-right: 20px;
    }
  }

  .editor-main {
    flex: 1;
    display: flex;
    overflow: hidden;

    &.pc-mode {
      // PC模式下三栏布局
      .component-panel {
        width: 250px;
        border-right: 1px solid #dcdfe6;
        padding: 10px;
        background: #fff;
        height: 100%;
        position: relative;
        transition: width 0.3s;
        z-index: 10;
        overflow-y: hidden;
        
        // 滚动条样式隐藏
        &::-webkit-scrollbar {
          width: 0;
          display: none;
        }
        
        -ms-overflow-style: none;  /* IE 和 Edge */
        scrollbar-width: none;  /* Firefox */
        
        // 折叠状态样式
        &.collapsed {
          width: 60px;
          padding: 10px 0;
          
          .component-item {
            justify-content: center;
            padding: 10px 0;
          }
          
          h3, h4 {
            text-align: center;
            font-size: 12px;
          }
        }
        
        // 面板切换开关
        .panel-toggle {
          position: absolute;
          top: 10px;
          right: 0;
          width: 20px;
          height: 30px;
          background: #f5f7fa;
          border-radius: 4px 0 0 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 11;
          border: 1px solid #dcdfe6;
          border-right: none;
          opacity: 0.7;
          
          &:hover {
            opacity: 1;
            background: #ecf5ff;
          }
          
          i {
            font-size: 12px;
            color: #409EFF;
          }
        }
        
        // 面板内容
        .panel-content {
          height: 100%;
          overflow-y: auto;
          
          // 隐藏滚动条
          &::-webkit-scrollbar {
            width: 0;
            display: none;
          }
          
          -ms-overflow-style: none;  /* IE 和 Edge */
          scrollbar-width: none;  /* Firefox */
          
          // 页面管理部分
          .page-manager-section {
            margin-bottom: 20px;
            
            h3 {
              font-size: 16px;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #ebeef5;
              color: #303133;
            }
            
            .page-list {
              .page-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 10px;
                border-radius: 4px;
                cursor: pointer;
                margin-bottom: 5px;
                transition: all 0.3s;
                
                &:hover {
                  background: #f5f7fa;
                }
                
                &.active {
                  background: #ecf5ff;
                  color: #409EFF;
                }
                
                .page-title {
                  flex: 1;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                
                .page-actions {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  
                  i {
                    font-size: 14px;
                    color: #909399;
                    cursor: pointer;
                    padding: 2px;
                    
                    &:hover {
                      color: #409EFF;
                    }
                    
                    &.disabled {
                      color: #c0c4cc;
                      cursor: not-allowed;
                    }
                  }
                }
              }
              
              .add-page-btn {
                display: flex;
                align-items: center;
                padding: 8px 10px;
                color: #409EFF;
                border: 1px dashed #409EFF;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
                
                i {
                  margin-right: 5px;
                }
                
                &:hover {
                  background: #ecf5ff;
                }
              }
            }
            
            .page-settings {
              margin-top: 15px;
              padding: 10px;
              background: #f5f7fa;
              border-radius: 4px;
              
              h3 {
                font-size: 15px;
                border-bottom: none;
                margin-bottom: 15px;
              }
            }
          }
          
          // 组件列表部分
          .components-section {
            h3 {
              font-size: 16px;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #ebeef5;
              color: #303133;
            }
            
            .component-list {
              .component-item {
                display: flex;
                align-items: center;
                padding: 10px;
                margin: 5px 0;
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                cursor: move;
                transition: all 0.3s;
                
                &:hover {
                  background: #f5f7fa;
                  border-color: #c6e2ff;
                }
                
                i {
                  margin-right: 8px;
                  font-size: 18px;
                  color: #409EFF;
                }
              }
            }
          }
        }

        .component-list {
          .component-item {
            padding: 10px;
            margin: 5px 0;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            cursor: move;
            
            &:hover {
              background: #f5f7fa;
            }

            i {
              margin-right: 8px;
            }
          }
        }
      }

      .content-editor {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #f5f7fa;
        
        // 美化滚动条
        &::-webkit-scrollbar {
          width: 6px;
        }
        
        &::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .section-wrapper {
          position: relative;
          margin: 10px 0;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

          .section-toolbar {
            position: absolute;
            right: 10px;
            top: 10px;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.3s;
          }

          &:hover .section-toolbar {
            opacity: 1;
          }
        }
      }

      .properties-panel {
        width: 300px;
        border-left: 1px solid #dcdfe6;
        padding: 10px;
        background: #fff;
        overflow-y: auto;
        
        .pro-features {
          margin-bottom: 15px;
          
          .pro-feature-list {
            margin-top: 8px;
            
            .pro-feature-item {
              margin: 5px 0;
              font-size: 13px;
              
              i {
                color: #67c23a;
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
    
    &.mobile-mode {
      // 移动模式下的布局
      flex-direction: column;
      
      .mobile-device-bar {
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        background: #fff;
        border-bottom: 1px solid #dcdfe6;
      }
      
      .mobile-edit-view {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 20px;
        background: #f5f7fa;
        
        .mobile-device-frame {
          width: 375px;
          height: 667px;
          margin: 0 auto;
          border-radius: 30px;
          border: 10px solid #333;
          background: #fff;
          display: flex;
          flex-direction: column;
          position: relative;
          
          &.iphone-14-pro {
            border-radius: 40px;
            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              width: 80px;
              height: 25px;
              background: #000;
              border-radius: 0 0 16px 16px;
              z-index: 1;
            }
          }
          
          &.iphone-se {
            border-radius: 20px;
            height: 568px;
            &::before, &::after {
              content: "";
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              background: #000;
            }
            &::before {
              top: 15px;
              width: 50px;
              height: 4px;
              border-radius: 2px;
            }
            &::after {
              bottom: 15px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 2px solid #444;
            }
          }
          
          .device-status-bar {
            height: 24px;
            background: #000;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
            font-size: 12px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
          }
          
          .mobile-content-area {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            
            .mobile-section {
              position: relative;
              margin-bottom: 15px;
              
              .mobile-section-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.1);
                border: 2px solid #409EFF;
                display: flex;
                justify-content: center;
                align-items: center;
                
                .mobile-section-tools {
                  background: white;
                  padding: 5px;
                  border-radius: 4px;
                }
              }
            }
            
            .mobile-add-section {
              display: flex;
              justify-content: center;
              margin: 20px 0;
            }

            .device-bottom-bar {
              height: 5px;
              width: 40%;
              background: #ccc;
              position: absolute;
              bottom: 5px;
              left: 50%;
              transform: translateX(-50%);
              border-radius: 3px;
            }
          }
        }
        
        .mobile-edit-sidebar {
          width: 300px;
          height: 667px;
          background: white;
          border-radius: 4px;
          margin-left: 20px;
          padding: 15px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          
          h3 {
            margin-top: 0;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ebeef5;
          }
          
          .mobile-specific-settings {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px dashed #dcdfe6;
            
            h4 {
              margin-bottom: 15px;
              color: #409EFF;
            }
          }
        }
      }
      
      .mobile-grid-view {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        background: #f5f7fa;
        
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          
          .grid-item {
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            padding: 15px;
            position: relative;
            
            &:hover {
              box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
            }
            
            .grid-item-title {
              margin-top: 10px;
              font-weight: bold;
              text-align: center;
            }
            
            .grid-item-actions {
              position: absolute;
              top: 10px;
              right: 10px;
              background: white;
              padding: 5px;
              border-radius: 4px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }
          }
          
          .grid-add-item {
            background: #f0f2f5;
            border-radius: 4px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border: 2px dashed #dcdfe6;
            min-height: 150px;
            
            i {
              font-size: 24px;
              color: #909399;
              margin-bottom: 10px;
            }
            
            &:hover {
              background: #ecf5ff;
              border-color: #409EFF;
              
              i, span {
                color: #409EFF;
              }
            }
          }
        }
      }
    }
  }
  
  .component-picker-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    
    .component-picker-item {
      background: #f5f7fa;
      border-radius: 4px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      
      i {
        font-size: 24px;
        margin-bottom: 10px;
      }
      
      &:hover {
        background: #ecf5ff;
        color: #409EFF;
      }
    }
  }

  /* 专业版编辑器样式 */
  .page-builder {
    display: flex;
    flex: 1;
    height: 100%;
    position: relative;
    overflow: hidden;
    
    .left-container {
      width: 40px;
      background-color: #333;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20px;
      
      i {
        font-size: 22px;
        margin-bottom: 20px;
        cursor: pointer;
        
        &:hover {
          color: #409EFF;
        }
      }
    }
    
    .right-container {
      width: 40px;
      background-color: #333;
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 20px;
      
      i {
        font-size: 22px;
        margin-bottom: 20px;
        cursor: pointer;
        
        &:hover {
          color: #409EFF;
        }
      }
    }
    
    .component-library {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 100%;
      background-color: white;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      z-index: 10;
      transition: left 0.3s;
    }
    
    .property-editor {
      position: absolute;
      top: 0;
      right: 0;
      width: 500px;
      height: 100%;
      background-color: white;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
      z-index: 10;
      transition: right 0.3s;
      overflow-y: auto;
    }
    
    .common-library {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 100%;
      background-color: white;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
      z-index: 10;
      transition: left 0.3s;
    }
  }
}

@media (max-width: 1200px) {
  .website-editor {
    .editor-main {
      &.mobile-mode {
        .mobile-edit-view {
          .mobile-edit-sidebar {
            width: 250px;
          }
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .website-editor {
    .editor-main {
      &.pc-mode {
        .component-panel {
          width: 200px;
        }
        
        .properties-panel {
          width: 250px;
        }
      }
    }
  }
}

</style> 