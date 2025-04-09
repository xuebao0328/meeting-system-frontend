<template>
  <div class="property-editor">
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 20px;
      "
    >
      <i class="el-icon-close" @click.stop="closePropertyEditor"></i>
    </div>
    <el-tabs v-model="activeTab" class="editor-tabs">
      <!-- 全局设置 -->
      <el-tab-pane label="页面设置" name="page">
        <el-form label-width="100px" :model="pageConfigForm">
          <el-form-item label="页面名称">
            <el-input
              v-model="pageConfigForm.title"
              @change="handlePageChange"
            />
          </el-form-item>
          <el-form-item label="页面URL">
            <el-input v-model="pageConfigForm.url" @change="handlePageChange" />
          </el-form-item>
          <el-form-item label="页面宽度">
            <el-input-number
              v-model="pageConfigForm.width"
              :min="0"
              @change="handlePageChange"
            />
            <span class="unit">px</span>
          </el-form-item>

          <el-form-item label="页面高度">
            <el-input-number
              v-model="pageConfigForm.height"
              :min="0"
              @change="handlePageChange"
            />
            <span class="unit">px</span>
          </el-form-item>
          <el-form-item label="显示网站导航">
            <el-switch
              v-model="pageConfigForm.showWebsiteNavigation"
              @change="websiteNavigationChange"
            />
          </el-form-item>
          <el-form-item label="显示底部信息栏">
            <el-switch
              v-model="pageConfigForm.showFooter"
              @change="footerChange"
            />
          </el-form-item>

          <el-form-item label="背景颜色">
            <el-color-picker
              v-model="pageConfigForm.backgroundColor"
              show-alpha
              @change="handlePageChange"
            />
          </el-form-item>

          <el-form-item label="网格显示">
            <el-switch
              v-model="pageConfigForm.showGrid"
              @change="handlePageChange"
            />
          </el-form-item>

          <el-form-item label="网格颜色">
            <el-color-picker
              v-model="pageConfigForm.gridColor"
              :disabled="!pageConfigForm.showGrid"
              @change="handlePageChange"
            />
          </el-form-item>

          <el-form-item label="网格尺寸">
            <el-input-number
              v-model="pageConfigForm.gridSize"
              :min="10"
              :max="100"
              :disabled="!pageConfigForm.showGrid"
              @change="handlePageChange"
            />
            <span class="unit">px</span>
          </el-form-item>
        </el-form>
        <!-- <el-button type="primary" @click="savePage">保存</el-button> -->
      </el-tab-pane>

      <!-- 元素属性 -->
      <el-tab-pane
        label="元素属性"
        name="element"
        v-if="selectedElement"
        :disabled="!selectedElement"
      >
        <div class="element-editor">
          <el-form label-width="100px" :model="elementForm">
            <el-form-item label="文本内容" v-if="elementForm.type === 'text'">
              <!-- <el-input v-model="elementForm.props.content" @input="handleElementChange" /> -->
              <el-button type="primary" @click="openEditor">编辑文本</el-button>
            </el-form-item>
            <el-form-item
              label="x"
              v-if="elementForm.type !== 'website-navigation'"
            >
              <el-input-number
                v-model="elementForm.x"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="y"
              v-if="elementForm.type !== 'website-navigation'"
            >
              <el-input-number
                v-model="elementForm.y"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="宽度">
              <el-input-number
                v-model="elementForm.props.width"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="高度">
              <el-input-number
                v-model="elementForm.props.height"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="层级">
              <el-input-number
                v-model="elementForm.props.zIndex"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="对齐方式"
              v-if="elementForm.type === 'website-navigation'"
            >
              <el-select
                v-model="elementForm.props.align"
                @change="handleElementChange"
              >
                <el-option label="左对齐" value="left"></el-option>
                <el-option label="居中" value="center"></el-option>
                <el-option label="右对齐" value="right"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="间距"
              v-if="elementForm.type === 'website-navigation'"
            >
              <el-input-number
                v-model="elementForm.props.space"
                @input="handleElementChange"
              />
            </el-form-item>
            <!-- <el-form-item label="公共组件" v-if="elementForm.type === 'website-navigation'">
                            <el-select v-model="commonComponent" @change="updateCommon">
                                <el-option label="是" value="1"></el-option>
                                <el-option label="否" value="0"></el-option>
                            </el-select>
                        </el-form-item> -->
            <el-form-item
              label="网站导航栏"
              v-if="elementForm.type === 'website-navigation'"
            >
              <el-button type="primary" @click="openWebsiteNavigationList"
                >设置导航栏</el-button
              >
            </el-form-item>
            <el-form-item
              label="底部信息栏"
              v-if="elementForm.type === 'footer'"
            >
              <el-button type="primary" @click="openFooterList"
                >设置底部信息栏</el-button
              >
            </el-form-item>
            <el-form-item
              label="字体"
              v-if="
                elementForm.type === 'image-text-navigation' ||
                elementForm.type === 'countdown' ||
                elementForm.type === 'website-navigation'
              "
            >
              <el-select
                v-model="elementForm.props.fontFamily"
                @change="handleElementChange"
              >
                <el-option label="默认" value="default"></el-option>
                <el-option label="微软雅黑" value="Microsoft YaHei"></el-option>
                <el-option label="宋体" value="SimSun"></el-option>
                <el-option label="黑体" value="SimHei"></el-option>
                <el-option label="楷体" value="KaiTi"></el-option>
                <el-option label="仿宋" value="FangSong"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="字体大小"
              v-if="
                elementForm.type === 'image-text-navigation' ||
                elementForm.type === 'countdown' ||
                elementForm.type === 'website-navigation'
              "
            >
              <el-input-number
                v-model="elementForm.props.fontSize"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="字体颜色"
              v-if="
                elementForm.type === 'image-text-navigation' ||
                elementForm.type === 'countdown' ||
                elementForm.type === 'website-navigation'
              "
            >
              <el-color-picker
                v-model="elementForm.props.color"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="字体粗细"
              v-if="
                elementForm.type === 'image-text-navigation' ||
                elementForm.type === 'countdown' ||
                elementForm.type === 'website-navigation'
              "
            >
              <el-select
                v-model="elementForm.props.fontWeight"
                @change="handleElementChange"
              >
                <el-option label="正常" value="normal"></el-option>
                <el-option label="加粗" value="bold"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="字体对齐方式"
              v-if="
                elementForm.type === 'image-text-navigation' ||
                elementForm.type === 'countdown'
              "
            >
              <el-select
                v-model="elementForm.props.textAlign"
                @change="handleElementChange"
              >
                <el-option label="左对齐" value="left"></el-option>
                <el-option label="居中" value="center"></el-option>
                <el-option label="右对齐" value="right"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="列数"
              v-if="elementForm.type === 'image-text-navigation'"
            >
              <el-input-number
                v-model="elementForm.props.cols"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="列间距"
              v-if="elementForm.type === 'image-text-navigation'"
            >
              <el-input-number
                v-model="elementForm.props.gap"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="倒计时"
              v-if="elementForm.type === 'countdown'"
            >
              <el-date-picker
                v-model="elementForm.props.endtime"
                type="datetime"
                placeholder="选择停止时间"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="链接"
              v-if="elementForm.type === 'text' || elementForm.type === 'image'"
            >
              <el-select
                v-model="elementForm.props.linkType"
                @change="handleElementChange"
              >
                <el-option label="无" value=""></el-option>
                <el-option label="外部链接" value="external"></el-option>
                <el-option label="内部链接" value="internal"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="链接地址"
              v-if="
                (elementForm.type === 'text' || elementForm.type === 'image') &&
                elementForm.props.linkType === 'external'
              "
            >
              <el-input
                v-model="elementForm.props.linkUrl"
                @input="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="链接地址"
              v-if="
                (elementForm.type === 'text' || elementForm.type === 'image') &&
                elementForm.props.linkType === 'internal'
              "
            >
              <el-select
                v-model="elementForm.props.linkUrl"
                @change="handleElementChange"
              >
                <el-option label="无" value=""></el-option>
                <el-option
                  :label="item.title"
                  :value="item.url"
                  v-for="(item, index) in pageList"
                  :key="index"
                >
                  {{ item.title }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="形状" v-if="elementForm.type === 'shape'">
              <el-select
                v-model="elementForm.props.shape"
                @change="handleElementChange"
              >
                <el-option label="矩形" value="rect"></el-option>
                <el-option label="圆形" value="circle"></el-option>
                <el-option label="三角形" value="triangle"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="文件上传"
              v-if="
                elementForm.type === 'image' ||
                elementForm.type === 'video' ||
                elementForm.type === 'audio'
              "
            >
              <img
                :src="elementForm.props.src"
                style="max-width: 100%; display: block"
                v-if="elementForm.type === 'image'"
              />
              <video
                :src="elementForm.props.src"
                style="max-width: 100%; display: block"
                v-if="elementForm.type === 'video' && elementForm.props.src"
              />
              <audio
                :src="elementForm.props.src"
                style="max-width: 100%; display: block"
                v-if="elementForm.type === 'audio' && elementForm.props.src"
                controls
              />
              <el-button
                size="small"
                type="primary"
                @click="openMediaLibrary(elementForm.type)"
                >选取文件</el-button
              >
            </el-form-item>
            <el-form-item
              label="自动播放"
              v-if="
                elementForm.type === 'video' || elementForm.type === 'audio'
              "
            >
              <el-switch
                v-model="elementForm.props.autoplay"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="循环播放"
              v-if="
                elementForm.type === 'video' || elementForm.type === 'audio'
              "
            >
              <el-switch
                v-model="elementForm.props.loop"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="音量"
              v-if="
                elementForm.type === 'video' || elementForm.type === 'audio'
              "
            >
              <el-input-number
                v-model="elementForm.props.volume"
                :min="0"
                :max="100"
                :step="10"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="静音" v-if="elementForm.type === 'video'">
              <el-switch
                v-model="elementForm.props.muted"
                @change="handleElementChange"
              />
            </el-form-item>
            <!-- <el-form-item label="显示播放按钮"
                            v-if="elementForm.type === 'video' || elementForm.type === 'audio'">
                            <el-switch v-model="elementForm.props.showPlayButton" @change="handleElementChange" />
                        </el-form-item> -->
            <!-- <el-form-item label="播放按钮图片"
                            v-if="(elementForm.type === 'video' || elementForm.type === 'audio') && elementForm.props.showPlayButton">
                            <el-upload class="upload-image" ref="upload" action="" :auto-upload="false"
                                :show-file-list="false" :on-change="handlePlayButtonChange">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="暂停按钮图片"
                            v-if="(elementForm.type === 'video' || elementForm.type === 'audio') && elementForm.props.showPlayButton">
                            <el-upload class="upload-image" ref="upload" action="" :auto-upload="false"
                                :show-file-list="false" :on-change="handlePauseButtonChange">
                                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            </el-upload>
                        </el-form-item> -->
            <el-form-item
              label="图文导航"
              v-if="elementForm.type === 'image-text-navigation'"
            >
              <el-button type="primary" @click="setImageTextNavigation"
                >设置图文导航</el-button
              >
            </el-form-item>
            <el-form-item label="轮播图" v-if="elementForm.type === 'carousel'">
              <el-button type="primary" @click="setCarousel"
                >设置轮播图</el-button
              >
            </el-form-item>
            <el-form-item
              label="轮播图方向"
              v-if="elementForm.type === 'carousel'"
            >
              <el-select
                v-model="elementForm.props.direction"
                @change="handleDirectionChange"
              >
                <el-option label="水平" value="horizontal"></el-option>
                <el-option label="垂直" value="vertical"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="轮播图数量"
              v-if="elementForm.type === 'carousel'"
            >
              <el-input-number
                v-model="elementForm.props.slidesPerView"
                :min="1"
                :max="10"
                @change="handleSlidesPerViewChange"
              />
            </el-form-item>
            <el-form-item
              label="轮播图间距"
              v-if="
                elementForm.type === 'carousel' &&
                elementForm.props.slidesPerView > 1 &&
                elementForm.props.direction === 'horizontal'
              "
            >
              <el-input-number
                v-model="elementForm.props.spaceBetween"
                :min="0"
                :max="100"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="自动播放"
              v-if="elementForm.type === 'carousel'"
            >
              <el-switch
                v-model="elementForm.props.autoplay"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="循环播放"
              v-if="elementForm.type === 'carousel'"
            >
              <el-switch
                v-model="elementForm.props.loop"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="前进后退按钮"
              v-if="elementForm.type === 'carousel'"
            >
              <el-switch
                v-model="elementForm.props.navigation"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="分页器" v-if="elementForm.type === 'carousel'">
              <el-switch
                v-model="elementForm.props.pagination"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item
              label="比例"
              v-if="
                elementForm.type === 'image' || elementForm.type === 'video'
              "
            >
              <el-select
                v-model="elementForm.props.objectFit"
                @change="handleElementChange"
              >
                <el-option label="默认" value="none"></el-option>
                <el-option label="适应容器" value="contain"></el-option>
                <el-option label="覆盖填充" value="cover"></el-option>
                <el-option label="拉伸填充" value="fill"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="背景颜色"
              v-if="
                elementForm.type === 'shape' ||
                elementForm.type === 'website-navigation'
              "
            >
              <el-color-picker
                v-model="elementForm.props.backgroundColor"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="地址" v-if="elementForm.type === 'map'">
              <el-input
                v-model="elementForm.props.address"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="地图信息" v-if="elementForm.type === 'map'">
              <el-input
                v-model="elementForm.props.mapInfo"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item label="缩放级别" v-if="elementForm.type === 'map'">
              <el-input-number
                v-model="elementForm.props.zoom"
                :min="3"
                :max="19"
                @change="handleElementChange"
              />
            </el-form-item>
            <el-form-item v-if="elementForm.type !== 'website-navigation'">
              <el-button type="danger" @click="$emit('delete', elementForm.id)"
                >删除元素</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="编辑文本"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="editorVisible"
      width="50%"
      v-if="elementForm.type === 'text'"
    >
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 200px; overflow-y: hidden"
        v-model="elementForm.props.content"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditorCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditorConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="素材中心"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="mediaLibraryVisible"
    >
      <div class="media-library-container">
        <div class="media-header">
          <!-- <el-input v-model="searchQuery" size="small" placeholder="搜索素材"
                        style="width: 200px; margin-right: 15px" />
                    <el-button slot="trigger" size="small" style="margin-right: 15px" @click="searchMedia"
                        type="primary">搜索</el-button> -->
          <el-upload
            class="upload-media"
            ref="upload"
            action=""
            :accept="accept"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
          >
            <el-button slot="trigger" size="small" type="primary"
              >上传文件</el-button
            >
          </el-upload>
        </div>
        <div class="media-list">
          <div class="media-list-container">
            <div
              v-for="(item, index) in mediaList"
              :key="index"
              class="media-item"
            >
              <div
                class="media-thumbnail"
                :class="{ 'media-selected': isSelected(item) }"
                @click="toggleSelect(item)"
              >
                <div class="media-image">
                  <img :src="item.thumbnailUrl" alt="" />
                  <div class="media-actions">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="viewMedia(item)"
                      >查看</el-button
                    >
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deleteMedia(item)"
                      >删除</el-button
                    >
                  </div>
                </div>
                <div class="selection-indicator" v-if="isSelected(item)">
                  <i class="el-icon-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="text-align: right; margin-top: 10px">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="mediaTotal"
            @current-change="handleMediaPageChange"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mediaLibraryVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmMediaSelection"
          :disabled="selectedMedia.length === 0"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="设置轮播图"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="carouselVisible"
    >
      <div class="carousel-container">
        <div class="carousel-list">
          <draggable
            v-model="elementForm.props.slides"
            v-if="elementForm.type === 'carousel'"
            handle=".drag-handle"
            @end="handleElementChange"
          >
            <div
              v-for="(slide, index) in elementForm.props.slides"
              :key="index"
              class="carousel-item"
            >
              <div class="drag-handle">
                <i class="el-icon-rank"></i>
              </div>
              <div
                class="carousel-image"
                @click="editCarouselImage(slide, index)"
              >
                <img :src="slide.src" alt="轮播图片" />
              </div>
              <div class="carousel-actions">
                <el-button type="danger" size="mini" @click="removeSlide(index)"
                  >删除</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="moveSlide(index, index - 1)"
                  :disabled="index === 0"
                  >上移</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="moveSlide(index, index + 1)"
                  :disabled="index === elementForm.props.slides.length - 1"
                  >下移</el-button
                >
              </div>
            </div>
          </draggable>
        </div>
        <div class="carousel-add">
          <el-button type="primary" @click="addCarouselImages"
            >添加图片</el-button
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="carouselVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCarousel">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置图文导航"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="imageTextNavigationVisible"
    >
      <div class="image-text-navigation-container">
        <div class="image-text-navigation-list">
          <div v-if="elementForm.type === 'image-text-navigation'">
            <div
              class="image-text-navigation-item"
              v-for="(item, index) in elementForm.props.children"
              :key="index"
            >
              <div class="image-text-navigation-item-content">
                <div
                  class="image-text-navigation-item-content-item"
                  @click="updateImageTextNavigationItem(item, index)"
                >
                  <label>图片</label>
                  <img :src="item.imgUrl" alt="图片" />
                </div>
                <div class="image-text-navigation-item-content-item">
                  <label>标题</label>
                  <el-input v-model="item.content" />
                </div>
                <div class="image-text-navigation-item-content-item">
                  <label>链接</label>
                  <el-select
                    v-model="item.linkUrl"
                    @change="handleElementChange"
                  >
                    <el-option label="无" value=""></el-option>
                    <el-option
                      :label="item.title"
                      :value="item.url"
                      v-for="(item, index) in pageList"
                      :key="index"
                    >
                      {{ item.title }}
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="image-text-navigation-item-actions">
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeImageTextNavigationItem(index)"
                  >删除</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <div class="image-text-navigation-add">
          <el-button type="primary" @click="addImageTextNavigationItem"
            >添加</el-button
          >
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imageTextNavigationVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImageTextNavigation"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="网站导航栏"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="websiteNavigationListVisible"
      width="60%"
    >
      <div
        class="website-navigation-list-container"
        v-if="elementForm.type === 'website-navigation'"
      >
        <div class="website-navigation-list-header">
          <el-button type="primary" @click="addWebsiteNavigationItem"
            >添加</el-button
          >
        </div>
        <el-table :data="elementForm.props.children">
          <el-table-column label="导航名称" prop="name"></el-table-column>
          <el-table-column label="打开方式" prop="openModel"></el-table-column>
          <el-table-column label="前端显示" prop="show"></el-table-column>
          <el-table-column label="排序" prop="sort"></el-table-column>
          <el-table-column label="链接地址" prop="url"></el-table-column>
          <el-table-column label="操作" prop="actions">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="editWebsiteNavigationItem(scope.row, scope.$index)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="deleteWebsiteNavigationItem(scope.row, scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      title="设置网站导航栏"
      :append-to-body="true"
      :close-on-click-modal="false"
      :visible.sync="websiteNavigationVisible"
    >
      <div class="website-navigation-container">
        <el-form
          label-position="top"
          @close="resetWebsiteNavigationForm"
          label-width="80px"
          ref="websiteNavigationForm"
          :model="websiteNavigationForm"
          :rules="websiteNavigationRules"
          style="padding: 0 20px; box-sizing: border-box"
        >
          <el-form-item label="导航名称" prop="name">
            <el-input v-model="websiteNavigationForm.name" />
          </el-form-item>
          <el-form-item label="打开方式" prop="openModel">
            <el-radio-group v-model="websiteNavigationForm.openModel">
              <el-radio label="0">当前窗口</el-radio>
              <el-radio label="1">新窗口</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="前端显示" prop="show">
            <el-checkbox-group v-model="websiteNavigationForm.show">
              <el-checkbox label="computerShow">电脑端</el-checkbox>
              <el-checkbox label="phoneShow">手机端</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="websiteNavigationForm.sort" />
          </el-form-item>
          <el-form-item label="链接地址" prop="url">
            <el-select
              v-model="websiteNavigationForm.url"
              @change="handleElementChange"
            >
              <el-option label="无" value=""></el-option>
              <el-option
                :label="item.title"
                :value="item.url"
                v-for="(item, index) in pageList"
                :key="index"
              >
                {{ item.title }}
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="websiteNavigationVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmWebsiteNavigation"
            >确 定</el-button
          >
        </span>
      </div>
    </el-dialog>
    <el-dialog
      title="预览"
      :append-to-body="true"
      @close="previewFile = null"
      :close-on-click-modal="false"
      :visible.sync="previewVisible"
    >
      <div class="preview-container">
        <div class="preview-content">
          <div class="preview-item">
            <div class="preview-item-content">
              <div class="preview-item-content-item">
                <img
                  v-if="elementForm.type === 'image' && previewFile"
                  :src="previewFile.url"
                  alt="图片"
                />
                <video
                  v-if="elementForm.type === 'video' && previewFile"
                  :src="previewFile.url"
                  controls
                ></video>
                <audio
                  v-if="elementForm.type === 'audio' && previewFile"
                  :src="previewFile.url"
                  controls
                ></audio>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  uploadFile,
  getFileList,
  addCommon,
  deleteCommon,
  deleteFile,
  getGlobalCommon,
  saveOrUpdate,
} from "@/api";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import draggable from "vuedraggable";
import { mapState } from "vuex";
import { DomEditor } from "@wangeditor/editor";
export default {
  components: { Editor, Toolbar, draggable },
  data() {
    return {
      mediaPage: 1,
      mediaPageSize: 9,
      mediaTotal: 0,
      previewVisible: false,
      commonComponent: "0",
      websiteNavigationRules: {
        name: [{ required: true, message: "请输入导航名称" }],
        openModel: [{ required: true, message: "请选择打开方式" }],
        show: [{ required: true, message: "请选择前端显示" }],
        url: [{ required: true, message: "请选择链接地址" }],
        sort: [{ required: true, message: "请设置排序" }],
      },
      websiteNavigationListVisible: false,
      websiteNavigationVisible: false,
      websiteNavigationForm: {
        name: "",
        openModel: "0",
        show: [],
        url: "",
        sort: "",
      },
      imageTextNavigationVisible: false,
      carouselVisible: false,
      fileType: "",
      mediaList: [],
      searchQuery: "",
      mediaLibraryVisible: false,
      selectedMedia: [],
      selectionMode: "single",
      editorVisible: false,
      elementForm: {},
      activeTab: "page",
      pageConfigForm: {},
      uploading: false,
      selectedFile: null,
      editor: null,
      html: "",
      toolbarConfig: {
        excludeKeys: [
          "group-video",
          "emotion",
          "divider",
          "group-more-style",
          "header1",
          "header2",
          "header3",
          "bgColor",
          "clearStyle",
          "through",
          "|",
          "insertTable",
          "fullScreen",
          "codeBlock",
          "insertTable",
          "insertVideo",
          "insertLink",
          "bulletedList",
          "numberedList",
          "todo",
          "blockquote",
          "undo",
          "redo",
          "insertImage",
        ],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        hoverbarKeys: {
          text: [],
        },
        MENU_CONF: {
          fontSize: {
            fontSizeList: [
              "12px",
              "14px",
              "16px",
              "18px",
              "20px",
              "24px",
              "28px",
              "32px",
              "36px",
              "40px",
              "48px",
              "56px",
              "64px",
              "72px",
              "96px",
              "120px",
              "150px",
              "200px",
            ],
          },
          uploadImage: {
            fieldName: "file",
            maxFileSize: 10 * 1024 * 1024, // 10MB
            maxNumberOfFiles: 10,
            allowedFileTypes: ["image/*"],
            customUpload: async (file, insertFn) => {
              const formData = new FormData();
              formData.append("file", file);
              try {
                const res = await uploadFile(formData);
                insertFn(res.data.url);
              } catch (error) {
                this.$message.error("图片上传失败");
                console.error("上传失败", error);
              }
            },
          },
        },
      },
      mode: "default",
      websiteNavigationFormIndex: -1,
      previewFile: null,
      isUpdateImageTextNavigationItem: false,
      isUpdateImageTextNavigationItemIndex: -1,
    };
  },
  watch: {
    pageConfig: {
      immediate: true,
      handler(newVal) {
        this.pageConfigForm = { ...newVal };
      },
    },
    selectedElement: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal) {
          this.activeTab = "element";
          this.elementForm = JSON.parse(JSON.stringify(newVal));
        } else {
          this.activeTab = "page";
          this.elementForm = {};
        }
      },
    },
    // 'elementForm.props.height': {
    //     handler(newVal, oldVal) {
    //         console.debug(newVal, oldVal)
    //         if (this.elementForm.type === 'footer') {
    //             this.elementForm.y = this.elementForm.y - oldVal
    //         }
    //     }
    // }
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  computed: {
    ...mapState("data", [
      "pageList",
      "pageConfig",
      "selectedElement",
      "pageElements",
    ]),
    accept() {
      if (this.elementForm.type === "image") {
        return "image/*";
      } else if (this.elementForm.type === "video") {
        return "video/*";
      } else if (this.elementForm.type === "audio") {
        return "audio/*";
      }
      return "";
    },
  },
  mounted() {
    console.debug("====================================================");
    this.$bus.$on("addCommon", (data) => {
      this.elementForm = data;
      this.handleElementChange();
      this.addCommon();
    });
  },
  methods: {
    closePropertyEditor() {
      this.$emit("close");
    },
    websiteNavigationChange() {
      if (this.pageConfigForm.showWebsiteNavigation) {
        this.getGlobalCommonWebsiteNavigation();
      } else {
        const elements = this.pageElements.filter(
          (item) => item.type !== "website-navigation"
        );
        this.setPageElements(elements);
      }
      this.handlePageChange();
    },
    footerChange() {
      if (this.pageConfigForm.showFooter) {
        this.getGlobalCommonFooter();
      } else {
        const elements = this.pageElements.filter(
          (item) => item.type !== "footer"
        );
        this.setPageElements(elements);
      }
      this.handlePageChange();
    },
    setNavigationId(id) {
      this.$store.dispatch("data/setNavigationId", id);
    },
    setFooterId(id) {
      this.$store.dispatch("data/setFooterId", id);
    },
    setPageElements(val) {
      this.$store.dispatch("data/setPageElements", val);
    },
    getGlobalCommonFooter() {
      getGlobalCommon(this.$route.query.webId, "footer").then(async (res) => {
        if (!res.data) {
          // footer的位置在最下方
          await saveOrUpdate({
            context: JSON.stringify({
              type: "footer",
              label: "底部信息栏",
              id: this.generateId(),
              x: 0,
              y: this.pageConfig.height - 100,
              props: {
                width: 300,
                height: 100,
              },
              webId: this.$route.query.webId,
            }),
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
            await saveOrUpdate({
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
    handleMediaPageChange(page) {
      this.mediaPage = page;
      this.getFileList();
    },
    getFileList() {
      getFileList({
        fileType: this.fileType,
        pageNum: this.mediaPage,
        pageSize: this.mediaPageSize,
      }).then((res) => {
        this.mediaList = res.rows;
        this.mediaTotal = res.total;
      });
    },
    addCommon() {
      addCommon({
        context: JSON.stringify(this.elementForm),
        webId: this.$route.query.webId,
      }).then((res) => {
        this.elementForm.commonId = res.data;
        this.handleElementChange();
        this.$emit("updateCommon");
      });
    },
    deleteCommon() {
      deleteCommon(this.elementForm.commonId).then(() => {
        this.elementForm.commonId = "";
        this.handleElementChange();
        this.$emit("updateCommon");
      });
    },
    updateCommon(value) {
      if (value === "1") {
        this.addCommon();
      } else {
        this.deleteCommon();
      }
    },
    resetWebsiteNavigationForm() {
      this.websiteNavigationForm = {
        name: "",
        openModel: "0",
        show: [],
        url: "",
        sort: "",
        id: "",
      };
      this.$refs.websiteNavigationForm.resetFields();
    },
    editWebsiteNavigationItem(row, index) {
      this.websiteNavigationFormIndex = index;
      this.websiteNavigationForm = {
        name: row.name,
        openModel: row.openModel,
        show: [
          row.computerShow ? "computerShow" : "",
          row.phoneShow ? "phoneShow" : "",
        ],
        url: row.url,
        sort: row.sort,
        id: row.id,
      };
      this.websiteNavigationVisible = true;
    },
    deleteWebsiteNavigationItem(row, index) {
      if (this.elementForm.props.children.length === 1) {
        return;
      }
      this.elementForm.props.children = this.elementForm.props.children.filter(
        (item, i) => i !== index
      );
      this.handleElementChange();
    },
    openWebsiteNavigationList() {
      this.websiteNavigationListVisible = true;
    },
    confirmWebsiteNavigation() {
      if (this.websiteNavigationFormIndex >= 0) {
        this.elementForm.props.children[this.websiteNavigationFormIndex] =
          this.websiteNavigationForm;
      } else {
        this.elementForm.props.children.push({
          name: this.websiteNavigationForm.name,
          openModel: this.websiteNavigationForm.openModel,
          sort: this.websiteNavigationForm.sort,
          url: this.websiteNavigationForm.url,
          computerShow:
            this.websiteNavigationForm.show.includes("computerShow"),
          phoneShow: this.websiteNavigationForm.show.includes("phoneShow"),
        });
      }
      this.websiteNavigationVisible = false;
      this.websiteNavigationForm = {
        name: "",
        openModel: "0",
        show: [],
        url: "",
        sort: "",
        id: "",
      };
      this.$refs.websiteNavigationForm.resetFields();
      this.handleElementChange();
    },
    addWebsiteNavigationItem() {
      this.websiteNavigationFormIndex = -1;
      this.websiteNavigationVisible = true;
    },
    updateImageTextNavigationItem(item, index) {
      this.isUpdateImageTextNavigationItem = true;
      this.isUpdateImageTextNavigationItemIndex = index;
      this.selectedMedia = [item];
      this.selectionMode = "single";
      this.fileType = "pic";
      this.mediaLibraryVisible = true;
      this.getFileList();
    },
    addImageTextNavigationItem() {
      this.isUpdateImageTextNavigationItem = false;
      this.selectionMode = "single";
      this.fileType = "pic";
      this.mediaLibraryVisible = true;
      this.getFileList();
    },
    confirmImageTextNavigation() {
      this.imageTextNavigationVisible = false;
      this.handleElementChange();
    },
    setImageTextNavigation() {
      this.imageTextNavigationVisible = true;
    },
    setCarousel() {
      // 如果没有slides属性，初始化一个空数组
      if (!this.elementForm.props.slides) {
        this.$set(this.elementForm.props, "slides", []);
      }
      this.carouselVisible = true;
    },
    editCarouselImage(slide, index) {
      this.isUpdateCarouselImage = true;
      this.isUpdateCarouselImageIndex = index;
      this.selectedMedia = [slide];

      this.selectionMode = "single";
      this.fileType = "pic";
      this.mediaLibraryVisible = true;

      this.getFileList();
    },
    addCarouselImages() {
      this.isUpdateCarouselImage = false;
      this.selectionMode = "multiple";
      this.fileType = "pic";
      this.mediaLibraryVisible = true;

      this.getFileList();
    },
    removeImageTextNavigationItem(index) {
      this.elementForm.props.children.splice(index, 1);
      this.handleElementChange();
    },
    removeSlide(index) {
      this.elementForm.props.slides.splice(index, 1);
      this.handleElementChange();
    },

    moveSlide(fromIndex, toIndex) {
      if (toIndex < 0 || toIndex >= this.elementForm.props.slides.length)
        return;

      const slide = this.elementForm.props.slides.splice(fromIndex, 1)[0];
      this.elementForm.props.slides.splice(toIndex, 0, slide);
      this.handleElementChange();
    },

    confirmCarousel() {
      this.carouselVisible = false;
      this.handleElementChange();
    },

    isSelected(item) {
      return this.selectedMedia.some((media) => media.id === item.id);
    },

    // 切换选中状态
    toggleSelect(item) {
      if (this.selectionMode === "single") {
        this.selectedMedia = [item];
      } else {
        const index = this.selectedMedia.findIndex(
          (media) => media.id === item.id
        );
        if (index === -1) {
          this.selectedMedia.push(item);
        } else {
          this.selectedMedia.splice(index, 1);
        }
      }
    },
    getImageDimensions(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();

        // 处理跨域请求
        img.crossOrigin = "Anonymous";

        img.onload = () => {
          resolve({
            width: img.naturalWidth, // 获取原始宽度
            height: img.naturalHeight, // 获取原始高度
          });
        };

        img.onerror = (err) => {
          reject(new Error("图片加载失败: " + err));
        };

        img.src = url;

        // 如果图片已缓存
        if (img.complete) {
          resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
        }
      });
    },
    confirmMediaSelection() {
      if (this.selectedMedia.length === 0) return;

      if (
        this.elementForm.type === "image" ||
        this.elementForm.type === "video" ||
        this.elementForm.type === "audio"
      ) {
        // 单个媒体元素处理
        this.elementForm.props.src = this.selectedMedia[0].url;
        if (this.elementForm.type === "image") {
          this.getImageDimensions(this.selectedMedia[0].url).then(
            (dimensions) => {
              this.elementForm.props.width = dimensions.width;
              this.elementForm.props.height = dimensions.height;
            }
          );
        }
        this.handleElementChange();
      } else if (this.elementForm.type === "carousel") {
        if (!this.isUpdateCarouselImage) {
          this.selectedMedia.forEach((media) => {
            this.elementForm.props.slides.push({ src: media.url });
          });
        } else {
          this.elementForm.props.slides[this.isUpdateCarouselImageIndex].src =
            this.selectedMedia[0].url;
        }
        this.handleElementChange();
      } else if (this.elementForm.type === "image-text-navigation") {
        // 图文导航处理新增
        if (!this.isUpdateImageTextNavigationItem) {
          this.selectedMedia.forEach((media) => {
            this.elementForm.props.children.push({
              imgUrl: media.url,
              content: "",
              linkUrl: "",
            });
          });
        } else {
          this.elementForm.props.children[
            this.isUpdateImageTextNavigationItemIndex
          ].imgUrl = this.selectedMedia[0].url;
        }
        // // 图文导航处理修改
        // this.elementForm.props.children.forEach(item => {
        //     item.imgUrl = this.selectedMedia.find(media => media.id === item.id).url
        // })
        this.handleElementChange();
      }

      this.mediaLibraryVisible = false;
      this.selectedMedia = [];
    },
    // 打开素材库时加载数据
    openMediaLibrary(type) {
      this.mediaLibraryVisible = true;
      this.selectedMedia = [];
      this.fileType = "";
      if (
        type === "image" ||
        type === "carousel" ||
        type === "image-text-navigation"
      ) {
        this.fileType = "pic";
      } else if (type === "video") {
        this.fileType = "vid";
      } else if (type === "audio") {
        this.fileType = "aud";
      }
      if (type === "carousel") {
        this.fileType = "pic";
        this.selectionMode = "single";
      } else {
        this.selectionMode = "single";
      }
      this.getFileList();
      // 这里需要调用获取素材列表的API
    },
    // 处理素材上传
    async handleMediaUpload() {
      // 上传文件逻辑
    },
    // 搜索素材
    searchMedia() {
      // 过滤素材列表逻辑
    },
    // 查看素材详情
    viewMedia(item) {
      this.previewFile = item;
      this.previewVisible = true;
      // 大图预览逻辑
    },
    // 删除素材
    deleteMedia(item) {
      // 删除确认及API调用
      deleteFile(item.id).then(() => {
        this.$message.success("删除成功");
        this.getFileList();
      });
    },
    handleEditorConfirm() {
      this.editorVisible = false;
      this.handleElementChange();
    },
    handleEditorCancel() {
      this.editorVisible = false;
    },
    openEditor() {
      this.editorVisible = true;
    },
    onCreated(editor) {
      this.editor = Object.seal(editor);
    },
    onChange(editor) {
      // 当前菜单排序和分组

      const toolbar = DomEditor.getToolbar(editor);
      console.debug(toolbar);
      console.debug(editor.getAllMenuKeys());
    },
    handleDirectionChange(value) {
      if (value === "vertical") {
        this.elementForm.props.slidesPerView = 1;
        this.elementForm.props.spaceBetween = 0;
      }
      this.handleElementChange();
    },
    handleSlidesPerViewChange(value) {
      if (value <= 1) {
        this.elementForm.props.spaceBetween = 0;
      }
      this.handleElementChange();
    },
    async handleCarouselChange(file) {
      this.selectedFile = file.raw;
      if (!this.selectedFile) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }

      try {
        this.uploading = true;
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        const res = await uploadFile(formData);

        this.elementForm.props.slides.push({ src: res.data.url });
        this.handleElementChange();
        this.$message.success("上传成功");
      } catch (error) {
        this.$message.error("上传失败");
      } finally {
        this.uploading = false;
      }
    },
    async handlePlayButtonChange(file) {
      this.selectedFile = file.raw;
      if (!this.selectedFile) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }

      try {
        this.uploading = true;
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        // 替换为你的上传接口调用
        const res = await uploadFile(formData);

        // 更新图片路径
        this.elementForm.props.playButtonSrc = res.data.url;
        this.handleElementChange();
        this.$message.success("上传成功");
      } catch (error) {
        this.$message.error("上传失败");
      } finally {
        this.uploading = false;
      }
    },
    async handlePauseButtonChange(file) {
      this.selectedFile = file.raw;
      if (!this.selectedFile) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }

      try {
        this.uploading = true;
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        // 替换为你的上传接口调用
        const res = await uploadFile(formData);

        // 更新图片路径
        this.elementForm.props.pauseButtonSrc = res.data.url;
        this.handleElementChange();
        this.$message.success("上传成功");
      } catch (error) {
        this.$message.error("上传失败");
      } finally {
        this.uploading = false;
      }
    },
    savePage() {
      this.$emit("convert-to-json", {
        ...this.pageConfig,
        elements: this.$parent.pageElements,
      });
    },
    handlePageChange() {
      console.debug("222222++++++++");
      this.$emit("update:page-config", { ...this.pageConfigForm });
    },

    handleElementChange() {
      if (this.selectedElement) {
        this.$emit("update", { ...this.elementForm });
      }
    },

    async handleFileChange(file) {
      this.selectedFile = file.raw;
      if (!this.selectedFile) {
        this.$message.warning("请先选择要上传的文件");
        return;
      }

      try {
        this.uploading = true;
        const formData = new FormData();
        formData.append("file", this.selectedFile);

        // 替换为你的上传接口调用
        await uploadFile(formData);

        this.getFileList();
        // this.elementForm.props.src = res.data.url
        // this.handleElementChange()
        this.$message.success("上传成功");
      } catch (error) {
        this.$message.error("上传失败");
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped lang="scss">
.editor-tabs {
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 0 16px;
}

.unit {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}

.element-editor {
  height: calc(100vh - 120px);
  overflow-y: auto;
}

:deep(.w-e-text-container) {
  padding: 17px 0;

  p {
    margin: 0;
  }
}

.image-text-navigation-container {
  .image-text-navigation-list {
    .image-text-navigation-item {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ebeef5;
      border-radius: 4px;

      .image-text-navigation-item-content {
        flex: 1;
        padding: 0 10px;

        .image-text-navigation-item-content-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;

          label {
            flex: 0 0 70px;
            text-align: left;
            margin-right: 10px;
          }

          img {
            height: 80px;
            object-fit: contain;
          }
        }
      }

      .image-text-navigation-item-actions {
        display: flex;
        gap: 5px;
      }
    }
  }

  .image-text-navigation-add {
    text-align: center;
  }
}

.carousel-container {
  .carousel-list {
    margin-bottom: 20px;
    max-height: 400px;
    overflow-y: auto;

    .carousel-item {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ebeef5;
      border-radius: 4px;

      .drag-handle {
        cursor: move;
        padding: 0 10px;
      }

      .carousel-image {
        flex: 1;
        margin: 0 10px;
        height: 80px;

        img {
          height: 100%;
          object-fit: contain;
        }
      }

      .carousel-actions {
        display: flex;
        gap: 5px;
      }
    }
  }

  .carousel-add {
    text-align: center;
  }
}

.media-library-container {
  height: 600px;

  .media-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .media-list {
    overflow-y: auto;

    .media-list-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;

      .media-item {
        margin-bottom: 20px;

        .media-thumbnail {
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          position: relative;
          cursor: pointer;
          height: 120px;

          .media-image {
            height: 100%;
            width: 100%;

            img {
              display: block;
              margin: 0 auto;
              height: 100%;
              object-fit: cover; // 保持图片比例填充容器
            }
          }

          &:hover {
            .media-actions {
              opacity: 1;
            }
          }

          &.media-selected {
            border: 2px solid #409eff;
          }

          .media-actions {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 8px;
            text-align: center;
            opacity: 0;
            transition: opacity 0.3s;
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .selection-indicator {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            background-color: #409eff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }
        }
      }
    }
  }

  .media-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 15px;
    border-top: 1px solid #ebeef5;
    background-color: #f5f7fa;
  }
}
</style>