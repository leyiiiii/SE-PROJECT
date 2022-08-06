<template>
<el-row class="main" type="flex" justify="center">
    <el-col :span="20">
      <div class="wrapper">
        <div class="pic-wrapper">
          <img id="bg" src="@/assets/RegistBg.png" />
        </div>
        <div class="login-wrapper">
          <el-row justify="center" type="flex">
            <img id="logo" src="@/assets/FullLogo.png" alt="logo" />
          </el-row>
          <el-row justify="center" type="flex">
            <input
              class="input-name"
              type="text"
              v-model="username"
              placeholder="用户名"
            />
            <i class="el-icon-view hidden"></i>
          </el-row>
          <el-row justify="center" type="flex">
            <input
              class="input-name"
              type="text"
              v-model="realname"
              placeholder="真实姓名"
            />
            <i class="el-icon-view hidden"></i>
          </el-row>
          <el-row justify="center" type="flex">
            <input
              class="input-name"
              type="text"
              v-model="email"
              placeholder="邮箱"
            />
            <i class="el-icon-view hidden"></i>
          </el-row>
          <el-row justify="center" type="flex">
            <input
              class="input-pwd"
              type="text"
              v-if="canSee1"
              v-model="password1"
              placeholder="密码"
            />
            <input
              class="input-pwd"
              type="password"
              v-else
              v-model="password1"
              placeholder="密码"
            />
            <i class="el-icon-view" @click="changeSee1"></i>
          </el-row>
          <el-row justify="center" type="flex">
            <input
              class="input-pwd"
              type="text"
              v-if="canSee2"
              v-model="password2"
              placeholder="重复密码"
              @keyup.enter="Register"
            />
            <input
              class="input-pwd"
              type="password"
              v-else
              v-model="password2"
              placeholder="重复密码"
              @keyup.enter="Register"
            />
            <i class="el-icon-view" @click="changeSee2"></i>
          </el-row>
          <el-row justify="center" type="flex">
            <div style="width: 350px; text-align: end">
              <span>已有帐号，</span>
              <button class="login-button" @click="gotoLogin">
                立即登录
              </button>
            </div>
          </el-row>
          <el-row justify="center" type="flex">
            <button class="regist-button" @click="Register">注册</button>
          </el-row>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
    name: 'Register',
    components: {
    Navi,
  },
  data() {
    return {
        username:'',
        realname:'',
        email:'',
        password1:'',
        password2:'',
        canSee1: false,
        canSee2: false,
    }
  },
  methods: {
    changeSee1() {
      this.canSee1 = !this.canSee1;
    },
    changeSee2() {
      this.canSee2 = !this.canSee2;
    },
    gotoLogin() {
        this.$router.push("/login");
    },
    Register() {
        if(this.username == "" || this.realname == "" || this.email == "" || this.password1 == "" || this.password2 == "") {
            this.$message.warning("请填写所有空格!");
            return;
        }

        const formData = new FormData();
        formData.append("username", this.username);
        formData.append("realname", this.realname);
        formData.append("email", this.email);
        formData.append("password", this.password1);
        formData.append("password2", this.password2);

        this.$axios({
        method: "post",
        url: "/api/v1/auth/register/",
        data: formData,
        })
        .then((res) => {
            console.log(res);
            switch (res.status) {
            case 201:
              this.$message.success("注册成功");
              this.$router.push("/login");
              break;
          }
        })
        .catch((err) => {
            console.log(err.response.data.code);
            switch(err.response.data.code) {
                case 1001:
                    this.$message.warning("邮箱已被使用");
                    break;
                case 1002:
                    this.$message.warning("用户名已被使用");
                    break;
                case 1003:
                    this.$message.warning("密码与重复密码不匹配");
                    break;
                case 1004:
                    this.$message.warning("密码需包含字母、数字及符号且字符数>=8");
                    break;
                default:
                    this.$message.warning("填写信息错误");
            }
        })
    }
  }
    
}
</script>

<style scoped>
.login-button:hover {
  color: #dfa297;
  cursor: pointer;
}
.login-button,
span {
  background: none;
  border: none;
  font-size: 14px;
}
.regist-button:hover {
  cursor: pointer;
}
.regist-button {
  width: 350px;
  height: 50px;
  margin-top: 30px;
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
  line-height: 50px;
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
  margin: 10px 0;
  padding: 5px;
  border: none;
  border-bottom: 1px black solid;
  color: gray;
  font-size: 18px;
  letter-spacing: 0.3em;
}
#logo {
  display: block;
  width: 400px;
  margin: 10px 0 -10px;
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