"use strict";(self["webpackChunkse_project"]=self["webpackChunkse_project"]||[]).push([[925],{5719:function(t,e,l){l.r(e),l.d(e,{default:function(){return m}});var r=function(){var t=this,e=t._self._c;return e("div",{staticClass:"attr-list v-talbe-attr"},[e("CommonAttr"),e("EditTable"),e("el-form",[e("el-form-item",{attrs:{label:"斑马纹"}},[e("el-switch",{model:{value:t.propValue.stripe,callback:function(e){t.$set(t.propValue,"stripe",e)},expression:"propValue.stripe"}})],1),e("el-form-item",{attrs:{label:"表头加粗"}},[e("el-switch",{model:{value:t.propValue.thBold,callback:function(e){t.$set(t.propValue,"thBold",e)},expression:"propValue.thBold"}})],1)],1)],1)},a=[],o=l(9339),s=function(){var t=this,e=t._self._c;return e("div",{staticClass:"edit-table"},[e("table",{on:{dblclick:t.onDblclick}},[e("tbody",t._l(t.tableData,(function(l,r){return e("tr",{key:r},t._l(l,(function(l,a){return e("td",{key:a,class:{selected:t.curTd===r+","+a},on:{click:function(e){return t.onClick(r,a)}}},[t.canEdit&&t.curTd===r+","+a?e("el-input",{directives:[{name:"focus",rawName:"v-focus"}],on:{blur:t.onBlur},model:{value:t.tableData[r][a],callback:function(e){t.$set(t.tableData[r],a,e)},expression:"tableData[row][col]"}}):e("span",[t._v(t._s(l))])],1)})),0)})),0)]),e("div",[e("button",{on:{click:t.addRow}},[t._v("添加新行")]),e("button",{on:{click:t.addCol}},[t._v("添加新列")]),e("button",{on:{click:t.deleteRow}},[t._v("删除行")]),e("button",{on:{click:t.deleteCol}},[t._v("删除列")])])])},i=[],n={directives:{focus:{inserted(t){t.querySelector("input").focus()}}},data(){return{curProperty:"",curTd:"",canEdit:!1,preCurTd:""}},computed:{tableData(){return this.$store.state.curComponent.propValue.data}},methods:{onDblclick(){this.canEdit=!0},onClick(t,e){this.curTd=t+","+e,this.preCurTd=this.curTd},onBlur(){this.canEdit=!1,this.curTd=""},deleteRow(){if(!this.preCurTd)return void this.$message.error("请先选择要删除的行");const t=this.preCurTd.split(",")[0];this.tableData.splice(t,1)},addRow(){this.tableData.push(new Array(this.tableData[0]?.length||1).fill(" "))},addCol(){this.tableData.length?this.tableData.forEach((t=>t.push(" "))):this.tableData.push([" "])},deleteCol(){if(!this.preCurTd)return void this.$message.error("请先选择要删除的列");const t=this.preCurTd.split(",")[1];this.tableData.forEach((e=>{e.splice(t,1)}))}}},c=n,u=l(3736),d=(0,u.Z)(c,s,i,!1,null,"eb983600",null),p=d.exports,h={components:{EditTable:p,CommonAttr:o.Z},computed:{propValue(){return this.$store.state.curComponent.propValue}}},b=h,f=(0,u.Z)(b,r,a,!1,null,null,null),m=f.exports}}]);
//# sourceMappingURL=925.f5eaeb05.js.map