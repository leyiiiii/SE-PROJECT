<template>
  <div class="home">
    <el-row>
      <el-col :span="2"><div class="Left">
        <Navi></Navi>
        </div></el-col>
      <el-col :span="22"><div class="Right">
        <img id="bg" src="@/assets/Workhard3.jpg"/>
        <el-row justify="center" type="flex">
          <el-col :span="12"><div class="bigIcon">
            <i class="el-icon-office-building"></i>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="24"><div class="Title">
            <span>没有团队？创一个？加入一个？</span>  
          </div></el-col>
        </el-row>
        <el-row v-if="isLogin">
          <el-col :span="24"><div class="Button">
            <el-button-group>
              <el-button type="primary" icon="el-icon-s-flag" @click="dialogVisible = true">创建团队</el-button>
              <el-dialog title="创建团队" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
                 <el-form :model="team" label-width="auto">
                    <el-form-item label="团队名称">
                        <el-input v-model="team.name"></el-input>
                    </el-form-item>
                    <el-form-item label="团队简介">
                      <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="team.desc" autocomplete="off" resize="none"></el-input>
                    </el-form-item>
                 </el-form>
                 <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelChanges" id="cancel">取消</el-button>
                    <el-button type="primary" @click="createTeam">确定</el-button>
                    </span>
                </el-dialog>
              <el-button type="primary" icon="el-icon-message" @click="checkInvitation">查看邀请</el-button>
            </el-button-group>
          </div></el-col>
        </el-row>
        <el-row v-else type="flex" align="middle">
          <el-col :span="24"><div class="goLogin">
            <span>马上登录吧</span>
            <i class="el-icon-right"></i>
            <el-button type="primary" @click="toLogin">登录</el-button>
          </div></el-col>
        </el-row>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'
import user from "@/store/user";

export default {
  name: 'HomeView',
  components: {
    Navi,
  },
  data() {
    return {
      dialogVisible: false,
      team: {
        name:'',
        desc:'',
      },
      isLogin: false,
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
  methods: {
    cancelChanges() {
      this.dialogVisible = false;
      this.team.name = '';
      this.team.desc = '';
    },
    handleClose() {
      this.dialogVisible = false;
      this.team.name = '';
      this.team.desc = '';
    },
    createTeam() {
      if(this.team.name == "") {
        this.$message.warning("团队名不可为空");
        return;
      }
            
      if(this.team.desc == "") {
          this.$message.warning("团队简介不可为空");
          return;
      }

      const formData = new FormData();
      formData.append("teamName", this.team.name);
      formData.append("description", this.team.desc);

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method:"post",
        url:"/api/v1/team/create",
        data: formData,
        headers: header,
      })
        .then((res) =>{
          console.log(res);
          this.$message.success("创建成功");
          this.dialogVisible = false;
          this.team.name = '';
          this.team.desc = '';
        })
        .catch((err) =>{
          console.log(err);
        })
    },
    checkInvitation() {
      this.$router.push("/invitation");
    },
    toLogin() {
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
.Title{
  text-align: center;
  font-size: 64px;
  font-family: STKaiti;
}
.bigIcon{
  /* border: 1px solid black; */
  text-align: center;
  margin-top: 180px;
  font-size: 100px;
}
.Button{
  text-align: center;
  margin-top: 20px;
}
.Button button{
  background-color: rgba(154, 85, 85, 0.664);
  border-color: rgb(140, 83, 83);
}
.goLogin{
  /* border: 1px solid black; */
  text-align: center;
  font-size: 36px;
}
.goLogin button{
  width: 120px;
  font-size: 30px;
  margin-top: 10px;
  background-color: rgba(154, 85, 85, 0.664);
  border-color: rgb(140, 83, 83);
}
#bg {
  width: 100%;
  position: absolute;
  z-index: -1;
  object-fit: cover;
  opacity: 0.8;
}
#cancel{
  color: white;
}
</style>
