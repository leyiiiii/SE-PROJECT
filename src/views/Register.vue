<template>
    <el-row justify="center" type="flex">
        <!-- <el-col :span="2"><div class="Left">
            <Navi></Navi>
        </div></el-col> -->
        <el-col :span="12"><div class="Right">
            <el-row  justify="center" type="flex">
                <el-col :span="24"><div class="Title">
                    墨书注册
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="18"><div class="insertBox">
                    <el-col :span="5"><div class="insertTitle"><span>昵称</span></div></el-col>
                    <el-col :span="14"><el-input v-model="username" placeholder="请输入昵称"></el-input></el-col>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="18"><div class="insertBox">
                    <el-col :span="5"><div class="insertTitle"><span>真实姓名</span></div></el-col>
                    <el-col :span="14"><el-input v-model="realname" placeholder="请输入真实姓名"></el-input></el-col>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="18"><div class="insertBox">
                    <el-col :span="5"><div class="insertTitle"><span>邮箱</span></div></el-col>
                    <el-col :span="14"><el-input v-model="email" placeholder="请输入邮箱"></el-input></el-col>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="18"><div class="insertBox">
                    <el-col :span="5"><div class="insertTitle"><span>密码</span></div></el-col>
                    <el-col :span="14"><el-input v-model="password1" placeholder="请输入密码" show-password></el-input></el-col>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="18"><div class="insertBox">
                    <el-col :span="5"><div class="insertTitle"><span>重复密码</span></div></el-col>
                    <el-col :span="14"><el-input v-model="password2" placeholder="请重新输入密码" show-password></el-input></el-col>
                </div></el-col>
            </el-row>
            <el-row>
                <el-col :span="4" :offset="14"><div class="backToLogin">
                    <el-button class="toLogin" type="text" @click="gotoLogin">返回登录</el-button>    
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-button class="Register" type="primary" @click="Register">注册</el-button>
            </el-row>
        </div></el-col>
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
    }
  },
  methods: {
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
.Right{
    margin-top: 155px;
    /* border: 1px solid black; */
    background-color: rgb(255, 168, 47);
    padding: 10px 0 10px 0;
    border-radius: 20px;
}
.Title{
    text-align: center;
    font-size: 48px;
    margin-bottom: 10px;
}
.insertTitle{
    /* border: 1px solid black; */
    float: right;
    margin-right: 10px;
    margin-top: 10px;
}
.insertBox{
    margin-top: 10px;
}
.toLogin{
    float: right;
    margin-right: 20px;
}
.Register{
    margin-top: 10px;
}
</style>