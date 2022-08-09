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
                    <el-button class="deleteAllButton" type="danger" round icon="el-icon-delete" @click="dialogVisible = true">清空回收站</el-button>
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
                    <el-button class="returnButton" type="info" icon="el-icon-back" plain @click="toTeam">返回团队</el-button>
                </div></el-col>
            </el-row>

            <!-- <el-row>
                <el-col :span="7" v-for="item in recoveryList" :key="item.id"><div class="Project">
                    <span class="recoveryListTitle">{{ item.type }}</span>
                    <span>{{ item.title }}</span>
                    <el-button type="success" round @click="Recover(item.id)">恢复</el-button>
                    <el-button type="danger" round @click="Delete(item.id)">删除</el-button>
                </div></el-col>
            </el-row> -->

            <el-row class="cardsRow">
                <el-col :span="7" v-for="item in recoveryList" :key="item.id">
                    <div class="recoveryCard">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover">
                    <img src="@/assets/Project.jpg" class="image">
                    <div style="padding: 14px;">
                        <span>{{ item.title }}</span>
                        <div class="bottom clearfix">
                        <time class="type">{{ item.type }}</time>
                        <el-button type="text" class="button1" @click="Delete(item.id)">删除</el-button>
                        <el-button type="text" class="button2" @click="Recover(item.id)">恢复</el-button>
                        </div>
                    </div>
                    </el-card>
                    </div>
                </el-col>
                
                <!-- <el-col :span="7">
                    <div class="recoveryCard">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover">
                    <img src="@/assets/Project.jpg" class="image">
                    <div style="padding: 14px;">
                        <span>标题</span>
                        <div class="bottom clearfix">
                        <time class="type">种类</time>
                        <el-button type="text" class="button1">删除</el-button>
                        <el-button type="text" class="button2">恢复</el-button>
                        </div>
                    </div>
                    </el-card>
                    </div>
                </el-col> -->
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
    padding: 0;
    margin-right: 10px;
    float: right;
    color: red;
}
.button2 {
    padding: 0;
    margin-right: 10px;
    float: right;
    color: green;
}
.image {
    width: 100%;
    height: 150px;
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
</style>