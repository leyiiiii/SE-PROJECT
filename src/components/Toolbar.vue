<template>
  <div>
    <div class="toolbar">
      <el-select class="select" v-model="value" clearable placeholder="选择模版">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="useTemplate">使用模版</el-button>
      <el-button @click="undo">撤消</el-button>
      <el-button @click="redo">重做</el-button>
      <label for="input" class="insert">插入图片</label>
      <input id="input" type="file" hidden @change="handleFileChange"/>
      <el-button style="margin-left: 10px" @click="preview(false)">预览</el-button>
      <el-button @click="save">保存</el-button>
      <el-button @click="clearCanvas">清空</el-button>
      <el-button :disabled="!areaData.components.length" @click="compose">组合</el-button>
      <el-button
          :disabled="
          !curComponent ||
          curComponent.isLock ||
          curComponent.component != 'Group'
        "
          @click="decompose">拆分
      </el-button>
      <el-button :disabled="!curComponent || curComponent.isLock" @click="lock">锁定</el-button>
      <el-button
          :disabled="!curComponent || !curComponent.isLock"
          @click="unlock">解锁
      </el-button>
      <el-button @click="downloadAsJPG">下载为JPG</el-button>
      <el-button @click="downloadAsPNG">下载为PNG</el-button>

      <div class="canvas-config">
        <span>画布大小</span>
        <input v-model="canvasStyleData.width"/>
        <span>*</span>
        <input v-model="canvasStyleData.height"/>
      </div>
      <div class="canvas-config">
        <span>画布比例</span>
        <input v-model="scale" @input="handleScaleChange"/> %
      </div>
    </div>

    <!-- 预览 -->
    <Preview
        v-if="isShowPreview"
        :is-screenshot="isScreenshot"
        @close="handlePreviewChange"
    />
  </div>
</template>

<script>
import generateID from "@/utils/generateID";
import toast from "@/utils/toast";
import {mapState} from "vuex";
import Preview from "@/components/Editor/Preview";
import {commonStyle, commonAttr} from "@/custom-component/component-list";
import eventBus from "@/utils/eventBus";
import {deepCopy, $} from "@/utils/utils";
import {divide, multiply} from "mathjs";
import {toJpeg, toPng} from "html-to-image";

