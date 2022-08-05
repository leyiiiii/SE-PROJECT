<template>
  <el-row class="Nav">
    <el-col :span="24">
      <el-menu
          class="nav-menu"
          @open="handleOpen"
          @close="handleClose"
          :router="true">
        <el-menu-item index="/">
          <!-- logo -->
          <i class="el-icon-collection"></i>
          <span class="mainTitle">墨</span>
        </el-menu-item>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-office-building"></i>
            <span>团队</span>
          </template>
          <el-menu-item-group>
            <template slot="title">已加入团队</template>
            <el-menu-item v-for="item in joinedTeam" :key="item.index" @click=toTeam(item.id)>{{ item.teamName }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-menu-item @click="toInvitation">
          <i class="el-icon-postcard"></i>
          <span slot="title">邀请</span>
        </el-menu-item>
        <el-menu-item v-if="!isLogin" index="/login">
          <i class="el-icon-user-solid"></i>
          <span slot="title">登录
        </span>
        </el-menu-item>
        <el-menu-item v-else @click="Logout">
          <i class="el-icon-finished"></i>
          <span slot="title">登出
        </span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import user from "@/store/user";

export default {
  data() {
    return {
      isLogin: false,
      joinedTeam:[],
    }
  },
  created() {
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if(userInfo) {
      this.isLogin = true;
    }
  },
  mounted() {
    this.getJoinedTeam();
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    Logout() {
      localStorage.removeItem("token");
      this.$store.dispatch("clear");
      this.$message.success("登出成功");
      setTimeout(() => {
        this.$router.push({ path:'/'});
        location.reload();
      }, 500);
    },
    async getJoinedTeam() {
      if(!this.isLogin) {
        return;
      }
      
      var header = {};
      if (localStorage.getItem("token"))
          header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
          method:"get",
          url:"/api/v1/team/list",
          headers: header,
      })
      .then((res) => {
          console.log(res);
          this.joinedTeam = res.data.results;
      })
      .catch((err) => {
          console.log(err);
      });
    },
    toTeam(teamId) {
      this.$router.push("/team/" + teamId);
      setTimeout(() => {
        location.reload();
      }, 500);
    },
    toInvitation() {
      if(this.isLogin) {
        this.$router.push("/invitation");
      }
      else {
        this.$notify({
            title: '注意！',
            message: '请先进行登录',
            type: 'warning'
         });
      }
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
.mainTitle{
  font-size: 24px;
}
.el-icon-collection {
  margin-left: 10px;
}
.nav-menu {
  background-color: #545c64;
}
.nav-menu span {
  color: #fff;
}

.el-menu {
  border-right: none;
}
.nav-menu:active span {
  color: #ffd04b;
}
</style>