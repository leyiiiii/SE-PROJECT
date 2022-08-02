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
                    <el-input v-model="inputPwd" placeholder="请输入密码"></el-input>
                    <el-button class="registerButton" type="text" @click="gotoRegister">注册</el-button>
                </div></el-col>
            </el-row>
            <el-row  justify="center" type="flex">
                <el-button class="Login" type="primary">登录</el-button>
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