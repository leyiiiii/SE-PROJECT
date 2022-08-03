<template>
  <div>
    <h3>我是编辑文章页面</h3>
    <el-row class="mb-4">
      <el-button type="success" @click="mark">保存</el-button>
    </el-row>
    <Editor></Editor>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
import axios from "axios";
import {stringify} from "qs";
export default {
  name: "Writer",
  components:{
    Editor,
  },
  methods:{
    mark()
    {
      axios({
        method:'get',
        url:'',
        data: qs.stringify({        /* 需要向后端传输的数据，此处使用 qs.stringify 将 json 数据序列化以发送后端 */

        })
      }).then(res => {                  /* res 是 response 的缩写 */
        if (res.data.content)       /* res.data 是后端返回的数据对象 */
          this.editor.children = res.data.content;
        else
          alert("获取失败！");
      })
          .catch(err => {                 /* 请求若出现路由找不到等其它异常，则在终端输出错误信息 */
            console.log(err);
          })
    }

  }
}
</script>

<style scoped>

</style>