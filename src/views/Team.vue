<template>
    <el-row>
      <el-col :span="2"><div class="Left">
        <Navi></Navi>
        </div></el-col>
      <el-col :span="22"><div class="Right">
        <el-row>
            <el-col :span="12">
                <div class="info">
                    <span class="teamInfo1">取啥名字好团队</span>
            </div></el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div class="info">
                    <span class="teamInfo2">团队创建日期&nbsp;:&nbsp;</span>
                    <span class="teamInfo2">1/8/2022</span>
            </div></el-col>
            <el-col :span="12">
                <div class="info">
                    <span class="teamInfo2">团队人数&nbsp;:&nbsp;</span>
                    <span class="teamInfo2">50</span>
            </div></el-col>
        </el-row>
        <el-row>
            <el-col :span="24"><div class="members">
                <i class="el-icon-user-solid"></i>
                <span class="membersTitle">成员列表</span>
                </div></el-col>
        </el-row>
        <el-row class="membersRow">
        <el-row v-for="item in membersList" :key="item.id" justify="center" type="flex">
            <el-col :span="23"><div class="membersList">
            <el-row>
                <el-col :span="10">
                    <div class="membersInfo">
                        <span>昵称:&nbsp;</span>
                        <span>{{ item.username }}</span>
                </div></el-col>
                <el-col :span="10">
                    <div class="membersInfo">
                        <span>真实姓名:&nbsp;</span>
                        <span>{{ item.realname }}</span>
                </div></el-col>
                <el-col :span="4"><div class="buttonArea">
                <el-button class="promoteButton" type="success" round>升为管理员</el-button>
                <el-button class="kickButton" type="danger" round>移除</el-button>
                </div></el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <div class="membersInfo">
                        <span>邮箱:&nbsp;</span>
                        <span>{{ item.email }}</span>
                </div></el-col>
                <el-col :span="10">
                    <div class="membersInfo">
                        <span>身份:&nbsp;</span>
                        <span>{{ item.pos }}</span>
                </div></el-col>
            </el-row>
            </div></el-col>
        </el-row>
        </el-row>
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
  name: 'HomeView',
  components: {
    Navi,
  },
  data() {
    return {
        membersList:[{
            id:1,
            username:'Lele',
            realname:'HuangLele',
            pos:'Owner',
            email:'abc@gmail.com',
        },
        {
            id:2,
            username:'Lolo',
            realname:'HuangLolo',
            pos:'Admin',
            email:'efg@gmail.com',
        },
        {
            id:3,
            username:'Lili',
            realname:'HuangLili',
            pos:'Member',
            email:'hij@gmail.com',
        },
                {
            id:4,
            username:'Lili',
            realname:'HuangLili',
            pos:'Member',
            email:'hij@gmail.com',
        },
        {
            id:5,
            username:'Lili',
            realname:'HuangLili',
            pos:'Member',
            email:'hij@gmail.com',
        },
        {
            id:6,
            username:'Lili',
            realname:'HuangLili',
            pos:'Member',
            email:'hij@gmail.com',
        },
        {
            id:7,
            username:'Lili',
            realname:'HuangLili',
            pos:'Member',
            email:'hij@gmail.com',
        },
        {
            id:8,
            username:'Lili',
            realname:'HuangLili',
            pos:'Member',
            email:'hij@gmail.com',
        },
        ]
    }
  }
}
</script>

<style scoped>
.Right{
  /* background-color: yellow; */
}
.info{
    margin: 10px;
}
.teamInfo1{
    font-size: 40px;
}
.teamInfo2{
    font-size: 20px;
}
.members{
    margin: 30px 0 0 10px;
}
.membersTitle{
    font-size: 24px;
}
.membersList{
    /* border: 1px solid black; */
    border-radius: 20px;
    margin-top: 10px;
    background-color: orange;
}
.membersInfo{
    margin: 5px 0 5px 10px;
    font-size: 18px;
    /* border: 1px solid black; */
}
.membersRow{
    /* border: 1px solid black; */
    height: 550px;
    overflow: hidden;
    overflow-y: scroll;
}
.buttonArea{
    position: absolute;
    margin-top: 12px;
}
/* .kickButton{
    position: absolute;
    margin: 0 0 0 130px;
    top: 40%;
    float: right;
} */
/* .promoteButton{
    position: absolute;
    margin: 0;
    top: 40%;
} */
.el-icon-user-solid{
    font-size: 22px;
}
</style>