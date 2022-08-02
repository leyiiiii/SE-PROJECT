<template>
    <el-row justify="center" type="flex">
        <!-- <el-col :span="2"><div class="Left">
            <Navi></Navi>
        </div></el-col> -->
        <el-col :span="8"><div class="Right">
            <el-row  justify="center" type="flex">
                <el-col :span="24"><div class="Title">
                    墨书登录
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="14"><div class="insertBox">
                    <el-input v-model="inputName" placeholder="请输入用户名/邮箱"></el-input>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="14"><div class="insertBox">
                    <el-input v-model="inputPwd" placeholder="请输入密码" show-password></el-input>
                    <el-button class="registerButton" type="text" @click="gotoRegister">注册</el-button>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-button class="Login" type="primary" @click="Login">登录</el-button>
            </el-row>
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
    name: 'Login',
    components: {
    Navi,
    },
    data() {
        return {
            inputName:'',
            inputPwd:'',
        }
    },
    methods: {
        gotoRegister() {
            this.$router.push("/register");
        },
        Login() {
            if(this.inputName == "") {
                this.$message.warning("用户名不可为空");
                return;
            }
            
            if(this.inputPwd == "") {
                this.$message.warning("密码不可为空");
                return;
            }

            const formData = new FormData();
            formData.append("username", this.inputName);
            formData.append("password", this.inputPwd);

            this.$axios({
                method:"post",
                url:"/api/v1/auth/login/",
                data: formData,
            })
              .then((res) =>{
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

              const history_pth = localStorage.getItem("preRoute");
              setTimeout(() => {
                if (history_pth == null || history_pth === "/register") {
                  this.$router.push("/");
                } else {
                  this.$router.push({ path: history_pth });
                }
              }, 500);
              })
              .catch((err) => {
                console.log(err);
                this.$message.warning("用户名/邮箱不存在或密码错误")
              })


        }
    }

}
</script>

<style scoped>
.Right{
    margin-top: 200px;
    /* border: 1px solid black; */
    padding: 10px 0 10px 0;
    border-radius: 20px;
    background-color: rgb(255, 168, 47);
}
.Title{
    text-align: center;
    font-size: 48px;
    margin-bottom: 10px;
}
.insertBox{
    margin-top: 10px;
    margin-bottom: 10px;
}
.register{
    border: 1px solid black;
    text-align: center;
}
.registerButton{
    float: right;
}
.Login{
    margin-top: 10px;
}
</style>