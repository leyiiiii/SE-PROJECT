<template>
  <el-row>
    <el-col :span="2">
      <div class="Left">
        <Navi></Navi>
      </div>
    </el-col>
    <el-col :span="2">
      <div class="content">
        <div class="project-name">{{ projectName }}</div>
        <div class="content-title">
          <i class="el-icon-s-unfold"></i>
          文档
          <div class="add-icon" @click="add">+</div>
        </div>
        <li v-for="item in documentList" :key="item.id" @click="openDoc(item.id)">
          <i class="el-icon-document"></i>
          {{ item.title }}
        </li>
      </div></el-col>
    <el-col :span="18" :offset="1">
      <Editor v-if="isOpenADoc"></Editor>
    </el-col>
  </el-row>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Navi from '@/components/NavigationBar.vue';
import Editor from "@/components/Editor";
export default {
  name: "test",
  components: {
    Navi,
    Editor
},
  data() {
    return {
      isOpenADoc: true,
      iconFormVisible: false,
      userInfo: {},
      dialogTitle: '增加',
      rowIndex: null,
      projectId: "",
      projectName: "",
      haveDocument: false,
      documentId: "",
      title: "",
      description: "",
      documentContent: "",
      createdAt: "",
      createdBy: "",
      belongTo: "",
      updatedAt: "",
      documentList: [],
    };
  },
  created() {
    var arr = this.$route.params.id.split("&");
    this.projectId = arr[0];
    if(arr.length > 1) {
      this.isOpenADoc = true;
      this.documentId = arr[1];
      this.getDocDetail();
    }
    else this.isOpenADoc = false;
    this.getProject();
    this.getDocument();
  },
  methods: {
    openDoc(id) {
      this.$router.replace("/document/" + this.projectId + "&" + id);
      window.location.reload();
    },
    ...mapActions([
    ]),
    // 增加
    add() {
      this.isOpenADoc = true;
    },
    // 编辑
    handleEdit(index, row) {
      this.dialogTitle = '编辑';
      this.userInfo = row;
      this.iconFormVisible = true;
      this.rowIndex = index;
    },
    // 弹窗确定
    submitUser() {
      if (this.dialogTitle === '编辑') {
        this.tableData.splice(this.rowIndex, 1, this.userInfo);
        this.iconFormVisible = false;
        return;
      }
      this.tableData.splice(0, 0, this.userInfo);
      this.iconFormVisible = false;
    },
    // 删除
    remove(index, row) {
      this.$confirm(`确定删除${row.name}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      }).then(() => {
        this.tableData.splice(index, 1);
      });
    },
    getDocDetail() {
      this.$axios({
        method: "get",
        url: "/api/v1/document/" + this.documentId,
      })
      .then((res) => {
        console.log(res.data);
        var r = res.data;
        this.documentContent = r.content;
        this.belongTo = r.belongTo;
        this.createdAt = r.createdAt;
        this.updatedAt = r.updatedAt;
        this.createdBy = r.createdBy;
        this.title = r.title;
        this.description = r.description;
      })
      .catch((err) =>{
        console.log(err);
      });
    },
    getDocument() {
        this.$axios({
        method: "get",
        url: "/api/v1/document/list?belongTo=" + this.projectId,
      })
      .then((res) => {
        console.log(res.data.results);
        this.documentList = res.data.results;
        if(this.documentList.length > 0) {
                this.haveDocument = true;
            }
      })
      .catch((err) =>{
        console.log(err);
      });
    },
    getProject() {
      this.$axios({
        method: "get",
        url: "/api/v1/project/" + this.projectId,
      })
      .then((res) => {
        this.projectId = this.projectId;
        this.projectName = res.data.title;
      })
      .catch((err) =>{
        console.log(err);
      });
    }
  },
  computed: {
    ...mapGetters({
    }),
  },
};

</script>

<style scoped>
.add-icon:hover, .content li:hover {
  cursor: pointer;
}
.add-icon {
  display: inline-block;
  color: darkgray;
  margin-left: 20px;
}
.content li {
  margin: 5px 0;
}
.content-title {
  margin: 10px 0;
}
.content {
  padding: 10px 20px;
  background-color: beige;
  height: 100vh;
}
.project-name {
  font-weight: 600;
}
</style>