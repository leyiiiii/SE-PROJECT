<template>
    <el-row>
        <el-col :span="2"><div class="Left">
            <Navi></Navi>
        </div></el-col>
        <el-col :span="22"><div class="Right">
            <el-row>
                <el-col :span="12"><div class="Title">
                    <span>{{ form.name }}</span>
                </div></el-col>
                <el-col :span="12"><div class="Buttons">
                    <el-button type="info" round icon="el-icon-edit" @click="dialogVisible = true">编辑项目</el-button>
                    <el-dialog title="编辑项目" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
                        <el-form :model="form" label-width="auto">
                            <el-form-item label="项目名字">
                                <el-input v-model="form.nameTemp"></el-input>
                            </el-form-item>
                            <el-form-item label="项目简介">
                                <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="form.descTemp" autocomplete="off" resize="none"></el-input>
                            </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelChanges">取消</el-button>
                        <el-button type="primary" @click="saveEdit">保存</el-button>
                    </span>
                 </el-dialog>
                 <el-popconfirm
                    confirm-button-text='确定'
                    cancel-button-text='不了，谢谢'
                    icon="el-icon-info"
                    icon-color="red"
                    title="您确定要删除此项目？"
                    @confirm="confirmDelete">
                    <el-button type="danger" round slot="reference">删除项目</el-button>
                 </el-popconfirm>
                </div></el-col>
            </el-row>
            <el-row>
                <el-col :span="3"><div class="Title2">
                    <span>项目简介:</span>
                </div></el-col>
                <el-col :span="20" v-if="hasChinese()"><div class="Desc">
                    <span>{{ form.desc }}</span>
                </div></el-col>
                <el-col :span="20" v-else><div class="Desc2">
                    <span>{{ form.desc }}</span>
                </div></el-col>
            </el-row>
            <el-row class="tab-row">
                <div class="tab" id="tab1" @click="toDoc">文档</div>
                <div class="tab" id="tab2" @click="toDesign">设计原型</div>
                <div class="tab" id="tab3" @click="toDraw">UML绘制图</div>
            </el-row>
            <Doc v-if="activeTab == 1"></Doc>
            <Design v-if="activeTab == 2"></Design>
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'
import Doc from '@/components/Document.vue'
import Design from '@/views/Design.vue'
import { timingSafeEqual } from 'crypto'

export default {
    name: 'Project',
    components: {
    Navi,
    Doc,
    Design,
},
    data() {
        return {
            dialogVisible: false,
            activeTab: 1,
            form: {
                name:'',
                desc:'',
                nameTemp:'',
                descTemp:'',
            }
        }
    },
    mounted() {
        var arr = this.$route.params.id.split("&");
        this.projectId = arr[0];
        this.getProjectInfo();
        if(arr.length > 1) {
            if(arr[1] == "doc"){
                this.activeTab = 1;
                this.toDoc();
            }
            else {
                this.activeTab = 2;
                this.toDesign();
            }
            this.isOpenADoc = true;
            this.documentId = arr[2];
        }
        else this.toDoc();
    },
    methods: {
        cancelChanges() {
            this.dialogVisible = false;
            this.form.nameTemp = this.form.name;
            this.form.descTemp = this.form.desc;
        },
        handleClose() {
            this.dialogVisible = false;
            this.form.nameTemp = this.form.name;
            this.form.descTemp = this.form.desc;
        },
        saveEdit() {
            this.dialogVisible = false;
            this.form.name = this.form.nameTemp;
            this.form.desc = this.form.descTemp;
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
        confirmDelete() {
        },
        toDoc() {            
            if(this.activeTab != 1) this.$router.replace("/project/" + this.projectId);
            this.activeTab = 1;
            document.getElementById("tab2").style.color = "black";
            document.getElementById("tab2").style.borderBottom = "none";
            document.getElementById("tab1").style.color = "darkolivegreen";
            document.getElementById("tab1").style.borderBottom = "2px solid darkolivegreen";
        },
        toDesign() {
            if(this.activeTab != 2) this.$router.replace("/project/" + this.projectId);
            this.activeTab = 2;
            document.getElementById("tab1").style.color = "black";
            document.getElementById("tab1").style.borderBottom = "none";
            document.getElementById("tab2").style.color = "darkolivegreen";
            document.getElementById("tab2").style.borderBottom = "2px solid darkolivegreen";
        },
        toDraw() {
            window.open(
            "https://app.diagrams.net/", "_blank");
        },
        getProjectInfo() {
        var header = {};
        if (localStorage.getItem("token"))
            header = { Authorization: "Bearer " + localStorage.getItem("token") };

        this.$axios({
            method:"get",
            url:"/api/v1/project/" + this.projectId,
            headers: header,
        })
          .then((res) => {
            console.log(res);
            console.log("YES")
            this.form.name = res.data.title;
            this.form.desc = res.data.description;
            this.form.nameTemp = this.form.name;
            this.form.descTemp = this.form.desc;
          })
          .catch((err) => {
            console.log(err);
          });
        }
    },
}
</script>

<style scoped>
.Title{
    font-size: 36px;
    margin: 10px 50px;
}
.Buttons{
    margin-top: 20px;
}
.Buttons button{
    margin-right: 10px;
}
.Title2{
    font-size: 20px;
    margin-left: 50px;
    margin-top: 5px;
    /* border: 1px solid black; */
}
.Title3{
    margin: 5px 0 0 0px;
    font-size: 20px;
}
.Desc{
    font-size: 20px;
    margin-top: 5px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    /* border: 1px solid black; */
}
.Desc2{
    font-size: 20px;
    margin-top: 8px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    /* border: 1px solid black; */
}
.function{
    /* border: 1px solid black; */
    /* margin-left: 20px; */
    margin-top: 10px;
    margin-left: 3px;
}
.function button{
    width: 220px;
    height: 100px;
}
.el-icon-data-line{
    font-size: 26px;
}
.tab:hover {
    color:darkolivegreen;
    cursor: pointer;
}
.tab {
    display: inline-block;
    width: 120px;
    height: 35px;
    /* outline: 2px black solid; */
    text-align: center;
}
.tab-row {
    padding: 5px 20px 0;
    margin: 10px 0;
    font-size: 20px;
    /* background-color: bisque; */
    margin-left: 3px;
    border-bottom: 2px lightgray solid;
}
</style> 