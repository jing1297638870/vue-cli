<template>
    <div class="tree-radio" v-if="init">
        <div class="app-flex">
            <base-search ref="search" v-model="filterText" @input="filterNode"></base-search>
            <ul class="app-content img-text-list" v-if="!isChild">
                <li class="list plist" v-for="x in nodeList" :key="x.id">
                    <label v-if="x.children" @click="showChild(x.children)">{{x.name}}
                        <div class="float-right iconfont icon-xiangyou"></div>
                    </label>
                    <label v-else>{{x.name}}
                        <div class="float-right">
                            <input type="radio" class="mint-checkbox-input" name="radio" @change="choose" :value="x" v-model="value">
                            <span class="mint-checkbox-core"></span>
                        </div>
                    </label>                   
                </li>
            </ul>
            <ul class="app-content img-text-list" v-if="isChild">
                <li class="list plist" v-for="x in childrenList" :key="x.id">
                    <label>{{x.name}}
                        <div class="float-right">
                            <input type="radio" class="mint-checkbox-input" name="radio" @change="choose" :value="x" v-model="value">
                            <span class="mint-checkbox-core"></span>
                        </div>
                    </label>                   
                </li>
            </ul>
            <div class="fixed-bottom-btn">
                <div class="btn chu-btn" @click="init=false">取 消</div>
            </div>
        </div>      
    </div>
</template>

<script>
import { Toast } from "mint-ui";
import BaseSearch from './BaseSearch'
export default {
    name: 'tree-radio',
    props:{
        list:{
            type:Array,
            default:[]
        },
        option:{
            type:Object
        }
    },
    data() {
		return {  
            init:false,       
            filterText:'', //搜索关键字
            value:'', //选中的父亲
            nodeList:[],
            childrenList:[], //孩子列表
            isChild:false //是否展示第二级
        }
    },
    methods:{
        filterNode(str) {
            this.filterText = str;
            if(this.isChild) {
                let arr = [];
                this.childrenList.forEach(item => {
                    if(item.name.indexOf(this.filterText) != -1) arr.push(item);
                });
                this.childrenList = arr;
            } else {
                this.nodeList = [];
                this.list.forEach(item => {
                    if(item.name.indexOf(this.filterText) != -1) this.nodeList.push(item);
                });
            }
            
        },
        open(){
            this.init = true;
            this.isChild = false;
            this.nodeList = this.list;
            this.filterText = '';
            this.list.forEach(item => {
              if(item.id==this.option.id) this.value = item;
            })
        },
        choose(){
          this.$emit('treeRadioVal', this.value);
            this.init = false;
        },
        showChild(list){
            this.childrenList = list;
            this.isChild = true;
        }
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
.tree-radio{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left:0;
    background:#fff;
    z-index: 200;
    font-size:px2rem(28);
    label{
        display:block;
    }
    input[type='radio'] {
        display:none;
    }
    .icon-select1{
        color:#ccc;
    }
    .icon-select{
        color:#88c700;
    }
    .icon-xiangyou{
        font-size:px2rem(28);
        color:#999;
    }
}
</style>
