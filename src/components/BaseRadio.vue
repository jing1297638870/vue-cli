<template>
    <div class="base-radio" v-if="init">
        <div class="app-flex">
            <base-search v-if="nodeList.length>10" ref="search" v-model="filterText" @input="filterNode"></base-search>
            <ul class="app-content img-text-list">
                <li class="list plist" v-for="(x,index) in nodeList" :key="index">
                    <label style="color:#999" v-if="x.status&&x.status!=='1'">{{x.name}}
                        <div class="float-right">未关注</div>
                    </label>
                    <label v-else>{{x.name}}
                        <div class="float-right">
                            <input type="radio" class="mint-checkbox-input" name="radio" @change="choose" :value="x" v-model="value">
                            <span class="mint-checkbox-core"></span>
                        </div>
                    </label>                   
                </li>
                <li v-if="nodeList.length==0" class="no-border align-center" style="color:#999; margin-top:30px;">暂无数据</li>
            </ul>
            <div class="fixed-bottom-btn">
                <div class="btn chu-btn" @click="init=false">取 消</div>
            </div>
        </div>       
    </div>
</template>

<script>
import { Toast } from "mint-ui";
import BaseSearch from './BaseSearch';
export default {
    name: 'base-radio',
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
            this.filterText = '';
            this.nodeList = this.list;
            this.value = '';
            this.list.forEach(item => {
              if(item.id==this.option.id) this.value = item;
            })
        },
        choose(){
          this.$emit('radioVal', this.value);
          this.init = false;
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
.base-radio{
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
}
</style>
