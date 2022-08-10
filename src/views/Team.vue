<template>
  <el-row>
    <el-col :span="2">
      <div class="Nav">
        <Navi></Navi>
      </div>
    </el-col>
    <el-col :span="21">
      <div class="Right">
        <el-row>
          <el-col :span="17">
            <div class="info">
              <span class="teamInfo1">{{ form.name }}</span>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="inviteButton">
              <el-button class="recycleButton" icon="el-icon-delete-solid" round @click="toRecycle">回收站</el-button>
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
            </div>
          </el-col>
        </el-row>

        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                 background-color="#F4E3E0" active-text-color="#ff6699" text-color="black">
          <el-menu-item index="1">详情</el-menu-item>
          <el-menu-item index="2">项目</el-menu-item>
          <el-menu-item index="3">文档中心</el-menu-item>
          <el-menu-item index="4"><i class="el-icon-user-solid"></i>成员列表</el-menu-item>
        </el-menu>

        <el-row v-if="activePage ==='1'">
          <div class="container">
            <div class="card">
              <div class="image">
                <img href="#" src="@/assets/Group1.png">
              </div>
              <div class="content">
                <h3>创建日期</h3>
                <p> {{ form.date }}</p>
              </div>
            </div>
          </div>
          <div class="container">
            <div class="card">
              <div class="image">
                <img href="#" src="@/assets/Group2.png">
              </div>
              <div class="content">
                <h3>人数</h3>
                <p> {{ form.count }}</p>
              </div>
            </div>
          </div>
          <div class="container">
            <div class="card">
              <div class="image">
                <img href="#" src="@/assets/Group3.png">
              </div>
              <div class="content">
                <h3>简介</h3>
                <p> {{ form.desc }}</p>
              </div>
            </div>
          </div>

        </el-row>
        <el-row v-if="activePage ==='2'">
          <el-col :span="24">
            <div class="projectTitle">
              <i class="el-icon-s-order"></i>
              <span class="membersTitle">项目</span>
              <el-tooltip class="item" effect="dark" content="创建项目" placement="top-start">
                <el-button class="addButton" icon="el-icon-plus" circle @click="dialogVisible = true"></el-button>
              </el-tooltip>
              <el-dialog title="创建项目" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
                <el-form :model="project" label-width="auto">
                  <el-form-item label="项目名称">
                    <el-input v-model="project.name"></el-input>
                  </el-form-item>
                  <el-form-item label="项目描述">
                    <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="project.desc" autocomplete="off"
                              resize="none"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelChanges">取消</el-button>
                    <el-button type="primary" @click="createProject">确定</el-button>
                    </span>
              </el-dialog>
              <el-table
                  v-if="haveProject && activePage ==='2'"
                  :data="projectList.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase())|| data.creatorName.toLowerCase().includes(search.toLowerCase()))"
                  style="width: 100%"
                  @cell-click="toProject"
                  :cell-class-name="getCellIndex">
                <el-table-column
                    label="项目名称"
                    prop="title"
                    sortable>
                </el-table-column>
                <el-table-column
                    label="创建日期"
                    prop="createdAt"
                    sortable>
                </el-table-column>
                <el-table-column
                    label="创建者"
                    prop="creatorName">
                </el-table-column>
                <el-table-column
                    align="right">
                  <template slot="header" slot-scope="scope">
                    <el-input
                        v-model="search"
                        size="mini"
                        placeholder="输入您的搜索"
                        @click="None(scope.$index)"/>
                  </template>
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <el-button size="mini" type="primary" icon="el-icon-edit" circle
                                 @click="editProject_(scope.$index, scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="复制" placement="top">
                      <el-button size="mini" type="primary" icon="el-icon-document-copy" circle
                                 @click="duplicateProject(scope.$index, scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <el-button size="mini" type="danger" icon="el-icon-delete" circle
                                 @click="deleteProject(scope.$index, scope.row)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="更多信息" placement="top">
                      <el-button size="mini" type="info" icon="el-icon-info" circle
                                 @click="getProjectInfo(scope.$index, scope.row)"></el-button>
                    </el-tooltip>
                    <el-dialog title="编辑项目" :visible.sync="editDialogVisible" width="50%"
                               :before-close="handleEditDialogClose" append-to-body=true>
                      <el-form :model="form" label-width="auto">
                        <el-form-item label="项目名称">
                          <el-input v-model="form.nameTemp"></el-input>
                        </el-form-item>
                        <el-form-item label="项目描述">
                          <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="form.descTemp"
                                    autocomplete="off" resize="none"></el-input>
                        </el-form-item>
                      </el-form>
                      <span slot="footer" class="dialog-footer">
                          <el-button @click="cancelEditProject">取消</el-button>
                          <el-button type="primary" @click="editProject">确定</el-button>
                        </span>
                    </el-dialog>
                    <el-dialog title="项目信息" :visible.sync="getProjectInfoDialogVisible" width="30%" append-to-body=true>
                      <h4>项目名称：{{ projectInfo.title }}</h4>
                      <h4>项目描述：{{ projectInfo.description }}</h4>
                      <h4>项目创建于：{{ projectInfo.createdAt | formatDate }}</h4>
                      <h4>项目更新于：{{ projectInfo.updatedAt | formatDate }}</h4>
                      <span slot="footer" class="dialog-footer">
                        <el-button @click="getProjectInfoDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="getProjectInfoDialogVisible = false">确定</el-button>
                      </span>
                    </el-dialog>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="!haveProject && activePage == '2'">
          <el-col :span="24">
            <div class="noProjects">
              <img src="@/assets/Project1.png" class="noProjectImg">
              <p>- 暂无项目 -</p>
            </div>
          </el-col>
        </el-row>

        <el-row v-if="activePage == '3'">
          <Doc></Doc>
        </el-row>

        <el-row v-if="activePage ==='4'">
          <el-col :span="24">
            <div class="membersRow">
              <el-descriptions v-for="item in membersList" :key="item.id" border :column="5" class="description">
                <el-descriptions-item label="昵称" :label-class-name="my-label" :contentStyle="contentStyle"
                                      :labelStyle="labelStyle">{{ item.username }}
                </el-descriptions-item>
                <el-descriptions-item label="真实姓名" v-if="item.realname == ''" :contentStyle="contentStyle"
                                      :labelStyle="labelStyle2">{{ item.username }}
                </el-descriptions-item>
                <el-descriptions-item label="真实姓名" v-else :contentStyle="contentStyle" :labelStyle="labelStyle2">
                  {{ item.realname }}
                </el-descriptions-item>
                <el-descriptions-item label="邮箱" :contentStyle="contentStyle2" :labelStyle="labelStyle">
                  {{ item.email }}
                </el-descriptions-item>
                <el-descriptions-item label="身份" :labelStyle="labelStyle">
                  <el-tag size="small" type="warning" v-if="item.position == 'Main Admin'">主管理员</el-tag>
                  <el-tag size="small" v-if="item.position == 'Admin'">管理员</el-tag>
                  <el-tag size="small" type="info" v-if="item.position == 'Member'">成员</el-tag>
                  <el-dropdown class="More" trigger="click">
                    <i v-if="checkPosition4(item.position, item.id)" class="el-icon-more"></i>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="checkPosition(item.position)" @click.native="promoteMember(item.id)">
                        升为管理员
                      </el-dropdown-item>
                      <el-dropdown-item v-if="checkPosition3(item.position)" @click.native="demoteMember(item.id)">
                        降为成员
                      </el-dropdown-item>
                      <el-dropdown-item v-if="checkPosition2(item.position)" @click.native="kickMember(item.id)">移除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import Navi from '@/components/NavigationBar.vue'
