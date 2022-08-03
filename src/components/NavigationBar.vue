<template>
  <el-row class="Nav">
    <el-col :span="24">
      <el-menu
          class="nav-menu"
          @open="handleOpen"
          @close="handleClose"
          :router="true"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
        <el-menu-item index="/">
          <!-- logo -->
          <i class="el-icon-s-cooperation"></i>
        </el-menu-item>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-office-building"></i>
            <span>团队</span>
          </template>
          <el-menu-item-group>
            <template slot="title">已加入团队</template>
            <el-menu-item index="/team">团队1</el-menu-item>
            <el-menu-item index="/team">团队2</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-document"></i>
          <span slot="title">文档</span>
        </el-menu-item>

        <el-submenu index="/design">
          <template slot="title">
            <i class="el-icon-brush"></i>
            <span>原型设计</span>
          </template>
          <el-menu-item-group>
            <template slot="title">原型设计页面</template>
            <el-menu-item index="/design">页面1</el-menu-item>
            <el-menu-item index="/design2">页面2</el-menu-item>
            <el-menu-item index="/design3">页面3</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-menu-item index="/invite">
          <i class="el-icon-postcard"></i>
          <span slot="title">邀请</span>
        </el-menu-item>
        <el-menu-item index="/login">
          <i class="el-icon-user-solid"></i>
          <span slot="title">登录
        </span>
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
.el-submenu .el-menu-item {
  min-width: auto;
}

.Nav {
  background-color: #545c64;
  height: 100vh;
  width: 130px;
}

.el-icon-s-cooperation {
  margin-left: 30px;
}

.el-menu {
  border-right: none;
}
</style>