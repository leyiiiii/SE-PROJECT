<template>
    <div class="header">
        <img src="../assets/FullLogo.png" alt="logo" ref="/">
        <a v-if="!isLogin" href="/login" class="nav">登录</a>
        <a href="/login" v-if="!isLogin" class="nav">进入团队</a>
        <a href="/team" v-else class="nav">进入团队</a>
        <a href="/about" class="nav">关于我们</a>
    </div>    
</template>

<script>
import user from "@/store/user";
export default {
  data() {
    return {
      isLogin: false,
      userId: "",
      username: "",
    };
  },
  created() {
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if (userInfo) {
      this.isLogin = true;
      this.$router.push('/team/?');
    }
  },
}
</script>

<style scoped>
.el-avatar{
    position: relative;
    top: -5px;
}
.nav span {
    position: relative;
    top: -4px;
    vertical-align: middle;
    margin-left: 10px;
    font-size: 22px;
}
.nav:hover, img:hover {
    cursor: pointer;
}
.nav {
    float: right;
    height: 100%;
    padding: 34px 0;
    margin: 0 30px;
    font-size: 22px;
    color: #3D4777;
    text-decoration: none;
    font-weight: 100;
}
img {
    height: 100%;
}
.header {
    height: 100px;
    padding: 0 800px 0 100px;
}
</style>