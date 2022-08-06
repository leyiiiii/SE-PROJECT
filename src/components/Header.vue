<template>
    <div class="header">
        <img src="../assets/FullLogo.png" alt="logo" ref="/">
        <a href="/login" class="nav">登录</a>
        <a href="/login" v-if="!isLogin" class="nav">进入团队</a>
        <a href="/team" v-else class="nav">进入团队</a>
        <a href="/about" class="nav">关于我们</a>
    </div>    
</template>

<style scoped>
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
    padding: 0 700px 0 100px;
}
</style>