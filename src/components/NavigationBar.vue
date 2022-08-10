<template>
  <el-row>
    <el-container>
      <el-aside
          width="auto"
          @mouseenter.native="collapseOpen"
          @mouseleave.native="collapseClose"
      >
        <el-menu
          class="nav-menu"
          @open="handleOpen"
          @close="handleClose"
          :router="true"
          :unique-opened="true"
          :collapse="isCollapse"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span> 用户管理 </span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="" style="cursor: default">
                <el-avatar
                  v-if="profilePic"
                  :size="25"
                  :src="profilePic"
                ></el-avatar>
                <el-avatar v-else :size="25" icon="el-icon-user"></el-avatar>
                <span> {{ username }} </span>
              </el-menu-item>
              <el-menu-item index="">
                <i class="el-icon-camera"></i>
                <span slot="title"> 更改头像 </span>
                <input id="imgUpload" type="file" accept="image/png,image/gif,image/jpeg" @change="uploadAvatar($event)"/>
              </el-menu-item>
              <el-menu-item index="" @click="dialogFormVisible1=true">
                <i class="el-icon-edit"></i>
                <span slot="title"> 编辑资料 </span>
              </el-menu-item>
              <el-menu-item index="/" @click="Logout">
                <i class="el-icon-switch-button"></i>
                <span slot="title"> 退出登录 </span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span> 团队 </span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="" @click="dialogFormVisible2=true" style="font-size:16px; color:darkslateblue;">
                创建团队
                <i class="el-icon-plus" style="font-size:16px; color:darkslateblue;"></i>
              </el-menu-item>
              <el-menu-item
                  v-for="item in joinedTeam"
                  :key="item.index"
                  @click="toTeam(item.id)"
              >{{ item.teamName }}
              </el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>

          <el-menu-item index="/invitation">
            <i class="el-icon-postcard"></i>
            <span slot="title"> 查看邀请 </span>
          </el-menu-item>
          <el-menu-item index="/about">
            <i class="el-icon-collection"></i>
            <span class="mainTitle"> 关于墨书 </span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main></el-main>
    </el-container>

    <el-dialog title="编辑个人信息" :visible.sync="dialogFormVisible1" :modal-append-to-body="false">
      <el-form :model="form">
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" :label-width="formLabelWidth">
          <el-input v-model="form.realname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="个性签名" :label-width="formLabelWidth">
          <el-input v-model="form.about" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editProfile">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="创建团队" :visible.sync="dialogFormVisible2">
      <el-form :model="team">
        <el-form-item label="团队名称" :label-width="formLabelWidth">
          <el-input v-model="team.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="team.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit2">取 消</el-button>
        <el-button type="primary" @click="createTeam">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import user from "@/store/user";

