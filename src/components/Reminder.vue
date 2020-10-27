<template>
    <div class="page-reminder">       
        <img src="../assets/images/tip-head.png" alt="">
        <div class="content">温馨提示：{{content}}</div>
    </div>
</template>

<script>
export default {
    name: 'reminder',
    props:{
        content:{
            type:String,
            default:''
        }
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.page-reminder{
    margin-top:px2rem(30);
    img{
        width:100%;
        display:block;
    }
    .content{
        background: #FFFAEA;
        padding: px2rem(20);
        font-size: px2rem(24);
        color: #ff4a78;
        line-height: px2rem(44);
    }
}
</style>
