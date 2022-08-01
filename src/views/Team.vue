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
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
  name: 'HomeView',
  components: {
    Navi,
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
    font-size: 36px;
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
.el-icon-user-solid{
    font-size: 22px;
}
</style>