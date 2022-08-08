<template>
  <el-row class="main" type="flex" justify="center">
    <el-col :span="20">
      <div class="wrapper">
        <div class="pic-wrapper">
          <img id="bg" src="@/assets/LoginBg.png" />
        </div>
        <div class="login-wrapper">
          <el-row justify="center" type="flex">
            <img id="logo" src="@/assets/FullLogo.png" alt="logo" />
          </el-row>
          <el-row justify="center" type="flex">
            <input
              class="input-name"
              type="text"
              v-model="inputName"
              placeholder="用户名/邮箱"
            />
            <i class="el-icon-view hidden" @click="changeSee"></i>
          </el-row>
          <el-row justify="center" type="flex">
            <input
              class="input-pwd"
              type="text"
              v-if="canSee"
              v-model="inputPwd"
              placeholder="密码"
              @keyup.enter="Login"
            />
            <input
              class="input-pwd"
              type="password"
              v-else
              v-model="inputPwd"
              placeholder="密码"
              @keyup.enter="Login"
            />
            <i class="el-icon-view" @click="changeSee"></i>
          </el-row>
          <el-row justify="center" type="flex">
            <div style="width: 350px; text-align: end">
              <span>没有账号？</span>
              <button class="regist-button" @click="gotoRegister">
                立即注册
              </button>
            </div>
          </el-row>
          <el-row justify="center" type="flex">
            <button class="login-button" @click="Login">登录</button>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      inputName: "",
      inputPwd: "",
      canSee: false,
    };
  },
  methods: {
    changeSee() {
      this.canSee = !this.canSee;
    },
    gotoRegister() {
      this.$router.push("/register");
    },
    Login() {
      if (this.inputName == "") {
        this.$message.warning("用户名不可为空");
        return;
      }

      if (this.inputPwd == "") {
        this.$message.warning("密码不可为空");
        return;
      }

      const formData = new FormData();
      formData.append("username", this.inputName);
      formData.append("password", this.inputPwd);

      this.$axios({
        method: "post",
        url: "/api/v1/auth/login/",
        data: formData,
      })
        .then((res) => {
          console.log(res);
          localStorage.setItem("token", res.data.tokens.access);
          this.$message.success("登录成功！");
          this.$store.dispatch("saveUserInfo", {
            user: {
              username: res.data.username,
              confirmed: true,
              id: res.data.id,
            },
          });

          setTimeout(() => {
            this.$router.push('/team/&');
          }, 500);
        })
        .catch((err) => {
          console.log(err);
          this.$message.warning("用户名/邮箱不存在或密码错误");
        });
    },
  },
};
</script>

<style scoped>
.regist-button:hover {
  color: #dfa297;
  cursor: pointer;
}
.regist-button,
span {
  background: none;
  border: none;
  font-size: 14px;
}
.login-button:hover {
  cursor: pointer;
}
.login-button {
  width: 350px;
  height: 50px;
  margin-top: 50px;
  background: none;
  border: none;
  border-radius: 10px;
  background-color: #3d477722;
  font-size: 20px;
  font-weight: 100;
  letter-spacing: 2em;
  text-indent: 2em;
}
.hidden {
  display: none;
}
.el-icon-view:hover {
  cursor: pointer;
  color: darkgray;
}
.el-icon-view {
  position: relative;
  right: 15px;
  line-height: 70px;
  font-size: 20px;
  color: gray;
}
.input-pwd {
  position: relative;
  left: 10px;
}
.input-name:focus,
.input-pwd:focus {
  outline: none;
}
.input-name::placeholder,
.input-pwd::placeholder {
  color: lightgrey;
}
.input-name,
.input-pwd {
  width: 350px;
  margin: 18px 0;
  padding: 5px;
  border: none;
  border-bottom: 1px black solid;
  color: gray;
  font-size: 20px;
  letter-spacing: 0.3em;
}
#logo {
  display: block;
  width: 400px;
  margin: 10px 0 70px;
}
#bg {
  width: 100%;
  height: 100%;
  border-radius: 20px 0 0 20px;
  object-fit: cover;
}
.login-wrapper {
  display: inline-block;
  width: 40%;
  height: 100%;
}
.pic-wrapper {
  float: left;
  width: 60%;
  height: 100%;
}
.wrapper {
  margin-top: 75px;
  height: 600px;
  border-radius: 20px;
  background-color: white;
  box-shadow: #00000084 0px 0px 50px;
}
.main {
  height: 100vh;
  background-color: #f4e3e069;
}
</style>