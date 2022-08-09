<template>
  <el-row>
    <div>
      <img id="bg" src="@/assets/TeamBg.png" alt="" />
      <h1 class="slogan">赶快进入团队开始工作吧！</h1>
      <h3 class="createTeam" @click="dialogFormVisible=true">
        创建团队<i class="el-icon-right"></i>
      </h3>
      <el-col :span="2">
        <div class="Nav">
          <Navi></Navi>
        </div>
      </el-col>
    </div>
    <el-dialog title="创建团队" :visible.sync="dialogFormVisible">
      <el-form :model="team">
        <el-form-item label="团队名称" :label-width="formLabelWidth">
          <el-input v-model="team.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介" :label-width="formLabelWidth">
          <el-input v-model="team.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="createTeam">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import Navi from "@/components/NavigationBar.vue";
import anime from "animejs/lib/anime.js";

export default {
  name: "TeamHomepage",
  components: {
    Navi,
  },
  data() {
    return {
      status: false,
      haveTeam: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      team: {
        name: "",
        desc: "",
      },
    };
  },
  created() {
    this.getTeam();
  },
  mounted() {
    var textWrapper = document.querySelector(".slogan");
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter'>$&</span>"
    );

    anime.timeline({ loop: false }).add({
      targets: ".slogan .letter",
      translateX: [40, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 5000,
      delay: (el, i) => 500 + 30 * i,
    });
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
          this.dialogFormVisible = false;
          this.team.name = "";
          this.team.desc = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    cancelEdit() {
      this.dialogFormVisible = false;
      this.getUser();
    },
    async getTeam() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
        method: "get",
        url: "/api/v1/team/list",
        headers: header,
      })
        .then((res) => {
          if (res.data.results.length != 0) {
            this.haveTeam = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.status = true;
    },
  },
};
</script>

<style scoped>
.createTeam:hover {
  cursor: pointer;
  color: #3d4777;
}
.createTeam {
  position: absolute;
  top: 120px;
  left: 730px;
  font-weight: 200;
  font-size: 1.5em;
  text-transform: uppercase;
  letter-spacing: 0.4em;
}
.slogan {
  position: absolute;
  top: 50px;
  left: 600px;
  font-weight: 200;
  font-size: 2em;
  text-transform: uppercase;
  letter-spacing: 0.5em;
}
.slogan .letter {
  display: inline-block;
  line-height: 1em;
}
.Nav {
  position: relative;
  z-index: 99;
}
.el-icon-more {
  transform: rotate(90deg);
}
.More {
  /* border: 1px solid black; */
  float: right;
}
#bg {
  position: absolute;
  width: 100%;
  z-index: -1;
}
</style>