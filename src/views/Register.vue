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
                    <el-col :span="14"><el-input v-model="password1" placeholder="请输入密码"></el-input></el-col>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-col :span="18"><div class="insertBox">
                    <el-col :span="5"><div class="insertTitle"><span>重复密码</span></div></el-col>
                    <el-col :span="14"><el-input v-model="password2" placeholder="请重新输入密码"></el-input></el-col>
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

    }
  }
    
}
</script>

<style scoped>
.Right{
    margin-top: 200px;
    /* border: 1px solid black; */
}
.Title{
    text-align: center;
    font-size: 48px;
    margin-bottom: 10px;
}
.insertTitle{
    /* border: 1px solid black; */
    float: right;
    margin-right: 5px;
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