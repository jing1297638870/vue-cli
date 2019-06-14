<template>
    <div class="message-box" v-if="flag">          
        <div class="box">
            <div class="title" v-html="title"></div>
            <div class="text" v-html="message"></div>
            <div class="choose-btn display-flex">
                <div class="flex-1" v-if="cancleBtn" @click="flag=false">取消</div>
                <div class="enter flex-1" @click="enter">确定</div>
            </div> 
        </div>
    </div>
</template>

<script>
export default {
    name: 'message-box',
    props:{
        message:{
            type:String,
            default:''
        },
        cancleBtn:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:'提示'
        }
    },
    data() {
		return {
            flag:false
        }
    },
    methods:{
        enter(){
            this.flag = false;
            this.$emit('enter', '');
        },
        open(){
            this.flag = true;
        }
    },
    mounted(){
        
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.message-box{
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;    
    background:rgba(0,0,0,.5);
    z-index:1;
    .box{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        width: 85%;
        font-size:px2rem(28);
        z-index: 2;
        .title{
            padding:px2rem(20) px2rem(10) 0;
            text-align: center;
            font-weight:700;
            font-size:px2rem(32);
        }
        .text{
            padding:px2rem(20);
            text-align:center;
            border-bottom:1px solid #f4f4f4;
        }
        .choose-btn{            
            text-align: center;
            div{
                line-height:px2rem(80);
            }
            .enter{
                color:#04c7ff;
                border-left:1px solid #f4f4f4;
            }
        }
    }
}
</style>
