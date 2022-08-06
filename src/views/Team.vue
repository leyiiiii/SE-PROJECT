<template>
    <el-row>
      <el-col :span="2"><div class="Left">
        <Navi></Navi>
        </div></el-col>
      <el-col :span="22"><div class="Right">
        <el-row>
            <el-col :span="12">
                <div class="info">
                    <span class="teamInfo1">{{ form.name }}</span>
            </div></el-col>
            <el-col :span="8">
                <div class="inviteButton">
                    <el-button v-if="isMainAdmin || isAdmin" type="info" round @click="dialogVisible2 = true">邀请成员</el-button>
                    <el-dialog title="邀请成员" :visible.sync="dialogVisible2" width="30%" :before-close="handleClose2">
                        <el-form label-width="auto">
                            <el-form-item label="用户名字">
                                <el-input v-model="inviteName"></el-input>
                            </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelChanges2">取消</el-button>
                        <el-button type="primary" @click="inviteMember">发送邀请</el-button>
                    </span>
                 </el-dialog>
                    <el-button type="danger" round @click="leaveTeam">离开团队</el-button>
            </div></el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div class="info">
                    <span class="teamInfo2">团队创建日期&nbsp;:&nbsp;</span>
                    <span class="teamInfo2">{{ form.date }}</span>
            </div></el-col>
            <el-col :span="12">
                <div class="info">
                    <span class="teamInfo2">团队人数&nbsp;:&nbsp;</span>
                    <span class="teamInfo2">{{ form.count }}</span>
            </div></el-col>
        </el-row>
        <el-row>
            <el-col :span="2"><div class="infoDesc">
                <span class="teamInfo2">团队简介&nbsp;:</span>
            </div></el-col>
            <el-col :span="20" v-if="hasChinese()"><div class="infoDesc2">
                <span class="teamInfo2">{{ form.desc }}</span>
            </div></el-col>
            <el-col :span="20" v-else><div class="infoDesc3">
                <span class="teamInfo2">{{ form.desc }}</span>
            </div></el-col>
        </el-row>
        <el-row>
            <el-col :span="24"><div class="projectTitle">
                <i class="el-icon-s-order"></i>
                <span class="membersTitle">项目</span>
                 <el-button class="addButton" icon="el-icon-plus" circle @click="dialogVisible = true"></el-button>
                 <el-dialog title="创建项目" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
                 <el-form :model="project" label-width="auto">
                    <el-form-item label="项目名称">
                        <el-input v-model="project.name"></el-input>
                    </el-form-item>
                    <el-form-item label="项目简介">
                      <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="project.desc" autocomplete="off" resize="none"></el-input>
                    </el-form-item>
                 </el-form>
                 <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelChanges">取消</el-button>
                    <el-button type="primary" @click="createProject">确定</el-button>
                    </span>
                </el-dialog>
                <el-button class="recycleButton" icon="el-icon-delete-solid" round @click="toRecycle">回收站</el-button>
                </div></el-col>
        </el-row>
        <el-row v-if="!haveProject">
            <el-col :span="24"><div class="projects">
            暂无项目！
            </div></el-col>
        </el-row>
        <el-row v-else>
            <el-button class="projectButton" v-for="item in projectList" :key="item.id" @click="enterProject(item.id)">{{ item.title }}</el-button>
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
                <el-button class="promoteButton" type="success" round v-if="checkPosition(item.position)" @click="promoteMember(item.id)">升为管理员</el-button>
                <el-button class="promoteButton" type="danger" round v-if="checkPosition3(item.position)" @click="demoteMember(item.id)">降为成员</el-button>
                <el-button class="kickButton" type="danger" round v-if="checkPosition2(item.position)" @click="kickMember(item.id)">移除</el-button>
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
                        <span>{{ item.position }}</span>
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
import user from "@/store/user";

