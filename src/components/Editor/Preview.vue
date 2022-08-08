<template>
  <div ref="container" class="bg">
<!--    <el-button v-if="!isScreenshot" class="close" @click="close">关闭</el-button>-->
    <el-button class="back" @click="back">返回</el-button>
    <el-button class="getAddress" @click="getAddress">生成预览链接</el-button>
    <div class="canvas-container">
      <div
          class="canvas"
          :style="{
                    ...getCanvasStyle(canvasStyleData),
                    width: changeStyleWithScale(canvasStyleData.width) + 'px',
                    height: changeStyleWithScale(canvasStyleData.height) + 'px',
                }"
      >
        <ComponentWrapper
            v-for="(item, index) in copyData"
            :key="index"
            :config="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {getStyle, getCanvasStyle} from '@/utils/style'
import {mapState} from 'vuex'
import ComponentWrapper from './ComponentWrapper'
import {changeStyleWithScale} from '@/utils/translate'
import {deepCopy} from '@/utils/utils'
import * as htmlToImage from 'html-to-image';
import html2canvas from "html2canvas";
import domtoimage from 'dom-to-image';

export default {
  components: {ComponentWrapper},
  props: {
    isScreenshot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copyData: [],
    }
  },
  computed: mapState([
    'componentData',
    'canvasStyleData',
  ]),
  created() {
    var header = {};
    if (localStorage.getItem("token"))
      header = { Authorization: "Bearer " + localStorage.getItem("token") };

    this.$axios({
      method: "get",
      url: "/api/v1/diagram/" + this.$route.params.id.split("&")[2],
      headers: header,
    })
        .then((res) => {
          // console.log("123456", res.data);
          var r = res.data;
          this.title = r.title;
          // console.log("canvasStyle", JSON.parse(r.canvasStyleData))
          this.$store.commit("setCanvasStyle", JSON.parse(r.canvasStyleData));
          this.$store.commit("setComponentData", JSON.parse(r.componentData));
          this.$set(this, 'copyData', deepCopy(JSON.parse(r.componentData)))
        })
        .catch((err) => {
          console.log(err);
        });
  },
  methods: {
    getStyle,
    getCanvasStyle,
    changeStyleWithScale,

    close() {
      this.$emit('close')
    },

    back(){
      this.$router.back();
    },

    getAddress() {
      this.$message(window.location.href);
    }
  },
}
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: rgb(0, 0, 0, .5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;

  .canvas-container {
    width: calc(100% - 40px);
    height: calc(100% - 120px);
    overflow: auto;

    .canvas {
      background: #fff;
      position: relative;
      margin: auto;
    }
  }

  .close {
    position: absolute;
    right: 20px;
    top: 20px;
  }

  .back {
    position: absolute;
    left: 20px;
    top: 20px;
  }

  .getAddress {
    position: absolute;
    left: 120px;
    top: 20px;
  }
}
</style>
