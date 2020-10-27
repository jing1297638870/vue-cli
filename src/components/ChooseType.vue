<template>
    <div class="choose-type" v-if="init">
        <div class="app-flex">
            <div class="app-content type display-flex">
                <div class="parent-type">
                    <label :class="value.pType==x.name ? 'active' : ''" @click="childList=x.child; value.cType=x.child[0].dicName" v-for="(x,index) in nodeList" :key="index">{{x.name}}
                        <input type="radio" :value="x.name" v-model="value.pType">
                    </label>
                </div>
                <div class="child-type flex-1">
                    <label  :class="value.cType==x.dicName ? 'active' : ''" v-for="(x,key) in childList" :key="key">{{x.dicName}}
                        <input type="radio" :value="x.dicName" v-model="value.cType">
                    </label>
                </div>
            </div> 
            <div class="fixed-bottom-btn">
                <div class="btn chu-btn" @click="init=false">取 消</div>
                <div class="btn fill-btn" @click="sub">确 定</div>
            </div>  
        </div> 
    </div>
</template>

<script>
import { Toast } from "mint-ui";

export default {
    name: 'choose-type',
    props:{
        list:{
            type:Array,
            default:[]
        },
        option:{
            type:Object,
            default:{pType:'', cType:''}
        }
    },
    data() {
		return {  
            init:false,                  
            value:{pType:'', cType:''},
            nodeList:[],
            childList:[]
        }
    },
    methods:{
        open(){
            this.init = true;
            this.nodeList = this.list;
            if(!this.option.pType || !this.option.cType) {
                this.value.pType = this.nodeList[0].name;
                this.childList = this.nodeList[0].child;
                this.value.cType = this.nodeList[0].child[0].dicName;               
            } else {
                this.nodeList.forEach((item, i) => {
                    if(item.name == this.option.pType) {
                        this.value.pType = this.option.pType;
                        this.childList = item.child;
                        this.value.cType = this.option.cType;
                    }
                });
            }           
        },
        sub() {
            this.$emit('input', this.value);
            this.init = false;
        }
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.choose-type{
    position:fixed;
    top:0;
    bottom:0;
    right:0;
    left:0;
    background:#fff;
    z-index: 200;
    .type{
        .parent-type{
            width:px2rem(150);            
            overflow: auto;
            label{
                display:block;
                padding:px2rem(28) px2rem(10);
                text-align:center;
                border-bottom:1px solid #d7d7d7;
                font-size:px2rem(28);
                color:#333;
                background:#f4f4f4;
                input{
                    display:none;
                }
            }
            .active{
                background:#fff;
                color:#04C7FF;
            }
        }
        .child-type{
            overflow: auto;
            margin:0 px2rem(20);
            label{
                display:block;
                padding:px2rem(20) px2rem(10);
                border-bottom:1px solid #f4f4f4;
                font-size:px2rem(28);
                color:#333;
                input{
                    display:none;
                }
            }
            .active{
                color:#04C7FF;
            }
        }
    }
}
</style>