import Doc from '@/components/Document.vue'
import user from "@/store/user";

export default {
  name: 'Team',
  components: {
    Navi,
    Doc,
  },
  data() {
    return {
      haveTeam: false,
      dialogVisible: false,
      dialogVisible2: false,
      isMainAdmin: false,
      isAdmin: false,
      isMember: false,
      userId: '',
      activeIndex: '3',
      activePage: '3',
      form: {
        name: '',
        desc: '',
        date: '',
        count: '',
        nameTemp: '',
        descTemp: '',
        belongTo: '',
      },
      // form_: {
      //   name: '',
      //   desc: '',
      //   nameTemp: '',
      //   descTemp: '',
      //   belongTo: '',
      // },
      project: {
        name: '',
        desc: '',
      },
      indexTemp: 0,
      rowTemp: {},
      inviteName: '',
      haveProject: false,
      projectList: [],
      membersList: [],
      search: '',
      rowIndex: 0,
      cellIndex: 0,
      contentStyle: {
        'width': '250px',
      },
      contentStyle2: {
        'width': '400px',
      },
      labelStyle: {
        'width': '55px',
      },
      labelStyle2: {
        'width': '90px',
      },
      editDialogVisible: false,
      getProjectInfoDialogVisible: false,
      projectInfo: {
        title: "",
        description: "",
        createdAt: "",
        updatedAt: "",
        belongTo: ""
      }
    }
  },

  created() {
    var arr = this.$route.params.id.split("&");
    this.teamId = arr[0];
    if (arr.length > 1) {
      this.activePage = '3'
      this.activeIndex = '3';
    }
    this.getTeamInfo();
    this.getProjectDetail();
    var userInfo;
    userInfo = user.getters.getUser(user.state());
    if (userInfo) {
      this.userId = userInfo.user.id;
    }
  },

  methods: {
    duplicateProject(index, row) {
      // console.log(index, row);

      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "post",
        url: "/api/v1/project/copy/" + row.id,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("项目复制成功！");
            setTimeout(function () {
              location.reload(true);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message.warning("项目复制失败！")
          });

    },

    deleteProject(index, row) {
      // console.log(index, row);
      // console.log(index);

      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "delete",
        url: "/api/v1/project/" + row.id,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("项目删除成功！");
            this.projectList.splice(index, 1);
          })
          .catch((err) => {
            console.log(err);
            this.$message.warning("项目删除失败！")
          });
    },

    cancelEditProject() {
      this.editDialogVisible = false;
      this.form.nameTemp = this.form.name;
      this.form.descTemp = this.form.desc;
    },

    editProject_(index, row) {
      this.editDialogVisible = true;
      this.indexTemp = index;
      this.rowTemp = row;
    },

    editProject() {
      const formData = new FormData();
      formData.append("title", this.form.nameTemp);
      formData.append("description", this.form.descTemp);

      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "put",
        url: "/api/v1/project/" + this.rowTemp.id,
        data: formData,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("项目编辑成功");
            this.editDialogVisible = false;
            this.form.name = this.form.nameTemp;
            this.form.desc = this.form.descTemp;
            setTimeout(function () {
              location.reload(true);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
            this.$message.warning("项目编辑失败！")
          })
    },

    getProjectInfo(index, row) {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "get",
        url: "/api/v1/project/" + row.id,
        headers: header,
      })
          .then((res) => {
            var projectInfo = res.data;
            this.projectInfo.title = projectInfo.title;
            this.projectInfo.description = projectInfo.description;
            this.projectInfo.createdAt = projectInfo.createdAt;
            this.projectInfo.updatedAt = projectInfo.updatedAt;
            this.getProjectInfoDialogVisible = true;
          })
          .catch((err) => {
            console.log(err);
            this.$message.warning("获取项目信息失败！")
          })
    },

    cancelChanges() {
      this.dialogVisible = false;
      this.project.name = '';
      this.project.desc = '';
    },
    handleEditDialogClose() {
      this.dialogVisible = false;
      this.form.nameTemp = this.form.name;
      this.form.descTemp = this.form.desc;
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
    handleSelect(key, keyPath) {
      if (key === '1') {
        this.activePage = '1';
      }

      if (key === '2') {
        this.activePage = '2';
      }

      if (key === '3') {
        this.activePage = '3';
      }

      if (key === '4') {
        this.activePage = '4';
      }
    },
    createProject() {
      if (this.project.name == "") {
        this.$message.warning("项目名不可为空！");
        return;
      }

      if (this.project.desc == "") {
        this.$message.warning("项目描述不可为空！");
        return;
      }

      const formData = new FormData();
      formData.append("title", this.project.name);
      formData.append("description", this.project.desc);

      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};


      this.$axios({
        method: "post",
        url: "/api/v1/project/create/" + this.teamId,
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
    getCellIndex({row, column, rowIndex, columnIndex}) {
      row.index = rowIndex;
      column.index = columnIndex;
    },
    toProject(row, column, cell, event) {
      this.rowIndex = row.index;
      this.columnIndex = column.index;

      if (this.columnIndex != 3) {
        this.$router.push("/project/" + row.id);
      }
    },
    inviteMember() {
      const formData = new FormData();
      formData.append("user", this.inviteName);
      formData.append("teamId", this.teamId);

      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "post",
        url: "/api/v1/team/invite",
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
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "delete",
        url: "/api/v1/team/leave/" + this.teamId,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("离开团队成功");
            this.$router.push({path: '/teamhome'});
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

            for (let i = 0; i < this.membersList.length; i++) {
              if (this.membersList[i].id === this.userId) {
                if (this.membersList[i].position == 0) {
                  this.isMainAdmin = true;
                  console.log("MAIN");
                  break;
                }
                if (this.membersList[i].position == 1) {
                  this.isAdmin = true;
                  console.log("ADMIN");
                  break;
                }
                if (this.membersList[i].position == 2) {
                  this.isMember = true;
                  console.log("NORMAL");
                  break;
                }
              }
            }

            for (let i = 0; i < this.membersList.length; i++) {
              if (this.membersList[i].position == 0) {
                this.membersList[i].position = 'Main Admin';
              }
              if (this.membersList[i].position == 1) {
                this.membersList[i].position = 'Admin';
              }
              if (this.membersList[i].position == 2) {
                this.membersList[i].position = 'Member';
              }
            }
          }))
          .catch((err) => {
            console.log(err);
            this.$router.push({path: '/'});
          })
    },
    getTeamMembers() {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      return this.$axios({
        method: "get",
        url: "/api/v1/team/member/list/" + this.teamId,
        headers: header,
      });
    },
    getTeamDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      return this.$axios({
        method: "get",
        url: "/api/v1/team/" + this.teamId,
        headers: header,
      });
    },
    getProjectDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "get",
        url: "/api/v1/project/list?belongTo=" + this.teamId,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.projectList = res.data.results;

            for (let i = 0; i < this.projectList.length; i++) {
              this.projectList[i].createdAt = this.projectList[i].createdAt.slice(0, 10);
            }

            if (this.projectList.length > 0) {
              this.haveProject = true;
            }
          })
          .catch((err) => {
            console.log(err);
          })
    },
    hasChinese() {
      const REGEX_CHINESE = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
      const hasChinese = this.form.desc.match(REGEX_CHINESE);
      if (hasChinese) {
        // console.log("true");
        return true;
      } else {
        // console.log("false");
        return false;
      }
    },
    checkPosition(userPos) {
      if (userPos === "Member" && (this.isMainAdmin || this.isAdmin)) {
        console.log("CAN PROMOTE");
        return true;
      } else return false;
    },
    checkPosition2(userPos) {
      if (userPos === "Member" && (this.isMainAdmin || this.isAdmin)) {
        console.log("CAN DEMOTE");
        return true;
      }
      if (userPos === "Admin" && this.isMainAdmin) {
        console.log("CAN KICK");
        return true;
      } else return false;
    },
    checkPosition3(userPos) {
      if (this.isMainAdmin && userPos === "Admin") {
        console.log("CAN DEMOTE");
        return true;
      } else return false;
    },
    checkPosition4(userPos, userId) {
      if (userId == this.userId) {
        return false;
      }
      if (this.isMainAdmin) {
        return true;
      }
      if (this.isAdmin && userPos == 'Member') {
        return true;
      } else return false;
    },
    promoteMember(memberId) {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "put",
        url: "/api/v1/team/admin/set/" + this.teamId + "/" + memberId,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("设置成功！");
            setTimeout(function () {
              location.reload(true);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
          })
    },
    demoteMember(memberId) {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "put",
        url: "/api/v1/team/admin/remove/" + this.teamId + "/" + memberId,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("设置成功！");
            setTimeout(function () {
              location.reload(true);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
          })
    },
    kickMember(memberId) {
      var header = {};
      if (localStorage.getItem("token"))
        header = {Authorization: "Bearer " + localStorage.getItem("token")};

      this.$axios({
        method: "delete",
        url: "/api/v1/team/member/remove/" + this.teamId + "/" + memberId,
        headers: header,
      })
          .then((res) => {
            console.log(res);
            this.$message.success("移除成功！");
            setTimeout(function () {
              location.reload(true);
            }, 500);
          })
          .catch((err) => {
            console.log(err);
          })
    },
    toRecycle() {
      this.$router.push("/recycle/" + this.teamId);
    },
  }
}
</script>