export default {
  name: 'Team',
  components: {
    Navi,
  },
  created() {
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if(userInfo) {
      this.userId = userInfo.user.id;
    }
  },
  data() {
    return {
        dialogVisible: false,
        dialogVisible2: false,
        isMainAdmin: false,
        isAdmin: false,
        isMember: false,
        userId:'',
        form: {
            name:'',
            desc:'',
            date:'',
            count:'',
        },
        project: {
            name:'',
            desc:'',
        },
        inviteName:'',
        haveProject: false,
        projectList:[],
        membersList:[]
    }
  },
  mounted() {
    this.getTeamInfo();
    this.getProjectDetail();
  },
  methods: {
    cancelChanges() {
        this.dialogVisible = false;
        this.project.name = '';
        this.project.desc = '';
    },
    handleClose() {
        this.dialogVisible = false;
        this.project.name = '';
        this.project.desc = '';
    },
    cancelChanges2() {
        this.dialogVisible2 = false;
        this.inviteName = '';
    },
    handleClose2() {
        this.dialogVisible2 = false;
        this.inviteName = '';
    },
    createProject() {
        if(this.project.name == "") {
                this.$message.warning("项目名不可为空！");
                return;
        }
            
        if(this.project.desc == "") {
            this.$message.warning("项目简介不可为空！");
            return;
        }

        const formData = new FormData();
            formData.append("title", this.project.name);
            formData.append("description", this.project.desc);

        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };


        this.$axios({
            method:"post",
            url:"/api/v1/project/create/" + this.$route.params.id,
            data: formData,
            headers: header,
        })
          .then((res) => {
            console.log(res);
            this.$message.success("创建项目成功");
            setTimeout(function () {
                location.reload(true);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message.warning("创建项目失败")
          });

        this.dialogVisible = false;
    },
    enterProject(projectID) {
        this.$router.push("/project/" + projectID);
    },
    inviteMember() {
        const formData = new FormData();
        formData.append("user", this.inviteName);
        formData.append("teamId", this.$route.params.id);

        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        this.$axios({
            method:"post",
            url:"/api/v1/team/invite",
            data: formData,
            headers: header,
        })
          .then((res) => {
            console.log(res);
            this.$message.success("邀请成功");
            this.dialogVisible2 = false;
          })
          .catch((err) => {
            console.log(err);
            this.$message.warning("抱歉，邀请失败！")
          });
    },
    leaveTeam() {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        this.$axios({
            method:"delete",
            url:"/api/v1/team/leave/" + this.$route.params.id,
            headers: header,
        })
          .then((res) => {
            console.log(res);
            this.$message.success("离开团队成功");
            this.$router.push({path: '/'});
          })
          .catch((err) => {
            console.log(err);
            this.$message.warning("您是主管理员，无法离开！")
          });
    },
    async getTeamInfo() {
        await this.$axios.all([
            this.getTeamDetail(),
            this.getTeamMembers(),
        ])
        .then(this.$axios.spread((tDetail, tMembers) => {
            console.log(tDetail);
            console.log(tMembers);
            this.form.name = tDetail.data.teamName;
            this.form.desc = tDetail.data.description;
            this.form.count = tDetail.data.members;
            this.form.date = tDetail.data.createdAt.slice(0, 10);
            this.membersList = tMembers.data.results;

            for(let i = 0; i < this.membersList.length; i++) {
                if(this.membersList[i].id === this.userId) {
                    if(this.membersList[i].position == 0) {
                        this.isMainAdmin = true;
                        console.log("MAIN");
                        break;
                    }
                    if(this.membersList[i].position == 1) {
                        this.isAdmin = true;
                        console.log("ADMIN");
                        break;
                    }
                    if(this.membersList[i].position == 2) {
                        this.isMember = true;
                        console.log("NORMAL");
                        break;
                    }
                }
            }

            for(let i = 0; i < this.membersList.length; i++) {
                if(this.membersList[i].position == 0) {
                    this.membersList[i].position = 'Main Admin';
                }
                if(this.membersList[i].position == 1) {
                    this.membersList[i].position = 'Admin';
                }
                if(this.membersList[i].position == 2) {
                    this.membersList[i].position = 'Member';
                }
            }
        }))
        .catch((err) =>{
            console.log(err);
            this.$router.push({path: '/'});
        })
    },
    getTeamMembers() {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        return this.$axios({
        method: "get",
        url: "/api/v1/team/member/list/" + this.$route.params.id,
        headers: header,
      });
    },
    getTeamDetail() {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };
            
        return this.$axios({
        method: "get",
        url: "/api/v1/team/" + this.$route.params.id,
        headers: header,
      });
    },
    getProjectDetail() {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        this.$axios({
        method: "get",
        url: "/api/v1/project/list?belongTo=" + this.$route.params.id,
        headers: header,
        })
          .then((res) =>{
            console.log(res);
            this.projectList = res.data.results;
            
            if(this.projectList.length > 0) {
                this.haveProject = true;
            }
          })
          .catch((err) =>{
            console.log(err);
          })
    },
    hasChinese() {
        const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
        const hasChinese = this.form.desc.match(REGEX_CHINESE);
        if(hasChinese) {
            console.log("true");
            return true;
        }
        else {
            console.log("false");
            return false;
        }
    },
    checkPosition(userPos) {
        if(userPos === "Member" && (this.isMainAdmin || this.isAdmin)) {
            return true;
        }
        else return false;
    },
    checkPosition2(userPos) {
        if(userPos === "Member" && (this.isMainAdmin || this.isAdmin)) {
            return true;
        }
        if(userPos === "Admin" && this.isMainAdmin) {
            return true;
        }
        else return false;
    },
    checkPosition3(userPos) {
        if(this.isMainAdmin && userPos === "Admin") {
            return true;
        }
        else return false;
    },
    promoteMember(memberId) {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        this.$axios({
        method: "put",
        url: "/api/v1/team/admin/set/" + this.$route.params.id + "/" + memberId,
        headers: header,
        })
          .then((res) =>{
            console.log(res);
            this.$message.success("设置成功！");
            setTimeout(function () {
                location.reload(true);
            }, 500);
          })
          .catch((err) =>{
            console.log(err);
          })
    },
    demoteMember(memberId) {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        this.$axios({
        method: "put",
        url: "/api/v1/team/admin/remove/" + this.$route.params.id + "/" + memberId,
        headers: header,
        })
          .then((res) =>{
            console.log(res);
            this.$message.success("设置成功！");
            setTimeout(function () {
                location.reload(true);
            }, 500);
          })
          .catch((err) =>{
            console.log(err);
          })
    },
    kickMember(memberId) {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        this.$axios({
        method: "delete",
        url: "/api/v1/team/member/remove/" + this.$route.params.id + "/" + memberId,
        headers: header,
        })
          .then((res) =>{
            console.log(res);
            this.$message.success("移除成功！");
            setTimeout(function () {
                location.reload(true);
            }, 500);
          })
          .catch((err) =>{
            console.log(err);
          })
    },
    toRecycle() {
        this.$router.push("/recycle/" + this.$route.params.id);
    }
  }
}
</script>
<style scoped>
.inviteButton{
    /* border: 1px solid black; */
    margin-top: 20px;
}
.inviteButton button{
    margin-right: 10px;
}
.info{
    margin: 10px;
    /* border: 1px solid black; */
}
.infoDesc{
    margin-left: 10px;
    /* border: 1px solid black; */
}
.infoDesc2{
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    /* border: 1px solid black; */
}
.infoDesc3{
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    /* border: 1px solid black; */
    margin-top: 3px;
}
.teamInfo1{
    font-size: 40px;
    font-family: fantasy;
}
.teamInfo2{
    font-size: 20px;
    font-family: cursive;
}
.projects{
    margin-left: 30px;
    margin-top: 5px;
    /* border: 1px solid black; */
}
.members, .projectTitle{
    /* border: 1px solid black; */
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
    height: 420px;
    overflow: hidden;
    overflow-y: scroll;
}
.buttonArea{
    position: absolute;
    margin-top: 12px;
}
.addButton, .recycleButton{
    margin-left: 10px;
}
.projectButton{
    margin-left: 20px;
    margin-top: 10px;
}
.el-icon-user-solid, .el-icon-s-order{
    font-size: 22px;
}
</style>