export default {
  components: {Preview},
  data() {
    return {
      diagramId: "",
      isShowPreview: false,
      needToChange: ["top", "left", "width", "height", "fontSize"],
      scale: "100%",
      timer: null,
      isScreenshot: false,
      options: [{
        value: '线上商城设计模板',
        label: '线上商城设计模板'
      }, {
        value: '学术成果分享平台模板',
        label: '学术成果分享平台模板'
      }],
      value: ''
    };
  },
  computed: mapState([
    "componentData",
    "canvasStyleData",
    "areaData",
    "curComponent",
    "curComponentIndex",
  ]),
  created() {
    eventBus.$on("preview", this.preview);
    eventBus.$on("save", this.save);
    eventBus.$on("clearCanvas", this.clearCanvas);

    this.scale = this.canvasStyleData.scale;

    var arr = this.$route.params.id.split("&");
    this.diagramId = arr[2];
  },
  methods: {
    getFontSize(scale) {
      if (scale >= 90) {
        return 15;
      } else if (scale >= 70) {
        return 14;
      } else if (scale >= 65) {
        return 13;
      } else if (scale >= 60) {
        return 12;
      } else if (scale >= 55) {
        return 11;
      } else if (scale >= 50) {
        return 10;
      } else if (scale >= 45) {
        return 9;
      } else if (scale >= 40) {
        return 8;
      } else if (scale >= 35) {
        return 7;
      } else return 6;
    },

    format(value) {
      return multiply(value, divide(parseFloat(this.scale), 100));
    },

    getOriginStyle(value) {
      return divide(value, divide(parseFloat(this.canvasStyleData.scale), 100));
    },

    handleScaleChange() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 画布比例设一个最小值，不能为 0
        // eslint-disable-next-line no-bitwise
        this.scale = ~~this.scale || 1;
        const componentData = deepCopy(this.componentData);
        componentData.forEach((component) => {
          Object.keys(component.style).forEach((key) => {
            if (this.needToChange.includes(key)) {
              if (key === "fontSize" && component.style[key] === "") return;

              // 根据原来的比例获取样式原来的尺寸
              // 再用原来的尺寸 * 现在的比例得出新的尺寸
              component.style[key] = this.format(
                  this.getOriginStyle(component.style[key])
              );
            }
          });
        });

        this.$store.commit("setComponentData", componentData);
        // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
        this.$store.commit("setCurComponent", {
          component: componentData[this.curComponentIndex],
          index: this.curComponentIndex,
        });
        this.$store.commit("setCanvasStyle", {
          ...this.canvasStyleData,
          scale: this.scale,
          fontSize: this.getFontSize(this.scale)
        });
      }, 1000);
    },

    lock() {
      this.$store.commit("lock");
    },

    unlock() {
      this.$store.commit("unlock");
    },

    compose() {
      this.$store.commit("compose");
      this.$store.commit("recordSnapshot");
    },

    decompose() {
      this.$store.commit("decompose");
      this.$store.commit("recordSnapshot");
    },

    undo() {
      this.$store.commit("undo");
    },

    redo() {
      this.$store.commit("redo");
    },

    handleFileChange(e) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) {
        toast("只能插入图片");
        return;
      }

      const reader = new FileReader();
      reader.onload = (res) => {
        const fileResult = res.target.result;
        const img = new Image();
        img.onload = () => {

          this.$store.commit("addComponent", {
            component: {
              ...commonAttr,
              id: generateID(),
              component: "Picture",
              label: "图片",
              icon: "",
              propValue: {
                url: fileResult,
                flip: {
                  horizontal: false,
                  vertical: false,
                },
              },
              style: {
                ...commonStyle,
                top: 0,
                left: 0,
                width: img.width,
                height: img.height,
              },
            },
          });

          this.$store.commit("recordSnapshot");

          // 修复重复上传同一文件，@change 不触发的问题
          $("#input").setAttribute("type", "text");
          $("#input").setAttribute("type", "file");

          //   console.log(res.target);
          //   let formData = new FormData();
          //   formData.append("img", fileResult);
          //   var header = {};
          //   if (localStorage.getItem("token"))
          //     header = { Authorization: "Bearer " + localStorage.getItem("token") };
          //   this.$axios({
          //     method: "post",
          //     url: "/api/v1/image/",
          //     data: formData,
          //     headers: header,
          //   })
          //     .then((res) => {
          //       console.log(res);
          //     })
          //     .catch((err) => {
          //       console.log(err);
          //     });
        };

        img.src = fileResult;
      };

      reader.readAsDataURL(file);
    },

    preview(isScreenshot) {
      this.save();
      this.isScreenshot = isScreenshot;
      this.isShowPreview = true;
      this.$store.commit("setEditMode", "preview");

      // note
      var arr = this.$route.params.id.split("&");
      var projectId = arr[0];
      var designId = arr[2];
      var path = "/preview/" + projectId + "&design&" + designId;
      this.$router.push({path: path})
    },

    downloadAsJPG() {
      toJpeg(document.getElementById("editor"),)
          .then(dataUrl => {
            var link = document.createElement('a');
            link.download = 'screenshot.jpeg';
            link.href = dataUrl;
            link.click();
          })
          .catch(error => {
            console.error('oops, something went wrong!', error)
          })
          .finally(this.close);
    },

    downloadAsPNG() {
      toPng(document.getElementById("editor"),)
          .then(dataUrl => {
            const a = document.createElement('a')
            a.setAttribute('download', 'screenshot')
            a.href = dataUrl
            a.click()
          })
          .catch(error => {
            console.error('oops, something went wrong!', error)
          })
          .finally(this.close);
    },

    save() {
      localStorage.setItem("canvasData", JSON.stringify(this.componentData));
      localStorage.setItem("canvasStyle", JSON.stringify(this.canvasStyleData));
      // console.log("component data:", this.componentData);
      //console.log(JSON.stringify(this.componentData));
      // console.log("canvas style:", this.canvasStyleData);
      //console.log(JSON.stringify(this.canvasStyleData));

      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("componentData", JSON.stringify(this.componentData));
      formData.append("canvasStyleData", JSON.stringify(this.canvasStyleData));
      formData.append("diagramId", this.diagramId);

      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "put",
        url: "/api/v1/diagram/" + this.diagramId,
        data: formData,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("保存成功");
          })
          .catch((err) => {
            console.log(err);
          });
    },

    clearCanvas() {
      this.$store.commit("setCurComponent", {component: null, index: null});
      this.$store.commit("setComponentData", []);
      this.$store.commit("recordSnapshot");
    },

    handlePreviewChange() {
      this.isShowPreview = false;
      this.$store.commit("setEditMode", "edit");
    },

    useTemplate() {
      let componentData = this.$store.state._componentData_;
      let canvasStyleData = this.$store.state._canvasStyleData_;

      let x = 0;
      if (this.value === "线上商城设计模板") {
        x = 1;
      } else if (this.value === "学术成果分享平台模板") {
        x = 2;
      } else {
        return;
      }

      this.$store.commit("setComponentData", componentData[x]);
      this.$store.commit("setCanvasStyle", {
        ...canvasStyleData[x],
        fontSize: this.getFontSize(canvasStyleData[x].scale)
      });
    },
  },

};
</script>

<style lang="scss" scoped>
.select {
  width: 120px;
  margin-right: 10px;
}

.toolbar {
  padding: 15px 10px;
  white-space: nowrap;
  overflow-x: auto;
  background: #fff;
  border-bottom: 1px solid #ddd;

  .canvas-config {
    display: inline-block;
    margin-left: 10px;
    font-size: 14px;
    color: #606266;

    input {
      width: 50px;
      margin-left: 4px;
      outline: none;
      padding: 0 5px;
      border: 1px solid #ddd;
      color: #606266;
    }

    span {
      margin-left: 10px;
    }
  }

  .insert {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: 0.1s;
    font-weight: 500;
    padding: 15px;
    font-size: 12px;
    border-radius: 3px;
    margin-left: 10px;
    width: 71px;
    height: 40px;

    &:active {
      color: #3a8ee6;
      border-color: #3a8ee6;
      outline: 0;
    }

    &:hover {
      background-color: #ecf5ff;
      color: #3a8ee6;
    }
  }
}
</style>
