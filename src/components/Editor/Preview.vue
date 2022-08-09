<template>
  <div ref="container" class="bg">
    <!--    <el-button v-if="!isScreenshot" class="close" @click="close">关闭</el-button>-->
    <el-button class="back" @click="back">返回</el-button>
    <el-button class="getAddress" @click="dialogVisible = true">生成预览链接</el-button>
    <el-dialog
        append-to-body="true"
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
      <h3>复制以下链接，在浏览器打开以观看原型设计页面预览图:</h3>
      <p>{{ currentWebsiteLink }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-select class="selectPage" v-model="value" clearable placeholder="切换页面" @change="select(value)">
      <el-option :key="index" v-for="(item, index) in designList" :value="'页面'+(index+1)+'：'+item.title">
        {{ '页面' + (index + 1) + '：' + item.title }}
      </el-option>
    </el-select>
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
      designList: [],
      value: "",
      status: false,
      dialogVisible: false,
      currentWebsiteLink: window.location.href
    }
  },
  computed: mapState([
    'componentData',
    'canvasStyleData',
  ]),

  created() {
    var header = {};
    if (localStorage.getItem("token"))
      header = {Authorization: "Bearer " + localStorage.getItem("token")};

    this.$axios({
      method: "get",
      url: "/api/v1/diagram/list?belongTo=" + this.$route.params.id.split("&")[0],
      headers: header,
    })
        .then((res) => {
          this.designList = res.data.results;

          console.log(this.designList)
          // console.log(this.designList[0].componentData)
        })
        .catch((err) => {
          console.log(err);
        });

    header = {};
    if (localStorage.getItem("token"))
      header = {Authorization: "Bearer " + localStorage.getItem("token")};

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

    back() {
      this.$router.back();
    },

    getAddress() {
      this.$message(window.location.href);
    },

    select(value) {
      let x = value.split('：')[0].substring(2, value.indexOf('：'));
      this.$store.commit("setCanvasStyle", JSON.parse(this.designList[x - 1].canvasStyleData));
      this.$store.commit("setComponentData", JSON.parse(this.designList[x - 1].componentData));
      this.$set(this, 'copyData', deepCopy(JSON.parse(this.designList[x - 1].componentData)))

      var arr = this.$route.params.id.split("&");
      var projectId = arr[0];
      var designId = this.designList[x - 1].id;
      var path = this.currentWebsiteLink.split("/preview")[0] + "/preview/" + projectId + "&design&" + designId;
      this.currentWebsiteLink = path
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
  background: rgb(0, 0, 0, .1);
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

  .selectPage {
    position: absolute;
    left: 300px;
    top: 20px;
  }
}
</style>
