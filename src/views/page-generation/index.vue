<template>
  <div class="root">
    <el-header class="page-management-header">
      <div class="page-management-container">
        <swiper :options="swiperOption" ref="swiperRef">
          <swiper-slide v-for="(item, index) in pageList" :key="index">
            <div class="page-management-item" @click="selectPage(item)">
              <div class="page-management-item-content">
                <span>{{ item.title }}</span>
                <img src="@/assets/images/close.png" class="close-icon" @click.stop="deletePageFn(item)" />
              </div>
              <div class="page-management-item-actions">
                <i class="el-icon-copy-document"></i>复制页面
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      <div class="page-management-header-actions">
        <el-button type="primary" size="small" @click="openAddPageDialog">新建页面</el-button>
        <el-button type="primary" size="small" @click="convertToJson">保存</el-button>
        <el-button type="primary" size="small" @click="preview">预览</el-button>
        <el-button type="primary" size="small">保存到页面库</el-button>
      </div>
    </el-header>
    <div class="page-builder">
      <div class="left-container">
        <i class="el-icon-menu" @click="componentLibraryVisible = !componentLibraryVisible"></i>
        <!-- 新增一级菜单 -->
        <!-- <div class="primary-menu" v-show="primaryMenuVisible" @mouseleave="primaryMenuVisible = false">
          <div class="menu-item" @click="showComponentLibrary">
            <i class="el-icon-files" style="font-size: 18px"></i>
            <span>组件库</span>
          </div> -->
          <!-- <div class="menu-item" @click="showCommonLibrary">
            <i class="el-icon-files" style="font-size: 18px"></i>
            <span>公共组件</span>
          </div> -->
        <!-- </div> -->
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
    <el-dialog :visible.sync="isAddPageDialog" :append-to-body="true" @close="resetAddForm" title="新建页面" width="50%">
      <el-form :model="pageForm" label-width="120px" :rules="rules" ref="addFormRef">
        <el-form-item label="页面名称" prop="title">
          <el-input v-model="pageForm.title"></el-input>
        </el-form-item>
        <!-- <el-form-item label="页面URL" prop="url">
          <el-input v-model="pageForm.url" readonly></el-input>
        </el-form-item> -->
      </el-form>
      <el-button type="primary" @click="addPage">保存</el-button>
    </el-dialog>
  </div>
</template>

