<template>
  <div class="home">
    <Header></Header>
    <div>
      <img id="bg" src="@/assets/HomepageBg.png" />
      <h1 class="slogan">
        <span class="text-wrapper">
          <span class="line line1"></span>
          <span class="letters">产品协作设计，更快更简单！</span>
        </span>
      </h1>
      <h4 class="slogan2">
        <span>设计师的利器，产品经理的帮手，工程师的伙伴</span>
      </h4>
      <!-- <el-row justify="center" type="flex">
          <el-col :span="12"><div class="bigIcon">
            <i class="el-icon-office-building"></i>
          </div></el-col>
        </el-row> -->
      <!-- <el-row>
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
        </el-row> -->
      <!-- <el-row v-else type="flex" align="middle">
          <el-col :span="24"><div class="goLogin">
            <span>马上登录吧</span>
            <i class="el-icon-right"></i>
            <el-button type="primary" @click="toLogin">登录</el-button>
          </div></el-col>
        </el-row> -->
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import user from "@/store/user";
import anime from "animejs/lib/anime.js";

export default {
  name: "HomeView",
  components: {
    Header,
  },
  data() {
    return {
      dialogVisible: false,
      team: {
        name: "",
        desc: "",
      },
      isLogin: false,
    };
  },
  created() {
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if (userInfo) {
      this.userId = userInfo.user.id;
      this.isLogin = true;
    }
  },
  mounted() {
    var textWrapper = document.querySelector(".slogan .letters");
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /([^\x00-\x80]|\w)/g,
      "<span class='letter'>$&</span>"
    );

    anime
      .timeline({ loop: false })
      .add({
        targets: ".slogan .line",
        scaleY: [0, 1],
        opacity: [0.5, 1],
        easing: "easeOutExpo",
        duration: 700,
      })
      .add({
        targets: ".slogan .line",
        translateX: [
          0,
          document.querySelector(".slogan .letters").getBoundingClientRect()
            .width + 10,
        ],
        easing: "easeOutExpo",
        duration: 700,
        delay: 100,
      })
      .add({
        targets: ".slogan .letter",
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 600,
        offset: "-=775",
        delay: (el, i) => 34 * (i + 1),
      });
    anime.timeline({ loop: false }).add({
      targets: ".slogan2",
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 3000,
      delay: 3000,
    });
  },
  methods: {
    cancelChanges() {
      this.dialogVisible = false;
      this.team.name = "";
      this.team.desc = "";
    },
    handleClose() {
      this.dialogVisible = false;
      this.team.name = "";
      this.team.desc = "";
    },
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
          this.dialogVisible = false;
          this.team.name = "";
          this.team.desc = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    checkInvitation() {
      this.$router.push("/invitation");
    },
    toLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.slogan2 {
  margin: 0 120px;
  color: #3D4777;
}
.slogan {
  font-weight: 700;
  font-size: 3.5em;
  margin: 200px 120px 20px;
}

.slogan .text-wrapper {
  position: relative;
  display: inline-block;
  padding-top: 0.1em;
  padding-right: 0.05em;
  padding-bottom: 0.15em;
}

.slogan .line {
  opacity: 0;
  position: absolute;
  left: 0;
  height: 100%;
  width: 3px;
  background-color: #fff;
  transform-origin: 0 50%;
}

.slogan .line1 {
  top: 0;
  left: 0;
}

.slogan .letter {
  display: inline-block;
  line-height: 1em;
}
.Title {
  text-align: center;
  font-size: 64px;
  font-family: STKaiti;
}
.bigIcon {
  /* border: 1px solid black; */
  text-align: center;
  margin-top: 180px;
  font-size: 100px;
}
.Button {
  text-align: center;
  margin-top: 20px;
}
.Button button {
  background-color: rgba(154, 85, 85, 0.664);
  border-color: rgb(140, 83, 83);
}
.goLogin {
  /* border: 1px solid black; */
  text-align: center;
  font-size: 36px;
}
.goLogin button {
  width: 120px;
  font-size: 30px;
  margin-top: 10px;
  background-color: rgba(154, 85, 85, 0.664);
  border-color: rgb(140, 83, 83);
}
#bg {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: -1;
  /* object-fit: cover; */
  /* opacity: 0.8; */
}
#cancel {
  color: white;
}
.home {
  height: 100vh;
}
</style>
