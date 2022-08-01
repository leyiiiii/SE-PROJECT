<template>
<el-row class="Nav">
  <el-col :span="24">
    <el-menu
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item>
        <i class="el-icon-s-cooperation"></i>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>团队</span>
        </template>
        <el-menu-item-group>
          <template slot="title">已加入团队</template>
          <el-menu-item index="1-1">团队1</el-menu-item>
          <el-menu-item index="1-2">团队2</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</el-row>
</template>

<script>
  export default {
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>
.el-submenu .el-menu-item{
    min-width: auto;
}
.Nav{
    background-color: #545c64;
    height: 100vh;
}
.el-icon-s-cooperation{
    margin-left: 30px;
}
.el-menu{
    border-right: none;
}
</style>