<script>
import ComponentLibrary from "./components/ComponentLibrary.vue";
import EditingCanvas from "./components/EditingCanvas.vue";
import PropertyEditor from "./components/PropertyEditor.vue";
import CommonLibrary from "./components/CommonLibrary.vue";
import { mapState } from "vuex";
import { v4 as uuidv4 } from "uuid";
import {
  updateWebPage,
  getPageList,
  addWebPage,
  getWebPage,
  deletePage,
  getGlobalCommon,
  saveOrUpdate,
} from "@/api";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  components: {
    ComponentLibrary,
    EditingCanvas,
    PropertyEditor,
    CommonLibrary,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 10,
        spaceBetween: 10,
        autoplay: false,
      },
      commonLibraryVisible: false,
      pageManagementVisible: false,
      primaryMenuVisible: false,
      zIndexCounter: 0,
      componentLibraryVisible: true,
      propertyEditorVisible: true,
      availableComponents: [
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
          },
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
          },
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
          },
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
          },
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
          },
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
          },
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
          },
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
          },
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
              },
            ],
            commonId: "",
          },
        },
      ],
      pageForm: {
        title: "",
      },
      rules: {
        title: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入页面URL", trigger: "blur" }],
      },
      isAddPageDialog: false,
    };
  },
  watch: {
    pageElements(newVal) {
      if (newVal.length === 0) {
        this.zIndexCounter = 0;
      }
    },
  },
  computed: {
    ...mapState("data", [
      "currentPage",
      "pageElements",
      "pageConfig",
      "selectedElement",
      "pageList",
      "navigatorId",
      "footerId",
    ]),
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.setCurrentPage(null);
    this.setPageList([]);
    this.setPageElements([]);
    this.setPageConfig({
      width: 1200,
      height: 800,
      backgroundColor: "#ffffff",
      showGrid: true,
      gridSize: 20,
      gridColor: "rgba(0,0,0,0.1)",
      title: "",
      url: "",
      showWebsiteNavigation: false,
      showFooter: false,
    });

    this.setSelectedElement(null);
  },
  methods: {
    addPage() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          addWebPage({
            webId: this.$route.query.webId,
            pageContext: "",
            pageHtml: "",
            title: this.pageForm.title,
          }).then(() => {
            this.getPageListFn();
            this.isAddPageDialog = false;
          });
        }
      });
    },
    resetAddForm() {
      this.$refs.addFormRef.resetFields();
    },
    openAddPageDialog() {
      this.pageForm = {
        title: "",
      };
      this.isAddPageDialog = true;
    },
    async init() {
      await this.getPageListFn();
      this.getGlobalCommonWebsiteNavigation();
      this.getGlobalCommonFooter();
    },
    getGlobalCommonFooter() {
      getGlobalCommon(this.$route.query.webId, "footer").then(async (res) => {
        console.debug(res);
        if (!res.data) {
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
              },
              webId: this.$route.query.webId,
            }),
            type: "footer",
            webId: this.$route.query.webId,
          });
          this.setFooterId(res.data);
          this.getGlobalCommonFooter();
        } else {
          this.setFooterId(res.data.id);
          const elements = [...this.pageElements];
          const context = JSON.parse(res.data.context);
          const index = elements.findIndex((item) => item.id === context.id);
          if (index > -1) {
            elements[index] = context;
          } else {
            elements.push(context);
          }
          this.setPageElements(elements);
        }
      });
    },
    getGlobalCommonWebsiteNavigation() {
      getGlobalCommon(this.$route.query.webId, "website-navigation").then(
        async (res) => {
          if (!res.data) {
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
                },
              }),
              type: "website-navigation",
              webId: this.$route.query.webId,
            });
            this.setNavigationId(res.data);
            this.getGlobalCommonWebsiteNavigation();
          } else {
            this.setNavigationId(res.data.id);
            const elements = [...this.pageElements];
            const context = JSON.parse(res.data.context);
            const index = elements.findIndex((item) => item.id === context.id);
            if (index > -1) {
              elements[index] = context;
            } else {
              elements.push(context);
            }
            console.debug(elements);
            this.setPageElements(elements);
          }
        }
      );
    },
    addCommon(item) {
      const context = JSON.parse(item.context);
      const newElements = [...this.pageElements, context];
      this.setPageElements(newElements);
    },
    generateId() {
      return uuidv4();
    },
    async getPageListFn() {
      const response = await getPageList(this.$route.query.webId);
      if (response.rows.length > 0) {
        this.setPageList(response.rows);
        const pageId = this.currentPage
          ? this.currentPage.id
          : response.rows[0].id;
        const res = await getWebPage(pageId);
        if (!res.data) {
          await addWebPage({
            webId: this.$route.query.webId,
            pageContext: "",
            pageHtml: "",
            title: "默认页面",
          });
          await this.getPageListFn();
          return;
        }
        if (res.data.pageContext) {
          const pageData = res.data;
          const pageContext = JSON.parse(pageData.pageContext);
          this.setCurrentPage({
            id: pageData.id,
            title: pageData.title,
            pageContext: pageData.pageContext,
            pageHtml: pageData.pageHtml,
            webId: pageData.webId,
            url: pageData.url,
          });
          this.setPageElements(pageContext.elements);
          this.setPageConfig({
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
          this.setSelectedElement(null);
        } else {
          const pageData = res.data;
          this.setCurrentPage({
            id: pageData.id,
            title: pageData.title,
            pageContext: pageData.pageContext,
            pageHtml: pageData.pageHtml,
            webId: pageData.webId,
            url: pageData.url,
          });
          this.setPageElements([]);
          this.setPageConfig({
            width: 1200,
            height: 800,
            backgroundColor: "#ffffff",
            showGrid: true,
            gridSize: 20,
            gridColor: "rgba(0,0,0,0.1)",
            title: "",
            url: "",
            showWebsiteNavigation: false,
            showFooter: false,
          });
          this.setSelectedElement(null);
        }
      } else {
        this.setCurrentPage(null);
        this.setPageList([]);
        this.setPageElements([]);
        this.setPageConfig({
          width: 1200,
          height: 800,
          backgroundColor: "#ffffff",
          showGrid: true,
          gridSize: 20,
          gridColor: "rgba(0,0,0,0.1)",
          title: "",
          url: "",
          showWebsiteNavigation: false,
          showFooter: false,
        });
        this.setSelectedElement(null);
        await addWebPage({
          webId: this.$route.query.webId,
          pageContext: "",
          pageHtml: "",
          title: "默认页面",
        });
        await this.getPageListFn();
      }
    },
    showCommonLibrary() {
      this.commonLibraryVisible = true;
      this.primaryMenuVisible = false;
    },
    async savePage(pageData) {
      const context = this.pageElements.find(
        (item) => item.type === "website-navigation"
      );
      if (context) {
        const res1 = await saveOrUpdate({
          context: JSON.stringify(context),
          id: this.navigatorId,
          type: "website-navigation",
          webId: this.$route.query.webId,
        });
        this.setNavigationId(res1.data);

        const res2 = await saveOrUpdate({
          context: JSON.stringify(context),
          id: this.footerId,
          type: "footer",
          webId: this.$route.query.webId,
        });
        this.setFooterId(res2.data);
      }
      await updateWebPage(pageData);
      this.$message.success("保存成功");
      this.init();
    },
    closeComponentLibrary() {
      console.debug('closeComponentLibrary')
     // this.componentLibraryVisible = false;
      this.pageManagementVisible = false;
      this.commonLibraryVisible = false;
    },
    deepMerge(target, source) {
      const result = { ...target };
      Object.keys(source).forEach((key) => {
        if (typeof source[key] === "object" && !Array.isArray(source[key])) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      });
      return result;
    },
    updateCommonFn() {
      this.$refs.commonLibrary.getCommonList();
    },
    deleteElement(elementId) {
      const elements = this.pageElements.filter((el) => el.id !== elementId);
      this.setPageElements(elements);
      this.setSelectedElement(null);
      this.propertyEditorVisible = false;
    },
    handleElementUpdate(payload) {
      const index = this.pageElements.findIndex((el) => el.id === payload.id);
      if (index > -1) {
        const elements = this.pageElements;
        this.$set(elements, index, {
          ...elements[index],
          ...payload,
        });
        this.setPageElements(elements);
      }
    },
    handlePageConfigUpdate(newConfig) {
      const pageConfig = {
        ...this.pageConfig,
        ...newConfig,
      };
      this.setPageConfig(pageConfig);
    },
    handleElementResize(payload) {
      const index = this.pageElements.findIndex((el) => el.id === payload.id);
      if (index > -1) {
        const elements = this.pageElements;
        const value = this.deepMerge(elements[index], payload);
        elements.splice(index, 1, value);
        this.setPageElements(elements);
      }
    },
    closeMenu() {
      // this.propertyEditorVisible = false;
      // this.closeComponentLibrary();
    },
    addElementToCanvas(elementData) {
      let zIndex =
        this.pageElements.length > 0
          ? Math.max(...this.pageElements.map((el) => el.props.zIndex || 0))
          : 0;
      zIndex = zIndex + 1;
      const newElement = {
        id: Date.now().toString(36),
        type: elementData.type,
        x: elementData.x,
        y: elementData.y,
        props: { ...elementData.props, zIndex },
      };
      this.setPageElements([...this.pageElements, newElement]);
    },
    updateElementPosition({ id, x, y }) {
      const index = this.pageElements.findIndex((el) => el.id === id);
      if (index > -1) {
        const elements = this.pageElements;
        this.$set(elements, index, {
          ...elements[index],
          x: Math.max(
            0,
            Math.min(x, this.pageConfig.width - elements[index].props.width)
          ),
          y: Math.max(
            0,
            Math.min(y, this.pageConfig.height - elements[index].props.height)
          ),
        });
        this.setPageElements(elements);
      }
    },
    selectedElementFn(element) {
      this.setSelectedElement(element);
      this.propertyEditorVisible = true;
      this.closeComponentLibrary();
    },
    showComponentLibrary() {
      this.componentLibraryVisible = true;
      this.primaryMenuVisible = false;
    },
    async preview() {
      const pageConfig = {
        ...this.pageConfig,
        elements: this.pageElements,
      };
      const elementsHTML = this.pageElements
        .map((element) => {
          const style = `
                    position: absolute;
                    left: ${element.x}px;
                    top: ${element.y}px;
                    width: ${element.props.width}px;
                    height: ${element.props.height}px;
                    ${element.type === "text"
              ? `
                        font-size: ${element.props.fontSize}px;
                        color: ${element.props.color};
                        font-weight: ${element.props.fontWeight};
                        font-style: ${element.props.fontStyle};
                        font-family: ${element.props.fontFamily};
                    `
              : ``
            }
                    ${element.type === "image" || element.type === "video"
              ? `
                        object-fit: ${element.props.objectFit};
                    `
              : ``
            }
                    ${element.type === "shape"
              ? `
                        background-color: ${element.props.backgroundColor};
                        ${element.props.shape === "circle"
                ? "border-radius: 50%;"
                : ""
              }
                    `
              : ""
            }
                `.replace(/\s+/g, " ");
          switch (element.type) {
            case "text":
              return `<div id="text-${element.id}" style="${style}" ${element.props.linkUrl
                  ? `onclick="window.open('${element.props.linkUrl}', '_blank')"`
                  : ""
                }></div>
                        <script>
                            (function(){
                                const text = document.getElementById('text-${element.id
                }')
                                text.innerHTML = '${element.props.content}'
                            })();
                        <\/script>
                        `;
            case "image":
              return `<a href="${element.props.linkUrl || "javascript:void(0)"
                }"><img src="${element.props.src}" style="${style}" /></a>`;
            case "shape":
              if (element.props.shape === "rect") {
                return `<div style="position: absolute; width: ${element.props.width}px; height: ${element.props.height}px; left: ${element.x}px; top: ${element.y}px;"><div style="width: 100%; height: 100%; background-color: ${element.props.backgroundColor};"></div></div>`;
              } else if (element.props.shape === "circle") {
                return `<div style="position: absolute; width: ${element.props.width}px; height: ${element.props.height}px; left: ${element.x}px; top: ${element.y}px;"><div style="width: 100%; height: 100%; background-color: ${element.props.backgroundColor}; border-radius: 50%;"></div></div>`;
              } else if (element.props.shape === "triangle") {
                return `<div style="position: absolute; width: ${element.props.width
                  }px; height: ${element.props.height}px; left: ${element.x
                  }px; top: ${element.y
                  }px;"><div style="width: 0; height: 0; border-left: ${element.props.width / 2
                  }px solid transparent; border-right: ${element.props.width / 2
                  }px solid transparent; border-bottom: ${element.props.height
                  }px solid ${element.props.backgroundColor};"></div></div>`;
              } else {
                return `<div style="position: absolute; width: ${element.props.width}px; height: ${element.props.height}px; left: ${element.x}px; top: ${element.y}px;"><div class="rect"></div></div>`;
              }
            case "map":
              return `
                            <div id="map-${element.id}" style="${style}"></div>
                            <script>
                                (function(){
                                    const map = new BMap.Map("map-${element.id}");
                                    map.centerAndZoom("${element.props.address}", ${element.props.zoom});
                                })();
                            <\/script>
                            `;
            case "carousel":
              return `
                            <div style="${style}">
                                <div id="carousel-${element.id
                }" style="width: 100%; height: 100%;">
                                    <div class="swiper-container" style="width: 100%; height: 100%;">
                                        <div class="swiper-wrapper">
                                            ${element.props.slides
                  .map(
                    (slide) => `
                                                <div class="swiper-slide">
                                                    <img src="${slide.src}" style="max-width: 100%; height: 100%; margin: 0 auto; display: block;">
                                                </div>
                                            `
                  )
                  .join("")}
                                        </div>
                                        ${element.props.pagination
                  ? '<div class="swiper-pagination"></div>'
                  : ""
                }
                                        ${element.props.navigation
                  ? `
                                            <div class="swiper-button-next"></div>
                                            <div class="swiper-button-prev"></div>
                                        `
                  : ""
                }
                                    </div>
                                </div>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.2/js/swiper.min.js"> <\/script>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.2/css/swiper.min.css">
                                <script>
                                    (function(){
                                        new Swiper('#carousel-${element.id
                } .swiper-container', {
                                            direction: '${element.props.direction
                }',
                                            loop: ${element.props.loop},
                                            slidesPerView: ${element.props.slidesPerView
                },
                                            spaceBetween: ${element.props.spaceBetween
                },
                                            autoplay: ${element.props.autoplay
                  ? `{
                                                delay: ${element.props.speed},
                                                disableOnInteraction: false
                                            }`
                  : false
                },
                                            pagination: ${element.props.pagination
                  ? `{
                                                el: '.swiper-pagination'
                                            }`
                  : false
                },
                                            navigation: ${element.props.navigation
                  ? `{
                                                nextEl: '.swiper-button-next',
                                                prevEl: '.swiper-button-prev'
                                            }`
                  : false
                }
                                        });
                                    })();
                                <\/script>
                            </div>
                        `;
            case "website-navigation":
              return `<div style="width: 100%; height: 100px; position: absolute; top: ${style.top}; left: ${style.left};">
                    <div style="width: 100%; height: 100%; display: flex; justify-content: ${element.props.align}">
                        <nav style="display:flex; align-items: center; width: ${element.props.width}px; height: ${element.props.height}px; background-color: ${element.props.backgroundColor}">
                            <ul style="display:flex; list-style:none; margin:0; padding:0;">
                                 ${element.props.children.map(child => `
                                    <li style="padding:0 ${element.props.space}px">
                                        <a href="${child.url}"  style="text-decoration: none; color: ${element.props.color}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight}; font-family: ${element.props.fontFamily}">
                                            ${child.name}
                                        </a>
                                    </li>
                                `).join('')}  
                            </ul>
                        </nav>
                    </div>
                  </div>`
            case "video":
              return `
                        <div style="${style}">
                            <div style="position:relative; width:100%; height:100%;">
                                <video
                                    id="video-${element.id}"
                                    style="width:100%; height:100%; object-fit:${element.props.objectFit
                }"
                                    volume="${element.props.volume / 100}"
                                    ${element.props.autoplay ? "autoplay" : ""}
                                    ${element.props.loop ? "loop" : ""}
                                    ${element.props.muted ? "muted" : ""}
                                    ${element.props.controls ? "controls" : ""}
                                    src="${element.props.src}">
                                </video>
                                ${element.props.showPlayButton
                  ? `
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    cursor: pointer;
                                ">
                                    <img
                                        id="playBtn-${element.id}"
                                        src="${element.props.playButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "none"
                    : "block"
                  };"
                                        onclick="
                                            document.getElementById('video-${element.id
                  }').play();
                                            this.style.display = 'none';
                                            document.getElementById('pauseBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                    <img
                                        id="pauseBtn-${element.id}"
                                        src="${element.props.pauseButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "block"
                    : "none"
                  };"
                                        onclick="
                                            document.getElementById('video-${element.id
                  }').pause();
                                            this.style.display = 'none';
                                            document.getElementById('playBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                </div>
                            `
                  : ""
                }
                            </div>
                        </div>
                    `;
            case "audio":
              return `
                        <div style="${style}">
                            <div style="position:relative; width:100%; height:100%;">
                                <audio
                                    id="audio-${element.id}"
                                    style="width:100%; height:100%;"
                                    volume="${element.props.volume / 100}"
                                    ${element.props.autoplay ? "autoplay" : ""}
                                    ${element.props.loop ? "loop" : ""}
                                    ${element.props.controls ? "controls" : ""}
                                    src="${element.props.src}">
                                </audio>
                                ${element.props.showPlayButton
                  ? `
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    cursor: pointer;
                                ">
                                    <img
                                        id="playBtn-${element.id}"
                                        src="${element.props.playButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "none"
                    : "block"
                  };"
                                        onclick="
                                            document.getElementById('audio-${element.id
                  }').play();
                                            this.style.display = 'none';
                                            document.getElementById('pauseBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                    <img
                                        id="pauseBtn-${element.id}"
                                        src="${element.props.pauseButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "block"
                    : "none"
                  };"
                                        onclick="
                                            document.getElementById('audio-${element.id
                  }').pause();
                                            this.style.display = 'none';
                                            document.getElementById('playBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                </div>
                            `
                  : ""
                }
                            </div>
                        </div>
                    `;
            case "image-text-navigation":
              return `
                            <div style="${style}">
                                <div class="image-text-navigation-container" id="image-text-navigation-${element.id
                }" style="display: grid; grid-template-columns: repeat(${element.props.cols
                }, 1fr); gap: ${element.props.gap}px; width: 100%; height: 100%;">
                                    ${element.props.children
                  .map(
                    (child) => `
                                        <div class="image-text-navigation-item" onclick="window.open('${child.linkUrl}', '_blank')">
                                            <img src="${child.imgUrl}">
                                            <div class="image-text-navigation-title" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">${child.content}</div>
                                        </div>
                                    `
                  )
                  .join("")}
                                </div>
                            </div>
                        `;
            case "countdown":
              return `
                            <div style="${style}">
                                <div class="countdown-container" id="countdown-${element.id}">
                                    <div class="countdown-values">
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="days-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">天</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="hours-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">时</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="minutes-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">分</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="seconds-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">秒</span>
                                        </div>
                                    </div>
                                </div>
                                <script>
                                    (function(){
                                        const endTime = new Date(${element.props.endtime});
                                        const container = document.getElementById('countdown-${element.id}');
                                        const daysEl = document.getElementById('days-${element.id}');
                                        const hoursEl = document.getElementById('hours-${element.id}');
                                        const minutesEl = document.getElementById('minutes-${element.id}');
                                        const secondsEl = document.getElementById('seconds-${element.id}');

                                        function updateCountdown() {
                                            const now = new Date().getTime();
                                            const diff = endTime - now;

                                            if (diff <= 0) {
                                                clearInterval(timer);
                                                daysEl.textContent = '00';
                                                hoursEl.textContent = '00';
                                                minutesEl.textContent = '00';
                                                secondsEl.textContent = '00';
                                                container.style.display = 'none';
                                                return;
                                            }

                                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                                            daysEl.textContent = String(days).padStart(2, '0');
                                            hoursEl.textContent = String(hours).padStart(2, '0');
                                            minutesEl.textContent = String(minutes).padStart(2, '0');
                                            secondsEl.textContent = String(seconds).padStart(2, '0');
                                        }

                                        updateCountdown();
                                        const timer = setInterval(updateCountdown, 1000);
                                    })();
                                <\/script>
                            </div>
                        `;
          }
        })
        .join("\n");
      let htmlString = `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>页面预览</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                        }
                        ul, ol {
                            list-style: none;
                        }
                        a {
                            text-decoration: none;
                        }
                        .page-container {
                            position: relative;
                            width: ${pageConfig.width}px;
                            height: ${pageConfig.height}px;
                            background-color: ${pageConfig.backgroundColor};
                            margin: 0 auto;
                            overflow: hidden;
                        }
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
                        .image-text-navigation-item{
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            img{
                                width: 100%;
                                height: calc(100% - 30px);
                                object-fit: contain;
                                object-position: center;
                                overflow: hidden;
                            }
                        }
                    </style>
                    <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=Ua1M6L6mOK6qdEbjqlHlUz5L"><\/script>
                </head>
                <body>
                    <div class="page-container">
                        ${elementsHTML}
                    </div>
                </body>
            </html>`;
      const pageData = {
        title: this.currentPage.title,
        id: this.currentPage.id,
        pageContext: JSON.stringify({
          backgroundColor: pageConfig.backgroundColor,
          elements: pageConfig.elements.filter(
            (item) => item.type !== "website-navigation"
          ),
          gridColor: pageConfig.gridColor,
          gridSize: pageConfig.gridSize,
          height: pageConfig.height,
          showGrid: pageConfig.showGrid,
          showWebsiteNavigation: pageConfig.showWebsiteNavigation,
          showFooter: pageConfig.showFooter,
          width: pageConfig.width,
          title: pageConfig.title,
          url: pageConfig.url,
        }),
        pageHtml: htmlString,
        webId: this.$route.query.webId,
        url: this.currentPage.url,
      }
      const context = this.pageElements.find(
        (item) => item.type === "website-navigation"
      );
      if (context) {
        const res1 = await saveOrUpdate({
          context: JSON.stringify(context),
          id: this.navigatorId,
          type: "website-navigation",
          webId: this.$route.query.webId,
        });
        this.setNavigationId(res1.data);

        const res2 = await saveOrUpdate({
          context: JSON.stringify(context),
          id: this.footerId,
          type: "footer",
          webId: this.$route.query.webId,
        });
        this.setFooterId(res2.data);
      }
      await updateWebPage(pageData);
      this.init();
      this.setCurrentPage({
        title: this.currentPage.title,
        id: this.currentPage.id,
        pageContext: JSON.stringify({
          backgroundColor: pageConfig.backgroundColor,
          elements: pageConfig.elements,
          gridColor: pageConfig.gridColor,
          gridSize: pageConfig.gridSize,
          height: pageConfig.height,
          showGrid: pageConfig.showGrid,
          showWebsiteNavigation: pageConfig.showWebsiteNavigation,
          showFooter: pageConfig.showFooter,
          width: pageConfig.width,
          title: pageConfig.title,
          url: pageConfig.url,
        }),
        pageHtml: htmlString,
        webId: this.$route.query.webId,
        url: this.currentPage.url,
      });
      window.open(this.currentPage.url, '_blank');
    },
    convertToJson() {
      const pageConfig = {
        ...this.pageConfig,
        elements: this.pageElements,
      };
      const elementsHTML = this.pageElements
        .map((element) => {
          const style = `
                    position: absolute;
                    left: ${element.x}px;
                    top: ${element.y}px;
                    width: ${element.props.width}px;
                    height: ${element.props.height}px;
                    ${element.type === "text"
              ? `
                        font-size: ${element.props.fontSize}px;
                        color: ${element.props.color};
                        font-weight: ${element.props.fontWeight};
                        font-style: ${element.props.fontStyle};
                        font-family: ${element.props.fontFamily};
                    `
              : ``
            }
                    ${element.type === "image" || element.type === "video"
              ? `
                        object-fit: ${element.props.objectFit};
                    `
              : ``
            }
                    ${element.type === "shape"
              ? `
                        background-color: ${element.props.backgroundColor};
                        ${element.props.shape === "circle"
                ? "border-radius: 50%;"
                : ""
              }
                    `
              : ""
            }
                `.replace(/\s+/g, " ");
          switch (element.type) {
            case "text":
              return `<div id="text-${element.id}" style="${style}" ${element.props.linkUrl
                  ? `onclick="window.open('${element.props.linkUrl}', '_blank')"`
                  : ""
                }></div>
                        <script>
                            (function(){
                                const text = document.getElementById('text-${element.id
                }')
                                text.innerHTML = '${element.props.content}'
                            })();
                        <\/script>
                        `;
            case "image":
              return `<a href="${element.props.linkUrl || "javascript:void(0)"
                }"><img src="${element.props.src}" style="${style}" /></a>`;
            case "shape":
              if (element.props.shape === "rect") {
                return `<div style="position: absolute; width: ${element.props.width}px; height: ${element.props.height}px; left: ${element.x}px; top: ${element.y}px;"><div style="width: 100%; height: 100%; background-color: ${element.props.backgroundColor};"></div></div>`;
              } else if (element.props.shape === "circle") {
                return `<div style="position: absolute; width: ${element.props.width}px; height: ${element.props.height}px; left: ${element.x}px; top: ${element.y}px;"><div style="width: 100%; height: 100%; background-color: ${element.props.backgroundColor}; border-radius: 50%;"></div></div>`;
              } else if (element.props.shape === "triangle") {
                return `<div style="position: absolute; width: ${element.props.width
                  }px; height: ${element.props.height}px; left: ${element.x
                  }px; top: ${element.y
                  }px;"><div style="width: 0; height: 0; border-left: ${element.props.width / 2
                  }px solid transparent; border-right: ${element.props.width / 2
                  }px solid transparent; border-bottom: ${element.props.height
                  }px solid ${element.props.backgroundColor};"></div></div>`;
              } else {
                return `<div style="position: absolute; width: ${element.props.width}px; height: ${element.props.height}px; left: ${element.x}px; top: ${element.y}px;"><div class="rect"></div></div>`;
              }
            case "map":
              return `
                            <div id="map-${element.id}" style="${style}"></div>
                            <script>
                                (function(){
                                    const map = new BMap.Map("map-${element.id}");
                                    map.centerAndZoom("${element.props.address}", ${element.props.zoom});
                                })();
                            <\/script>
                            `;
            case "carousel":
              return `
                            <div style="${style}">
                                <div id="carousel-${element.id
                }" style="width: 100%; height: 100%;">
                                    <div class="swiper-container" style="width: 100%; height: 100%;">
                                        <div class="swiper-wrapper">
                                            ${element.props.slides
                  .map(
                    (slide) => `
                                                <div class="swiper-slide">
                                                    <img src="${slide.src}" style="max-width: 100%; height: 100%; margin: 0 auto; display: block;">
                                                </div>
                                            `
                  )
                  .join("")}
                                        </div>
                                        ${element.props.pagination
                  ? '<div class="swiper-pagination"></div>'
                  : ""
                }
                                        ${element.props.navigation
                  ? `
                                            <div class="swiper-button-next"></div>
                                            <div class="swiper-button-prev"></div>
                                        `
                  : ""
                }
                                    </div>
                                </div>
                                <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.2/js/swiper.min.js"> <\/script>
                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/5.4.2/css/swiper.min.css">
                                <script>
                                    (function(){
                                        new Swiper('#carousel-${element.id
                } .swiper-container', {
                                            direction: '${element.props.direction
                }',
                                            loop: ${element.props.loop},
                                            slidesPerView: ${element.props.slidesPerView
                },
                                            spaceBetween: ${element.props.spaceBetween
                },
                                            autoplay: ${element.props.autoplay
                  ? `{
                                                delay: ${element.props.speed},
                                                disableOnInteraction: false
                                            }`
                  : false
                },
                                            pagination: ${element.props.pagination
                  ? `{
                                                el: '.swiper-pagination'
                                            }`
                  : false
                },
                                            navigation: ${element.props.navigation
                  ? `{
                                                nextEl: '.swiper-button-next',
                                                prevEl: '.swiper-button-prev'
                                            }`
                  : false
                }
                                        });
                                    })();
                                <\/script>
                            </div>
                        `;
            case "website-navigation":
              return `<div style="width: 100%; height: 100px; position: absolute; top: ${style.top}; left: ${style.left};">
                    <div style="width: 100%; height: 100%; display: flex; justify-content: ${element.props.align}">
                        <nav style="display:flex; align-items: center; width: ${element.props.width}px; height: ${element.props.height}px; background-color: ${element.props.backgroundColor}">
                            <ul style="display:flex; list-style:none; margin:0; padding:0;">
                                 ${element.props.children.map(child => `
                                    <li style="padding:0 ${element.props.space}px">
                                        <a href="${child.url}"  style="text-decoration: none; color: ${element.props.color}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight}; font-family: ${element.props.fontFamily}">
                                            ${child.name}
                                        </a>
                                    </li>
                                `).join('')}  
                            </ul>
                        </nav>
                    </div>
                  </div>`
            case "video":
              return `
                        <div style="${style}">
                            <div style="position:relative; width:100%; height:100%;">
                                <video
                                    id="video-${element.id}"
                                    style="width:100%; height:100%; object-fit:${element.props.objectFit
                }"
                                    volume="${element.props.volume / 100}"
                                    ${element.props.autoplay ? "autoplay" : ""}
                                    ${element.props.loop ? "loop" : ""}
                                    ${element.props.muted ? "muted" : ""}
                                    ${element.props.controls ? "controls" : ""}
                                    src="${element.props.src}">
                                </video>
                                ${element.props.showPlayButton
                  ? `
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    cursor: pointer;
                                ">
                                    <img
                                        id="playBtn-${element.id}"
                                        src="${element.props.playButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "none"
                    : "block"
                  };"
                                        onclick="
                                            document.getElementById('video-${element.id
                  }').play();
                                            this.style.display = 'none';
                                            document.getElementById('pauseBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                    <img
                                        id="pauseBtn-${element.id}"
                                        src="${element.props.pauseButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "block"
                    : "none"
                  };"
                                        onclick="
                                            document.getElementById('video-${element.id
                  }').pause();
                                            this.style.display = 'none';
                                            document.getElementById('playBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                </div>
                            `
                  : ""
                }
                            </div>
                        </div>
                    `;
            case "audio":
              return `
                        <div style="${style}">
                            <div style="position:relative; width:100%; height:100%;">
                                <audio
                                    id="audio-${element.id}"
                                    style="width:100%; height:100%;"
                                    volume="${element.props.volume / 100}"
                                    ${element.props.autoplay ? "autoplay" : ""}
                                    ${element.props.loop ? "loop" : ""}
                                    ${element.props.controls ? "controls" : ""}
                                    src="${element.props.src}">
                                </audio>
                                ${element.props.showPlayButton
                  ? `
                                <div style="
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    cursor: pointer;
                                ">
                                    <img
                                        id="playBtn-${element.id}"
                                        src="${element.props.playButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "none"
                    : "block"
                  };"
                                        onclick="
                                            document.getElementById('audio-${element.id
                  }').play();
                                            this.style.display = 'none';
                                            document.getElementById('pauseBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                    <img
                                        id="pauseBtn-${element.id}"
                                        src="${element.props.pauseButtonSrc}"
                                        style="width: 50px; height: 50px; display: ${element.props.autoplay
                    ? "block"
                    : "none"
                  };"
                                        onclick="
                                            document.getElementById('audio-${element.id
                  }').pause();
                                            this.style.display = 'none';
                                            document.getElementById('playBtn-${element.id
                  }').style.display = 'block';
                                        "
                                    >
                                </div>
                            `
                  : ""
                }
                            </div>
                        </div>
                    `;
            case "image-text-navigation":
              return `
                            <div style="${style}">
                                <div class="image-text-navigation-container" id="image-text-navigation-${element.id
                }" style="display: grid; grid-template-columns: repeat(${element.props.cols
                }, 1fr); gap: ${element.props.gap}px; width: 100%; height: 100%;">
                                    ${element.props.children
                  .map(
                    (child) => `
                                        <div class="image-text-navigation-item" onclick="window.open('${child.linkUrl}', '_blank')">
                                            <img src="${child.imgUrl}">
                                            <div class="image-text-navigation-title" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">${child.content}</div>
                                        </div>
                                    `
                  )
                  .join("")}
                                </div>
                            </div>
                        `;
            case "countdown":
              return `
                            <div style="${style}">
                                <div class="countdown-container" id="countdown-${element.id}">
                                    <div class="countdown-values">
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="days-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">天</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="hours-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">时</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="minutes-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">分</span>
                                        </div>
                                        <div class="countdown-item">
                                            <span class="countdown-number" id="seconds-${element.id}" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">00</span>
                                            <span class="countdown-label" style="text-align: ${element.props.textAlign}; color: ${element.props.color}; font-family: ${element.props.fontFamily}; font-size: ${element.props.fontSize}px; font-weight: ${element.props.fontWeight};">秒</span>
                                        </div>
                                    </div>
                                </div>
                                <script>
                                    (function(){
                                        const endTime = new Date(${element.props.endtime});
                                        const container = document.getElementById('countdown-${element.id}');
                                        const daysEl = document.getElementById('days-${element.id}');
                                        const hoursEl = document.getElementById('hours-${element.id}');
                                        const minutesEl = document.getElementById('minutes-${element.id}');
                                        const secondsEl = document.getElementById('seconds-${element.id}');

                                        function updateCountdown() {
                                            const now = new Date().getTime();
                                            const diff = endTime - now;

                                            if (diff <= 0) {
                                                clearInterval(timer);
                                                daysEl.textContent = '00';
                                                hoursEl.textContent = '00';
                                                minutesEl.textContent = '00';
                                                secondsEl.textContent = '00';
                                                container.style.display = 'none';
                                                return;
                                            }

                                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                                            daysEl.textContent = String(days).padStart(2, '0');
                                            hoursEl.textContent = String(hours).padStart(2, '0');
                                            minutesEl.textContent = String(minutes).padStart(2, '0');
                                            secondsEl.textContent = String(seconds).padStart(2, '0');
                                        }

                                        updateCountdown();
                                        const timer = setInterval(updateCountdown, 1000);
                                    })();
                                <\/script>
                            </div>
                        `;
          }
        })
        .join("\n");
      let htmlString = `<!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>页面预览</title>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                        }
                        ul, ol {
                            list-style: none;
                        }
                        a {
                            text-decoration: none;
                        }
                        .page-container {
                            position: relative;
                            width: ${pageConfig.width}px;
                            height: ${pageConfig.height}px;
                            background-color: ${pageConfig.backgroundColor};
                            margin: 0 auto;
                            overflow: hidden;
                        }
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
                        .image-text-navigation-item{
                            width: 100%;
                            height: 100%;
                            overflow: hidden;
                            img{
                                width: 100%;
                                height: calc(100% - 30px);
                                object-fit: contain;
                                object-position: center;
                                overflow: hidden;
                            }
                        }
                    </style>
                    <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=Ua1M6L6mOK6qdEbjqlHlUz5L"><\/script>
                </head>
                <body>
                    <div class="page-container">
                        ${elementsHTML}
                    </div>
                </body>
            </html>`;
      console.debug(pageConfig);

      this.savePage({
        title: this.currentPage.title,
        id: this.currentPage.id,
        pageContext: JSON.stringify({
          backgroundColor: pageConfig.backgroundColor,
          elements: pageConfig.elements.filter(
            (item) => item.type !== "website-navigation"
          ),
          gridColor: pageConfig.gridColor,
          gridSize: pageConfig.gridSize,
          height: pageConfig.height,
          showGrid: pageConfig.showGrid,
          showWebsiteNavigation: pageConfig.showWebsiteNavigation,
          showFooter: pageConfig.showFooter,
          width: pageConfig.width,
          title: pageConfig.title,
          url: pageConfig.url,
        }),
        pageHtml: htmlString,
        webId: this.$route.query.webId,
        url: this.currentPage.url,
      });
      this.setCurrentPage({
        title: this.currentPage.title,
        id: this.currentPage.id,
        pageContext: JSON.stringify({
          backgroundColor: pageConfig.backgroundColor,
          elements: pageConfig.elements,
          gridColor: pageConfig.gridColor,
          gridSize: pageConfig.gridSize,
          height: pageConfig.height,
          showGrid: pageConfig.showGrid,
          showWebsiteNavigation: pageConfig.showWebsiteNavigation,
          showFooter: pageConfig.showFooter,
          width: pageConfig.width,
          title: pageConfig.title,
          url: pageConfig.url,
        }),
        pageHtml: htmlString,
        webId: this.$route.query.webId,
        url: this.currentPage.url,
      });
    },
    deletePageFn(page) {
      if (!page?.id) return;
      this.$confirm("确定要删除该页面吗？删除后不可恢复", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const loading = this.$loading({
            lock: true,
            text: "正在删除...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          await deletePage(page.id);
          loading.close();
          this.$message.success("删除成功");
          await this.getPageListFn();
        })
        .catch(() => { });
    },
    async selectPage(page) {
      this.$confirm("是否保存当前页面", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        this.convertToJson();
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        const res = await getWebPage(page.id);
        const pageData = res.data;
        this.setCurrentPage({
          id: pageData.id,
          title: pageData.title,
          pageContext: pageData.pageContext,
          pageHtml: pageData.pageHtml,
          webId: pageData.webId,
          url: pageData.url,
        });
        if (pageData.pageContext) {
          const pageContext = JSON.parse(pageData.pageContext);
          this.setPageElements(pageContext.elements);
          this.setPageConfig({
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
        } else {
          this.setPageElements([]);
          this.setPageConfig({
            width: 1200,
            height: 800,
            backgroundColor: "#ffffff",
            showGrid: true,
            gridSize: 20,
            gridColor: "rgba(0,0,0,0.1)",
            title: pageData.title || "",
            url: pageData.url || "",
            showWebsiteNavigation: false,
            showFooter: false,
          });
        }
        this.init();
        this.setSelectedElement(null);
        setTimeout(() => {
          loading.close();
        }, 500);
      }).catch(async () => {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        const res = await getWebPage(page.id);
        const pageData = res.data;
        this.setCurrentPage({
          id: pageData.id,
          title: pageData.title,
          pageContext: pageData.pageContext,
          pageHtml: pageData.pageHtml,
          webId: pageData.webId,
          url: pageData.url,
        });
        if (pageData.pageContext) {
          const pageContext = JSON.parse(pageData.pageContext);
          this.setPageElements(pageContext.elements);
          this.setPageConfig({
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
        } else {
          this.setPageElements([]);
          this.setPageConfig({
            width: 1200,
            height: 800,
            backgroundColor: "#ffffff",
            showGrid: true,
            gridSize: 20,
            gridColor: "rgba(0,0,0,0.1)",
            title: pageData.title || "",
            url: pageData.url || "",
            showWebsiteNavigation: false,
            showFooter: false,
          });
        }
        this.init();
        this.setSelectedElement(null);
        setTimeout(() => {
          loading.close();
        }, 500);
      });
    },
    setFooterId(id) {
      this.$store.dispatch("data/setFooterId", id);
    },
    setNavigationId(id) {
      this.$store.dispatch("data/setNavigationId", id);
    },
    setPageList(val) {
      this.$store.dispatch("data/setPageList", val);
    },
    setPageConfig(val) {
      this.$store.dispatch("data/setPageConfig", val);
    },
    setCurrentPage(val) {
      this.$store.dispatch("data/setCurrentPage", val);
    },
    setSelectedElement(val) {
      this.$store.dispatch("data/setSelectedElement", val);
    },
    setNavigation(val) {
      this.$store.dispatch("data/setNavigation", val);
    },
    setPageElements(val) {
      this.$store.dispatch("data/setPageElements", val);
    },
  },
};
</script>

<style scoped>
.page-management-header {
  height: 100px !important;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;

  .page-management-header-actions {
    display: flex;
    align-items: center;
  }

  .page-management-container {
    position: relative;
    width: 1080px;

    .swiper-container {
      width: 90%;
    }
  }

  .page-management-item {
    margin: 10px 0;
    margin-right: 10px;
    display: flex;
    flex: 0 0 100px;
    align-items: center;
    cursor: pointer;
    flex-direction: column;
    justify-content: center;

    .page-management-item-content {
      flex: 0 0 50px;
      width: 100%;
      justify-content: center;
      align-items: center;
      background-color: #409eff;
      display: flex;
      padding: 10px;
      color: #fff;
      box-sizing: border-box;
      margin-bottom: 10px;
      font-size: 12px;
      border-radius: 5px;

      .close-icon {
        width: 20px;
        position: absolute;
        top: 0px;
        right: 0px;
        background: #000;
        border-radius: 50%;
        padding: 5px;
        box-sizing: border-box;
      }
    }

    .page-management-item-actions {
      font-size: 12px;

      i {
        margin-right: 5px;
      }

      .el-button {
        padding: 5px 10px;
      }
    }
  }
}

.page-builder {
  display: flex;
  height: calc(100vh - 100px);
  background: #f0f2f5;
}

.left-container {
  position: fixed;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;

  i {
    font-size: 40px;
    color: #409eff;
    cursor: pointer;
  }
}

.right-container {
  position: fixed;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;

  i {
    font-size: 40px;
    color: #409eff;
    cursor: pointer;
  }
}

/* 自动填充中间区域 */
.editing-canvas {
  flex: 1;
  margin: 20px;
  overflow: auto;
}

.page-management {
  position: fixed;
  top: 0;
  width: 300px;
  height: 100%;
  background: #fff;
  z-index: 1000;
  transition: left 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  z-index: 1000;
}

.component-library {
  position: fixed;
  top: 0;
  width: 200px;
  height: 100%;
  background: #fff;
  z-index: 1000;
  transition: left 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  z-index: 1000;
}

.property-editor {
  position: fixed;
  top: 0;
  right: -500px;
  width: 500px;
  height: 100%;
  background: #fff;
  z-index: 1000;
  transition: right 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
}

.primary-menu {
  position: absolute;
  width: 200px;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  z-index: 2000;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s;
  white-space: nowrap;
}

.menu-item:hover {
  background: #f5f7fa;
}

.menu-item i {
  margin-right: 8px;
  font-size: 16px;
  color: #606266;
}

.menu-item span {
  font-size: 14px;
  color: #303133;
}
</style>
