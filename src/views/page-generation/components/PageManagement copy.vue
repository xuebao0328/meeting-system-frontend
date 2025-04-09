<template>
    <div class="page-management">
        <div class="title">页面管理</div>
        <div class="page-list">
            <div class="page-item" v-for="page in pageList" :key="page.id"
                :class="{ 'active': page.id === pageForm.id }" @click="selectPage(page)">
                <div class="page-item-title">{{ page.title }}</div>
                <div class="page-item-actions">
                    <el-button type="text" @click.stop="openEditPageDialog(page)">编辑</el-button>
                    <el-button type="text" @click.stop="deletePage(page)">删除</el-button>
                </div>
            </div>
        </div>
        <el-button type="primary" @click="openAddPageDialog">添加页面</el-button>
        <el-dialog :visible.sync="isAddPageDialog" :append-to-body="true" @close="resetAddForm" title="新建页面" width="50%">
            <el-form :model="pageForm" label-width="120px" :rules="rules" ref="addFormRef">
                <el-form-item label="页面名称" prop="title">
                    <el-input v-model="pageForm.title"></el-input>
                </el-form-item>
                <el-form-item label="页面URL" prop="url">
                    <el-input v-model="pageForm.url"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="addPage">保存</el-button>
        </el-dialog>
        <el-dialog :visible.sync="isEdit" :append-to-body="true" @close="resetEditForm" title="编辑页面" width="50%">
            <el-form :model="pageForm" label-width="120px" :rules="rules" ref="editFormRef">
                <el-form-item label="页面名称" prop="title">
                    <el-input v-model="pageForm.title"></el-input>
                </el-form-item>
                <el-form-item label="页面URL" prop="url">
                    <el-input v-model="pageForm.url"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="updateWebPage">保存</el-button>
        </el-dialog>
    </div>
</template>

<script>
import { addWebPage, updateWebPage, getWebPage, deletePage } from '@/api'
import { mapState } from 'vuex'
export default {
    name: 'PageManagement',
    props: {
        pageList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            rules: {
                title: [
                    { required: true, message: '请输入页面名称', trigger: 'blur' }
                ],
                url: [
                    { required: true, message: '请输入页面URL', trigger: 'blur' }
                ]
            },
            pageForm: {
                title: '',
                url: ''
            },
            isEdit: false,
            webId: this.$route.query.webId,
            isAddPageDialog: false,
        }
    },
    watch: {
        'currentPage'(newVal) {
            this.pageForm = { ...newVal };
        }
    },
    computed: {
        ...mapState('data', ['currentPage'])
    },
    methods: {
        resetAddForm() {
            this.$refs.addFormRef.resetFields();
        },
        resetEditForm() {
            this.$refs.editFormRef.resetFields();
        },
        openAddPageDialog() {
            this.pageForm = {
                title: '',
                url: ''
            }
            this.isAddPageDialog = true;
        },
        openEditPageDialog(page) {
            this.pageForm = {
                title: page.title,
                url: page.url,
                id: page.id
            }
            this.isEdit = true;
        },
        deletePage(page) {
            deletePage(page.id).then(() => {
                this.$emit('getPageList');
            })
        },
        setCurrentPage(val) {
            this.$store.dispatch('data/setCurrentPage', val)
        },
        setPageElements(val) {
            this.$store.dispatch('data/setPageElements', val)
        },
        setPageConfig(val) {
            this.$store.dispatch('data/setPageConfig', val)
        },
        
        selectPage(page) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            getWebPage(page.id).then(res => {
                this.setCurrentPage({
                    id: res.data.id,
                    title: res.data.title,
                    pageContext: res.data.pageContext,
                    pageHtml: res.data.pageHtml,
                    webId: res.data.webId
                });
                if (res.data.pageContext) {
                    const pageContext = JSON.parse(res.data.pageContext);
                    this.setPageElements(pageContext.elements);
                    this.setPageConfig(pageContext);
                } else {
                    this.setPageElements([]);
                    this.setPageConfig({
                        width: 1200,
                        height: 800,
                        backgroundColor: "#ffffff",
                        showGrid: true,
                        gridSize: 20,
                        gridColor: "rgba(0,0,0,0.1)",
                        showWebsiteNavigation: false,
                        showFooter: false,
                        title: '',
                        url: '',
                    });
                }
                setTimeout(() => {
                    loading.close();
                }, 500)
            });
        },
        updateWebPage() {
            this.$refs.editFormRef.validate((valid) => {
                if (valid) {
                    const currentState = this.currentPage;
                    updateWebPage({ 
                        id: this.pageForm.id,
                        title: this.pageForm.title,
                        webId: this.webId,
                        pageContext: currentState.pageContext,
                        pageHtml: currentState.pageHtml,
                        url: this.pageForm.url
                    }).then(() => {
                        this.isEdit = false;
                        this.$emit('getPageList');
                    })
                }
            })
        },
        addPage() {
            this.$refs.addFormRef.validate((valid) => {
                if (valid) {
                    addWebPage({
                        webId: this.webId,
                        pageContext: '',
                        pageHtml: '',
                        title: this.pageForm.title,
                        url: this.pageForm.url
                    }).then(() => {
                        this.$emit('getPageList');
                        this.isAddPageDialog = false;
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.page-management {
    width: 240px;
    height: 100vh;
    border-right: 1px solid #e8e8e8;
    background: #fff;
    .page-list {
        .page-item {
            cursor: pointer;
            padding: 16px;
            &:hover {
                background: #f0f0f0;
            }
            &.active {
                background: #f0f0f0;
            }
        }
    }
}

.title {
    padding: 16px;
    font-weight: 500;
    border-bottom: 1px solid #e8e8e8;
}
</style>
