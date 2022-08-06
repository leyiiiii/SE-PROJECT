<template>
    <div class="header">
        <img src="../assets/FullLogo.png" alt="logo" ref="/">
        <a href="/login" class="nav">登录</a>
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
    };
  },
  created() {
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if (userInfo) {
      this.isLogin = true;
    }
  },
}
</script>

<style scoped>
.nav:hover, img:hover {
    cursor: pointer;
}
.nav {
    float: right;
    height: 100%;
    padding: 38px 0;
    margin: 0 50px;
    font-size: 22px;
    color: #3D4777;
    font-weight: 600;
    text-decoration: none;
    /* background-color: hotpink; */
}
img {
    height: 100%;
}
.header {
    height: 100px;
    padding: 0 100px;
    /* background-color: aqua; */
}
</style>