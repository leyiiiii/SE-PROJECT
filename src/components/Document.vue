<template>
  <el-row>
    <el-col :span="3">
      <div class="content">
        <div class="content-title">
          <i class="el-icon-s-unfold"></i>
          文档
          <div class="add-icon" @click="add">+</div>
        </div>
        <li v-for="item in documentList" :key="item.id">
          <div class="list-box" @click="openDoc(item.id)">
            <i class="el-icon-document"></i>
            {{ item.title }}
          </div>
          <i class="el-icon-delete" @click="remove(item.id)"></i>
        </li>
      </div></el-col>
    <el-col :span="18" :offset="1">
      <div class="doc-title" v-if="status">{{ title }}
        <i class="el-icon-edit" @click="changeTitle"></i>
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
    Editor
},
  data() {
    return {
      isOpenADoc: true,
      status:false,
      iconFormVisible: false,
      userInfo: {},
      dialogTitle: '增加',
      rowIndex: null,
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
    };
  },
  created() {
    var arr = this.$route.params.id.split("&");
    this.projectId = arr[0];
    this.getDocument();
    if(arr.length > 2) {
      this.isOpenADoc = true;
      this.documentId = arr[2];
      this.getDocDetail();
    }
    else this.isOpenADoc = false;
  },
  methods: {
    changeTitle() {
      this.$prompt('更改文档名字', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          let formData = new FormData();
          formData.append("title", value);
          formData.append("documentId", this.documentId);
          var header = {};
          if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

          this.$axios({
            method: "put",
            url: "/api/v1/document/" + this.documentId,
            data: formData,
            headers: header,
          })
          .then((res) => {
            console.log(res.data)
          })
          .catch((err) =>{
            console.log(err);
          });
          this.$message({
            type: 'success',
            message: '更改成功'
          });
          window.location.reload();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    openDoc(id) {
      this.$router.replace("/project/" + this.projectId + "&doc&" + id);
      window.location.reload();
    },
    add() {
      let formData = new FormData();
      formData.append("title", "Unknown Document");
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
    // 删除
    remove(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var header = {};
          if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

          this.$axios({
            method: "delete",
            url: "/api/v1/document/" + id,
            headers: header,
          })
          .then((res) => {
            console.log(res.data)
          })
          .catch((err) =>{
            console.log(err);
          });

          this.$message({
            type: 'success',
            message: '删除成功!'
          });

          window.location.reload()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    async getDocDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
        method: "get",
        url: "/api/v1/document/" + this.documentId,
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
      .catch((err) =>{
        console.log(err);
      });
    },
    getDocument() {
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
        if(this.documentList.length > 0) {
                this.haveDocument = true;
            }
      })
      .catch((err) =>{
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
.el-icon-edit:hover {
  color: gray;
  cursor: pointer;
}
.el-icon-edit {
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
.add-icon:hover, .content li:hover {
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