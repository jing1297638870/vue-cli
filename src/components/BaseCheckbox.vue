<template>
    <div class="base-checkbox" v-if="init">
        <div class="app-flex">
            <base-search ref="search" v-model="filterText" @input="filterNode"></base-search>
            <ul class="app-content img-text-list">
                <li class="list plist" v-for="x in nodeList" :key="x.id">
                    <label style="color:#999" v-if="x.status&&x.status!=1">{{x.name}}
                        <div class="float-right">未关注</div>
                    </label>
                    <label v-if="x.status&&x.status==1&&x.isCc==='1'">{{x.name}}
                        <div class="float-right">
                            <input type="checkbox" name="checkbox" disabled="disabled" class="mint-checkbox-input" checked>
                            <span class="mint-checkbox-core"></span>
                        </div>
                    </label>
                    <label v-if="x.status&&x.status==1&&x.isCc==='0'">{{x.name}}
                        <div class="float-right">
                            <input type="checkbox" name="checkbox" class="mint-checkbox-input" :value="x" v-model="value">
                            <span class="mint-checkbox-core"></span>
                        </div>
                    </label>  
                    <label v-if="(x.status&&x.status==1 || !x.status) && !x.isCc">{{x.name}}
                        <div class="float-right">
                            <input type="checkbox" name="checkbox" class="mint-checkbox-input" :value="x" v-model="value">
                            <span class="mint-checkbox-core"></span>
                        </div>
                    </label>                   
                </li>
                <li v-if="nodeList.length==0" class="no-border align-center" style="color:#999; margin-top:30px;">暂无数据</li>
            </ul>
            <div class="fixed-bottom-btn" v-if="!filterText">
                <div class="btn fill-btn" @click="enter">确 定</div>
                <div class="btn chu-btn" @click="close">取 消</div>
            </div>
            <div class="fixed-bottom-btn" v-if="filterText">
                <div class="btn chu-btn" @click="filterText=''; $refs.search.del()">返 回</div>
            </div>
        </div>
        <div class="float-ball" @click="popupVisible=true" v-drag><i class="iconfont icon-renyuanxinxi"></i></div>
        <mt-popup v-model="popupVisible" position="right">
            <div class="title">已选择的成员</div>
            <div class="list" @click="del(x.id)" v-for="x in value" :key="x.id">{{x.name}}<i class="iconfont icon-shanchu float-right"></i></div>
        </mt-popup>
    </div>
</template>

<script>
import { Toast } from "mint-ui";
import BaseSearch from './BaseSearch';
export default {
    name: 'base-checkbox',
    props:{
        list:{
            type:Array,
            default:[]
        },
        option:{
            type:Array,
            default:[]
        }
    },
    data() {
		return {         
            filterText:'', //搜索关键字
            popupVisible:false,
            init:false,       
            value:'',
            nodeList:[]
        }
    },
    methods:{
        filterNode(str) {
            this.filterText = str;
            this.nodeList = [];
            this.list.forEach(item => {
                if(item.name.indexOf(this.filterText) != -1) this.nodeList.push(item);
            });
        },
        open(){
            this.init = true;            
            this.nodeList = this.list;
            this.value = this.option;
        },
        enter(){ //确定
            this.$emit('checkList', this.value)
            this.init = false;
        },
        del(id){
            this.value.forEach((item,i) => {
                if(item.id==id) this.value.splice(i,1);
            });
        },
        close() {
          this.init = false;
        }
    },
    mounted(){
         
    },
    components:{
        BaseSearch
    },
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.base-checkbox{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left:0;
    background:#fff;
    z-index: 200;
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
            font-size:px2rem(24);
            color:#666;
            line-height:px2rem(30);
            .iconfont{
                color:#f00;
            }
        }
    }
    label{
        display:block;
    }
    .mint-checkbox-core{
      border-radius: 0;
    }
}
</style>
