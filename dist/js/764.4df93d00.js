"use strict";(self["webpackChunkse_project"]=self["webpackChunkse_project"]||[]).push([[764],{7764:function(s,e,t){t.r(e),t.d(e,{default:function(){return p}});var a=function(){var s=this,e=s._self._c;return e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-col",{attrs:{span:12}},[e("div",{staticClass:"Right"},[e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-col",{attrs:{span:24}},[e("div",{staticClass:"Title"},[s._v(" 墨书注册 ")])])],1),e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-col",{attrs:{span:18}},[e("div",{staticClass:"insertBox"},[e("el-col",{attrs:{span:5}},[e("div",{staticClass:"insertTitle"},[e("span",[s._v("昵称")])])]),e("el-col",{attrs:{span:14}},[e("el-input",{attrs:{placeholder:"请输入昵称"},model:{value:s.username,callback:function(e){s.username=e},expression:"username"}})],1)],1)])],1),e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-col",{attrs:{span:18}},[e("div",{staticClass:"insertBox"},[e("el-col",{attrs:{span:5}},[e("div",{staticClass:"insertTitle"},[e("span",[s._v("真实姓名")])])]),e("el-col",{attrs:{span:14}},[e("el-input",{attrs:{placeholder:"请输入真实姓名"},model:{value:s.realname,callback:function(e){s.realname=e},expression:"realname"}})],1)],1)])],1),e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-col",{attrs:{span:18}},[e("div",{staticClass:"insertBox"},[e("el-col",{attrs:{span:5}},[e("div",{staticClass:"insertTitle"},[e("span",[s._v("邮箱")])])]),e("el-col",{attrs:{span:14}},[e("el-input",{attrs:{placeholder:"请输入邮箱"},model:{value:s.email,callback:function(e){s.email=e},expression:"email"}})],1)],1)])],1),e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-col",{attrs:{span:18}},[e("div",{staticClass:"insertBox"},[e("el-col",{attrs:{span:5}},[e("div",{staticClass:"insertTitle"},[e("span",[s._v("密码")])])]),e("el-col",{attrs:{span:14}},[e("el-input",{attrs:{placeholder:"请输入密码","show-password":""},model:{value:s.password1,callback:function(e){s.password1=e},expression:"password1"}})],1)],1)])],1),e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-col",{attrs:{span:18}},[e("div",{staticClass:"insertBox"},[e("el-col",{attrs:{span:5}},[e("div",{staticClass:"insertTitle"},[e("span",[s._v("重复密码")])])]),e("el-col",{attrs:{span:14}},[e("el-input",{attrs:{placeholder:"请重新输入密码","show-password":""},model:{value:s.password2,callback:function(e){s.password2=e},expression:"password2"}})],1)],1)])],1),e("el-row",[e("el-col",{attrs:{span:4,offset:14}},[e("div",{staticClass:"backToLogin"},[e("el-button",{staticClass:"toLogin",attrs:{type:"text"},on:{click:s.gotoLogin}},[s._v("返回登录")])],1)])],1),e("el-row",{attrs:{justify:"center",type:"flex"}},[e("el-button",{staticClass:"Register",attrs:{type:"primary"},on:{click:s.Register}},[s._v("注册")])],1)],1)])],1)},l=[],r=t(7742),i={name:"Register",components:{Navi:r.Z},data(){return{username:"",realname:"",email:"",password1:"",password2:""}},methods:{gotoLogin(){this.$router.push("/login")},Register(){if(""==this.username||""==this.realname||""==this.email||""==this.password1||""==this.password2)return void this.$message.warning("请填写所有空格!");const s=new FormData;s.append("username",this.username),s.append("realname",this.realname),s.append("email",this.email),s.append("password",this.password1),s.append("password2",this.password2),this.$axios({method:"post",url:"/api/v1/auth/register/",data:s}).then((s=>{switch(console.log(s),s.status){case 201:this.$message.success("注册成功"),this.$router.push("/login");break}})).catch((s=>{switch(console.log(s.response.data.code),s.response.data.code){case 1001:this.$message.warning("邮箱已被使用");break;case 1002:this.$message.warning("用户名已被使用");break;case 1003:this.$message.warning("密码与重复密码不匹配");break;case 1004:this.$message.warning("密码需包含字母、数字及符号且字符数>=8");break;default:this.$message.warning("填写信息错误")}}))}}},n=i,o=t(3736),c=(0,o.Z)(n,a,l,!1,null,"23a7a82e",null),p=c.exports}}]);
//# sourceMappingURL=764.4df93d00.js.map