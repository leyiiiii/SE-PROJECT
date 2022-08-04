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
                <el-col :span="2"><div class="Title2">
                    <span>项目简介:</span>
                </div></el-col>
                <el-col :span="20" v-if="hasChinese()"><div class="Desc">
                    <span>{{ form.desc }}</span>
                </div></el-col>
                <el-col :span="20" v-else><div class="Desc2">
                    <span>{{ form.desc }}</span>
                </div></el-col>
            </el-row>
            <el-row>
                <el-col :span="12"><div class="Title3">
                    <i class="el-icon-data-line"></i>
                    <span>项目操作</span>
                </div></el-col>
            </el-row>
            <el-row>
                <el-col :span="22"><div class="function">
                <el-button type="primary" plain>设计原型</el-button>
                <el-button type="success" plain>文档</el-button>
                <el-button type="warning" plain @click="toDraw">绘制图</el-button>
                </div></el-col>
            </el-row>
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
    name: 'Project',
    components: {
        Navi,
    },
    data() {
        return {
            dialogVisible: false,
            form: {
                name:'',
                desc:'',
                nameTemp:'',
                descTemp:'',
            }
        }
    },
    mounted() {
        this.getProjectInfo();
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
            url:"/api/v1/project/" + this.$route.params.id,
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
    font-size: 40px;
    margin: 10px;
}
.Buttons{
    margin-top: 20px;
}
.Buttons button{
    margin-right: 10px;
}
.Title2{
    font-size: 24px;
    margin-left: 10px;
    margin-top: 5px;
    /* border: 1px solid black; */
}
.Title3{
    margin: 50px 0 0 10px;
    font-size: 28px;
}
.Desc{
    font-size: 24px;
    margin-top: 5px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    /* border: 1px solid black; */
}
.Desc2{
    font-size: 24px;
    margin-top: 10px;
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    white-space: normal;
    /* border: 1px solid black; */
}
.function{
    /* border: 1px solid black; */
    margin-left: 20px;
    margin-top: 10px;
}
.function button{
    width: 220px;
    height: 100px;
}
.el-icon-data-line{
    font-size: 26px;
}
</style> 