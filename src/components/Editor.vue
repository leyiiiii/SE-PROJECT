<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden"
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
      title: "",
      description: "",
      documentContent: "",
      createdAt: "",
      createdBy: "",
      belongTo: "",
      updatedAt: "",
      editor: null,
      html: "",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    saveDoc() {
      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("description", this.description);
      formData.append("content", JSON.stringify(this.html));
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
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getDocDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      this.$axios({
        method: "get",
        url: "/api/v1/document/" + this.documentId,
        headers: header,
      })
        .then((res) => {
          console.log("aaa", res.data);
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
    handleSpecialCharacters(jsonStr) {
      let obj = {};
      if (jsonStr && Object.prototype.toString.call(jsonStr) == "[object String]" && jsonStr != 'null') {
        jsonStr = jsonStr.replace(/\r/g, "\\r");
        jsonStr = jsonStr.replace(/\n/g, "\\n");
        jsonStr = jsonStr.replace(/\t/g, "\\t");
        jsonStr = jsonStr.replace(/\\/g, "\\\\");
        jsonStr = jsonStr.replace(/\'/g, "&#39;");
        jsonStr = jsonStr.replace(/ /g, "&nbsp;");
        jsonStr = jsonStr.replace(/</g, "$lt;");
        jsonStr = jsonStr.replace(/>/g, "$gt;");
        obj = JSON.parse(jsonStr)
      }
      return obj;
    }
  },
  mounted() {
    var arr = this.$route.params.id.split("&");
    this.documentId = arr[2];
    this.getDocDetail();
    window.setInterval(() => {
      setTimeout(this.saveDoc(), 0)
    }, 1000);
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
});
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>