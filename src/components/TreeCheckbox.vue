<template>
    <div class="tree-checkbox" v-show="init">
        <div class="app-flex">
            <base-search ref="search" v-model="filterText" @input="searchInput"></base-search>
            <div class="app-content">
                <!-- 树 -->
                <ul v-show="!filterText" :id="id" class="ztree"></ul>
                <!-- 搜索列表 -->
                <div v-if="filterText" class="img-text-list">
                    <div class="list plist" v-for="x in searchTreeNodes" :key="x.id">
                        <label @click="checkSearch(x)">{{x.name}}
                            <div class="float-right">
                                <span class="checkbox-core" :class="(x.checked && (x.check_Child_State==2 || x.check_Child_State==-1)) ? 'checkbox-core1' : ''"></span>
                            </div>
                            <div class="parent">{{x.title}}</div>
                        </label>                   
                    </div>
                </div>
            </div>
            
            <div class="fixed-bottom-btn" v-if="!filterText">
                <div class="btn no-btn" @click="close">取 消</div>
                <div class="btn fill-btn" @click="enter">确 定</div>               
            </div>
        </div>
        <div class="float-ball" @click="popupVisible=true" v-drag><i class="iconfont icon-renyuanxinxi"></i></div>
        <mt-popup v-model="popupVisible" position="right">
            <div class="title">已选择的部门或成员</div>
            <div class="list" @click="del(x)" v-for="x in tempNodes" :key="x.id">{{x.name}}
                <i class="iconfont icon-shanchu float-right"></i>
                <div class="parent">{{x.title}}</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import $ from 'jquery'
import { Toast } from "mint-ui";
import BaseSearch from "./BaseSearch"

import '../../static/ztree/zTreeStyle.css'
import '../../static/ztree/jquery.ztree.core.js'
import '../../static/ztree/jquery.ztree.excheck.js'
import '../../static/ztree/jquery.ztree.exhide.js'
var zTreeObj, nameKey;

export default {
    name: 'tree-checkbox',
    props:{
        treeNodes:{ //所有的
            type:Array,
            default:[]
        },
        checkNodes:{ //选中的
            type:Array,
            default:[]
        },
        id:{
            type:String
        }
    },
    data() {
		return {
            init:false,
            nodes:[], //所有数据
            filterText:'', //搜索关键字
            searchTreeNodes:[], //搜索列表
            tempNodes:[], //已选中的成员
            popupVisible:false,
            setting:{
                check: {
                    enable: true,
                    chkboxType: { "Y": "ps", "N": "ps" }
                },
                view: {
                    nameIsHTML: true, //允许name支持html				
                    selectedMulti: false,
                    showLine: false,
                    showIcon:false
                },
                edit: {
                    enable: false,
                    editNameSelectAll: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: this.onClick,
                    onCheck: this.onCheck
                }
            }
        }
    },
    methods:{
        searchInput(val){
            this.filterText = val;
            this.searchTreeNodes = [];
            if(val) {
                this.searchTreeNodes = zTreeObj.getNodesByFilter(this.filterFunc);
                this.searchTreeNodes.forEach((obj,i) => {
                    let arr = obj.getPath();
                    this.searchTreeNodes[i].title = '';
                    arr.forEach((item,j) => {
                        if(j<arr.length-1) this.searchTreeNodes[i].title = this.searchTreeNodes[i].title + '/' + item.name;
                    })               
                    this.searchTreeNodes[i].title = this.searchTreeNodes[i].title.substring(1);
                });
                this.searchTreeNodes = this.uniq(this.searchTreeNodes);
            }
        },
        filterFunc(node) {
            if (node[nameKey] && node[nameKey].toLowerCase().indexOf(this.filterText.toLowerCase())!=-1) {
				return true; 
			}
        },
        uniq(array){
            var temp = [];
            var l = array.length;
            for(var i = 0; i < l; i++) {
                for(var j = i + 1; j < l; j++){
                    if (array[i].id === array[j].id){
                        array[j].title = array[j].title + ', ' + array[i].title
                        i++;
                        j = i;
                    }
                }
                temp.push(array[i]);
            }
            return temp;
        },
        checkSearch(node){ //选中搜索列表中的项
            this.$refs.search.del();
            zTreeObj.checkNode(node, !(node.checked && (node.check_Child_State==2 || node.check_Child_State==-1)), true); 
            this.onCheck('', this.id, node);            
        },
        del(node){ //删除选中
            zTreeObj.checkNode(node, false, true); 
            this.onCheck('', this.id, node);
        },
        enter(){ //确定
            if(this.tempNodes.length==0) return Toast("请选择");
            let obj= {
                nameArr:[],
                idArr:[],
                typeIdArr:[]
            }
            this.tempNodes.forEach((item) => {
                obj.nameArr.push(item.name);
                obj.idArr.push(item.id);
                obj.typeIdArr.push(item.typeId);
            })
            this.$emit("list", {obj:obj, arr:this.tempNodes});
            this.init = false;
            zTreeObj.destroy();
        },
        close(){
            this.init = false;
            zTreeObj.destroy();
        },
        open(){ //打开该组件
            this.init = true;
            this.filterText = '';
            this.nodes = this.treeNodes;            
            this.tempNodes = this.checkNodes;     
            $.fn.zTree.init($("#"+this.id), this.setting, this.nodes);     
            zTreeObj = $.fn.zTree.getZTreeObj(this.id);
            nameKey = zTreeObj.setting.data.key.name;   
            this.tempNodes.forEach(node => {
                zTreeObj.checkNode(node, true, true); 
                this.onCheck('', this.id, node);  
            })                               
        },
        onClick(e,treeId, treeNode) {
            zTreeObj.expandNode(treeNode);
        },
        onCheck(e, treeId, treeNode){           
            //相同id处理
            var shownodes = zTreeObj.getNodesByParam("id", treeNode.id, null);
            shownodes.forEach(item => {
                var pathOfOne = item.getPath();
                if(pathOfOne && pathOfOne.length>0){ 
                    for(var i=0;i<pathOfOne.length-1;i++){
                        zTreeObj.expandNode(pathOfOne[i],true); 
                    }
                }
            })
            if(treeNode.checked) {
                shownodes.forEach(item => {
                    zTreeObj.checkNode(item, true, true); 
                })                      
            } else {
                shownodes.forEach(item => {
                    zTreeObj.checkNode(item, false, true); 
                })       
            }
                      
            // 获取选中的节点
            var tempNodes = zTreeObj.getCheckedNodes(true);
            var tempNodes2 = [];
            this.tempNodes = [];
            // 过滤掉半选状态的节点
            tempNodes.forEach(item => {
                var status = item.getCheckStatus(); //获取节点的选中状态,用于过滤半选
                if (status.checked && !status.half) {//过滤掉半选的节点
                    tempNodes2.push(item);
                }
            })
            tempNodes2.forEach(item => {
                // 判断当前节点是否有父节点
                if (item.getParentNode()) { // 有父节点
                    var parentStatus = item.getParentNode().getCheckStatus();//判断父节点的选中状态
                    
                    if (parentStatus.half) {               
                        this.tempNodes.push(item);
                    }
                } else {  // 没有父节点,则是根节点,加入到数组中
                    this.tempNodes.push(item);
                }
            })

            this.tempNodes.forEach((obj,i) => {
                let arr = obj.getPath();
                this.tempNodes[i].title = '';
                arr.forEach((item,j) => {
                  if(j<arr.length-1) this.tempNodes[i].title = this.tempNodes[i].title + '/' + item.name;
                })               
                this.tempNodes[i].title = this.tempNodes[i].title.substring(1);
            });
            this.tempNodes = this.uniq(this.tempNodes);
        }
    },
    components:{
        BaseSearch
    }
}


