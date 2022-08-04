<template>
<el-row>
  <el-col :span="3">
    <div class="design-content">
      <div class="project-name">{{ projectName }}</div>
      <div class="content-title">
        <i class="el-icon-s-unfold"></i>
        设计原型
        <div class="add-icon" @click="add">+</div>
      </div>
      <li v-for="item in designList" :key="item.id" @click="openFile(item.id)">
        <i class="el-icon-document"></i>
        {{ item.title }}
      </li>
    </div></el-col
  >
  <el-col :span="21">
    <div v-if="isOpenAFile" class="design">
      <main>
        <Toolbar />
        <!-- 左侧组件列表 -->

        <section class="left">
          <ComponentList />
          <RealTimeComponentList />
        </section>
        <!-- 中间画布 -->
        <section class="center">
          <div
            class="content"
            @drop="handleDrop"
            @dragover="handleDragOver"
            @mousedown="handleMouseDown"
            @mouseup="deselectCurComponent"
          >
            <Editor />
          </div>
        </section>
        <!-- 右侧属性列表 -->
        <section class="right">
          <el-tabs v-if="curComponent" v-model="activeName">
            <el-tab-pane label="属性" name="attr">
              <component :is="curComponent.component + 'Attr'" />
            </el-tab-pane>
            <el-tab-pane
              label="动画"
              name="animation"
              style="padding-top: 20px"
            >
              <AnimationList />
            </el-tab-pane>
            <el-tab-pane label="事件" name="events" style="padding-top: 20px">
              <EventList />
            </el-tab-pane>
          </el-tabs>
          <CanvasAttr v-else></CanvasAttr>
        </section>
      </main>
    </div>
  </el-col></el-row>
</template>

<script>
import Editor from "@/components/Editor/index";
import ComponentList from "@/components/ComponentList"; // 左侧列表组件
import AnimationList from "@/components/AnimationList"; // 右侧动画列表
import EventList from "@/components/EventList"; // 右侧事件列表
import componentList from "@/custom-component/component-list"; // 左侧列表数据
import Toolbar from "@/components/Toolbar";
import { deepCopy } from "@/utils/utils";
import { mapState } from "vuex";
import generateID from "@/utils/generateID";
import { listenGlobalKeyDown } from "@/utils/shortcutKey";
import RealTimeComponentList from "@/components/RealTimeComponentList";
import CanvasAttr from "@/components/CanvasAttr";
import NavigationBar from "@/components/NavigationBar";

export default {
  components: {
    NavigationBar,
    Editor,
    ComponentList,
    AnimationList,
    EventList,
    Toolbar,
    RealTimeComponentList,
    CanvasAttr,
  },
  data() {
    return {
      activeName: "attr",
      reSelectAnimateIndex: undefined,
      isOpenAFile: true,
      designId: "",
      designList: [],
    };
  },
  computed: mapState([
    "componentData",
    "curComponent",
    "isClickComponent",
    "canvasStyleData",
    "editor",
  ]),
  created() {
    var arr = this.$route.params.id.split("&");
    this.projectId = arr[0];
    this.getDesign();
    if(arr.length > 2) {
      this.isOpenAFile = true;
      this.designId = arr[2];
      this.getDesignDetail();
    }
    else this.isOpenAFile = false;

    this.restore();
    // 全局监听按键事件
    listenGlobalKeyDown();
  },
  methods: {
    openFile(id) {
      this.$router.replace("/project/" + this.projectId + "&design&" + id);
      window.location.reload();
    },
    add() {
      let formData = new FormData();
      formData.append("title", "Unknown Document");
      formData.append("description", "文档描述");
      formData.append("content", JSON.stringify("<p>this is a document</p>"));
      formData.append("projectId", this.projectId);

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "post",
        url: "/api/v1/document/create/" + this.projectId,
        data: formData,
        headers: header,
      })
      .then((res) => {
        console.log(res.data);
        this.openDoc(res.data.id);
      })
      .catch((err) =>{
        console.log(err);
      });
    },

    restore() {
      // 用保存的数据恢复画布
      if (localStorage.getItem("canvasData")) {
        this.$store.commit(
          "setComponentData",
          JSON.parse(localStorage.getItem("canvasData"))
        );
      }

      if (localStorage.getItem("canvasStyle")) {
        this.$store.commit(
          "setCanvasStyle",
          JSON.parse(localStorage.getItem("canvasStyle"))
        );
      }
    },

    handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      const index = e.dataTransfer.getData("index");
      const rectInfo = this.editor.getBoundingClientRect();
      if (index) {
        const component = deepCopy(componentList[index]);
        component.style.top = e.clientY - rectInfo.y;
        component.style.left = e.clientX - rectInfo.x;
        component.id = generateID();
        this.$store.commit("addComponent", { component });
        this.$store.commit("recordSnapshot");
      }
    },

    handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },

    handleMouseDown(e) {
      e.stopPropagation();
      this.$store.commit("setClickComponentStatus", false);
      this.$store.commit("setInEditorStatus", true);
    },

    deselectCurComponent(e) {
      if (!this.isClickComponent) {
        this.$store.commit("setCurComponent", { component: null, index: null });
      }

      // 0 左击 1 滚轮 2 右击
      if (e.button != 2) {
        this.$store.commit("hideContextMenu");
      }
    },
    async getDesignDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
        method: "get",
        url: "/api/v1/diagram/" + this.designId,
        headers: header,
      })
      .then((res) => {
        console.log(res.data);
        var r = res.data;
        // this.documentContent = r.content;
        // this.belongTo = r.belongTo;
        // this.createdAt = r.createdAt;
        // this.updatedAt = r.updatedAt;
        // this.createdBy = r.createdBy;
        // this.title = r.title;
        // this.description = r.description;
        // this.status = true;
      })
      .catch((err) =>{
        console.log(err);
      });
    },
    getDesign() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "get",
        url: "/api/v1/diagram/list?belongTo=" + this.projectId,
        headers: header,
      })
      .then((res) => {
        this.designList = res.data.results
      })
      .catch((err) =>{
        console.log(err);
      });
    },
  },
};
</script>

<style lang="scss">
.design {
  height: 100vh;
  background: #fff;

  main {
    height: calc(100% - 64px);
    position: relative;

    .left {
      //margin-left: 130px;
      position: absolute;
      height: 100%;
      width: 200px;
      left: 10px;
      top: 70px;

      & > div {
        overflow: auto;

        &:first-child {
          border-bottom: 1px solid #ddd;
        }
      }
    }

    .right {
      position: absolute;
      height: 100%;
      width: 288px;
      right: 0;
      top: 70px;

      .el-select {
        width: 100%;
      }
    }

    .center {
      margin-left: 330px;
      margin-right: 288px;
      background: #f5f5f5;
      height: 100%;
      overflow: auto;
      padding: 20px;

      .content {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }
  }

  .placeholder {
    text-align: center;
    color: #333;
  }

  .global-attr {
    padding: 10px;
  }
}
.add-icon:hover, .design-content li:hover {
  cursor: pointer;
}
.add-icon {
  display: inline-block;
  color: darkgray;
  margin-left: 20px;
}
.design-content li {
  margin: 5px 0;
}
.content-title {
  margin: 10px 0;
}
.design-content {
  padding: 10px 20px;
  // background-color: beige;
  border-right: 2px lightgray solid;
  height: 100vh;
}
.project-name {
  font-weight: 600;
}
</style>
