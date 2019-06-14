<template>
    <div class="load-show">       
        <p class="page-infinite-loading" v-show="isLoading">
            <mt-spinner type="fading-circle" :size="20"></mt-spinner><br />加载中...
        </p>
        <img class="no-data-img" v-show="!isLoading && length == 0" :src="require('../assets/images/no-data.jpg')" alt="">
        <p class="page-infinite-loading no-data-list" v-show="!isLoading && length == 0">暂无数据</p>
        <p class="page-infinite-loading" v-show="!isLoading && length > 0 && (length >= total)">
            <span class="infinite-prompt-text">没有更多了...</span>
        </p>
        <copyright></copyright>
    </div>
</template>

<script>
export default {
    name: 'load-show',
    props:{
        length: {
            type:Number,
            default:0
        },
        total: {
            type:Number,
            default:0
        },
        isLoading: {
            type:Boolean,
            default:false
        }
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.load-show{
    .page-infinite-loading{
        text-align:center; 
        color:#ccc; 
        margin-top:px2rem(30);
        span{
            display:inline-block;
            margin:0 auto;
        }
    }
    .no-data-list{
        margin:px2rem(160) 0 70%;
    }
    .no-data-img{
        width:40%;
        display:block;
        margin:px2rem(200) auto 0;
    }
}
</style>