<style>
.el-descriptions-item__label.is-bordered-label {
  background: #F4E3E0;
}
</style>

<style scoped>
.createTeam:hover {
  cursor: pointer;
  color: #3D4777;
}

.inviteButton {
  /* border: 1px solid black; */
  float: right;
  margin-top: 20px;
}

.inviteButton button {
  margin-right: 5px;
  margin-left: 0px;
}

.info {
  margin: 10px;
  /* border: 1px solid black; */
}

.infoDesc {
  margin-left: 10px;
  /* border: 1px solid black; */
}

.infoDesc2 {
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  white-space: normal;
  /* border: 1px solid black; */
}

.infoDesc3 {
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  white-space: normal;
  /* border: 1px solid black; */
}

.teamInfo1 {
  font-size: 48px;
  font-family: 'Times New Roman', Times, serif;
}

.teamInfo2 {
  font-size: 20px;
  font-family: cursive;
}

.noProjects {
  margin-top: 130px;
  /* border: 1px solid black; */
  text-align: center;
}

.noProjects p {
  margin-top: 10px;
  color: rgba(128, 128, 128, 0.67);
}

.members, .projectTitle {
  /* border: 1px solid black; */
  margin: 30px 0 0 10px;
}

.membersTitle {
  font-size: 24px;
}

