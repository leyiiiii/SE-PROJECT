<template>
  <div class="home">
    <el-row>
      <el-col :span="2"><div class="Left">
        <Navi></Navi>
        </div></el-col>
      <el-col :span="22"><div class="Right">
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
        <el-row>
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
                    <el-button @click="cancelChanges">取消</el-button>
                    <el-button type="primary" @click="createTeam">确定</el-button>
                    </span>
                </el-dialog>
              <el-button type="primary" icon="el-icon-message" @click="checkInvitation">查看邀请</el-button>
            </el-button-group>
          </div></el-col>
        </el-row>
      </div></el-col>
    </el-row>
  </div>
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
      dialogVisible: false,
      team: {
        name:'',
        desc:'',
      }
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
    },
    checkInvitation() {
      this.$router.push("/invite");
    }
  }
}
</script>

<style scoped>
.Title{
  text-align: center;
  font-size: 64px;
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
</style>
