<template>
    <div class="attendance-calendar">
        <div class="calendar-tit display-flex">
            <div class="align-left flex-1"><i class="iconfont icon-xiangzuo2"></i><span @click="buildCalendar(1)">上月</span></div>
            <div class="align-center flex-1">{{currDateTxt}}</div>
            <div class="align-right flex-1"><span @click="buildCalendar(2)">下月</span><i class="iconfont icon-xiangyou"></i></div>
        </div>
        <table class="calendar-body">
            <tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th>
            <tr v-for="(x,index) in calendarBody" :key="index">
                <td v-for="(y, key) in x" :key="key">
                    <div class="list" @click="toNext(y)">
                        <img class="today" v-if="y.istoday" :src="require('../assets/images/attendance.png')" alt="">
                        <img class="status" :src="require(`../assets/images/bg${y.value}.png`)" alt="">
                        <span class="day">{{y.day}}</span>
                    </div>
                </td>
            </tr>
        </table>
        <div class="bottom display-flex">
            <div class="align-right"><img :src="require('../assets/images/bg1.png')" alt="">{{status['1']}}</div>
            <div class="align-center"><img :src="require('../assets/images/bg2.png')" alt="">{{status['2']}}</div>
            <div class="align-left"><img :src="require('../assets/images/bg3.png')" alt="">{{status['3']}}</div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'attendance-calendar',
    props:{
        ajax_url:{
            type:String
        },
        searchObj:{
            type:Object
        },
        status:{
            type:Object
        }
    },
    data() {
		return {
            calendarBody:[]
        }
    },
    methods:{
        toNext(item){
            var currDateArr = this.searchObj.currdate.split("-");
            let t =  currDateArr[0] + "-" + currDateArr[1] + "-";
            this.$router.push({name:this.searchObj.link, query:Object.assign(this.searchObj, {time:t+item.day})});
        },
        buildCalendar: function (type) {
            // 上个月
            if (type == 1) {
                this.getPreMonth(this.searchObj.currdate);
            } else if (type == 2) { //下个月
                this.getNextMonth(this.searchObj.currdate);
            }
            
            this.$http.post(this.ajax_url, this.searchObj)
            .then(res => {
                this.buildCalendarBody(this.searchObj.currdate, res.data.result);
            });
        },
        // 获取上个月
        getPreMonth: function (date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中月的天数
            var year2 = year;
            var month2 = parseInt(month) - 1;
            if (month2 == 0) {
                year2 = parseInt(year2) - 1;
                month2 = 12;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                //month2 = '0' + month2;
            }
            var t2 = year2 + '-' + month2 + '-' + day2;
            this.searchObj.currdate = t2;
        },
        // 获取下个月
        getNextMonth: function (date) {
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份
            var month = arr[1]; //获取当前日期的月份
            var day = arr[2]; //获取当前日期的日
            var days = new Date(year, month, 0);
            days = days.getDate(); //获取当前日期中的月的天数
            var year2 = year;
            var month2 = parseInt(month) + 1;
            if (month2 == 13) {
                year2 = parseInt(year2) + 1;
                month2 = 1;
            }
            var day2 = day;
            var days2 = new Date(year2, month2, 0);
            days2 = days2.getDate();
            if (day2 > days2) {
                day2 = days2;
            }
            if (month2 < 10) {
                //month2 = '0' + month2;
            }

            var t2 = year2 + '-' + month2 + '-' + day2;
            this.searchObj.currdate = t2;
        },
        //生成打卡记录日历
        // 1:已打卡 2:请假 3.打卡+请假
        // data   [{"2016-11-1":1},{"2016-11-2":1}, ...]
        buildCalendarBody: function (currdate, data) {
            var currdateArr = currdate.split("-");
            var y = currdateArr[0];
            // js中月份是从0-11计算的.
            var m = parseInt(currdateArr[1]) - 1;

            var d = parseInt(currdateArr[2]);
            var i, k, today = new Date();
            var firstday = new Date(y, m, 1) //获取当月的第一天

            var dayOfWeek = firstday.getDay() //判断第一天是星期几(返回[0-6]中的一个，0代表星期天，1代表星期一，以此类推)
                //alert(this.isLeap(y));
            var days_per_month = new Array(31, 28 + this.isLeap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31) //创建月份数组
            var str_nums = Math.ceil((dayOfWeek + days_per_month[m]) / 7); //确定日期表格所需的行数

            var arr = [];
            var nowDay = today.getDate();
            for (i = 0; i < str_nums; i += 1) { //二维数组创建日期表格
                var arr1 = [];
                for (k = 0; k < 7; k++) {
                    var idx = 7 * i + k; //为每个表格创建索引,从0开始
                    var date = idx - dayOfWeek + 1; //将当月的1号与星期进行匹配
                
                    (date <= 0 || date > days_per_month[m]) ? date = ' ': date = idx - dayOfWeek + 1; //索引小于等于0或者大于月份最大值就用空表格代替
                    var istoday = date == d ? "today" : "";
                   
                    if (date != ' ') {
                        if(typeof(data[date - 1]["day-"+date])=="undefined"){
                            var dayObj = {};
                            dayObj["day-"+date] = 0;
                            data.splice(date - 1, 0, dayObj);
                        }  

                        arr1.push({istoday:istoday, day:date, value:data[date - 1]['day-' + date]});
                    } else {                       
                        arr1.push({istoday:istoday, day:date, value:''});
                    }                    
                }               
                arr.push(arr1);
            }
           
            this.calendarBody = arr;
        },
        //判断当前年份是否是闰年(闰年2月份有29天，平年2月份只有28天)
        isLeap: function (year) {
            return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
        }
    },
    created() {
        this.buildCalendar();
    },
    computed: {
        // 显示日历当前年月.
        currDateTxt: function () {
            var currDateArr = this.searchObj.currdate.split("-");
            return currDateArr[0] + "年" + currDateArr[1] + "月";
        }
    }
}


</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.attendance-calendar{
    padding:px2rem(20);
    .calendar-tit {
        font-size:px2rem(28);
        color:#333;
        padding-bottom:px2rem(10);
        border-bottom:1px solid #ccc;
        .align-center{
            font-size:px2rem(32);
        }
        .iconfont{
            font-size:px2rem(28);
            color:#666;
        }
    }
    .calendar-body{
        width:100%;
        margin-top:px2rem(10);
        font-size:px2rem(24);
        td{
            text-align: center;
            position:relative;
            padding:px2rem(10) 0;
            .status{
                width:80%;
                margin:0 auto;
                display:block;
                border-radius:50%;
            }
            .today{
                position:absolute;
                right:0;
                top:px2rem(-3);
                width:px2rem(30);
            }
            .day{
                width:px2rem(40);
                height:px2rem(40);
                position:absolute;
                left:50%;
                top:50%;
                margin-top:px2rem(-20);
                margin-left:px2rem(-20);
                z-index: 100;
                line-height:px2rem(40);
                color:#fff;
            }
        }
    }
    .bottom{
        font-size:px2rem(28);
        margin-top:px2rem(20);
        div{
            -webkit-flex:1;/*Chrome*/
            -ms-flex:1;/*IE 10*/
            flex: 1;/* NEW ,Spec - Opera 12.1,Firefox 20+*/
            -webkit-box-flex:1;/*OLD -iOS 6-,Safari 3.1-6*/
            -moz-box-flex:1;/*OLD - Firefox 19-*/
            img{
                width:px2rem(24);
                margin-right:px2rem(5);
            }
        }
    }
}
</style>