.membersList {
  /* border: 1px solid black; */
  border-radius: 20px;
  margin-top: 10px;
  background-color: rgb(244, 200, 242);
}

.membersInfo {
  margin: 5px 0 5px 10px;
  font-size: 18px;
  /* border: 1px solid black; */
}

.membersRow {
  /* border: 1px solid black; */
  margin-top: 10px;
  max-height: 600px;
  overflow: hidden;
  overflow-y: scroll;
}

.buttonArea {
  position: absolute;
  margin-top: 12px;
}

.addButton {
  margin-left: 10px;
}

.projectButton {
  margin-left: 20px;
  margin-top: 10px;
}

.description {
  /* border: 1px solid black; */
  margin: 10px;
}

.el-icon-s-order {
  font-size: 22px;
}

.el-icon-user-solid {
  color: black;
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

.noProjectImg {
  height: 20%;
  width: 20%;
  opacity: 0.8;
}

.container {
  /* border: 1px solid black; */
  position: relative;
  width: 300px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* flex-warp : warp; */
  padding: 30px;
  margin-left: 100px;
  margin-top: 100px;
}

.container .card {
  position: relative;
  max-width: 300px;
  height: 215px;
  background-color: #fff;
  margin: 30px 10px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  transition: 0.3s ease-in-out;
  border-radius: 15px;
}

.container .card:hover {
  height: 320px;
}

.container .card .image {
  position: relative;
  background: rgb(254, 235, 238);
  width: 260px;
  height: 260px;
  top: -40%;
  /* left: 8px; */
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.container .card .image img {
  max-width: 100%;
  border-radius: 15px;
}

.container .card .content {
  position: relative;
  top: -140px;
  padding: 10px 15px;
  color: #111;
  text-align: center;
  visibility: hidden;
  opacity: 0;
  transition: 0.3s ease-in-out;
  /* border: 1px solid black; */
  overflow-wrap: break-word;
  max-width: 260px;
}

.container .card:hover .content {
  margin-top: 30px;
  visibility: visible;
  opacity: 1;
  transition-delay: 0.2s;
}

.content h3 {
  font-size: 30px;
  color: #F4E3E0;
}

.content p {
  color: #c9bab8;
}
</style>