<template>
    <el-row>
        <el-col :span="2"><div class="Left">
            <Navi></Navi>
        </div></el-col>
        <el-col :span="22"><div class="Right">
            <el-row>
                <el-col :span="3"><div class="Title">
                    <span>回收站</span>
                </div></el-col>
                <el-col :span="12"><div class="deleteAll">
                    <el-tooltip class="item" effect="dark" content="清空回收站" placement="bottom-start">
                    <el-button class="deleteAllButton" type="danger" round icon="el-icon-delete" @click="dialogVisible = true"></el-button>
                    </el-tooltip>
                    <el-dialog
                        title="清空回收站"
                        :visible.sync="dialogVisible"
                        width="30%">
                        <span class="line1">确定清空回收站？</span>
                        <span class="line2">注意：确定此操作后所有项目、文档、设计原型等将无法恢复</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="deleteAll">确定</el-button>
                        </span>
                    </el-dialog>
                    <el-button class="returnButton" type="info" icon="el-icon-back" round plain @click="toTeam">返回团队</el-button>
                </div></el-col>
            </el-row>
            <el-row v-if="isEmpty">
                <el-col :span="24"><div class="noRecycle">
                    <img src="@/assets/Recycle5.png" class="noRecycleImg">
                    <p>此时回收站为空，您删除的东西都会出现在这里哟~</p>
                </div></el-col>
            </el-row>
            <el-row class="cardsRow" v-else>
                <el-col :span="7" v-for="item in recoveryList" :key="item.id">
                    <div class="recoveryCard">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover">
                    <img v-if="item.type == '项目'" src="@/assets/Recycle1.png" class="image">
                    <img v-if="item.type == '设计原型'" src="@/assets/Recycle2.png" class="image">
                    <img v-if="item.type == '文件夹'" src="@/assets/Recycle3.png" class="image">
                    <img v-if="item.type == '文档'" src="@/assets/Recycle4.png" class="image">
                    <div style="padding: 14px;">
                        <span>{{ item.title }}</span>
                        <div class="bottom clearfix">
                        <time class="type">{{ item.type }}</time>
                        <el-button type="danger" plain class="button1" @click="Delete(item.id)">永久删除</el-button>
                        <el-button type="success" plain class="button2" @click="Recover(item.id)">还原</el-button>
                        </div>
                    </div>
                    </el-card>
                    </div>
                </el-col>
            </el-row>
        </div></el-col>
    </el-row>
</template>

<script>
import Navi from '@/components/NavigationBar.vue'

export default {
    name: 'Recycle',
    components: {
        Navi,
    },
    mounted() {
        this.getRecoveryList();
    },
    data() {
        return {
            dialogVisible: false,
            recoveryList: [],
            isEmpty: false,
        }
    },
    methods: {
        getRecoveryList() {
            var header = {};
            if (localStorage.getItem("token"))
                header = { Authorization: "Bearer " + localStorage.getItem("token") };

            this.$axios({
            method: "get",
            url: "/api/v1/recovery/list/" + this.$route.params.id,
            headers: header,
            })
            .then((res) =>{
                console.log(res);
                this.recoveryList = res.data.results;
                if(this.recoveryList.length == 0) {
                    this.isEmpty = true;
                }

                for(let i = 0; i < this.recoveryList.length; i++) {
                    if(this.recoveryList[i].type == 0) {
                        this.recoveryList[i].type = "项目";
                    }

                    if(this.recoveryList[i].type == 1) {
                        this.recoveryList[i].type = "文档";
                    }

                    if(this.recoveryList[i].type == 2) {
                        this.recoveryList[i].type = "设计原型";
                    }

                    if(this.recoveryList[i].type == 3) {
                        this.recoveryList[i].type = "文件夹";
                    }
                }
            })
            .catch((err) =>{
                console.log(err);
            })
        },
        Recover(recoveryId) {
            var header = {};
            if (localStorage.getItem("token"))
                header = { Authorization: "Bearer " + localStorage.getItem("token") };

            this.$axios({
            method: "put",
            url: "/api/v1/recovery/" + recoveryId,
            headers: header,
            })
            .then((res) =>{
                console.log(res);
                this.$message.success("恢复成功！");
                setTimeout(function () {
                    location.reload(true);
                }, 500);
            })
            .catch((err) =>{
                console.log(err);
            })
        },
        Delete(deleteId) {
            var header = {};
            if (localStorage.getItem("token"))
                header = { Authorization: "Bearer " + localStorage.getItem("token") };

            this.$axios({
            method: "delete",
            url: "/api/v1/recovery/" + deleteId,
            headers: header,
            })
            .then((res) =>{
                console.log(res);
                this.$message.success("删除成功！");
                setTimeout(function () {
                    location.reload(true);
                }, 500);
            })
            .catch((err) =>{
                console.log(err);
            })
        },
        deleteAll() {
            var header = {};
            if (localStorage.getItem("token"))
                header = { Authorization: "Bearer " + localStorage.getItem("token") };

            this.$axios({
            method: "delete",
            url: "/api/v1/recovery/clear/" + this.$route.params.id,
            headers: header,
            })
            .then((res) =>{
                console.log(res);
                this.$message.success("清空成功！");
                this.dialogVisible = false;
                setTimeout(function () {
                    location.reload(true);
                }, 500);
            })
            .catch((err) =>{
                console.log(err);
                this.$message.info("回收站已清空");
                this.dialogVisible = false;
            })
        },
        toTeam() {
            this.$router.push("/team/" + this.$route.params.id);
        }
    }
}
</script>

<style scoped>
.cardsRow{
    /* border: 1px solid black; */
    max-height: 670px;
    overflow: hidden;
    overflow-y: scroll;
}
.Title{
    /* border: 1px solid black; */
    margin: 10px 0 0 10px;
    font-size: 48px;
}
.line1{
    display: block;
    font-size: 20px;
}
.line2{
    color: red;
}
.deleteAllButton{
    margin-top: 25px;
}
.Project{
    /* border: 1px solid black; */
    margin: 10px 20px 0 20px;
    background: rgb(255, 216, 242);
    text-align: center;
    padding: 10px;
    border-radius: 20px;
}
.Project span{
    display: block;
    margin-bottom: 10px;
}
.recoveryListTitle{
    font-size: 22px;
}
.recoveryCard{
    margin: 10px 20px 10px 20px;
    /* border: 1px solid black; */
}
.returnButton{
    margin-left: 10px;
}

.type {
    font-size: 13px;
    color: #999;
}
.bottom {
    margin-top: 13px;
    line-height: 12px;
}
.button1 {
    padding: 3px;
    margin-right: 10px;
    float: right;
    /* color: red; */
}
.button2 {
    padding: 3px;
    margin-right: 10px;
    float: right;
    /* color: green; */
}
.image {
    width: 100%;
    /* height: 200px; */
    display: block;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix:after {
    clear: both;
}
.el-card:hover{
    transform: scale(1.05);
}
.noRecycle{
    /* border: 1px solid black; */
    text-align: center;
    margin-top: 140px;
}
.noRecycleImg{
    height: 20%;
    width: 20%;
    opacity: 0.8;
}
.noRecycle p{
    margin-top: 10px;
    color: rgba(128, 128, 128, 0.67);
}
</style>