"use strict";(self["webpackChunkse_project"]=self["webpackChunkse_project"]||[]).push([[896],{896:function(e,t,n){n.r(t),n.d(t,{default:function(){return h}});var l=function(){var e=this,t=e._self._c;return t("div",{staticClass:"line-shape"})},i=[],s=n(7414),a={extends:s.Z},o=a,c=n(3736),r=(0,c.Z)(o,l,i,!1,null,"30dba720",null),h=r.exports},7414:function(e,t,n){n.d(t,{Z:function(){return h}});var l,i,s=n(4003),a={props:{linkage:{type:Object,default:()=>{}},element:{type:Object,default:()=>{}}},created(){this.linkage?.data?.length&&(s.Z.$on("v-click",this.onClick),s.Z.$on("v-hover",this.onHover))},mounted(){const{data:e,duration:t}=this.linkage||{};e?.length&&(this.$el.style.transition=`all ${t}s`)},beforeDestroy(){this.linkage?.data?.length&&(s.Z.$off("v-click",this.onClick),s.Z.$off("v-hover",this.onHover))},methods:{changeStyle(e=[]){e.forEach((e=>{e.style.forEach((e=>{e.key&&(this.element.style[e.key]=e.value)}))}))},onClick(e){const t=this.linkage.data.filter((t=>t.id===e&&"v-click"===t.event));this.changeStyle(t)},onHover(e){const t=this.linkage.data.filter((t=>t.id===e&&"v-hover"===t.event));this.changeStyle(t)}}},o=a,c=n(3736),r=(0,c.Z)(o,l,i,!1,null,null,null),h=r.exports}}]);
//# sourceMappingURL=896.e101a777.js.map