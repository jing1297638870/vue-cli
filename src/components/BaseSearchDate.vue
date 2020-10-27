<template>
    <div class="base-search-data display-flex">
        <div class="input display-flex flex-1">
            <input class="flex-1" type="text" @click="chooseData" v-model="keyword" placeholder="请选择时间" />
            <i v-if="keyword" @click="del" class="iconfont icon-shanchu"></i>
        </div>       
        <mt-datetime-picker :visible-item-count="5" type="date" year-format="{value}年" month-format="{value}月" date-format="{value}日" ref="picker" :value="new Date(keyword)" :endDate="new Date()" @confirm="handleConfirm"></mt-datetime-picker>
    </div>
</template>

<script>

export default {
    name: 'base-search-data',
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
        chooseData(){
            this.$refs.picker.open();
        },
        handleConfirm(value) {
			//日期选择
			var year = value.getFullYear();
			var month = value.getMonth() + 1;
			var day = value.getDate();
			var hour = value.getHours();
			var min = value.getMinutes();
			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}
			if (hour < 10) {
				hour = "0" + hour;
			}
			if (min < 10) {
				min = "0" + min;
			}
            this.keyword = year + "-" + month + "-" + day;
            this.$emit('input', this.keyword);
		}
    },
    mounted(){
       
    },
    watch:{
       value(val) {
           this.keyword = val
       } 
    }
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.base-search-data{
    padding:px2rem(20) px2rem(20);
    font-size:px2rem(28);
    .input{
        padding-right:px2rem(10);        
        height:px2rem(50);
        line-height:px2rem(50);
        border:1px solid #ccc;    
        border-radius:px2rem(4);  
        input{
            padding-left:px2rem(10);
            height:px2rem(46);
            border:0;  
            color:#333;  
            display:block;       
        }
        .iconfont{
            color:#999;
        }
    }
}
</style>
