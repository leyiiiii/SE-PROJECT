"use strict";(self["webpackChunkse_project"]=self["webpackChunkse_project"]||[]).push([[902],{9346:function(t,e,a){a.r(e),a.d(e,{default:function(){return Z}});var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"design"},[e("main",[e("el-col",{attrs:{span:2}},[e("NavigationBar")],1),e("Toolbar"),e("section",{staticClass:"left"},[e("ComponentList"),e("RealTimeComponentList")],1),e("section",{staticClass:"center"},[e("div",{staticClass:"content",on:{drop:t.handleDrop,dragover:t.handleDragOver,mousedown:t.handleMouseDown,mouseup:t.deselectCurComponent}},[e("Editor")],1)]),e("section",{staticClass:"right"},[t.curComponent?e("el-tabs",{model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[e("el-tab-pane",{attrs:{label:"属性",name:"attr"}},[e(t.curComponent.component+"Attr",{tag:"component"})],1),e("el-tab-pane",{staticStyle:{"padding-top":"20px"},attrs:{label:"动画",name:"animation"}},[e("AnimationList")],1),e("el-tab-pane",{staticStyle:{"padding-top":"20px"},attrs:{label:"事件",name:"events"}},[e("EventList")],1)],1):e("CanvasAttr")],1)],1)])},o=[],s=a(694),i=a(5205),r=a(5912),l=a(9054),c=a(6845),m=a(6437),p=a(2648),d=a(3822),u=a(1840),C=a(9657),v=a(9921),h=a(9571),g=a(7742),f={components:{NavigationBar:g.Z,Editor:s.Z,ComponentList:i.Z,AnimationList:r.Z,EventList:l.Z,Toolbar:m.Z,RealTimeComponentList:v.Z,CanvasAttr:h.Z},data(){return{activeName:"attr",reSelectAnimateIndex:void 0}},computed:(0,d.rn)(["componentData","curComponent","isClickComponent","canvasStyleData","editor"]),created(){this.restore(),(0,C.Y)()},methods:{restore(){localStorage.getItem("canvasData")&&this.$store.commit("setComponentData",JSON.parse(localStorage.getItem("canvasData"))),localStorage.getItem("canvasStyle")&&this.$store.commit("setCanvasStyle",JSON.parse(localStorage.getItem("canvasStyle")))},handleDrop(t){t.preventDefault(),t.stopPropagation();const e=t.dataTransfer.getData("index"),a=this.editor.getBoundingClientRect();if(e){const n=(0,p.p$)(c.ZP[e]);n.style.top=t.clientY-a.y,n.style.left=t.clientX-a.x,n.id=(0,u.Z)(),this.$store.commit("addComponent",{component:n}),this.$store.commit("recordSnapshot")}},handleDragOver(t){t.preventDefault(),t.dataTransfer.dropEffect="copy"},handleMouseDown(t){t.stopPropagation(),this.$store.commit("setClickComponentStatus",!1),this.$store.commit("setInEditorStatus",!0)},deselectCurComponent(t){this.isClickComponent||this.$store.commit("setCurComponent",{component:null,index:null}),2!=t.button&&this.$store.commit("hideContextMenu")}}},S=f,D=a(3736),b=(0,D.Z)(S,n,o,!1,null,null,null),Z=b.exports}}]);
//# sourceMappingURL=902.68abc6b3.js.map