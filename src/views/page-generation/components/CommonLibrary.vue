<template>
  <div class="component-library">
    <div class="title">公共组件</div>
    <div class="common-list" v-for="item in commonList" :key="item.id">
      <div class="common-item">
        <span>{{ item.id }}</span>
      </div>
      <div class="common-item-actions">
        <el-button type="text" @click="addCommon(item)">添加1</el-button>
        <el-button type="text" @click="deleteItem(item.id)">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCommonList, deleteCommon } from "@/api";
import { mapState } from "vuex";
export default {
  name: "CommonLibrary",
  data() {
    return {
      commonList: [],
    };
  },
  mounted() {
    this.getCommonList();
  },
  computed: {
    ...mapState("data", ["pageElements", "pageConfig"]),
  },
  methods: {
    setPageElements(val) {
      this.$store.dispatch("data/setPageElements", val);
    },
    setPageConfig(val) {
      this.$store.dispatch("data/setPageConfig", val);
    },

    async getCommonList() {
      const res = await getCommonList(this.$route.query.webId);
      return res;
    },
    async deleteCommon(id) {
      const res = await deleteCommon(id);
      return res;
    },

    addElementToPage(element) {
      const newElements = [...this.pageElements, element];
      this.setPageElements(newElements);

      const pageConfig = {
        ...this.pageConfig,
        elements: [...this.pageConfig.elements, element],
      };
      this.setPageConfig(pageConfig);
    },

    addCommon(item) {
      const context = JSON.parse(item.context);
      context.commonId = context.props.commonId;
      this.addElementToPage(context);
    },
    deleteItem(id) {
      this.deleteCommon(id).then(() => {
        this.getCommonList().then((res) => {
          this.commonList = res.data;
        });
      });
    },
  },
};
</script>

<style scoped>
.component-library {
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
