<template>
  <div class="home">
    <el-row>
      <el-col :span="2">
        <div class="Left">
          <Navi></Navi>
        </div>
      </el-col>
      <el-col :span="22">
        <div class="Right">
          I am home PAGE!
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
  name: 'HomeView',
  components: {
    Navi,
  }
}
</script>

<style scoped>
.Right {
  background-color: red;
  text-align: center;
  font-size: 64px;
}
</style>
