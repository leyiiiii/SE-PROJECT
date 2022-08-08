<template>
  <el-row class="Nav">
    <!-- <el-col :span="24">
      <el-menu
          class="nav-menu"
          @open="handleOpen"
          @close="handleClose"
          :router="true">
        <el-menu-item index="/">
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
    </el-col> -->
    <el-container>
      <el-aside
        width="auto"
        @mouseenter.native="collapseOpen"
        @mouseleave.native="collapseClose"
      >
        <el-menu
          class="nav-menu"
          @open="handleOpen"
          @close="handleClose"
          :router="true"
          :collapse="isCollapse"
        >
          <el-menu-item index="/login">
            <i class="el-icon-user"></i>
            <span slot="title"> {{username}} </span>
          </el-menu-item>
          <el-menu-item index="/" @click="Logout">
            <i class="el-icon-switch-button"></i>
            <span slot="title"> 退出登录 </span>
          </el-menu-item>

          <el-submenu>
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span> 团队 </span>
            </template>
            <el-menu-item-group>
              <!-- <template slot="title">已加入团队</template> -->
              <el-menu-item
                v-for="item in joinedTeam"
                :key="item.index"
                @click="toTeam(item.id)"
                >{{ item.teamName }}</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item index="/invitation">
            <i class="el-icon-postcard"></i>
            <span slot="title"> 查看邀请 </span>
          </el-menu-item>
          <el-menu-item index="/">
            <i class="el-icon-collection"></i>
            <span class="mainTitle"> 关于墨书 </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main> </el-main>
    </el-container>
  </el-row>
</template>

<script>
import user from "@/store/user";

export default {
  data() {
    return {
      isLogin: false,
      joinedTeam: [],
      collapseBtnClick: false,
      isCollapse: true,
      username: "",
    };
  },
  created() {
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if (userInfo) {
      this.isLogin = true;
      this.username = userInfo.user.username;
    }
  },
  mounted() {
    this.getJoinedTeam();
  },
  methods: {
    collapseStatus() {
      this.collapseBtnClick = this.isCollapse;
      this.isCollapse = !this.isCollapse;
    },
    collapseOpen() {
      if (this.collapseBtnClick) return;
      this.isCollapse = false;
    },
    collapseClose() {
      if (this.collapseBtnClick) return;
      this.isCollapse = true;
    },
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
        this.$router.push({ path: "/" });
        location.reload();
      }, 500);
    },
    async getJoinedTeam() {
      if (!this.isLogin) {
        return;
      }

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
        method: "get",
        url: "/api/v1/team/list",
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
      if (this.isLogin) {
        this.$router.push("/invitation");
      } else {
        this.$notify({
          title: "注意！",
          message: "请先进行登录",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style>
.el-submenu__title:hover,
.el-submenu.is-opened {
  outline: 0 !important;
  background-color: #3d47773a !important;
  width: 130px;
}
.el-submenu .el-menu-item{
  color: #3d4777;
}
</style>
<style scoped>
i, span {
  color: #3d4777;
  font-weight: 100;
}
.el-menu-item-group {
  background-color: #3d47774a;
}
.el-menu-item {
  min-width: 130px;
}
.el-menu-item:hover {
  background-color: #3d47773a !important;
}
.el-menu:active span{
  color: #7d0066;
}
.nav-menu {
  height: 100vh;
  background-color: #3d47773a;
}
.el-menu {
  border-right: none;
}

</style>