export default {
  data() {
    return {
      isLogin: false,
      joinedTeam: [],
      collapseBtnClick: false,
      isCollapse: true,
      userId: "",
      username: "",
      profilePic: "",
      form: {
        username: "",
        profilePic: "",
        realname: "",
        email: "",
        about: "",
      },
      team: {
        name: "",
        desc: "",
      },
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      formLabelWidth: "120px",
    };
  },
  created() {
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if (userInfo) {
      this.isLogin = true;
      this.$store.state._isLogin_ = true;
      this.userId = userInfo.user.id;
      this.username = userInfo.user.username;
      this.form.username = userInfo.user.username;
      this.getUser();
    }
  },
  mounted() {
    this.getJoinedTeam();
  },
  methods: {
    createTeam() {
      if (this.team.name == "") {
        this.$message.warning("团队名不可为空");
        return;
      }

      if (this.team.desc == "") {
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
        method: "post",
        url: "/api/v1/team/create",
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res);
          this.$message.success("创建成功");
          this.dialogFormVisible2 = false;
          this.team.name = "";
          this.team.desc = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getImg(event) {
      this.form.profilePic = event.target.files[0];
    },
    async uploadAvatar(event) {
      this.form.profilePic = event.target.files[0];
      const formData = new FormData();
      formData.append("email", this.form.email);
      formData.append("username", this.form.username);
      formData.append("userId", this.form.id);
      formData.append("about", this.form.about);
      formData.append("realname", this.form.realname);
      formData.append("profile", this.form.profilePic);
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      await this.$axios({
        method: "put",
        url: "/api/v1/auth/detail/" + this.userId,
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res);
          this.getUser();
          setTimeout(function () {
            location.reload(true);
          }, 500);
          this.$message.success("恭喜！修改成功");
        })
        .catch((err) => {
          console.log(err);
          this.$message.warning("抱歉！上传失败");
        });
    },
    async editProfile() {
      const formData = new FormData();
      formData.append("email", this.form.email);
      formData.append("username", this.form.username);
      formData.append("userId", this.form.id);
      formData.append("about", this.form.about);
      formData.append("realname", this.form.realname);
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      await this.$axios({
        method: "put",
        url: "/api/v1/auth/detail/" + this.userId,
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res);
          this.getUser();
          this.dialogFormVisible1 = false;
          setTimeout(function () {
            location.reload(true);
          }, 500);
          this.$message.success("恭喜！修改成功");
        })
        .catch((err) => {
          console.log(err);
          this.$message.warning("抱歉！昵称已被使用");
        });
    },
    cancelEdit2() {
      this.dialogFormVisible2 = false;
      this.getUser();
    },
    cancelEdit() {
      this.dialogFormVisible1 = false;
      this.getUser();
    },
    collapseStatus() {
      this.collapseBtnClick = this.isCollapse;
      this.isCollapse = !this.isCollapse;
    },
    collapseOpen() {
      if (this.collapseBtnClick) return;
      this.isCollapse = false;
    },
    collapseClose() {
      if (this.collapseBtnClick) return;
      this.isCollapse = true;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    Logout() {
      localStorage.removeItem("token");
      this.$store.dispatch("clear");
      this.$message.success("登出成功");
      setTimeout(() => {
        this.$router.push({path: "/"});
        location.reload();
      }, 500);
    },
    async getUser() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
        method: "get",
        url: "/api/v1/auth/detail/" + this.userId,
        headers: header,
      })
        .then((res) => {
          console.log(res);
          this.form.realname = res.data.realname;
          this.form.email = res.data.email;
          this.profilePic = res.data.thumbnail;
          this.form.profilePic = res.data.thumbnail;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getJoinedTeam() {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      await this.$axios({
        method: "get",
        url: "/api/v1/team/list",
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.joinedTeam = res.data.results;
          })
          .catch((err) => {
            console.log(err);
          });
    },
    toTeam(teamId) {
      this.$router.push("/team/" + teamId);
      setTimeout(() => {
        location.reload();
      }, 500);
    },
    toInvitation() {
      if (this.isLogin) {
        this.$router.push("/invitation");
      } else {
        this.$notify({
          title: "注意！",
          message: "请先进行登录",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style>
.el-submenu__title:hover,
.el-submenu.is-opened,
.el-submenu.is-closed {
  outline: 0 !important;
  background-color: #3d47773a !important;
  width: 150px;
}

.el-submenu .el-menu-item {
  color: #3d4777;
}
</style>
<style scoped>
#imgUpload {
  float: left;
  position: absolute;
  top: 15px;
  left: 30px;
  font-size: 20px;
  opacity: 0;
}
.el-avatar {
  margin-right: 5px;
}
i,
span {
  color: #3d4777;
  font-weight: 100;
}

.el-menu-item-group {
  /* background-color: #3d47774a; */
  background-color: #d3d5e0;
}

.el-menu-item {
  min-width: 150px;
}

.el-menu-item:hover {
  /* background-color: #3d47773a !important; */
  background-color: #d3d5e0 !important;
}

.el-menu:active span {
  color: #7d0066;
}

.nav-menu {
  height: 100vh;
  max-width: 150px;
  /* background-color: #3d47773a; */
  background-color: #d3d5e0;
  overflow: hidden;
}

.el-menu {
  border-right: none;
  transition: all 40ms;
}
</style>