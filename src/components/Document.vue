<template>
  <el-row>
    <el-col :span="3">
      <div class="content">
        <div v-if="!isTeamDoc" class="content-title">
          <i class="el-icon-s-unfold"></i>
          文档
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <div class="add-icon" @click="add">+</div>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">空白文档</el-dropdown-item>
            <el-dropdown-item command="b">会议记录</el-dropdown-item>
            <el-dropdown-item command="c">需求规格说明书</el-dropdown-item>
            <el-dropdown-item command="d">软件开发计划书</el-dropdown-item>
            <el-dropdown-item command="e">软件测试报告</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          <!-- <div class="add-icon" @click="add">+</div> -->
        </div>
        <div v-else class="content-title">
          <i class="el-icon-s-unfold"></i>
          文档中心
          <div class="el-icon-folder-add" @click="addTeamFolder"></div>
          <div class="el-icon-document-add" @click="addTeamDoc"></div>
        </div>
        <div v-if="!isTeamDoc">
          <li v-for="item in documentList" :key="item.id">
            <div class="list-box" @click="openDoc(item.id)">
              <i class="el-icon-document"></i>
              {{ item.title }}
            </div>
            <i class="el-icon-delete" @click="remove(item.id)"></i>
          </li>
        </div>
        <div v-else-if="isTeamDoc && status1">
          <div v-for="item in folderList" :key="item.id">
            <el-dropdown size="mini">
              <div class="list-box">
                <i class="el-icon-folder"></i>
                {{ item.title }}
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="editFolderName(item.id)"
                    >重命名</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="addDocInFolder(item.id)"
                    >添加文档</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="deleteFolder(item.id)"
                    >删除文件夹</el-dropdown-item
                  >
                </el-dropdown-menu>
              </div>
            </el-dropdown>
            <div
              class="second"
              v-for="child in item.folchildren"
              :key="child.id"
            >
              <el-dropdown size="mini">
                <div class="list-box">
                  <i class="el-icon-folder"></i>
                  {{ child.title }}
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="editFolderName(child.id)"
                      >重命名</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="addDocInFolder(child.id)"
                      >添加文档</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="deleteFolder(child.id)"
                      >删除文件夹</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </div>
              </el-dropdown>
              <div
                class="third"
                v-for="childs in child.docchildren"
                :key="childs.id"
              >
                <i class="el-icon-document"></i>
                {{ childs.title }}
              </div>
            </div>
            <div
              class="second"
              v-for="child in item.docchildren"
              :key="child.id"
            >
              <i class="el-icon-document"></i>
              {{ child.title }}
            </div>
          </div>
          <div
            class="first"
            v-for="item in teamDocList"
            :key="item.id"
            @click="openDoc(item.id)"
          >
            <i class="el-icon-document"></i>
            {{ item.title }}
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="18" :offset="1">
      <div class="doc-title" v-if="status">
        {{ title }}
        <el-tooltip
          class="item"
          effect="dark"
          content="修改文件名"
          placement="top"
        >
          <i class="el-icon-edit" @click="changeTitle"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="保存" placement="top">
          <i class="el-icon-upload" @click="saveDoc"></i>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="退出编辑"
          placement="top"
        >
          <i class="el-icon-check" @click="endEdit"></i>
        </el-tooltip>
      </div>
      <Editor ref="editor" v-if="isOpenADoc"></Editor>
    </el-col>
  </el-row>
</template>

