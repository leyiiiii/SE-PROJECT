<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 450px; overflow-y: hidden"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default Vue.extend({
  components: { Editor, Toolbar },
  data() {
    return {
      documentId: "",
      teamId: "",
      projectId: "",
      title: "",
      description: "",
      documentContent: "",
      createdAt: "",
      createdBy: "",
      belongTo: "",
      updatedAt: "",
      editor: null,
      html: "",
      toolbarConfig: {
        excludeKeys: [
          "bulletedList",
          "numberedList",
          "todo",
          "group-image",
          "group-video",
          "emotion",
        ],
      },
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    async saveDoc() {
      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("content", JSON.stringify(this.html));
      formData.append("documentId", this.documentId);

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
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
    async getDocDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      if(this.$route.path.slice(0, 8) == "/project")
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
          var r = res.data;
          this.html = r.content;
          this.belongTo = r.belongTo;
          this.createdAt = r.createdAt;
          this.updatedAt = r.updatedAt;
          this.createdBy = r.createdBy;
          this.title = r.title;
          this.description = r.description;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    var arr = this.$route.params.id.split("&");
    if(this.$route.path.slice(0, 8) == "/project"){
      this.projectId = arr[0];
    }
    else {
      this.teamId = arr[0]
    }
    this.documentId = arr[2];
    this.getDocDetail();
  },
  beforeRouteUpdate(to, from, next) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    next();
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
});
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>