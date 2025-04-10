<template>
  <div class="meeting-detail-settings">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <img src="../assets/logo.png" alt="Logo" class="logo-image" />
        <span class="logo-text">会议详情设置</span>
      </div>
      <nav class="sidebar-nav">
      
        <div class="nav-item" :class="{ active: activeMenu === 'website' }" @click="activeMenu = 'website'" style="--index: 2;">
          <i class="el-icon-globe"></i>
          <span>会议网站搭建</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'guests' }" @click="activeMenu = 'guests'" style="--index: 3;">
          <i class="el-icon-star"></i>
          <span>重要嘉宾管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'invoice' }" @click="activeMenu = 'invoice'" style="--index: 4;">
          <i class="el-icon-document"></i>
          <span>发票信息设置</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'finance' }" @click="activeMenu = 'finance'" style="--index: 5;">
          <i class="el-icon-money"></i>
          <span>财务管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'hotel' }" @click="activeMenu = 'hotel'" style="--index: 6;">
          <i class="el-icon-house"></i>
          <span>酒店预定</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'checkin' }" @click="activeMenu = 'checkin'" style="--index: 7;">
          <i class="el-icon-check"></i>
          <span>签到管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'registration' }" @click="activeMenu = 'registration'" style="--index: 8;">
          <i class="el-icon-edit"></i>
          <span>注册管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'badge' }" @click="activeMenu = 'badge'" style="--index: 9;">
          <i class="el-icon-printer"></i>
          <span>胸卡打印配置</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'signup' }" @click="activeMenu = 'signup'" style="--index: 10;">
          <i class="el-icon-tickets"></i>
          <span>报名信息管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'websites' }" @click="activeMenu = 'websites'" style="--index: 11;">
          <i class="el-icon-menu"></i>
          <span>会议网站列表</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'registrationmanage' }" @click="activeMenu = 'registrationmanage'" style="--index: 12;">
          <i class="el-icon-user"></i>
          <span>用户报名管理</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'userinfo' }" @click="activeMenu = 'userinfo'" style="--index: 13;">
          <i class="el-icon-user-solid"></i>
          <span>会议数据</span>
        </div>
        <div class="nav-item" :class="{ active: activeMenu === 'profile' }" @click="activeMenu = 'profile'" style="--index: 14;">
          <i class="el-icon-s-custom"></i>
          <span>个人中心</span>
        </div>
      </nav>
    </div>

    <!-- 右侧内容区域 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="top-bar">
        <div class="page-title">{{ pageTitle }}</div>
        <div class="user-info">
          <div class="notification-icon">
            <i class="el-icon-bell"></i>
            <span class="badge" v-if="unreadCount">{{ unreadCount }}</span>
          </div>
          <div class="user-profile">
            <img src="../assets/avatar.png" alt="Avatar" class="avatar" />
            <span class="username">{{ username }}</span>
            <el-dropdown trigger="click">
              <i class="el-icon-arrow-down el-icon--right" style="cursor: pointer;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="goToUserCenter">个人中心</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="content">
       

        <!-- 会议网站搭建 -->
        <div v-if="activeMenu === 'website'" class="section">
        
          <!-- 网站状态信息 -->
          <el-card class="website-status-card">
            <div slot="header" class="card-header">
              <span>网站状态</span>
              <div>
                <el-button type="primary" @click="goToWebsiteBuilder">编辑网站</el-button>
                <el-button type="success" @click="previewWebsite">预览网站</el-button>
                <el-button :type="meetingData.websiteStatus === 'active' ? 'danger' : 'success'" @click="toggleWebsiteStatus">
                  {{ meetingData.websiteStatus === 'active' ? '下线网站' : '发布网站' }}
                </el-button>
              </div>
            </div>
            <div class="website-info">
              <div class="info-item">
                <span class="info-label">状态：</span>
                <el-tag :type="meetingData.websiteStatus === 'active' ? 'success' : 'info'">
                  {{ meetingData.websiteStatus === 'active' ? '已发布' : '草稿' }}
                </el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">浏览量：</span>
                <span>{{ meetingData.websiteViews || 0 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">最后更新：</span>
                <span>{{ meetingData.websiteLastUpdate || '尚未发布' }}</span>
              </div>
            </div>
          </el-card>
          
          <!-- 网站模板选择 -->
          <el-card class="website-templates-card" style="margin-top: 20px;">
            <div slot="header" class="card-header">
              <span>网站模板</span>
              <div>
                <span class="tip-text">选择一个模板开始创建您的会议网站</span>
              </div>
            </div>
            <div class="template-list">
              <div class="template-item" @click="selectTemplate('academic')">
                <div class="template-image">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM0Mjg1RjQiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSI2MCIgcj0iNDAiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=" alt="学术会议模板">
                </div>
                <div class="template-title">学术会议模板</div>
                <div class="template-desc">适合学术研讨会、论坛等学术性质的会议</div>
              </div>
              <div class="template-item" @click="selectTemplate('business')">
                <div class="template-image">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiMzNEE4NTMiLz48cmVjdCB4PSI0MCIgeT0iMzAiIHdpZHRoPSIxMjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=" alt="商务会议模板">
                </div>
                <div class="template-title">商务会议模板</div>
                <div class="template-desc">适合企业年会、产品发布会等商务活动</div>
              </div>
              <div class="template-item" @click="selectTemplate('exhibition')">
                <div class="template-image">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNFQTQzMzUiLz48cG9seWdvbiBwb2ludHM9IjEwMCwzMCAxNTAsMTAwIDUwLDEwMCIgZmlsbD0iI0ZGRkZGRiIvPjwvc3ZnPg==" alt="科技展会模板">
                </div>
                <div class="template-title">科技展会模板</div>
                <div class="template-desc">适合科技展览、创新大会等科技类活动</div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 重要嘉宾管理 -->
        <div v-if="activeMenu === 'guests'" class="section">
          <h3>重要嘉宾管理</h3>
          <p>这里是重要嘉宾管理页面，您可以管理会议的重要嘉宾信息。</p>
        </div>

        <!-- 发票信息设置 -->
        <div v-if="activeMenu === 'invoice'" class="section">
          <h3>发票信息设置</h3>
          <el-tabs v-model="activeInvoiceTab">
            <!-- 注册发票标签页 -->
            <el-tab-pane label="注册发票" name="registrationInvoice">
              <div class="invoice-settings">
                <!-- 筛选框和一键开票按钮 -->
                <div class="filter-box">
                  <span class="filter-label">发票状态：</span>
                  <el-select v-model="invoiceStatusFilter" placeholder="请选择发票状态" style="width: 150px;">
                    <el-option label="全部" value="" />
                    <el-option label="已开具" value="已开票" />
                    <el-option label="未开具" value="待开票" />
                    <el-option label="无须开票" value="无须开票" />
                  </el-select>
                  <el-button type="primary" style="margin-left: 15px;" @click="batchHandleInvoice">一键开票</el-button>
                </div>
                
                <el-table :data="filteredRegistrationInvoices" style="width: 100%; table-layout: fixed;" @selection-change="handleRegistrationSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="orderNumber" label="订单号" width="120" />
                  <el-table-column prop="name" label="注册人" width="100" />
                  <el-table-column prop="registrationType" label="注册类型" width="120" />
                  <el-table-column prop="amount" label="发票金额" width="120">
                    <template #default="scope">
                      ¥{{ scope.row.amount }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="开票状态" width="120">
                    <template #default="scope">
                      <el-tag :type="getStatusType(scope.row.status)">
                        {{ scope.row.status }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="requestDate" label="申请时间" width="160" />
                  <el-table-column />
                  <el-table-column label="操作" width="150">
                    <template #default="scope">
                      <el-button 
                        type="text" 
                        @click="handleInvoice(scope.row)"
                        :disabled="scope.row.status === '已开票'"
                      >
                        开具发票
                      </el-button>
                      <el-button 
                        type="text" 
                        @click="viewInvoiceDetails(scope.row)"
                      >
                        查看详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <!-- 酒店发票标签页 -->
            <el-tab-pane label="酒店发票" name="hotelInvoice">
              <div class="invoice-settings">
                <!-- 筛选框和一键开票按钮 -->
                <div class="filter-box">
                  <span class="filter-label">发票状态：</span>
                  <el-select v-model="invoiceStatusFilter" placeholder="请选择发票状态" style="width: 150px;">
                    <el-option label="全部" value="" />
                    <el-option label="已开具" value="已开票" />
                    <el-option label="未开具" value="待开票" />
                    <el-option label="无须开票" value="无须开票" />
                  </el-select>
                  <el-button type="primary" style="margin-left: 15px;" @click="batchHandleInvoice">一键开票</el-button>
                </div>
                
                <el-table :data="filteredHotelInvoices" style="width: 100%; table-layout: fixed;" @selection-change="handleHotelSelectionChange">
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="orderNumber" label="订单号" width="120" />
                  <el-table-column prop="name" label="入住人" width="100" />
                  <el-table-column prop="hotelName" label="酒店名称" width="150" />
                  <el-table-column prop="roomType" label="房型" width="120" />
                  <el-table-column prop="amount" label="发票金额" width="120">
                    <template #default="scope">
                      ¥{{ scope.row.amount }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="status" label="开票状态" width="120">
                    <template #default="scope">
                      <el-tag :type="getStatusType(scope.row.status)">
                        {{ scope.row.status }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="requestDate" label="申请时间" width="160" />
                  <el-table-column />
                  <el-table-column label="操作" width="150">
                    <template #default="scope">
                      <el-button 
                        type="text" 
                        @click="handleInvoice(scope.row)"
                        :disabled="scope.row.status === '已开票'"
                      >
                        开具发票
                      </el-button>
                      <el-button 
                        type="text" 
                        @click="viewInvoiceDetails(scope.row)"
                      >
                        查看详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 财务管理 -->
        <div v-if="activeMenu === 'finance'" class="section">
          <h3>财务管理</h3>
          <p>这里是财务管理页面，您可以管理会议的财务信息。</p>
        </div>

        <!-- 酒店预定 -->
        <div v-if="activeMenu === 'hotel'" class="section">
          <h3>酒店管理</h3>
          <el-tabs v-model="activeHotelTab">
            <el-tab-pane label="酒店列表" name="hotelList">
              <div class="config-container">
                <el-card class="config-card">
                  <div slot="header" class="card-header">
                    <span>酒店列表</span>
                    <div>
                      <el-button type="info" @click="viewAllBookings">查看入住人信息</el-button>
                      <el-button type="primary" @click="addHotel">添加酒店</el-button>
                    </div>
                  </div>
                  <div v-for="hotel in hotels" :key="hotel.id" class="hotel-item">
                    <div class="hotel-header">
                      <div class="hotel-info">
                        <el-image :src="hotel.image" class="hotel-image"></el-image>
                        <div class="hotel-details">
                          <h4>{{ hotel.name }}</h4>
                          <p>预定时间：{{ hotel.bookingStartTime }} ~ {{ hotel.bookingEndTime }}</p>
                          <p v-if="hotel.address">地址：{{ hotel.address }}</p>
                          <p v-if="hotel.description" class="hotel-description">{{ hotel.description }}</p>
                        </div>
                      </div>
                      <div class="hotel-actions">
                        <el-button type="primary" size="small" @click="editHotel(hotel)">编辑</el-button>
                        <el-button type="danger" size="small" @click="deleteHotel(hotel)">删除</el-button>
                      </div>
                    </div>
                    
                    <!-- 房型列表 -->
                    <div class="room-list">
                      <div class="room-header">
                        <span>房型配置</span>
                        <el-button type="primary" size="small" @click="addRoomType(hotel)">添加房型</el-button>
                      </div>
                      <el-table :data="hotel.roomTypes" style="width: 100%">
                        <el-table-column prop="name" label="房型名称" />
                        <el-table-column prop="inventory" label="库存" />
                        <el-table-column prop="booked" label="已定" />
                        <el-table-column prop="status" label="状态">
                          <template #default="scope">
                            <el-tag :type="scope.row.status === '上架' ? 'success' : 'info'">
                              {{ scope.row.status }}
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作">
                          <template #default="scope">
                            <el-button type="text" @click="editRoomType(hotel, scope.row)">编辑</el-button>
                            <el-button type="text" @click="deleteRoomType(hotel, scope.row)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
            <el-tab-pane label="入住信息" name="checkinInfo">
              <div class="checkin-settings">
                <!-- 字段选择器 -->
                <el-select v-model="selectedFields" multiple placeholder="选择显示的字段" style="margin-bottom: 20px; width: 100%;">
                  <el-option
                    v-for="field in availableFields"
                    :key="field.prop"
                    :label="field.label"
                    :value="field.prop"
                  />
                </el-select>

                <!-- 动态表格 -->
                <el-table :data="checkinList" style="width: 100%">
                  <el-table-column prop="orderNumber" label="订单号" width="120" />
                  <el-table-column prop="orderDate" label="下单日期" width="120" />
                  <el-table-column prop="name" label="姓名" width="100" />
                  <el-table-column prop="phone" label="手机号" width="120" />
                  <el-table-column prop="email" label="邮箱" width="150" />
                  <el-table-column prop="checkinDate" label="入住日期" width="120" />
                  <el-table-column prop="checkoutDate" label="退房日期" width="120" />
                  <el-table-column prop="days" label="预定天数" width="100" />
                  <el-table-column prop="invoiceInfo" label="发票信息" width="120">
                    <template #default="scope">
                      <el-tag :type="scope.row.invoiceInfo ? 'success' : 'info'">
                        {{ scope.row.invoiceInfo || '未选择' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="afterSales" label="售后情况" width="120">
                    <template #default="scope">
                      <el-tag :type="getAfterSalesType(scope.row.afterSales)">
                        {{ scope.row.afterSales }}
                      </el-tag>
                      <el-button 
                        v-if="scope.row.afterSales !== '无'"
                        type="text" 
                        @click="viewAfterSalesDetails(scope.row)"
                      >
                        查看详情
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remarks" label="备注" width="150" />
                  <el-table-column label="操作" fixed="right" width="150">
                    <template #default="scope">
                      <el-button type="text" @click="openEditDialog(scope.row)">编辑</el-button>
                      <el-button type="text" @click="deleteCheckin(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 编辑入住信息弹窗 -->
                <el-dialog title="编辑入住信息" :visible.sync="isEditDialogVisible" width="40%">
                  <div class="checkin-detail">
                    <el-form :model="editForm" label-width="100px" label-position="left" class="centered-form">
                      <el-form-item label="入住日期">
                        <el-date-picker 
                          v-model="editForm.checkinDate" 
                          type="date" 
                          placeholder="选择入住日期"
                          value-format="yyyy-MM-dd"
                        />
                      </el-form-item>
                      <el-form-item label="退房日期">
                        <el-date-picker 
                          v-model="editForm.checkoutDate" 
                          type="date" 
                          placeholder="选择退房日期"
                          value-format="yyyy-MM-dd"
                        />
                      </el-form-item>
                      <el-form-item label="发票信息">
                        <el-select v-model="editForm.invoiceInfo" placeholder="请选择发票类型">
                          <el-option label="电子发票" value="电子发票" />
                          <el-option label="纸质发票" value="纸质发票" />
                        </el-select>
                      </el-form-item>
                      <el-form-item label="备注">
                        <el-input type="textarea" v-model="editForm.remarks" placeholder="请输入备注" rows="3" />
                      </el-form-item>
                    </el-form>
                  </div>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="isEditDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveEdit">保存</el-button>
                  </span>
                </el-dialog>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 签到管理 -->
        <div v-if="activeMenu === 'checkin'" class="section">
          <h3>签到管理</h3>
          <p>这里是签到管理页面，您可以管理会议的签到信息。</p>
        </div>

        <!-- 注册管理 -->
        <div v-if="activeMenu === 'registration'" class="section">
          <h3>注册管理</h3>
          <p>这里是注册管理页面，您可以管理会议的注册信息。</p>
        </div>

        <!-- 胸卡打印配置 -->
        <div v-if="activeMenu === 'badge'" class="section">
          <h3>胸卡打印配置</h3>
          <div class="config-container">
            <!-- 模板管理 -->
            <el-card class="config-card">
              <div slot="header" class="card-header">
                <span>模板管理</span>
                <el-button type="primary" @click="openTemplateEditor">上传模板</el-button>
              </div>
              <el-tabs v-model="activeTemplateTab">
                <el-tab-pane label="基础款" name="basic">
                  <el-table :data="templates.filter(t => t.type === 'basic')" style="width: 100%">
                    <el-table-column prop="name" label="模板名称" />
                    <el-table-column prop="size" label="胸卡尺寸">
                      <template #default="scope">
                        <span v-if="scope.row.size === 'a4'">A4 (210x297mm)</span>
                        <span v-else-if="scope.row.size === 'id1'">ID-1 (85.6x54mm)</span>
                        <span v-else-if="scope.row.size === 'custom'">
                          {{ scope.row.customWidth }}×{{ scope.row.customHeight }}mm
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="namePosition" label="姓名位置">
                      <template #default="scope">
                        <span v-if="scope.row.namePosition === 'center'">居中</span>
                        <span v-else-if="scope.row.namePosition === 'bottom'">在图片底部</span>
                        <span v-else>-</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="背景图片">
                      <template #default="scope">
                        <el-image
                          v-if="scope.row.backgroundImage"
                          :src="scope.row.backgroundImage"
                          style="width: 50px; height: 30px;"
                          :preview-src-list="[scope.row.backgroundImage]"
                        ></el-image>
                        <span v-else>-</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button type="text" @click="editTemplate(scope.row)">编辑</el-button>
                        <el-button type="text" @click="deleteTemplate(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="VIP款" name="vip">
                  <el-table :data="templates.filter(t => t.type === 'vip')" style="width: 100%">
                    <el-table-column prop="name" label="模板名称" />
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button type="text" @click="editTemplate(scope.row)">编辑</el-button>
                        <el-button type="text" @click="deleteTemplate(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="媒体款" name="media">
                  <el-table :data="templates.filter(t => t.type === 'media')" style="width: 100%">
                    <el-table-column prop="name" label="模板名称" />
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button type="text" @click="editTemplate(scope.row)">编辑</el-button>
                        <el-button type="text" @click="deleteTemplate(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-card>

            <!-- 胸牌生成 -->
            <el-card class="config-card">
              <div slot="header" class="card-header">
                <span>胸牌生成</span>
              </div>
              <el-form :model="badgeConfig" label-width="120px" label-position="left" class="centered-form">
                <el-form-item label="生成条件">
                  <el-checkbox-group v-model="badgeConfig.filters">
                    <el-checkbox label="已签到用户" />
                    <el-checkbox label="已缴费用户" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="生成模式">
                  <el-radio-group v-model="badgeConfig.mode">
                    <el-radio label="快速生成">快速生成</el-radio>
                    <el-radio label="定制生成">定制生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="输出格式">
                  <el-select v-model="badgeConfig.format" placeholder="请选择输出格式">
                    <el-option label="PDF" value="pdf" />
                    <el-option label="PNG" value="png" />
                    <el-option label="JPG" value="jpg" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateBadges">生成胸牌</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>

        <!-- 报名信息管理 -->
        <div v-if="activeMenu === 'signup'" class="section">
          <h3>报名信息管理</h3>
          <div class="config-container">
            <!-- 报名与缴费配置 -->
            <el-card class="config-card">
              <div slot="header" class="card-header">
                <span>报名与缴费配置</span>
              </div>
              <el-form :model="signupConfig" label-width="120px" label-position="left" class="centered-form">
                <!-- 报名时间配置 -->
                <el-form-item label="报名开始时间">
                  <el-date-picker v-model="signupConfig.start" type="datetime" placeholder="选择开始时间" />
                </el-form-item>
                <el-form-item label="报名结束时间">
                  <el-date-picker v-model="signupConfig.end" type="datetime" placeholder="选择结束时间" />
                </el-form-item>

                <!-- 报名表单收集设置按钮 -->
                <el-form-item label="报名表单收集">
                  <el-button type="primary" @click="goToFormSettings">报名表单收集设置</el-button>
                </el-form-item>

                <!-- 缴费链接配置 -->
                <el-form-item label="缴费链接">
                  <el-input v-model="signupConfig.paymentLink" placeholder="请输入缴费链接" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="testPaymentLink">测试链接</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <!-- 门票类型配置 -->
            <el-card class="config-card">
              <div slot="header" class="card-header">
                <span>门票类型配置</span>
                <el-button type="primary" @click="openTicketTypeForm">添加门票类型</el-button>
              </div>
              <el-table :data="ticketTypes" style="width: 100%">
                <el-table-column prop="name" label="门票名称" />
                <el-table-column prop="price" label="价格" />
                <el-table-column prop="discountPrice" label="优惠价格" />
                <el-table-column prop="discountStart" label="优惠开始时间" :formatter="formatDateTime" />
                <el-table-column prop="discountEnd" label="优惠结束时间" :formatter="formatDateTime" />
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button type="text" @click="editTicketType(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteTicketType(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>

        <!-- 会议网站列表 -->
        <div v-if="activeMenu === 'websites'" class="section">
          <div class="website-list-container">
            <div class="steps-container">
              <div class="custom-steps">
                <div class="custom-step" :class="{ active: currentStep === 0, completed: currentStep > 0 }">
                  <div class="step-number">1</div>
                  <div class="step-title">网站设置</div>
                </div>
                <div class="custom-step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
                  <div class="step-number">2</div>
                  <div class="step-title">导航栏设置</div>
                </div>
                <div class="custom-step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
                  <div class="step-number">3</div>
                  <div class="step-title">发布</div>
                </div>
              </div>
            </div>
            <el-card class="form-card">
              <el-form 
                ref="websiteForm" 
                :model="websiteForm" 
                label-position="left"
                label-width="120px"
                @submit.native.prevent="handleWebsiteSubmit"
                :rules="websiteFormRules"
                class="website-form centered-form"
              >
                <!-- 网站开关 -->
                <el-form-item 
                  label="会议开关" 
                  prop="open"
                >
                  <el-switch v-model="websiteForm.open"></el-switch>
                </el-form-item>

                <!-- 会议名称 -->
                <el-form-item 
                  label="会议名称" 
                  prop="title"
                >
                  <el-input v-model="websiteForm.title" placeholder="请输入会议名称"></el-input>
                </el-form-item>

                <!-- URL链接 -->
                <el-form-item 
                  label="URL链接" 
                  prop="url"
                >
                  <div class="url-input-group">
                    <el-input v-model="websiteForm.url" placeholder="请输入URL链接"></el-input>
                    <el-button type="primary" @click="handleGenerateUrl">生成URL</el-button>
                  </div>
                </el-form-item>

                <!-- 会议类型 -->
                <el-form-item 
                  label="会议类型" 
                  prop="type"
                >
                  <el-input v-model="websiteForm.type" placeholder="请输入会议类型"></el-input>
                </el-form-item>

                <!-- 描述 -->
                <el-form-item 
                  label="描述" 
                  prop="description"
                >
                  <el-input 
                    type="textarea" 
                    v-model="websiteForm.description" 
                    placeholder="请输入会议文本描述" 
                    :rows="4"
                    show-word-limit
                    maxlength="100"
                  ></el-input>
                </el-form-item>

                <!-- 会议地址 -->
                <el-form-item 
                  label="会议地址" 
                  prop="address"
                >
                  <el-input v-model="websiteForm.address" placeholder="请输入会议地址"></el-input>
                </el-form-item>

                <!-- 会议时间 -->
                <el-form-item 
                  label="会议时间"
                >
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item prop="startTime">
                        <el-date-picker
                          v-model="websiteForm.startTime"
                          type="datetime"
                          placeholder="开始时间"
                          style="width: 100%"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="endTime">
                        <el-date-picker
                          v-model="websiteForm.endTime"
                          type="datetime"
                          placeholder="结束时间"
                          style="width: 100%"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>

                <!-- 选择模板 -->
                <el-form-item 
                  label="选择模板" 
                  prop="template"
                >
                  <el-select v-model="websiteForm.template" placeholder="请选择模板">
                    <el-option label="模板1" value="template1"></el-option>
                    <el-option label="模板2" value="template2"></el-option>
                  </el-select>
                </el-form-item>

                <!-- 登记时间范围 -->
                <el-form-item 
                  label="登记时间范围"
                >
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <el-form-item prop="registerStartTime">
                        <el-date-picker
                          v-model="websiteForm.registerStartTime"
                          type="datetime"
                          placeholder="开始时间"
                          style="width: 100%"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="registerEndTime">
                        <el-date-picker
                          v-model="websiteForm.registerEndTime"
                          type="datetime"
                          placeholder="结束时间"
                          style="width: 100%"
                        ></el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>

                <!-- 允许到场方式 -->
                <el-form-item 
                  label="允许到场方式" 
                  prop="attendanceType"
                >
                  <el-radio-group v-model="websiteForm.attendanceType">
                    <el-radio label="offline">二维码</el-radio>
                    <el-radio label="online">手动输入</el-radio>
                  </el-radio-group>
                </el-form-item>

                <!-- 提交按钮 -->
                <el-form-item class="submit-buttons">
                  <el-button v-if="currentStep > 0" @click="handlePrevStep">上一步</el-button>
                  <el-button v-if="currentStep < 2" type="primary" native-type="submit">下一步</el-button>
                  <el-button v-if="currentStep === 2" type="success" @click="submitFinalStep">发布网站</el-button>
                  <el-button @click="cancelForm">取消</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
        <!-- 用户报名管理 -->
        <div v-if="activeMenu === 'registrationmanage'" class="section">
          <div class="registration-container">
            <el-card class="registration-card">
              <el-form
                ref="registrationForm"
                :model="registrationForm"
                label-position="left"
                label-width="120px"
                @submit.native.prevent 
                :rules="registrationFormRules"
                class="registration-form centered-form"
              >
                <el-form-item
                  label="姓名"
                  prop="name"
                  required
                >
                  <el-input v-model="registrationForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>

                <el-form-item
                  label="性别"
                  prop="gender"
                  required
                >
                  <el-radio-group v-model="registrationForm.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="手机"
                  prop="phone"
                  required
                >
                  <el-input v-model="registrationForm.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                <el-form-item
                  label="单位"
                  prop="organization"
                  required
                >
                  <el-input v-model="registrationForm.organization" placeholder="请输入单位"></el-input>
                </el-form-item>

                <el-form-item
                  label="职称"
                  prop="title"
                >
                  <el-input type="textarea" :rows="4" v-model="registrationForm.title" placeholder="请输入职称"></el-input>
                </el-form-item>

                <el-form-item
                  label="报告分会场"
                  prop="venue"
                  required
                >
                  <div class="venue-item">
                    <el-select v-model="registrationForm.venue" placeholder="请选择分会场" style="width: 100%">
                      <el-option label="分会场1" value="venue1"></el-option>
                      <el-option label="分会场2" value="venue2"></el-option>
                      <el-option label="分会场3" value="venue3"></el-option>
                    </el-select>
                    <div class="operation-buttons">
                      <div class="button" @click="handleAdd">
                        <i class="el-icon-plus"></i>
                      </div>
                      <div class="button" @click="handleEdit">
                        <i class="el-icon-edit"></i>
                      </div>
                      <div class="button" @click="handleDelete">
                        <i class="el-icon-delete"></i>
                      </div>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item
                  label="分会场报告申请"
                  prop="reportTitle"
                  required
                >
                  <el-radio-group v-model="registrationForm.reportTitle">
                    <el-radio label="yes">是</el-radio>
                    <el-radio label="no">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <div class="section-block">
                  <div class="section-title">上传附件信息（建议：请事后再填写200字以内的个人简介）</div>
                  <div class="upload-area">
                    <el-upload
                      action="#"
                      :auto-upload="false"
                      :limit="5"
                      multiple
                      :file-list="fileList"
                    >
                      <el-button slot="trigger" type="primary">选取文件</el-button>
                      <div slot="tip" class="el-upload__tip">支持的格式：txt, pdf, doc, docx, xls, xlsx, ppt, pptx, zip, rar</div>
                    </el-upload>
                  </div>
                </div>

                <el-form-item
                  label="是否需要开票"
                  prop="needInvoice"
                  required
                >
                  <el-radio-group v-model="registrationForm.needInvoice">
                    <el-radio label="yes">是</el-radio>
                    <el-radio label="no">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="发票抬头"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle" ></el-input>
                </el-form-item>
                <el-form-item
                  label="抬头名称"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle"></el-input>
                </el-form-item>

                <el-form-item
                  label="纳税人识别号"
                  prop="taxId"
                  
                >
                  <el-input v-model="registrationForm.taxId" ></el-input>
                </el-form-item>
               
                <el-form-item
                  label="开户行"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item
                  label="公司/单位/个人电话"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item
                  label="公司/单位/个人地址"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item
                  label="收票人姓名"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item
                  label="收票人手机"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item
                  label="收票人邮箱"
                  prop="invoiceTitle"
                  
                >
                  <el-input v-model="registrationForm.invoiceTitle"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="saveRegistrationForm">保存</el-button>
                  <el-button @click="resetRegistrationForm">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
        <!--会议数据 -->
        <div v-if="activeMenu === 'userinfo'" class="section">
          <div class="user-info-container">
            <!-- 统计卡片 -->
            <el-row :gutter="20" class="stats-row">
              <el-col :span="4" :xs="12" :sm="12" :md="8" :lg="4">
                <el-card class="stat-card blue-card">
                  <div class="stat-title">总参会人数</div>
                  <div class="stat-value blue-value">1,286</div>
                  <div class="stat-description">较上周增长 12%</div>
                </el-card>
              </el-col>
              <el-col :span="4" :xs="12" :sm="12" :md="8" :lg="4">
                <el-card class="stat-card green-card">
                  <div class="stat-title">缴费完成率</div>
                  <div class="stat-value green-value">86%</div>
                  <div class="stat-description">已缴费 1,106 人</div>
                </el-card>
              </el-col>
              <el-col :span="4" :xs="12" :sm="12" :md="8" :lg="4">
                <el-card class="stat-card yellow-card">
                  <div class="stat-title">签到率</div>
                  <div class="stat-value yellow-value">78%</div>
                  <div class="stat-description">已签到 1,003 人</div>
                </el-card>
              </el-col>
              <el-col :span="4" :xs="12" :sm="12" :md="8" :lg="4">
                <el-card class="stat-card purple-card">
                  <div class="stat-title">发票申请率</div>
                  <div class="stat-value purple-value">65%</div>
                  <div class="stat-description">已申请 836 人</div>
                </el-card>
              </el-col>
              <el-col :span="4" :xs="12" :sm="12" :md="8" :lg="4">
                <el-card class="stat-card blue-card">
                  <div class="stat-title">收入总金额</div>
                  <div class="stat-value blue-value">1,286 ¥</div>
                  <div class="stat-description">较上周增长 12%</div>
                </el-card>
              </el-col>
            </el-row>
            
            <!-- 图表区域 -->
            <el-row :gutter="20" class="charts-row">
              <el-col :span="12" :xs="24" :lg="12">
                <el-card class="chart-card">
                  <div class="chart-title">参会团队分布</div>
                  <div class="chart-container" ref="pieChart"></div>
                </el-card>
              </el-col>
              <el-col :span="12" :xs="24" :lg="12">
                <el-card class="chart-card">
                  <div class="chart-title">缴费状态分布</div>
                  <div class="chart-container" ref="barChart"></div>
                </el-card>
              </el-col>
            </el-row>
            
            <!-- 表格工具栏 -->
            <div class="table-tools">
              <div class="search-bar">
                <el-input
                  placeholder="搜索姓名、账号、手机号等"
                  v-model="searchText"
                  @change="handleSearch"
                  prefix-icon="el-icon-search"
                  style="width: 300px"
                >
                </el-input>
              </div>
              <div class="filter-buttons">
                <el-dropdown @command="handlePaymentFilter" trigger="click">
                  <el-button icon="el-icon-s-operation">
                    缴费状态<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="">全部</el-dropdown-item>
                    <el-dropdown-item command="已缴费">已缴费</el-dropdown-item>
                    <el-dropdown-item command="未缴费">未缴费</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                
                <el-dropdown @command="handleSignInFilter" trigger="click">
                  <el-button icon="el-icon-check">
                    签到状态<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="">全部</el-dropdown-item>
                    <el-dropdown-item command="已签到">已签到</el-dropdown-item>
                    <el-dropdown-item command="未签到">未签到</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                
                <el-dropdown @command="handleTeamFilter" trigger="click">
                  <el-button icon="el-icon-user">
                    团队筛选<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="">全部</el-dropdown-item>
                    <el-dropdown-item command="团队A">团队A</el-dropdown-item>
                    <el-dropdown-item command="团队B">团队B</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                
                <el-button type="primary" icon="el-icon-download" @click="exportUserData">导出数据</el-button>
              </div>
            </div>
            
            <!-- 用户表格 -->
            <el-card class="table-card" :body-style="{ padding: 0 }">
              <el-table
                :data="filteredUserData"
                border
                stripe
                style="width: 100%"
              >
                <el-table-column prop="id" label="用户名" width="180"></el-table-column>
                <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                <el-table-column prop="team" label="所属团队" width="120"></el-table-column>
                <el-table-column prop="contact" label="联系方式" width="200"></el-table-column>
                <el-table-column prop="registerTime" label="注册时间" width="180"></el-table-column>
                <el-table-column label="缴费状态" width="100">
                  <template slot-scope="scope">
                    <el-tag :type="getTagType(scope.row.paymentStatus)">{{ scope.row.paymentStatus }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="发票状态" width="100">
                  <template slot-scope="scope">
                    <el-tag :type="getTagType(scope.row.invoiceStatus)">{{ scope.row.invoiceStatus }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="签到状态" width="100">
                  <template slot-scope="scope">
                    <el-tag :type="getTagType(scope.row.signInStatus)">{{ scope.row.signInStatus }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" @click="viewUserDetails(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </div>
        <!-- 个人中心 -->
        <div v-if="activeMenu === 'profile'" class="section">
          
          <!-- 内容区域 -->
          <div class="content-container">
            <!-- 个人信息卡片 -->
            <el-card class="info-card">
              <div class="info-header">
                <div class="avatar-section">
                  <div class="avatar">
                    <img src="/avatar-placeholder.png" alt="用户头像" />
                  </div>
                </div>
                <div class="info-section">
                  <div class="info-row">
                    <div class="info-item">
                      <span class="info-label">姓名：</span>
                      <span class="info-value">{{ userProfileInfo.name }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">性别：</span>
                      <span class="info-value">{{ userProfileInfo.gender }}</span>
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-item">
                      <span class="info-label">手机号码：</span>
                      <span class="info-value">{{ userProfileInfo.phone }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">电子邮箱：</span>
                      <span class="info-value">{{ userProfileInfo.email }}</span>
                    </div>
                  </div>
                  <div class="info-row">
                    <div class="info-item">
                      <span class="info-label">身份证号：</span>
                      <span class="info-value">{{ userProfileInfo.idNumber }}</span>
                    </div>
                  </div>
                </div>
                <div class="edit-button-wrapper">
                  <el-button 
                    icon="el-icon-edit" 
                    class="edit-button"
                    @click="editUserProfile"
                  >
                    编辑
                  </el-button>
                </div>
              </div>
            </el-card>
            
            <!-- 标签页和表格 -->
            <el-card class="tabs-card">
              <el-tabs v-model="activeProfileTab" @tab-click="handleProfileTabChange">
                <el-tab-pane label="缴费状态" name="1">
                  <el-table 
                    :data="meetingData" 
                    class="meeting-table"
                    :stripe="true"
                    border
                  >
                    <el-table-column 
                      prop="name" 
                      label="会议名称" 
                      width="30%" 
                      :show-overflow-tooltip="true"
                    />
                    <el-table-column 
                      prop="amount" 
                      label="缴费金额" 
                    />
                    <el-table-column 
                      prop="status" 
                      label="状态" 
                    >
                      <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '待支付' ? 'warning' : 'success'">
                          {{ scope.row.status }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column 
                      prop="time" 
                      label="支付时间" 
                    />
                    <el-table-column 
                      prop="operation" 
                      label="操作" 
                    >
                      <template slot-scope="scope">
                        <el-button v-if="scope.row.operation" type="text" size="small">
                          {{ scope.row.operation }}
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="pagination-container">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[5, 10, 20, 50]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="meetingData.length">
                    </el-pagination>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="历史记录" name="2">
                  <el-table 
                    :data="meetingData" 
                    class="meeting-table"
                    :stripe="true"
                  >
                    <el-table-column 
                      prop="name" 
                      label="会议名称" 
                      width="30%" 
                      :show-overflow-tooltip="true"
                    />
                    <el-table-column 
                      prop="amount" 
                      label="缴费金额" 
                    />
                    <el-table-column 
                      prop="status" 
                      label="状态" 
                    >
                      <template slot-scope="scope">
                        <el-tag :type="scope.row.status === '待支付' ? 'warning' : 'success'">
                          {{ scope.row.status }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column 
                      prop="time" 
                      label="支付时间" 
                    />
                    <el-table-column 
                      prop="operation" 
                      label="操作" 
                    >
                      <template slot-scope="scope">
                        <el-button v-if="scope.row.operation" type="text" size="small">
                          {{ scope.row.operation }}
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="pagination-container">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[5, 10, 20, 50]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="meetingData.length">
                    </el-pagination>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </div>
        
      </div>
    </div>

    <!-- 添加门票类型弹窗 -->
    <el-dialog title="添加门票类型" :visible.sync="isTicketTypeFormVisible" width="30%">
      <el-form :model="ticketTypeForm" label-width="100px" label-position="left" class="centered-form">
        <el-form-item label="门票名称">
          <el-input v-model="ticketTypeForm.name" placeholder="请输入门票名称" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="ticketTypeForm.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="优惠价格">
          <el-input v-model="ticketTypeForm.discountPrice" placeholder="请输入优惠价格" />
        </el-form-item>
        <el-form-item label="优惠开始时间">
          <el-date-picker
            v-model="ticketTypeForm.discountStart"
            type="datetime"
            placeholder="选择优惠开始时间"
          />
        </el-form-item>
        <el-form-item label="优惠结束时间">
          <el-date-picker
            v-model="ticketTypeForm.discountEnd"
            type="datetime"
            placeholder="选择优惠结束时间"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isTicketTypeFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTicketType">保存</el-button>
      </span>
    </el-dialog>

    <!-- 编辑模板弹窗 -->
    <el-dialog title="编辑模板" :visible.sync="isTemplateEditorVisible" width="50%">
      <el-form :model="templateForm" label-width="120px" label-position="left" class="centered-form">
        <!-- 模板名称和胸卡尺寸 -->
        <el-row :gutter="20">
          <el-col :span="12">
        <el-form-item label="模板名称">
          <el-input v-model="templateForm.name" placeholder="请输入模板名称" />
        </el-form-item>
          </el-col>
          <el-col :span="12">
        <el-form-item label="胸卡尺寸">
          <el-select v-model="templateForm.size" placeholder="请选择胸卡尺寸">
            <el-option label="A4 (210x297mm)" value="a4" />
            <el-option label="ID-1 (85.6x54mm)" value="id1" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>

        <!-- 自定义尺寸 -->
        <el-row v-if="templateForm.size === 'custom'" :gutter="20">
          <el-col :span="12">
            <el-form-item label="宽度">
              <el-input v-model="templateForm.customWidth" placeholder="请输入宽度">
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="高度">
              <el-input v-model="templateForm.customHeight" placeholder="请输入高度">
                <template slot="append">mm</template>
              </el-input>
            </el-form-item>
            </el-col>
          </el-row>

        <!-- 姓名放置位置 -->
        <el-row :gutter="20">
          <el-col :span="24">
        <el-form-item label="姓名放置位置">
          <el-radio-group v-model="templateForm.namePosition">
            <el-radio label="center">居中</el-radio>
            <el-radio label="bottom">在图片底部</el-radio>
          </el-radio-group>
        </el-form-item>
          </el-col>
        </el-row>

        <!-- 背景图片 -->
        <el-row :gutter="20">
          <el-col :span="24">
        <el-form-item label="背景图片">
          <el-radio-group v-model="templateForm.backgroundImage">
            <el-radio v-for="bg in presetBackgrounds" :key="bg.id" :label="bg.url">
              <el-image :src="bg.url" style="width: 80px; height: 50px; margin-right: 10px;" />
              <span>{{ bg.name }}</span>
            </el-radio>
          </el-radio-group>
          <el-upload
            action="#"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess"
            :auto-upload="false"
            :file-list="fileList"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
          </el-upload>
        </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isTemplateEditorVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTemplate">保存</el-button>
      </span>
    </el-dialog>

    <!-- 添加/编辑酒店弹窗 -->
    <el-dialog :title="hotelFormTitle" :visible.sync="isHotelFormVisible" width="50%">
      <el-form :model="hotelForm" label-width="120px" label-position="left" :rules="hotelFormRules" ref="hotelForm" class="centered-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="酒店名称" prop="name">
              <el-input v-model="hotelForm.name" placeholder="请输入酒店名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="预定开始时间" prop="bookingStartTime">
              <el-date-picker
                v-model="hotelForm.bookingStartTime"
                type="date"
                placeholder="选择预定开始时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预定结束时间" prop="bookingEndTime">
              <el-date-picker
                v-model="hotelForm.bookingEndTime"
                type="date"
                placeholder="选择预定结束时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="酒店图片" prop="image">
              <el-upload
                action="#"
                :before-upload="handleHotelImageUpload"
                :on-success="handleHotelImageSuccess"
                :auto-upload="false"
                :file-list="hotelImageList"
                list-type="picture-card"
              >
                <i class="el-icon-plus"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="酒店描述">
              <el-input type="textarea" v-model="hotelForm.description" placeholder="请输入酒店描述" rows="4" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="酒店地址">
              <el-input v-model="hotelForm.address" placeholder="请输入酒店地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isHotelFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveHotel">保存</el-button>
      </span>
    </el-dialog>

    <!-- 添加插入字段弹窗 -->
    <el-dialog title="插入字段" :visible.sync="insertFieldDialogVisible" width="50%">
      <div class="field-dialog-header">
        <el-input 
          placeholder="搜索" 
          prefix-icon="el-icon-search" 
          v-model="fieldSearchText"
          clearable
          class="field-search-input">
        </el-input>
      </div>
      
      <el-collapse v-model="activeCollapseNames">
        <!-- 基本信息字段 -->
        <el-collapse-item name="basicInfo">
          <template slot="title">
            <div class="collapse-title">
              <span>基本信息 (48)</span>
              <div class="collapse-actions">
                <i class="el-icon-edit" @click.stop="openCustomGroupDialog"></i>
                <i class="el-icon-arrow-up"></i>
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
          </template>
          
          <div class="field-grid">
            <div 
              v-for="field in filteredBasicFields" 
              :key="field.value"
              class="field-item"
              :class="{ 'field-selected': selectedFields.includes(field.value) }"
              @click="toggleFieldSelection(field.value)">
              {{ field.label }}
              <i v-if="selectedFields.includes(field.value)" class="el-icon-check"></i>
            </div>
          </div>
        </el-collapse-item>
        
        <!-- 自定义字段 -->
        <el-collapse-item name="customFields">
          <template slot="title">
            <div class="collapse-title">
              <span>自定义字段</span>
              <div class="collapse-help">
                <i class="el-icon-question"></i>
              </div>
            </div>
          </template>
          
          <div class="field-grid">
            <div 
              v-for="field in customFieldTypes" 
              :key="field.value"
              class="field-item"
              @click="addCustomField(field.value)">
              {{ field.label }}
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="insertFieldDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddFields">确定</el-button>
      </span>
    </el-dialog>
    
    <!-- 添加自定义字段弹窗 -->
    <el-dialog title="添加自定义字段" :visible.sync="customFieldDialogVisible" width="30%">
      <el-form :model="customFieldForm" label-width="100px" :rules="customFieldRules" ref="customFieldForm">
        <el-form-item label="字段名称" prop="name" required>
          <el-input v-model="customFieldForm.name" placeholder="请输入字段名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customFieldDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCustomField">确定</el-button>
      </span>
    </el-dialog>

    <!-- 添加自定义分组弹窗 -->
    <el-dialog title="添加自定义字段" :visible.sync="customGroupDialogVisible" width="30%">
      <el-form :model="customGroupForm" label-width="100px" :rules="customGroupRules" ref="customGroupForm">
        <el-form-item label="字段名称" prop="name" required>
          <el-input v-model="customGroupForm.name" placeholder="请输入字段名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="customGroupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCustomGroup">确定</el-button>
      </span>
    </el-dialog>
    
    <!-- 编辑字段侧边栏 -->
    <el-drawer
      title="编辑字段"
      :visible.sync="editFieldDrawerVisible"
      direction="rtl"
      size="30%"
      :before-close="handleEditFieldDrawerClose">
      <div class="edit-field-container">
        <el-form :model="editFieldForm" label-width="80px">
          <el-form-item label="显示名称">
            <el-input v-model="editFieldForm.displayName" placeholder="请输入显示名称"></el-input>
          </el-form-item>
          
          <el-form-item label="占位文字">
            <el-input v-model="editFieldForm.placeholder" placeholder="请输入占位文字"></el-input>
          </el-form-item>
          
          <el-form-item label="描述">
            <el-input type="textarea" v-model="editFieldForm.description" placeholder="请输入描述"></el-input>
          </el-form-item>
          
          <el-form-item label="选项">
            <div class="option-item">
              <div class="option-label">
                <i class="el-icon-plus"></i>
                <span>个人</span>
              </div>
              <i class="el-icon-view"></i>
            </div>
            
            <div class="option-item">
              <div class="option-label">
                <i class="el-icon-plus"></i>
                <span>公司/单位</span>
              </div>
              <i class="el-icon-view"></i>
            </div>
          </el-form-item>
          
          <el-form-item label="必填">
            <el-switch v-model="editFieldForm.required"></el-switch>
          </el-form-item>
        </el-form>
        
        <div class="drawer-footer">
          <el-button @click="editFieldDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEditField">保存</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 在所有el-dialog后添加删除确认弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteConfirmVisible"
      width="30%"
      center>
      <div class="delete-confirm-content">
        <i class="el-icon-warning-outline warning-icon"></i>
        <span>确认删除?</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete">确定</el-button>
      </span>
    </el-dialog>

    <!-- 报名表单收集设置弹窗 -->
    <el-dialog
      title="报名表单收集设置"
      :visible.sync="formSettingsDialogVisible"
      width="70%"
      :before-close="handleFormSettingsClose">
      <div class="form-settings-container">
        <div class="form-fields-header">
          <h3>表单字段管理</h3>
          <el-button type="primary" size="small" @click="addNewField">添加字段</el-button>
        </div>
        
        <el-table
          :data="formFields"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="字段名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="type"
            label="字段类型"
            width="120">
            <template slot-scope="scope">
              {{ getFieldTypeName(scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="required"
            label="是否必填"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.required ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :disabled="scope.row.isBasic"
                @click="handleEditField(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                :disabled="scope.row.isBasic"
                @click="handleDeleteField(scope.row)">删除</el-button>
              <el-button
                size="mini"
                type="info"
                @click="moveFieldUp(scope.$index)" 
                :disabled="scope.$index === 0">上移</el-button>
              <el-button
                size="mini"
                type="info"
                @click="moveFieldDown(scope.$index)"
                :disabled="scope.$index === formFields.length - 1">下移</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="formSettingsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveFormSettings">保存设置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入echarts库
import * as echarts from 'echarts';
// 在script部分导入auth.js中的logout方法
import { logout } from '@/api/auth';

export default {
  name: 'MeetingDetailSettings',
  data() {
    return {
      meetingId: this.$route.params.id,
      activeMenu: 'website',
      activeStep: 1,  // 添加这一行来控制当前步骤
      // 初始化meetingData避免undefined错误
      meetingData: {
        websiteStatus: 'draft',
        websiteViews: 0,
        websiteLastUpdate: '',
        name: '测试会议',
        ticketTypes: []
      },
      // 其他缺少的数据
      unreadCount: 0,
      isTicketTypeFormVisible: false,
      ticketTypeForm: {
        name: '',
        price: 0,
        description: '',
        quota: 100,
        startDate: '',
        endDate: ''
      },
      activeInvoiceTab: 'registrationInvoice',
      activeHotelTab: 'hotelList',
      invoiceStatusFilter: '',
      selectedRegistrationInvoices: [],
      selectedHotelInvoices: [],
      // 初始化发票数据
      registrationInvoices: [
        {
          orderNumber: 'REG20230001',
          name: '张三',
          registrationType: '普通票',
          amount: 199,
          status: '待开票',
          requestDate: '2023-05-15 10:30:00'
        },
        {
          orderNumber: 'REG20230002',
          name: '李四',
          registrationType: 'VIP票',
          amount: 599,
          status: '已开票',
          requestDate: '2023-05-16 14:20:00'
        }
      ],
      hotelInvoices: [
        {
          orderNumber: 'HOTEL20230001',
          name: '王五',
          hotelName: '皇冠假日酒店',
          roomType: '标准间',
          amount: 688,
          status: '待开票',
          requestDate: '2023-05-18 09:15:00'
        }
      ],
      templates: [
        { name: '基础款', type: 'basic' },
        { name: 'VIP款', type: 'vip' },
        { name: '媒体款', type: 'media' },
      ],
      badgeConfig: {
        filters: [],
        mode: '快速生成',
        format: 'pdf',
      },
      activeTemplateTab: 'basic',
      isTemplateEditorVisible: false,
      templateForm: {
        name: '',
        type: 'basic',
        size: 'a4',
        customWidth: '',
        customHeight: '',
        backgroundImage: '',
        namePosition: 'center',
      },
      fileList: [],
      presetBackgrounds: [
        {
          id: 1,
          name: '背景1',
          url: '/images/胸卡背景1.jpg',
        },
        {
          id: 2,
          name: '背景2',
          url: '/images/胸卡背景2.jpg',
        },
        {
          id: 3,
          name: '背景3',
          url: '/images/胸卡背景3.jpg',
        },
      ],
      hotels: [
        {
          id: 1,
          name: '维多利亚大酒店',
          image: '/images/hotel1.jpg',
          bookingStartTime: '2024-03-01',
          bookingEndTime: '2024-03-10',
          roomTypes: [
            {
              id: 1,
              name: '标准间',
              inventory: 50,
              booked: 20,
              status: '上架',
            },
            {
              id: 2,
              name: '豪华套房',
              inventory: 20,
              booked: 5,
              status: '上架',
            },
          ],
        },
        {
          id: 2,
          name: '皇冠假日酒店',
          image: '/images/hotel2.jpg',
          bookingStartTime: '2024-03-01',
          bookingEndTime: '2024-03-15',
          roomTypes: [
            {
              id: 1,
              name: '高级大床房',
              inventory: 30,
              booked: 15,
              status: '上架',
            },
            {
              id: 2,
              name: '商务套房',
              inventory: 10,
              booked: 3,
              status: '下架',
            },
          ],
        },
      ],
      isHotelFormVisible: false,
      hotelForm: {
        id: null,
        name: '',
        bookingStartTime: '',
        bookingEndTime: '',
        image: '',
        description: '',
        address: '',
        roomTypes: [],
      },
      hotelImageList: [],
      hotelFormRules: {
        name: [{ required: true, message: '请输入酒店名称', trigger: 'blur' }],
        bookingStartTime: [{ required: true, message: '请选择预定开始时间', trigger: 'change' }],
        bookingEndTime: [{ required: true, message: '请选择预定结束时间', trigger: 'change' }],
      },
      hotelFormTitle: '添加酒店',
      checkinList: [
        {
          orderNumber: 'ORD123456',
          orderDate: '2024-03-01',
          name: '张三',
          phone: '13800138000',
          email: 'zhangsan@example.com',
          checkinDate: '2024-03-05',
          checkoutDate: '2024-03-07',
          days: 2,
          invoiceRequired: true,
          invoiceInfo: '电子发票',
          afterSales: '无',
          remarks: '',
        },
        {
          orderNumber: 'ORD234567',
          orderDate: '2024-03-01',
          name: '李四',
          phone: '13900139000',
          email: 'lisi@example.com',
          checkinDate: '2024-03-06',
          checkoutDate: '2024-03-09',
          days: 3,
          invoiceRequired: true,
          invoiceInfo: '纸质发票',
          afterSales: '已处理',
          remarks: '客人要求安排靠窗房间',
        },
        {
          orderNumber: 'ORD345678',
          orderDate: '2024-03-02',
          name: '王五',
          phone: '13700137000',
          email: 'wangwu@example.com',
          checkinDate: '2024-03-10',
          checkoutDate: '2024-03-15',
          days: 5,
          invoiceRequired: false,
          invoiceInfo: '',
          afterSales: '无',
          remarks: '客人晚上10点后到达',
        },
        {
          orderNumber: 'ORD456789',
          orderDate: '2024-03-02',
          name: '赵六',
          phone: '13600136000',
          email: 'zhaoliu@example.com',
          checkinDate: '2024-03-08',
          checkoutDate: '2024-03-10',
          days: 2,
          invoiceRequired: true,
          invoiceInfo: '电子发票',
          afterSales: '处理中',
          remarks: '客人投诉房间空调不制冷',
        },
        {
          orderNumber: 'ORD567890',
          orderDate: '2024-03-03',
          name: '钱七',
          phone: '13500135000',
          email: 'qianqi@example.com',
          checkinDate: '2024-03-15',
          checkoutDate: '2024-03-20',
          days: 5,
          invoiceRequired: true,
          invoiceInfo: '电子发票',
          afterSales: '无',
          remarks: '',
        },
        {
          orderNumber: 'ORD678901',
          orderDate: '2024-03-04',
          name: '孙八',
          phone: '13400134000',
          email: 'sunba@example.com',
          checkinDate: '2024-03-12',
          checkoutDate: '2024-03-13',
          days: 1,
          invoiceRequired: false,
          invoiceInfo: '',
          afterSales: '待处理',
          remarks: '客人要求更换房间，因为隔壁太吵',
        },
      ],
      availableFields: [
        { prop: 'orderNumber', label: '订单号' },
        { prop: 'orderDate', label: '下单日期' },
        { prop: 'name', label: '姓名' },
        { prop: 'phone', label: '手机号' },
        { prop: 'email', label: '邮箱' },
        { prop: 'checkinDate', label: '入住日期' },
        { prop: 'checkoutDate', label: '退房日期' },
        { prop: 'days', label: '预定天数' },
        { prop: 'invoiceRequired', label: '是否开发票' },
        { prop: 'invoiceInfo', label: '发票信息' },
        { prop: 'afterSales', label: '售后情况' },
        { prop: 'remarks', label: '备注' },
      ],
      selectedFields: [
        'orderNumber',
        'orderDate',
        'name',
        'phone',
        'email',
        'checkinDate',
        'checkoutDate',
        'days',
        'invoiceRequired',
        'invoiceInfo',
        'afterSales',
        'remarks',
      ],
      isEditDialogVisible: false,
      editForm: {
        checkinDate: '',
        checkoutDate: '',
        invoiceInfo: '',
        remarks: '',
      },
      signupConfig: {
        start: '',
        end: '',
        paymentLink: '',
      },
      ticketTypes: [
        {
          name: '普通票',
          price: 199,
          discountPrice: 179,
          discountStart: '2023-05-15 10:30:00',
          discountEnd: '2023-06-30 12:00:00'
        },
        {
          name: 'VIP票',
          price: 599,
          discountPrice: 499,
          discountStart: '2023-05-16 14:20:00',
          discountEnd: '2023-06-30 12:00:00'
        }
      ],
      websiteForm: {
        open: false,
        title: '',
        url: '',
        type: '',
        description: '',
        address: '',
        startTime: '',
        endTime: '',
        template: '',
        registerStartTime: '',
        registerEndTime: '',
        attendanceType: 'offline'
      },
      websiteFormRules: {
        title: [
          { required: true, message: '请输入会议名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入URL链接', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入会议类型', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入会议地址', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        template: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        registerStartTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        registerEndTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        attendanceType: [
          { required: true, message: '请选择到场方式', trigger: 'change' }
        ]
      },
      registrationForm: {
        name: '',
        gender: 'male',
        phone: '',
        organization: '',
        title: '',
        venue: '',
        reportTitle: 'no',
        needInvoice: 'no',
        invoiceTitle: '',
        taxId: ''
      },
      fieldsModalVisible: false,
      showEditPanel: false,
      editField: {
        displayName: '',
        placeholder: '',
        description: '',
        selectedOption: 'personal',
        required: false,
      },
      deleteModalVisible: false,
      // 添加字段选择弹窗相关数据
      insertFieldDialogVisible: false,
      fieldSearchText: '',
      activeCollapseNames: ['basicInfo', 'customFields'],
      selectedFields: [],
      // 添加自定义字段弹窗相关数据
      customFieldDialogVisible: false,
      customFieldForm: {
        name: '',
        type: ''
      },
      customFieldRules: {
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      basicFields: [
        { label: '姓名', value: 'name' },
        { label: '性别', value: 'gender' },
        { label: '职务', value: 'position' },
        { label: '国家', value: 'country' },
        { label: '手机', value: 'phone' },
        { label: '邮箱', value: 'email' },
        { label: '公司', value: 'company' },
        { label: '部门', value: 'department' },
        { label: '职务', value: 'title' },
        { label: '证件', value: 'idcard' },
        { label: '称谓分类', value: 'titleCategory' },
        { label: '是否有照片', value: 'hasPhoto' },
        { label: '是否有报告', value: 'hasReport' },
        { label: '开户行及账号', value: 'bankAccount' },
        { label: '收票人姓名', value: 'invoiceReceiverName' },
        { label: '收票人手机', value: 'invoiceReceiverPhone' },
        { label: '是否需要开票', value: 'needInvoice' },
        { label: '发票抬头', value: 'invoiceTitle' }
      ],
      customFieldTypes: [
        { label: '单行文本', value: 'singleLineText' },
        { label: '多行文本', value: 'multiLineText' },
        { label: '单项选择', value: 'radioSelect' },
        { label: '多项选择', value: 'multiSelect' },
        { label: '下拉选择', value: 'dropdown' },
        { label: '下拉多选', value: 'dropdownMulti' },
        { label: '级联选择', value: 'cascade' },
        { label: '文件上传', value: 'fileUpload' },
        { label: '图片上传', value: 'imageUpload' },
        { label: '日期', value: 'date' },
        { label: '日期时间', value: 'datetime' },
        { label: '年份', value: 'year' },
        { label: '数字', value: 'number' },
        { label: '富文本', value: 'richtext' },
        { label: '分隔线', value: 'divider' },
        { label: '协议/声明', value: 'agreement' },
        { label: '电子签名', value: 'signature' }
      ],
      userStats: {
        totalUsers: 1286,
        completeRate: 86,
        signInRate: 78,
        invoiceRate: 65,
        totalIncome: 1286
      },
      userData: [
        { id: 1, name: '张三', team: '团队A', contact: '13800138000', registerTime: '2024-03-01', paymentStatus: '已缴费', invoiceStatus: '已开票', signInStatus: '已签到' },
        { id: 2, name: '李四', team: '团队B', contact: '13900139000', registerTime: '2024-03-02', paymentStatus: '未缴费', invoiceStatus: '未开票', signInStatus: '未签到' },
        { id: 3, name: '王五', team: '团队A', contact: '13700137000', registerTime: '2024-03-03', paymentStatus: '已缴费', invoiceStatus: '已开票', signInStatus: '已签到' },
        { id: 4, name: '赵六', team: '团队B', contact: '13600136000', registerTime: '2024-03-04', paymentStatus: '已缴费', invoiceStatus: '已开票', signInStatus: '已签到' },
        { id: 5, name: '钱七', team: '团队A', contact: '13500135000', registerTime: '2024-03-05', paymentStatus: '未缴费', invoiceStatus: '未开票', signInStatus: '未签到' },
        { id: 6, name: '孙八', team: '团队B', contact: '13400134000', registerTime: '2024-03-06', paymentStatus: '已缴费', invoiceStatus: '已开票', signInStatus: '已签到' },
      ],
      searchText: '',
      
      // 个人信息数据
      userProfileInfo: {
        name: '王立群',
        gender: '男',
        phone: '177*****35',
        email: 'awdkwriter@outlook.com',
        idNumber: '345345******35345'
      },
      
      // 会议数据
      meetingData: [
        {
          key: '1',
          name: '会议名称会议名称会议名称会议名称会议名称会议名称',
          amount: '200',
          status: '已支付',
          time: '2024年12月5日 12:00:00',
          operation: '申请发票'
        },
        {
          key: '2',
          name: '会议名称会议名称会议名称会议名称会议名称会议名称',
          amount: '200',
          status: '待支付',
          time: '/',
          operation: ''
        },
        {
          key: '3',
          name: '会议名称会议名称会议名称',
          amount: '200',
          status: '已完成',
          time: '/',
          operation: ''
        },
        {
          key: '4',
          name: '会议名称会议名称会议名称会议名称会议名称',
          amount: '200',
          status: '已支付',
          time: '2024年11月5日 12:00:00',
          operation: '申请发票'
        },
        {
          key: '5',
          name: '会议名称会议名称会议名称',
          amount: '200',
          status: '已支付',
          time: '2024年10月5日 12:00:00',
          operation: '申请发票'
        }
      ],
      activeProfileTab: '1',
      currentPage: 1,
      pageSize: 5,
      currentStep: 0, // 当前步骤，从0开始
      registrationFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        organization: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        venue: [
          { required: true, message: '请选择分会场', trigger: 'change' }
        ]
      },
      // 添加自定义分组弹窗相关数据
      customGroupDialogVisible: false,
      customGroupForm: {
        name: ''
      },
      customGroupRules: {
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 编辑字段抽屉相关数据
      editFieldDrawerVisible: false,
      editFieldForm: {
        displayName: '',
        placeholder: '',
        description: '',
        required: false
      },
      currentEditingField: null,
      deleteConfirmVisible: false,
      currentDeleteField: null,
      paymentStatusFilter: '',
      signInStatusFilter: '',
      teamFilter: '',
      formSettingsDialogVisible: false, // 添加弹窗控制变量
      formFields: [
        { id: 1, name: '姓名', type: 'text', required: true, order: 1, isBasic: true },
        { id: 2, name: '性别', type: 'radio', required: true, order: 2, isBasic: true },
        { id: 3, name: '手机', type: 'text', required: true, order: 3, isBasic: true },
        { id: 4, name: '单位', type: 'text', required: true, order: 4, isBasic: true },
        { id: 5, name: '职称', type: 'textarea', required: false, order: 5, isBasic: true },
        { id: 6, name: '报告分会场', type: 'select', required: true, order: 6, isBasic: true },
        { id: 7, name: '分会场报告申请', type: 'radio', required: true, order: 7, isBasic: true }
      ],
      tempFieldType: '', // 临时存储字段类型
      username: '管理员', // 默认值
    };
  },
  computed: {
    pageTitle() {
      const titles = {
        data: '会议数据',
        website: '会议网站搭建',
        guests: '重要嘉宾管理',
        invoice: '发票信息设置',
        finance: '财务管理',
        hotel: '酒店预定',
        checkin: '签到管理',
        registration: '注册管理',
        badge: '胸卡打印配置',
        signup: '报名信息管理',
        profile: '个人中心',
        registrationmanage: '用户报名管理',
        userinfo: '会议数据',
        websites: '会议网站列表',
      };
      return titles[this.activeMenu];
    },
    filteredRegistrationInvoices() {
      if (!this.invoiceStatusFilter) {
        return this.registrationInvoices;
      }
      return this.registrationInvoices.filter(invoice => invoice.status === this.invoiceStatusFilter);
    },
    filteredHotelInvoices() {
      if (!this.invoiceStatusFilter) {
        return this.hotelInvoices;
      }
      return this.hotelInvoices.filter(invoice => invoice.status === this.invoiceStatusFilter);
    },
    // 添加字段搜索过滤计算属性
    filteredBasicFields() {
      if (!this.fieldSearchText) {
        return this.basicFields;
      }
      return this.basicFields.filter(field => 
        field.label.toLowerCase().includes(this.fieldSearchText.toLowerCase()) ||
        field.value.toLowerCase().includes(this.fieldSearchText.toLowerCase())
      );
    },
    filteredUserData() {
      return this.userData.filter(user => {
        // 搜索过滤
        const searchMatch = !this.searchText || 
          user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.id.toString().includes(this.searchText) ||
          user.contact.includes(this.searchText);
        
        // 缴费状态过滤
        const paymentMatch = !this.paymentStatusFilter || user.paymentStatus === this.paymentStatusFilter;
        
        // 签到状态过滤
        const signInMatch = !this.signInStatusFilter || user.signInStatus === this.signInStatusFilter;
        
        // 团队过滤
        const teamMatch = !this.teamFilter || user.team === this.teamFilter;
        
        return searchMatch && paymentMatch && signInMatch && teamMatch;
      });
    },
  },
  mounted() {
    this.fetchMeetingData();
    // 初始化图表
    this.$nextTick(() => {
      // 当切换到会议数据tab时初始化图表
      this.$watch('activeMenu', (newValue) => {
        if (newValue === 'userinfo') {
          this.initCharts();
        }
      });
      
      // 如果初始选中的就是会议数据，则直接初始化图表
      if (this.activeMenu === 'userinfo') {
        this.initCharts();
      }
    });
  },
  methods: {
    fetchMeetingData() {
      // 这里应该是与API通信获取会议数据
      // 模拟API返回的数据
      setTimeout(() => {
        this.meetingData = {
          websiteStatus: 'draft',
          websiteViews: 152,
          websiteLastUpdate: '2023-06-15 14:30:25',
          name: '第十届全球科技创新峰会',
          ticketTypes: [
            { id: 1, name: '普通票', price: 199, quota: 100, sold: 45 },
            { id: 2, name: 'VIP票', price: 599, quota: 50, sold: 12 }
          ]
        };
      }, 500);
    },
    goToWebsiteBuilder() {
      this.$router.push({
        path: '/website-builder',
        query: { meetingId: this.meetingId }
      });
    },
    previewWebsite() {
      window.open(`/preview-website/${this.meetingId}`, '_blank');
    },
    toggleWebsiteStatus() {
      this.meetingData.websiteStatus = this.meetingData.websiteStatus === 'active' ? 'draft' : 'active';
      this.$message.success(this.meetingData.websiteStatus === 'active' ? '网站已成功发布！' : '网站已下线！');
    },
    fetchMeetingDetails() {
      // 模拟从 API 获取会议详情
      this.meeting = {
        id: this.meetingId,
        title: '2024年度技术峰会',
        time: '2024-03-15 09:00',
        location: '上海国际会议中心',
        attendees: [
          { id: 1, name: '张三' },
          { id: 2, name: '李四' },
        ],
        subVenues: [
          { id: 1, name: '分会场A' },
          { id: 2, name: '分会场B' },
        ],
      };
    },
    addAttendee() {
      // 添加参会人员逻辑
    },
    removeAttendee(id) {
      // 删除参会人员逻辑
    },
    addVenue() {
      // 添加分会场逻辑
    },
    editVenue(id) {
      // 编辑分会场逻辑
    },
    removeVenue(id) {
      // 删除分会场逻辑
    },
    openTicketTypeForm() {
      this.ticketTypeForm = { name: '', price: '', discountStart: '', discountEnd: '' };
      this.isTicketTypeFormVisible = true;
    },
    editTicketType(row) {
      this.ticketTypeForm = { ...row };
      this.isTicketTypeFormVisible = true;
    },
    deleteTicketType(row) {
      this.$confirm('确定删除该门票类型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const index = this.ticketTypes.findIndex(item => item.name === row.name);
          if (index !== -1) {
            this.ticketTypes.splice(index, 1);
            this.$message.success('删除成功');
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    addCustomField() {
      // 添加自定义字段
    },
    testPaymentLink() {
      // 测试缴费链接
    },
    saveTicketType() {
      // 检查是否设置了报名时间
      if (!this.signupConfig.start || !this.signupConfig.end) {
        this.$message.error('请先设置报名时间');
        return;
      }

      // 如果填写了优惠时间，检查是否在报名时间区间内
      if (this.ticketTypeForm.discountStart && this.ticketTypeForm.discountEnd) {
        const signupStart = new Date(this.signupConfig.start);
        const signupEnd = new Date(this.signupConfig.end);
        const discountStart = new Date(this.ticketTypeForm.discountStart);
        const discountEnd = new Date(this.ticketTypeForm.discountEnd);

        if (discountStart < signupStart || discountEnd > signupEnd) {
          this.$message.error('优惠时间不在报名时间范围内');
          return;
        }
      }

      if (!this.ticketTypeForm.name || !this.ticketTypeForm.price) {
        this.$message.error('请填写完整信息');
        return;
      }

      // 如果是编辑操作，更新对应的门票类型
      const index = this.ticketTypes.findIndex(item => item.name === this.ticketTypeForm.name);
      if (index !== -1) {
        this.ticketTypes.splice(index, 1, { ...this.ticketTypeForm });
      } else {
        // 如果是添加操作，添加到列表
        this.ticketTypes.push({ ...this.ticketTypeForm });
      }
      this.isTicketTypeFormVisible = false; // 关闭弹窗
      this.$message.success('操作成功');
    },
    formatDateTime(row, column, cellValue) {
      if (!cellValue) return '-'; // 如果值为空，显示"-"
      const date = new Date(cellValue);
      return date.toLocaleString(); // 格式化日期时间
    },
    goToFormSettings() {
      // this.$router.push({ name: 'FormSettings' }); // 注释掉原来的跳转代码
      this.formSettingsDialogVisible = true; // 显示弹窗
    },
    openTemplateEditor() {
      this.templateForm = {
        name: '',
        type: 'basic',
        size: 'a4',
        customWidth: '',
        customHeight: '',
        backgroundImage: '',
        namePosition: 'center',
      };
      this.fileList = [];
      this.isTemplateEditorVisible = true;
    },
    editTemplate(row) {
      this.templateForm = { ...row };
      this.fileList = row.backgroundImage ? [{ url: row.backgroundImage }] : [];
      this.isTemplateEditorVisible = true;
    },
    deleteTemplate(row) {
      this.$confirm('确定删除该模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const index = this.templates.findIndex(item => item.name === row.name);
          if (index !== -1) {
            this.templates.splice(index, 1);
            this.$message.success('删除成功');
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    generateBadges() {
      // 生成胸牌
      this.$message.success('胸牌生成成功');
    },
    handleBeforeUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLessThan5MB = file.size / 1024 / 1024 < 5;

      if (!isJPGOrPNG) {
        this.$message.error('只能上传JPG/PNG格式的图片');
        return false;
      }
      if (!isLessThan5MB) {
        this.$message.error('图片大小不能超过5MB');
        return false;
      }

      // 模拟上传
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.templateForm.backgroundImage = reader.result;
        this.fileList = [{ url: reader.result, name: file.name }];
      };
      return false;
    },
    handleUploadSuccess(response, file) {
      // 处理上传成功
    },
    saveTemplate() {
      if (!this.templateForm.name) {
        this.$message.error('请填写模板名称');
        return;
      }

      if (this.templateForm.size === 'custom' && (!this.templateForm.customWidth || !this.templateForm.customHeight)) {
        this.$message.error('请填写自定义尺寸');
        return;
      }

      // 如果是编辑操作，更新对应的模板
      const index = this.templates.findIndex(item => item.name === this.templateForm.name);
      if (index !== -1) {
        this.templates.splice(index, 1, { ...this.templateForm });
      } else {
        // 如果是添加操作，添加到列表
        this.templates.push({ ...this.templateForm });
      }
      this.isTemplateEditorVisible = false; // 关闭弹窗
      this.$message.success('操作成功');
    },
    addHotel() {
      this.hotelForm = {
        id: null,
        name: '',
        bookingStartTime: '',
        bookingEndTime: '',
        image: '',
        description: '',
        address: '',
        roomTypes: [],
      };
      this.hotelImageList = [];
      this.isHotelFormVisible = true;
    },
    editHotel(hotel) {
      this.hotelForm = { ...hotel };
      this.hotelImageList = hotel.image ? [{ url: hotel.image }] : [];
      this.isHotelFormVisible = true;
    },
    deleteHotel(hotel) {
      this.$confirm(`确定删除酒店 "${hotel.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const index = this.hotels.findIndex(item => item.id === hotel.id);
          if (index !== -1) {
            this.hotels.splice(index, 1);
            this.$message.success('删除成功');
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    addRoomType(hotel) {
      // 添加房型逻辑
      this.$message.success(`为酒店 "${hotel.name}" 添加房型`);
    },
    editRoomType(hotel, roomType) {
      // 编辑房型逻辑
      this.$message.success(`编辑酒店 "${hotel.name}" 的房型 "${roomType.name}"`);
    },
    deleteRoomType(hotel, roomType) {
      this.$confirm(`确定删除房型 "${roomType.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const index = hotel.roomTypes.findIndex(item => item.id === roomType.id);
          if (index !== -1) {
            hotel.roomTypes.splice(index, 1);
            this.$message.success('删除成功');
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    handleHotelImageUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLessThan5MB = file.size / 1024 / 1024 < 5;

      if (!isJPGOrPNG) {
        this.$message.error('只能上传JPG/PNG格式的图片');
        return false;
      }
      if (!isLessThan5MB) {
        this.$message.error('图片大小不能超过5MB');
        return false;
      }

      // 模拟上传
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.hotelForm.image = reader.result;
        this.hotelImageList = [{ url: reader.result, name: file.name }];
        
        // 手动更新表单验证状态
        if (this.$refs.hotelForm) {
          this.$refs.hotelForm.validateField('image');
        }
      };
      return false;
    },
    handleHotelImageSuccess(response, file) {
      // 处理上传成功
    },
    saveHotel() {
      this.$refs.hotelForm.validate((valid) => {
        if (valid) {
          if (this.hotelForm.bookingEndTime < this.hotelForm.bookingStartTime) {
            this.$message.error('预定结束时间不能早于开始时间');
            return;
          }
          
          const hotelData = {
            id: this.hotelForm.id,
            name: this.hotelForm.name,
            bookingStartTime: this.hotelForm.bookingStartTime,
            bookingEndTime: this.hotelForm.bookingEndTime,
            image: this.hotelForm.image,
            description: this.hotelForm.description,
            address: this.hotelForm.address,
            roomTypes: this.hotelForm.roomTypes || []
          };

          // 如果是编辑操作，更新对应的酒店
          if (this.hotelForm.id) {
            const index = this.hotels.findIndex(item => item.id === this.hotelForm.id);
            if (index !== -1) {
              this.hotels.splice(index, 1, hotelData);
            }
          } else {
            // 如果是添加操作，添加到列表
            const newId = this.hotels.length > 0 ? Math.max(...this.hotels.map(h => h.id)) + 1 : 1;
            hotelData.id = newId;
            this.hotels.push(hotelData);
          }
          this.isHotelFormVisible = false; // 关闭弹窗
          this.$message.success('操作成功');
        } else {
          return false;
        }
      });
    },
    viewAllBookings() {
      this.$message.success('查看所有酒店入住人信息');
      // 这里可以添加显示所有入住人信息的逻辑，例如打开一个弹窗等
    },
    editCheckin(row) {
      // 编辑入住信息逻辑
      this.$message.success(`编辑入住人信息: ${row.name}`);
    },
    deleteCheckin(row) {
      this.$confirm(`确定删除订单号为 "${row.orderNumber}" 的入住信息吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const index = this.checkinList.findIndex(item => item.orderNumber === row.orderNumber);
          if (index !== -1) {
            this.checkinList.splice(index, 1);
            this.$message.success('删除成功');
          }
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    viewAfterSalesDetails(row) {
      // 查看售后详情逻辑
      this.$message.success(`查看售后详情: ${row.name}`);
    },
    openEditDialog(row) {
      this.editForm = {
        ...row,
        invoiceInfo: row.invoiceInfo || '', // 如果没有发票信息，默认为空字符串
      };
      this.isEditDialogVisible = true;
    },
    saveEdit() {
      // 验证日期
      if (!this.editForm.checkinDate || !this.editForm.checkoutDate) {
        this.$message.warning('请选择入住和退房日期');
        return;
      }

      // 验证退房日期是否晚于入住日期
      if (new Date(this.editForm.checkoutDate) <= new Date(this.editForm.checkinDate)) {
        this.$message.warning('退房日期必须晚于入住日期');
        return;
      }

      const index = this.checkinList.findIndex(item => item.orderNumber === this.editForm.orderNumber);
      if (index !== -1) {
        // 计算预定天数
        const checkinDate = new Date(this.editForm.checkinDate);
        const checkoutDate = new Date(this.editForm.checkoutDate);
        const days = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

        // 更新信息
        this.checkinList[index] = {
          ...this.checkinList[index],
          ...this.editForm,
          days,
          invoiceRequired: !!this.editForm.invoiceInfo,
        };
        this.$message.success('信息更新成功');
      }
      this.isEditDialogVisible = false;
    },
    getStatusType(status) {
      const statusMap = {
        '待开票': 'warning',
        '已开票': 'success',
        '开票失败': 'danger'
      };
      return statusMap[status] || 'info';
    },
    handleInvoice(row) {
      this.$confirm('确认为该订单开具发票吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里添加开具发票的逻辑
        row.status = '已开票';
        this.$message.success('发票开具成功');
      }).catch(() => {
        this.$message.info('已取消开具发票');
      });
    },
    viewInvoiceDetails(row) {
      this.$message.success('查看发票详情');
    },
    getAfterSalesType(status) {
      const statusMap = {
        '无': 'info',
        '已处理': 'success',
        '处理中': 'warning',
        '待处理': 'danger'
      };
      return statusMap[status] || 'info';
    },
    // 处理注册发票选择变化
    handleRegistrationSelectionChange(val) {
      this.selectedRegistrationInvoices = val;
    },
    
    // 处理酒店发票选择变化
    handleHotelSelectionChange(val) {
      this.selectedHotelInvoices = val;
    },
    
    // 批量处理发票
    batchHandleInvoice() {
      // 获取当前激活的标签页
      const selectedInvoices = this.activeInvoiceTab === 'registrationInvoice' 
        ? this.selectedRegistrationInvoices 
        : this.selectedHotelInvoices;
      
      if (selectedInvoices.length === 0) {
        this.$message.warning('请至少选择一个待开票的订单');
        return;
      }
      
      // 检查是否所有选中的发票都可以开具
      const invalidInvoices = selectedInvoices.filter(item => item.status !== '待开票');
      if (invalidInvoices.length > 0) {
        this.$message.warning('只能为待开票的订单开具发票');
        return;
      }
      
      this.$confirm(`确认为选中的 ${selectedInvoices.length} 个订单开具发票吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 批量开具发票
        selectedInvoices.forEach(invoice => {
          invoice.status = '已开票';
        });
        this.$message.success(`成功为 ${selectedInvoices.length} 个订单开具发票`);
      }).catch(() => {
        this.$message.info('已取消开具发票');
      });
    },
    selectTemplate(template) {
      this.$confirm(`确定使用${template === 'academic' ? '学术会议' : template === 'business' ? '商务会议' : '科技展会'}模板创建网站吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 保存模板选择
        this.$message.success('模板已选择，即将进入编辑器');
        // 跳转到网站编辑器
        this.$router.push({
          path: '/website-builder',
          query: { 
            meetingId: this.meetingId,
            template: template
          }
        });
      }).catch(() => {
        // 取消选择
      });
    },
    generateUrl() {
      // 生成URL的逻辑
      if (this.websiteForm.title) {
        this.websiteForm.url = 'https://meeting.example.com/' + this.websiteForm.title.toLowerCase().replace(/\s+/g, '-');
        this.$message.success('URL生成成功');
      } else {
        this.$message.warning('请先输入会议名称');
      }
    },
    submitForm() {
      this.$refs.websiteForm.validate((valid) => {
        if (valid) {
          // 表单验证通过，进行提交
          this.$message.success('表单验证通过，准备进入下一步');
          // 这里可以添加跳转到下一步的逻辑
        } else {
          this.$message.error('请填写完整所有必填项');
          return false;
        }
      });
    },
    cancelForm() {
      this.$confirm('确认取消编辑？未保存的内容将会丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.websiteForm.resetFields();
        this.$message.info('已取消编辑');
      }).catch(() => {});
    },
    // 处理会议网站表单提交
    handleWebsiteSubmit() {
      this.$refs.websiteForm.validate((valid) => {
        if (valid) {
          console.log('提交的表单数据:', this.websiteForm);
          this.$message.success('提交成功');
          this.handleNextStep(); // 提交成功后前进到下一步
        } else {
          this.$message.error('请检查表单填写是否正确');
          return false;
        }
      });
    },
    
    // 生成URL按钮点击处理
    handleGenerateUrl() {
      // 生成随机URL
      const randomString = Math.random().toString(36).substring(2, 10);
      this.websiteForm.url = `meeting-${randomString}`;
      this.$message.info('已生成URL');
    },
    showFieldsModal() {
      this.fieldsModalVisible = true;
    },
    handleFieldSelect(field) {
      console.log('选择字段:', field);
      this.fieldsModalVisible = false;
      
      // 如果是添加新字段，打开编辑面板进行编辑
      this.currentField = field;
      this.editField = {
        displayName: this.fieldOptions.find(option => option.value === field) ? this.fieldOptions.find(option => option.value === field).label : field,
        placeholder: `请输入${this.fieldOptions.find(option => option.value === field) ? this.fieldOptions.find(option => option.value === field).label : field}`,
        description: '',
        selectedOption: 'personal',
        required: true
      };
      this.showEditPanel = true;
    },
    toggleEditPanel() {
      // 如果是关闭面板，重置当前字段
      if (this.showEditPanel) {
        this.currentField = null;
      }
      this.showEditPanel = !this.showEditPanel;
    },
    saveRegistrationSettings() {
      // 保存注册设置的逻辑
      this.$message.success('注册设置已保存');
    },
    handleFieldsModalCancel() {
      this.fieldsModalVisible = false;
    },
    saveEditField() {
      // 保存编辑字段的逻辑
      this.$message.success('字段已保存');
      this.showEditPanel = false;
      this.currentField = null;
    },
    handleDeleteConfirm() {
      // 处理删除的逻辑
      this.$message.success('字段已删除');
      this.deleteModalVisible = false;
    },
    handleDeleteCancel() {
      this.deleteModalVisible = false;
    },
    handleSearch() {
      // 处理搜索的逻辑
      this.$message.success('搜索: ' + this.searchText);
    },
    handlePaymentFilter(command) {
      this.paymentStatusFilter = command;
      this.$message.success('筛选缴费状态: ' + (command || '全部'));
    },
    handleSignInFilter(command) {
      this.signInStatusFilter = command;
      this.$message.success('筛选签到状态: ' + (command || '全部'));
    },
    handleTeamFilter(command) {
      this.teamFilter = command;
      this.$message.success('筛选团队: ' + (command || '全部'));
    },
    exportUserData() {
      this.$message.success('导出用户数据');
      // 实际应用中应该调用API导出数据
    },
    getTagType(status) {
      if (status === '已缴费' || status === '已签到' || status === '已开票') {
        return 'success';
      } else if (status === '未缴费' || status === '未签到' || status === '未开票') {
        return 'warning';
      }
      return 'info';
    },
    viewUserDetails(row) {
      // 处理查看用户详情的逻辑
      console.log('查看用户详情:', row);
    },
    // 初始化图表
    initCharts() {
      // 确保DOM已经渲染
      this.$nextTick(() => {
        if (this.$refs.pieChart) {
          // 初始化饼图 - 参会团队分布
          const pieChart = echarts.init(this.$refs.pieChart);
          const pieOption = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              right: 10,
              top: 'center',
              data: ['官方合作', '企业代表', '科研机构', '媒体记者', '其他代表']
            },
            series: [
              {
                name: '参会团队分布',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 6,
                  borderColor: '#fff',
                  borderWidth: 2
                },
                label: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '14',
                    fontWeight: 'bold'
                  }
                },
                labelLine: {
                  show: false
                },
                data: [
                  { value: 480, name: '官方合作' },
                  { value: 300, name: '企业代表' },
                  { value: 200, name: '科研机构' },
                  { value: 150, name: '媒体记者' },
                  { value: 156, name: '其他代表' }
                ]
              }
            ],
            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de']
          };
          pieChart.setOption(pieOption);
          
          // 响应式调整
          window.addEventListener('resize', () => {
            pieChart.resize();
          });
        }
        
        if (this.$refs.barChart) {
          // 初始化柱状图 - 缴费状态分布
          const barChart = echarts.init(this.$refs.barChart);
          const barOption = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'category',
              data: ['已缴费', '未缴费', '部分缴费', '退款中']
            },
            yAxis: {
              type: 'value',
              name: '人数'
            },
            series: [
              {
                data: [1100, 120, 200, 80],
                type: 'bar',
                barWidth: '40%',
                itemStyle: {
                  color: function(params) {
                    const colorList = ['#5470c6', '#ee6666', '#fac858', '#91cc75'];
                    return colorList[params.dataIndex];
                  }
                }
              }
            ]
          };
          barChart.setOption(barOption);
          
          // 响应式调整
          window.addEventListener('resize', () => {
            barChart.resize();
          });
        }
      });
    },
    // 个人信息相关方法
    handleProfileTabChange(tab) {
      this.activeProfileTab = tab.name;
    },
    
    editUserProfile() {
      this.$message.success('编辑个人信息');
      // 可以在这里实现编辑个人信息的逻辑
    },
    
    handleSizeChange(val) {
      this.pageSize = val;
    },
    
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    
    // 处理下一步按钮点击
    handleNextStep() {
      if (this.currentStep < 2) {
        this.currentStep += 1;
      }
    },
    
    // 处理上一步按钮点击
    handlePrevStep() {
      if (this.currentStep > 0) {
        this.currentStep -= 1;
      }
    },
    // 发布网站 - 最终步骤提交
    submitFinalStep() {
      this.$confirm('确认发布此会议网站吗？发布后将立即生效。', '提示', {
        confirmButtonText: '确认发布',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 这里添加发布网站的逻辑
        this.$message({
          type: 'success',
          message: '网站发布成功！',
          duration: 3000,
          onClose: () => {
            // 发布成功后的跳转或其他操作
            // this.$router.push('/websites');
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消发布'
        });
      });
    },
    
    // 取消表单
    cancelForm() {
      this.$confirm('确认取消编辑？未保存的内容将会丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.websiteForm.resetFields();
        this.currentStep = 0; // 重置步骤
        this.$message.info('已取消编辑');
      }).catch(() => {
        // 用户取消操作，不做任何处理
      });
    },
    // 保存报名表单
    saveRegistrationForm() {
      this.$refs.registrationForm.validate((valid) => {
        if (valid) {
          this.$message.success('表单保存成功');
          console.log('表单数据：', this.registrationForm);
          // 这里可以添加提交表单数据到服务器的逻辑
        } else {
          this.$message.error('请检查表单是否填写正确');
          return false;
        }
      });
    },
    
    // 重置报名表单
    resetRegistrationForm() {
      this.$refs.registrationForm.resetFields();
      this.fileList = [];
      this.$message.info('表单已重置');
    },
    
    // 处理上移按钮
    handleMoveUp() {
      this.$message.info('上移操作');
    },
    
    // 处理下移按钮
    handleMoveDown() {
      this.$message.info('下移操作');
    },
    
    // 处理删除按钮
    handleDelete() {
      // 显示删除确认对话框
      this.deleteConfirmVisible = true;
      // 记录当前要删除的字段
      this.currentDeleteField = 'venue'; // 实际应用中应该是当前选中的字段
    },
    handleAdd() {
      // 显示插入字段弹窗
      this.insertFieldDialogVisible = true;
    },
    
    handleEdit() {
      // 显示编辑字段抽屉
      this.editFieldDrawerVisible = true;
      
      // 获取当前字段信息
      // 这里假设我们有一个字段信息，实际应用中应根据选中的字段ID等获取信息
      this.currentEditingField = 'venue'; // 示例，假设编辑的是venue字段
      this.editFieldForm = {
        displayName: '报告分会场',
        placeholder: '请选择分会场',
        description: '',
        required: true
      };
    },
    
    handleEditFieldDrawerClose(done) {
      this.$confirm('确认关闭？未保存的内容将会丢失')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    
    saveEditField() {
      // 保存字段编辑
      this.$message({
        message: '字段保存成功',
        type: 'success'
      });
      
      // 这里可以添加将修改应用到表单配置的逻辑
      
      this.editFieldDrawerVisible = false;
    },
    
    toggleFieldSelection(fieldValue) {
      const index = this.selectedFields.indexOf(fieldValue);
      if (index > -1) {
        this.selectedFields.splice(index, 1);
      } else {
        this.selectedFields.push(fieldValue);
      }
    },
    
    addCustomField(fieldType) {
      this.customFieldForm.type = fieldType;
      this.customFieldDialogVisible = true;
      // 重置表单
      if (this.$refs.customFieldForm) {
        this.$refs.customFieldForm.resetFields();
      }
    },
    
    saveCustomField() {
      this.$refs.customFieldForm.validate((valid) => {
        if (valid) {
          this.$message({
            message: `已添加自定义字段: ${this.customFieldForm.name}`,
            type: 'success'
          });
          
          // 这里可以添加保存自定义字段的逻辑
          // 例如将自定义字段添加到表单配置中
          
          this.customFieldDialogVisible = false;
        } else {
          return false;
        }
      });
    },
    
    confirmAddFields() {
      if (this.selectedFields.length === 0) {
        this.$message({
          message: '请至少选择一个字段',
          type: 'warning'
        });
        return;
      }
      
      this.$message({
        message: `已添加${this.selectedFields.length}个字段`,
        type: 'success'
      });
      
      this.insertFieldDialogVisible = false;
    },
    openCustomGroupDialog() {
      this.customGroupDialogVisible = true;
      // 重置表单
      if (this.$refs.customGroupForm) {
        this.$refs.customGroupForm.resetFields();
      }
    },
    
    saveCustomGroup() {
      this.$refs.customGroupForm.validate((valid) => {
        if (valid) {
          this.$message({
            message: `已添加自定义分组: ${this.customGroupForm.name}`,
            type: 'success'
          });
          
          // 这里可以添加保存自定义分组的逻辑
          
          this.customGroupDialogVisible = false;
        } else {
          return false;
        }
      });
    },
    confirmDelete() {
      // 执行删除操作
      this.$message({
        message: '字段删除成功',
        type: 'success'
      });
      
      // 这里可以添加实际删除字段的逻辑
      
      this.deleteConfirmVisible = false;
    },
    handleFormSettingsClose() {
      this.formSettingsDialogVisible = false;
    },
    addNewField() {
      // 添加新字段的弹窗
      this.$prompt('请输入字段名称', '添加字段', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S+/,
        inputErrorMessage: '字段名称不能为空'
      }).then(({ value }) => {
        // 创建新字段对象
        const newField = {
          id: Date.now(), // 使用时间戳作为临时ID
          name: value,
          type: 'text', // 默认为文本类型
          required: false,
          order: this.formFields.length + 1,
          isBasic: false
        };
        
        // 添加到字段列表
        this.formFields.push(newField);
        this.$message.success(`已添加字段: ${value}`);
      }).catch(() => {
        this.$message.info('已取消添加');
      });
    },
    handleEditField(field) {
      // 弹出编辑对话框
      this.$prompt('修改字段名称', '编辑字段', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: field.name,
        inputPattern: /\S+/,
        inputErrorMessage: '字段名称不能为空'
      }).then(({ value }) => {
        // 更新字段名称
        const index = this.formFields.findIndex(f => f.id === field.id);
        if (index !== -1) {
          this.formFields[index].name = value;
          this.$message.success(`已修改字段名称为: ${value}`);
          
          // 弹出选择字段类型对话框
          this.$confirm('是否修改字段类型?', '编辑字段', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'info'
          }).then(() => {
            // 打开字段类型选择
            this.selectFieldType(field);
          }).catch(() => {
            // 用户选择不修改类型
          });
        }
      }).catch(() => {
        this.$message.info('已取消编辑');
      });
    },
    selectFieldType(field) {
      // 这里可以实现字段类型选择的逻辑
      // 简化版本为直接切换几种常见类型
      const types = ['text', 'textarea', 'radio', 'checkbox', 'select', 'date'];
      const typeNames = ['文本', '多行文本', '单选', '多选', '下拉选择', '日期'];
      
      // 构建选项
      const options = types.map((type, index) => {
        return {
          value: type,
          label: typeNames[index]
        };
      });
      
      // 创建一个下拉选择对话框
      this.$alert(
        '<div><p>请选择字段类型:</p><select class="el-select" id="fieldTypeSelect">' + 
        options.map(option => `<option value="${option.value}" ${field.type === option.value ? 'selected' : ''}>${option.label}</option>`).join('') + 
        '</select></div>',
        '选择字段类型',
        {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          callback: action => {
            if (action === 'confirm') {
              const selectElement = document.getElementById('fieldTypeSelect');
              if (selectElement) {
                const selectedType = selectElement.value;
                // 更新字段类型
                const index = this.formFields.findIndex(f => f.id === field.id);
                if (index !== -1) {
                  this.formFields[index].type = selectedType;
                  this.$message.success(`已修改字段类型为: ${this.getFieldTypeName(selectedType)}`);
                }
              }
            } else {
              this.$message.info('已取消修改字段类型');
            }
          }
        }
      );
    },
    handleDeleteField(field) {
      // 确认删除
      this.$confirm(`确定要删除字段 "${field.name}" 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 执行删除操作
        const index = this.formFields.findIndex(f => f.id === field.id);
        if (index !== -1) {
          this.formFields.splice(index, 1);
          this.$message.success('删除成功');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    moveFieldUp(index) {
      if (index === 0) return; // 已经是第一个，不能上移
      
      // 交换当前字段与上一个字段的位置
      const temp = this.formFields[index];
      this.formFields.splice(index, 1);
      this.formFields.splice(index - 1, 0, temp);
      
      // 更新order值
      this.updateFieldOrders();
      
      this.$message.success('上移成功');
    },
    moveFieldDown(index) {
      if (index === this.formFields.length - 1) return; // 已经是最后一个，不能下移
      
      // 交换当前字段与下一个字段的位置
      const temp = this.formFields[index];
      this.formFields.splice(index, 1);
      this.formFields.splice(index + 1, 0, temp);
      
      // 更新order值
      this.updateFieldOrders();
      
      this.$message.success('下移成功');
    },
    updateFieldOrders() {
      // 重新设置所有字段的order值
      this.formFields.forEach((field, index) => {
        field.order = index + 1;
      });
    },
    saveFormSettings() {
      // 保存表单设置
      this.$message.success('表单设置已保存');
      this.formSettingsDialogVisible = false;
      
      // 这里可以添加API调用，将字段配置保存到后端
    },
    getFieldTypeName(type) {
      // 根据类型返回中文名称
      const typeMap = {
        'text': '文本',
        'textarea': '多行文本',
        'radio': '单选',
        'checkbox': '多选',
        'select': '下拉选择',
        'date': '日期'
      };
      
      return typeMap[type] || type;
    },
    goToUserCenter() {
      this.$router.push('/user-center');
    },
    logout() {
      logout(); // 调用API中的logout方法清除token
      this.$message.success('退出登录成功');
      this.$router.push('/login'); // 跳转到登录页
    },
    fetchUserInfo() {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          this.username = user.username || '管理员';
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },
  },
  created() {
    this.fetchUserInfo();
    this.fetchMeetingDetails();
  },
};
</script>

<style scoped>
@import '../styles/meetingDetailSettings.css';

/* 字段选择弹窗样式 */
.field-dialog-header {
  margin-bottom: 15px;
}

.field-search-input {
  width: 100%;
}

.collapse-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.collapse-actions, .collapse-help {
  display: flex;
  align-items: center;
}

.collapse-actions i, .collapse-help i {
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;
}

.field-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
}

.field-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  width: calc(25% - 10px);
  box-sizing: border-box;
}

.field-item:hover {
  background-color: #e6f1fc;
}

.field-selected {
  background-color: #e6f1fc;
  color: #409EFF;
  border: 1px solid #a0cfff;
}

@media screen and (max-width: 768px) {
  .field-item {
    width: calc(50% - 10px);
  }
}

/* 其他已有样式 */
/* ... existing styles ... */

/* 编辑字段抽屉样式 */
.edit-field-container {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 10px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
}

.option-label {
  display: flex;
  align-items: center;
}

.option-label i {
  margin-right: 8px;
  color: #409EFF;
}

.drawer-footer {
  margin-top: auto;
  padding: 20px 0;
  text-align: right;
}

/* 其他已有样式 */
/* ... existing styles ... */

/* 删除确认对话框样式 */
.delete-confirm-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 24px;
  color: #E6A23C;
  margin-right: 10px;
}

/* 表单设置弹窗样式 */
.form-settings-container {
  padding: 20px;
}

.form-fields-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-fields-header h3 {
  margin: 0;
}

.form-fields-header .el-button {
  margin-left: 10px;
}

.form-fields-header .el-button:first-child {
  margin-left: 0;
}
</style>    