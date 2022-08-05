<template>
    <el-row>
        <el-col :span="2"><div class="Left">
            <Navi></Navi>
        </div></el-col>
        <el-col :span="22"><div class="Right">
            <el-row v-for="item in invitationList" :key="item.index">
                <el-row>
                <el-col :span="14"><div class="invitationTeam">
                    <span>{{ item.team}} </span>
                </div></el-col>
                <el-col :span="4"><div class="invitationTeam">
                     <el-button type="success" round @click="Accept(item.id)">同意</el-button>
                      <el-button type="danger" round @click="Decline(item.id)">拒绝</el-button>
                </div></el-col>
                </el-row>
                <el-row>
                <el-col :span="14"><div class="invitationInvitor">
                    <span>- {{ item.invitedBy }}邀请您进入团队</span>
                </div></el-col>
                </el-row>
                <el-divider></el-divider>
            </el-row>
            <el-row v-if="invitationList.length == 0">
                <el-col :span="24"><div class="noInvitation">
                    <span>- 暂无邀请 -</span>
                </div></el-col>
            </el-row>
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'
import user from "@/store/user";

export default {
    name: 'Invitation',
    components: {
        Navi,
    },
    data() {
        return {
            invitationList:[],
            isLogin: false,
            userId:'',
        }
    },
    created() {
        var userInfo;
        userInfo = user.getters.getUser(user.state());
        if(userInfo) {
            this.userId = userInfo.user.id;
            this.isLogin = true;
        }
  },
    mounted() {
        this.getInvitation();
    },
    methods: {
        getInvitation() {
            var header = {};
            if (localStorage.getItem("token"))
                header = { Authorization: "Bearer " + localStorage.getItem("token") };

            this.$axios({
                method:"get",
                url:"/api/v1/invitation/list",
                headers: header,
            })
            .then((res) => {
                console.log(res);
                this.invitationList = res.data.results;
            })
            .catch((err) => {
                console.log(err);
            });
        },
        Accept(inviteId) {
            var header = {};
            if (localStorage.getItem("token"))
                header = { Authorization: "Bearer " + localStorage.getItem("token") };

            this.$axios({
                method:"put",
                url:"/api/v1/invitation/reply/" + inviteId + "/" + "1",
                headers: header,
            })
            .then((res) => {
                console.log(res);
                console.log("同意成功");
                setTimeout(function () {
                    location.reload(true);
                }, 500);
            })
            .catch((err) => {
                console.log(err);
            });
        },
        Decline(inviteId) {
            var header = {};
            if (localStorage.getItem("token"))
                header = { Authorization: "Bearer " + localStorage.getItem("token") };

            this.$axios({
                method:"put",
                url:"/api/v1/invitation/reply/" + inviteId + "/" + "2",
                headers: header,
            })
            .then((res) => {
                console.log(res);
                console.log("拒绝成功");
                setTimeout(function () {
                    location.reload(true);
                }, 500);
            })
            .catch((err) => {
                console.log(err);
            });
        },
    }
}
</script>

<style scoped>
.Right{
    padding-top: 10px;
}
.invitationTeam{
    /* border: 1px solid black; */
    font-size: 48px;
    font-weight: bold;
    margin-left: 10px;
    color: orange;
}
.invitationInvitor{
    /* border: 1px solid black; */
    font-size: 24px;
    margin-left: 20px;
    color:darkgoldenrod;
}
.noInvitation{
    /* border: 1px solid black; */
    text-align: center;
    font-size: 48px;
    color: rgba(128, 128, 128, 0.67);
    margin-top: 30px;
}
</style>