<template>
  <el-row>
    <el-col :span="3">
      <div class="content">
        <div v-if="!isTeamDoc" class="content-title">
          <i class="el-icon-s-unfold"></i>
          文档
          <div class="add-icon" @click="add">+</div>
        </div>
        <div v-else class="content-title">
          <i class="el-icon-s-unfold"></i>
          文档中心
          <div class="add-icon" @click="add">+</div>
        </div>
        <div v-if="!isTeamDoc">
          <li v-for="item in documentList" :key="item.id">
            <div class="list-box" @click="openDoc(item.id)">
              <i class="el-icon-document"></i>
              {{ item.title }}
            </div>
            <i class="el-icon-delete" @click="remove(item.id)"></i>
          </li>
        </div>
        <div v-else></div>
      </div>
    </el-col>
    <el-col :span="18" :offset="1">
      <div class="doc-title" v-if="status">
        {{ title }}
        <el-tooltip class="item" effect="dark" content="修改文件名" placement="top">
          <i class="el-icon-edit" @click="changeTitle"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="保存" placement="top">
          <i class="el-icon-upload" @click="saveDoc"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="退出编辑" placement="top">
          <i class="el-icon-check" @click="endEdit"></i>
        </el-tooltip>
      </div>
      <Editor v-if="isOpenADoc"></Editor>
    </el-col>
  </el-row>
</template>

<script>
import Editor from "@/components/Editor";
export default {
  name: "test",
  components: {
    Editor,
  },
  data() {
    return {
      isTeamDoc: false,
      isOpenADoc: true,
      status1: false,
      status: false,
      iconFormVisible: false,
      userInfo: {},
      dialogTitle: "增加",
      rowIndex: null,
      teamId: "",
      projectId: "",
      haveDocument: false,
      documentId: "",
      title: "",
      documentContent: "",
      createdAt: "",
      createdBy: "",
      belongTo: "",
      updatedAt: "",
      documentList: [],
      folderList: [[]],
    };
  },
  created() {
    if (this.$route.path.slice(0, 5) == "/team") {
      this.isTeamDoc = true;
      var arr = this.$route.params.id.split("&");
      this.teamId = arr[0];
      this.getTeamDoc();
      if (arr.length > 2) {
        this.isOpenADoc = true;
        this.documentId = arr[2];
        this.getDocDetail();
      } else this.isOpenADoc = false;
    } else {
      var arr = this.$route.params.id.split("&");
      this.projectId = arr[0];
      this.getProjDoc();
      if (arr.length > 2) {
        this.isOpenADoc = true;
        this.documentId = arr[2];
        this.getDocDetail();
      } else this.isOpenADoc = false;
    }
  },
  methods: {
    endEdit() {

    },
    changeTitle() {
      this.$prompt("更改文档名字", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          let formData = new FormData();
          formData.append("title", value);
          formData.append("documentId", this.documentId);
          var header = {};
          if (localStorage.getItem("token"))
            header = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            };

          this.$axios({
            method: "put",
            url: "/api/v1/document/" + this.teamId + "/" + this.documentId,
            data: formData,
            headers: header,
          })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "更改成功",
          });
          window.location.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    openDoc(id) {
      this.$router.replace("/project/" + this.projectId + "&doc&" + id);
      window.location.reload();
    },
    add() {
      let formData = new FormData();
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
        .catch((err) => {
          console.log(err);
        });
    },
    saveDoc() {
      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("content", JSON.stringify(this.html));
      formData.append("documentId", this.documentId);

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "put",
        url: "/api/v1/document/" + this.teamId + "/" + this.documentId,
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    remove(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var header = {};
          if (localStorage.getItem("token"))
            header = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            };

          this.$axios({
            method: "delete",
            url: "/api/v1/document/" + this.teamId + "/" + id,
            headers: header,
          })
            .then((res) => {
              console.log(res.data);
              this.$message({
                type: "success",
                message: "删除成功!",
              });

              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async getDocDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      await this.$axios({
        method: "get",
        url: "/api/v1/project/" + this.projectId,
        headers: header,
      })
        .then((res) => {
          this.teamId = res.data.belongTo;
        })
        .catch((err) => {
          console.log(err);
        });
      this.$axios({
        method: "get",
        url: "/api/v1/document/" + this.teamId + "/" + this.documentId,
        headers: header,
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
          this.status = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getProjDoc() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "get",
        url: "/api/v1/document/list?belongTo=" + this.projectId,
        headers: header,
      })
        .then((res) => {
          console.log(res.data.results);
          this.documentList = res.data.results;
          if (this.documentList.length > 0) {
            this.haveDocument = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getTeamDoc() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "get",
        url: "/api/v1/folder/list?belongTo=" + this.teamId,
        headers: header,
      })
        .then((res) => {
          console.log(res.data.results);
          if (res.data.results.length == 0) return;
          var folderArr = [];
          folderArr = res.data.results;
          console.log("123456", folderArr);
          for (let i = 0; i < folderArr.length; i++) {
            this.$axios({
              method: "get",
              url: "/api/v1/document/list?belongFolder=" + folderArr[i].id,
              headers: header,
            })
              .then((res) => {
                console.log("!!!!", res.data);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.doc-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}
.el-icon-edit:hover,
.el-icon-upload:hover {
  color: gray;
  cursor: pointer;
}
.el-icon-edit,
.el-icon-upload {
  margin: 0 10px 0 0;
  color: lightgray;
}
.el-icon-delete:hover {
  color: crimson;
}
.el-icon-delete {
  display: inline-block;
  vertical-align: top;
  font-size: 18px;
  color: lightgray;
  /* outline: 1px black solid; */
}
.add-icon:hover,
.content li:hover {
  cursor: pointer;
}
.add-icon {
  display: inline-block;
  color: darkgray;
  margin-left: 20px;
}
.list-box {
  display: inline-block;
  width: 115px;
}
.content li {
  margin: 5px 0;
}
.content-title {
  margin: 10px 0;
}
.content {
  padding: 10px 20px;
  border-right: 2px lightgray solid;
  height: 100vh;
}
</style>