</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.tree-checkbox{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left:0;
    background:#fff;
    z-index: 20;
    label{
        display:block;
        overflow: hidden;
        font-size:px2rem(28);
        .parent{
            font-size:px2rem(24);
            color:#999;
        }
    }
    .mint-checkbox-core{
      border-radius: 0;
    }
    .mint-popup-right{
        width:70%;
        right:0;
        top:0;
        bottom:0;
        transform: none;
        overflow: auto;
        .title{
            padding:px2rem(20);
            border-bottom:1px solid #ddd;
            font-size:px2rem(28);
            color:#333;
        }
        .list{
            padding:px2rem(20);
            font-size:px2rem(28);
            color:#333;
            line-height:1.5;
            .iconfont{
                color:#f00;
            }
            .parent{
                font-size:px2rem(24);
                color:#999;
            }
        }
    }
    .ztree{padding:0 px2rem(20) px2rem(20);}
    .checkbox-core{margin-top:px2rem(6);}
    .ztree li span.button.chk,.checkbox-core{float:right; width:px2rem(30); height:px2rem(30); border-radius: 0; border:1px solid #ccc; position:relative;background-image:none;}
    .ztree li span.button.chk.checkbox_true_full, .ztree li span.button.chk.checkbox_true_full_focus,.checkbox-core1{background-color: #26a2ff; background-image:none;border-color: #26a2ff;}
    .ztree li span.button.chk.checkbox_true_full:after, .ztree li span.button.chk.checkbox_true_full_focus:after, .checkbox-core1:after{
        border: 2px solid transparent;
        border-left: 0;
        border-top: 0;
        content: " ";
        top: px2rem(1);
        left: px2rem(7);
        position: absolute;
        width:px2rem(8);
        height:px2rem(16);        
        transition: transform .2s, -webkit-transform .2s;
        -webkit-transform: rotate(45deg) scale(1);
        border-color: #fff;
        -webkit-transform: rotate(45deg) scale(1);
        transform: rotate(45deg) scale(1);
    }
    .ztree li{padding:px2rem(20) 0; border-bottom:1px solid #f4f4f4; position:relative;} 
    .ztree li:last-child{border-bottom:0; padding-bottom:0;}
    .ztree li ul{margin:px2rem(20) 0 0 px2rem(30); border-top:1px solid #f4f4f4; padding-left:0;}
    .ztree li span.button.ico_open, .ztree li span.button.ico_close, .ztree li span.button.ico_docu{margin-top:5px;}
    .ztree li a{padding-left:px2rem(12);}
    .ztree li a:hover{text-decoration: none;}
    .ztree li a.curSelectedNode{background-color:rgba(0,0,0,0); border-color:rgba(0,0,0,0);}
    .ztree li span.button.switch{display:none;}
    .ztree li span.button.noline_open{display:inline-block; width:px2rem(20); height:px2rem(20); border-left:1px solid #999; border-top:1px solid #999; transform:rotate(225deg); background:#fff;}
    .ztree li span.button.noline_close{display:inline-block; width:px2rem(20); height:px2rem(20); border-left:1px solid #999; border-top:1px solid #999; transform:rotate(135deg); background:#fff;}
}
</style>