<script>
import Editor from "@/components/Editor";
export default {
  name: "test",
  components: {
    Editor,
  },
  data() {
    return {
      isTeamDoc: false,
      isOpenADoc: true,
      status1: false,
      status: false,
      iconFormVisible: false,
      userInfo: {},
      dialogTitle: "增加",
      rowIndex: null,
      teamId: "",
      projectId: "",
      haveDocument: false,
      documentId: "",
      title: "",
      documentContent: "",
      createdAt: "",
      createdBy: "",
      belongTo: "",
      updatedAt: "",
      documentList: [],
      folderList: [],
      teamDocList: [],
    };
  },
  created() {
    if (this.$route.path.slice(0, 5) == "/team") {
      this.isTeamDoc = true;
      var arr = this.$route.params.id.split("&");
      this.teamId = arr[0];
      this.getTeamDoc();
      if (arr.length > 2) {
        this.isOpenADoc = true;
        this.documentId = arr[2];
        this.getDocDetail();
      } else this.isOpenADoc = false;
    } else {
      var arr = this.$route.params.id.split("&");
      this.projectId = arr[0];
      this.getProjDoc();
      if (arr.length > 2) {
        this.isOpenADoc = true;
        this.documentId = arr[2];
        this.getDocDetail();
      } else this.isOpenADoc = false;
    }
  },
  methods: {
    handleCommand(command) {
      switch(command) {
        case 'a':{
          this.add("<p></p>")
          break;
        }
        case 'b':{
          this.add("\"<h1>会议记录</h1><hr/><p><strong>日期：</strong></p><p><strong>时间：</strong></p><p><strong>地点：</strong></p><p><strong>会议组织者：&nbsp;&nbsp;</strong></p><p><strong>会议类型：&nbsp;</strong></p><p><strong>主持人：&nbsp;&nbsp;</strong></p><p><strong>记录员：&nbsp;</strong></p><p><strong>计时员：&nbsp;</strong></p><p><strong>与会者：</strong>&nbsp;</p><p><br></p><p><strong>阅读内容：&nbsp;</strong></p><p><strong>携带内容：&nbsp;</strong></p><p><strong>议程项目：&nbsp;</strong></p><p><strong>演示者：&nbsp;</strong></p><p><strong>讨论：</strong></p><p><strong>结论：</strong></p><p><br></p><p><strong>拟办事项：</strong></p><p><strong>责任人：</strong></p><p><strong>截止日期：&nbsp;</strong></p><p><strong>议程项目：&nbsp;</strong></p><p><strong>演示者：&nbsp;</strong></p><p><strong>讨论：</strong></p><p><strong>结论：</strong></p>\"")
          break;
        }
        case 'c':{
          this.add("\"<h2 style=\\\"text-indent: 0px; text-align: start; line-height: 26px;\\\"><strong>一、&nbsp;引言</strong></h2><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>1.1&nbsp;定位与目标</strong></h3><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>1.2&nbsp;对象</strong></h3><li></li><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>1.3&nbsp;软件需求分析理论</strong></h3><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>1.4&nbsp;软件需求分析目标</strong></h3><p><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 26px;\\\"><strong>二、&nbsp;需求概述</strong></h2><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>2.1&nbsp;项目背景</strong></h3><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>2.2&nbsp;需求概述</strong></h3><p><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 26px;\\\"><strong>三、&nbsp;系统功能需求</strong></h2><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>3.1&nbsp;功能总览</strong></h3><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"></h3><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>3.2&nbsp;业务流程图</strong></h3><p><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>3.3&nbsp;数据流分析</strong></h3><p><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>3.4&nbsp;数据字典</strong></h3><p><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 26px;\\\"><strong>四、&nbsp;软硬件及外部系统接口需求</strong></h2><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>4.1&nbsp;用户界面</strong></h3><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>4.2&nbsp;硬件需求</strong></h3><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>4.3&nbsp;运行环境</strong></h3><ul style=\\\"text-indent: 0px; text-align: start;\\\"><li><strong>Web&nbsp;浏览器：</strong></li><li><strong>标准分辨率：</strong></li><li></li></ul><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 26px;\\\"><strong>五、&nbsp;可靠性与可用性需求</strong></h2><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>5.1&nbsp;性能需求</strong></h3><ul style=\\\"text-indent: 0px; text-align: start;\\\"><li><strong>处理能力</strong></li></ul><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><ul style=\\\"text-indent: 0px; text-align: start;\\\"><li><strong>响应时间</strong></li></ul><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h3 style=\\\"text-indent: 0px; text-align: start; line-height: 24px;\\\"><strong>5.2&nbsp;安全性需求</strong></h3><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 26px;\\\"><strong>六、&nbsp;参考文献</strong></h2>\"")
          break;
        }
        case 'd':{
          this.add("\"<h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 24px;\\\">1引言</span><span style=\\\"font-size: 16px;\\\"><br></span><span style=\\\"font-size: 22px;\\\">1.1编写目的<br><br>1.2背景</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">1.3定义</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">1.4参考资料</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">1.5&nbsp;系统动机(暂时保密)</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">1.6标准、条件和约定</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">1.7编写文档的WBS</span><span style=\\\"font-size: 16px;\\\"><br></span></h3><h2 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 24px;\\\">2项目概述</span></h2><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">2.1工作内容</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">2.2主要参加人员</span></h3><h4 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">2.3产品及成果<br></span><span style=\\\"font-size: 16px;\\\">2.3.1程序<br><br>2.3.3服务</span></h4><h4 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">2.4验收标准</span></h4><h4 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 16px;\\\">2.4.1代码的验收</span></h4><h4 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 16px;\\\">2.4.2&nbsp;文档验收</span></h4><h4 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 16px;\\\">2.4.3&nbsp;服务验收</span></h4><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">2.5完成项目的最迟期限</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">2.6本计划的日期</span><span style=\\\"font-size: 16px;\\\"><br></span></h3><h2 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 24px;\\\">3实施总计划</span><span style=\\\"font-size: 22px;\\\"><br>3.1开发过程<br></span><span style=\\\"font-size: 16px;\\\">3.1.1&nbsp;需求分析<br><br>3.1.2&nbsp;系统设计<br><br>3.1.3&nbsp;编码及测试阶段<br><br>3.1.4&nbsp;文档、产品部署</span></h2><h4 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 16px;\\\">3.1.5&nbsp;项目总结</span></h4><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">3.2工作任务的分解</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">3.3接口人员<br><br>3.4进度</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">3.5预算</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">3.6关键问题<br></span></h3><h2 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 24px;\\\">4支持条件</span><span style=\\\"font-size: 22px;\\\"><br>4.1计算机系统支持<br><br>4.2需要用户承担的工作<br><br>4.3需由外单位提供的条件<br></span></h2><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 24px;\\\">5专题计划要点</span><span style=\\\"font-size: 22px;\\\"><br>5.1开发人员培训计划</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">5.2&nbsp;测试计划</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">5.3&nbsp;质量保证计划</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">5.4&nbsp;人员配置计划</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">5.5&nbsp;客户培训计划</span></h3><h3 style=\\\"text-align: start;\\\"><span style=\\\"font-size: 22px;\\\">5.6&nbsp;安全保密计划</span><span style=\\\"font-size: 16px;\\\"><br></span></h3>\"")
          break;
        }
        case 'e':{
          this.add("\"<h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">1.&nbsp;介绍</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">1.1&nbsp;编写目的</h2><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.&nbsp;测试概要</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1&nbsp;测试方法和测试工具</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.1&nbsp;账号安全管理</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.2&nbsp;权限管理</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.3&nbsp;安全日志</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.4&nbsp;访问控制安全</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.5&nbsp;输入安全</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.6&nbsp;缓冲区溢出</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.7&nbsp;SQL注入</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">2.1.8&nbsp;跨站点脚本攻击</h2><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">3.&nbsp;测试组织</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">3.1&nbsp;测试人员</h2><table style=\\\"width: 100%;\\\"><tbody><tr><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th></tr><tr><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td></tr></tbody></table><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">4.&nbsp;测试结果及缺陷分析</h2><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">4.1&nbsp;遗留缺陷列表</h2><td colspan=\\\"1\\\" rowspan=\\\"1\\\" style=\\\"line-height: 24px;\\\"></td><table style=\\\"width: 100%;\\\"><tbody><tr><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th><th colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></th></tr><tr><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td></tr><tr><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td><td colSpan=\\\"1\\\" rowSpan=\\\"1\\\"></td></tr></tbody></table><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">5.&nbsp;测试结论</h2><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p><h2 style=\\\"text-indent: 0px; text-align: start; line-height: 1.5;\\\">6.&nbsp;测试建议</h2><p style=\\\"text-indent: 0px; text-align: start;\\\"><br></p>\"")
          break;
        }
      }
    },
    deleteFolder(id) {
      this.$confirm("此操作将永久删除该文件夹, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var header = {};
          if (localStorage.getItem("token"))
            header = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            };

          this.$axios({
            method: "delete",
            url: "/api/v1/folder/" + this.teamId + "/" + id,
            headers: header,
          })
            .then((res) => {
              console.log(res.data);
              this.$message({
                type: "success",
                message: "删除成功!",
              });

              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    editFolderName(id) {
      this.$prompt("更改文件夹名字", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          let formData = new FormData();
          formData.append("title", value);
          var header = {};
          if (localStorage.getItem("token"))
            header = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            };

          this.$axios({
            method: "put",
            url: "/api/v1/folder/" + this.teamId + "/" + id,
            data: formData,
            headers: header,
          })
            .then((res) => {
              console.log(res.data);
              this.$message({
                type: "success",
                message: "更改成功",
              });
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    addDocInFolder(id) {
      let formData = new FormData();
      formData.append("content", JSON.stringify("<p>this is a document</p>"));
      formData.append("teamId", this.teamId);

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "post",
        url: "/api/v1/folder/document/create/" + this.teamId + "/" + id,
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res.data);
          this.openDoc(res.data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addTeamDoc() {
      let formData = new FormData();
      formData.append("content", JSON.stringify("<p>this is a document</p>"));
      formData.append("teamId", this.teamId);

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "post",
        url: "/api/v1/team/document/create/" + this.teamId,
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res.data);
          this.openDoc(res.data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addTeamFolder() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      let formData = new FormData();
      formData.append("teamId", this.teamId);
      this.$axios({
        method: "post",
        url: "/api/v1/folder/create/" + this.teamId,
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async endEdit() {
      await this.$confirm("是否退出编辑？请确保您已保存文档！", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var header = {};
        if (localStorage.getItem("token"))
          header = {
            Authorization: "Bearer " + localStorage.getItem("token"),
          };
        this.$axios({
          method: "delete",
          url: "/api/v1/lock/" + this.teamId + "/" + this.documentId,
          headers: header,
        })
          .then((res) => {
            console.log(res.data);

            this.$router.replace("/project/" + this.projectId);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
        this.$message({
          type: "info",
          message: "已退出编辑",
        });
      });
    },
    changeTitle() {
      this.$prompt("更改文档名字", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          let formData = new FormData();
          formData.append("title", value);
          formData.append("documentId", this.documentId);
          var header = {};
          if (localStorage.getItem("token"))
            header = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            };

          this.$axios({
            method: "put",
            url: "/api/v1/document/" + this.teamId + "/" + this.documentId,
            data: formData,
            headers: header,
          })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
            });
          this.$message({
            type: "success",
            message: "更改成功",
          });
          window.location.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    openDocInTeam(id) {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      this.$axios({
        method: "post",
        url: "/api/v1/lock/" + this.teamId + "/" + id,
        headers: header,
      })
        .then((res) => {
          console.log(res);
          this.$router.replace("/team/" + this.teamId + "&doc&" + id);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    openDoc(id) {
      if (this.isOpenADoc) {
        this.$message({
          message: "请先退出编辑！",
          type: "warning",
        });
        return;
      }
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      this.$axios({
        method: "post",
        url: "/api/v1/lock/" + this.teamId + "/" + id,
        headers: header,
      })
        .then((res) => {
          console.log(res);
          this.$router.replace("/project/" + this.projectId + "&doc&" + id);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response.data.code);
          if (err.response.data.code == 4001) {
            this.$message({
              message: "您的同伴正在修改此文档，请耐心等待其修改完毕！",
              type: "warning",
            });
          }
        });
    },
    add(str) {
      let formData = new FormData();
      formData.append("content", JSON.stringify(str));
      formData.append("projectId", this.projectId);

      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      this.$axios({
        method: "post",
        url: "/api/v1/document/create/" + this.projectId,
        data: formData,
        headers: header,
      })
        .then((res) => {
          console.log(res.data);
          this.openDoc(res.data.id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    saveDoc() {
      this.$refs.editor.saveDoc();
    },
    remove(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var header = {};
          if (localStorage.getItem("token"))
            header = {
              Authorization: "Bearer " + localStorage.getItem("token"),
            };

          this.$axios({
            method: "delete",
            url: "/api/v1/document/" + this.teamId + "/" + id,
            headers: header,
          })
            .then((res) => {
              console.log(res.data);
              this.$message({
                type: "success",
                message: "删除成功!",
              });

              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async getDocDetail() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      await this.$axios({
        method: "get",
        url: "/api/v1/project/" + this.projectId,
        headers: header,
      })
        .then((res) => {
          this.teamId = res.data.belongTo;
        })
        .catch((err) => {
          console.log(err);
        });
      this.$axios({
        method: "get",
        url: "/api/v1/document/" + this.teamId + "/" + this.documentId,
        headers: header,
      })
        .then((res) => {
          console.log(res.data);
          var r = res.data;
          this.documentContent = r.content;
          this.belongTo = r.belongTo;
          this.createdAt = r.createdAt;
          this.updatedAt = r.updatedAt;
          this.createdBy = r.createdBy;
          this.title = r.title;
          this.status = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getProjDoc() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
        method: "get",
        url: "/api/v1/project/" + this.projectId,
        headers: header,
      })
        .then((res) => {
          this.teamId = res.data.belongTo;
        })
        .catch((err) => {
          console.log(err);
        });
      this.$axios({
        method: "get",
        url: "/api/v1/document/list?belongTo=" + this.projectId,
        headers: header,
      })
        .then((res) => {
          console.log(res.data.results);
          this.documentList = res.data.results;
          if (this.documentList.length > 0) {
            this.haveDocument = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getTeamDoc() {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };

      await this.$axios({
        method: "get",
        url: "/api/v1/folder/list?belongTo=" + this.teamId,
        headers: header,
      })
        .then((res) => {
          console.log(res.data.results);
          if (res.data.results.length == 0) return;
          this.folderList = res.data.results;
          for (let i = 0; i < this.folderList.length; i++) {
            this.getDocInFolder(this.folderList[i].id, i);
            this.getFolderInFolder(this.folderList[i].id, i);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      await this.$axios({
        method: "get",
        url: "/api/v1/document/list?belongTeam=" + this.teamId,
        headers: header,
      })
        .then((res) => {
          console.log(res.data.results);
          if (res.data.results.length == 0) return;
          this.teamDocList = res.data.results;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getDocInFolder(id, i) {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      await this.$axios({
        method: "get",
        url: "/api/v1/document/list?belongFolder=" + id,
        headers: header,
      })
        .then((res) => {
          this.folderList[i].docchildren = [];
          this.folderList[i].docchildren = res.data.results;
          console.log(this.folderList[i]);
        })
        .catch((err) => {
          console.log(err);
        });
      if (i == this.folderList.length - 1) this.status1 = true;
    },
    async getDocInFolderInFolder(id, i, j) {
      this.status1 = false;
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      await this.$axios({
        method: "get",
        url: "/api/v1/document/list?belongFolder=" + id,
        headers: header,
      })
        .then((res) => {
          this.folderList[i].folchildren[j].docchildren = [];
          this.folderList[i].folchildren[j].docchildren = res.data.results;
          console.log(this.folderList[i]);
        })
        .catch((err) => {
          console.log(err);
        });
      if (j == this.folderList[i].folchildren.length - 1) this.status1 = true;
    },
    async getFolderInFolder(id, i) {
      var header = {};
      if (localStorage.getItem("token"))
        header = { Authorization: "Bearer " + localStorage.getItem("token") };
      await this.$axios({
        method: "get",
        url: "/api/v1/folder/list?belongFolder=" + id,
        headers: header,
      })
        .then((res) => {
          if (res.data.results.length == 0) return;
          this.folderList[i].folchildren = [];
          this.folderList[i].folchildren = res.data.results;
          for (let j = 0; j < this.folderList[i].folchildren.length; j++) {
            this.getDocInFolderInFolder(
              this.folderList[i].folchildren[j].id,
              i,
              j
            );
            // this.getFolderInFolder(this.folderList[i].folchildren[j].id, i);
          }
          console.log(this.folderList[i]);
        })
        .catch((err) => {
          console.log(err);
        });
      // if (i == this.folderList.length - 1) this.status1 = true;
    },
  },
};
</script>

<style scoped>
.third {
  padding-left: 18px;
  margin: 3px 0;
  cursor: pointer;
}
.second {
  padding-left: 12px;
  margin: 3px 0;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}
.first {
  margin: 3px 0;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}
.el-dropdown {
  cursor: pointer;
}
.doc-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}
.el-icon-edit:hover,
.el-icon-upload:hover,
.el-icon-check:hover {
  color: gray;
  cursor: pointer;
}
.el-icon-edit,
.el-icon-upload,
.el-icon-check {
  margin: 0 10px 0 0;
  color: lightgray;
}
.el-icon-delete:hover {
  color: crimson;
}
.el-icon-delete {
  display: inline-block;
  vertical-align: top;
  font-size: 18px;
  color: lightgray;
  /* outline: 1px black solid; */
}
.add-icon:hover,
.content li:hover {
  cursor: pointer;
}
.add-icon,
.el-icon-folder-add,
.el-icon-document-add {
  display: inline-block;
  color: darkgray;
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
}
.list-box {
  display: inline-block;
  width: 154px;
}
.content li {
  margin: 5px 0;
  font-size: 16px;
}
.content-title {
  margin: 10px 0;
}
.content {
  padding: 10px 5px;
  border-right: 2px lightgray solid;
  height: 100vh;
}
</style>