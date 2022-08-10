<template>
  <div class="about">
    <Header></Header>
    <div>
      <img id="bg" src="@/assets/HomepageBg.png" />
      <h1 class="slogan">
        <span class="text-wrapper">
          <span class="line line1"></span>
          <span class="letters">好的产品，打动人心</span>
        </span>
      </h1>
      <h4 class="slogan2">
        <div>墨书，一个产品协作平台</div><br>
        <div>在墨书，你可以加入或创建团队，在团队内进行身份管理</div>
        <div>在墨书，你可以创建或打开项目，并进行项目管理</div>
        <div>在墨书，你可以设计产品的原型，并导出原型设计页面</div>
        <div>在墨书，你可以对设计好的原型开启预览，让他人看到你的设计</div>
        <div>在墨书，你可以编辑项目文档，也可以编辑只属于团队的文档</div><br>
        <div>在墨书，只有你想不到的，没有你做不到的</div>
      </h4>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import user from "@/store/user";
import anime from "animejs/lib/anime.js";

export default {
  name: "aboutView",
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
  letter-spacing: 0.5em;
  line-height: 160%;
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
#bg {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: -1;
}
.about {
  height: 100vh;
}
</style>
