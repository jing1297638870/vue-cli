<template>
    <div class="base-search display-flex">
        <div class="input display-flex flex-1">
            <i class="iconfont icon-search"></i>
            <input type="text" class="flex-1" v-model="keyword" placeholder="请输入关键字..." />
            <i v-if="keyword" @click="del" class="iconfont icon-shanchu"></i>
        </div>  
        <div class="button" @click="enter">搜索</div>     
    </div>
</template>

<script>

export default {
    name: 'base-search',
    props:{
        value:{
            type:String,
            default:''
        }
    },
    data() {
		return {
            keyword:''
        }
    },
    methods:{
        del(){
            this.keyword = '';
            this.$emit('input', this.keyword);
        },
        enter(){
            this.$emit('input', this.keyword);            
        }
    },
    mounted(){
        this.keyword = this.value;
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.base-search{
    padding:px2rem(14) px2rem(20);
    font-size:px2rem(28);
    background:#f5f5f5;
    .input{      
        padding-right:px2rem(10);        
        height:px2rem(64);
        line-height:px2rem(64);
        border:1px solid #eee;    
        border-radius:px2rem(10); 
        background:#fff; 
        input{
            border-radius:px2rem(10); 
            padding-right:px2rem(10);        
            height:px2rem(60);
            display:block;
            border:0;  
            color:#333;         
        }
        .iconfont{
            color:#999;
            padding:0 px2rem(10)
        }
    }
    .button{
        margin-left:px2rem(20);
        height:px2rem(64);
        color:#04c7ff;
        text-align: center;
        line-height:px2rem(64);
        border-radius:px2rem(4);
    }
}
</style>
