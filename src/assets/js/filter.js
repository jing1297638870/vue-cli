export default {
    'fmt': (timespan) => {
        var dateTime = new Date(timespan); 
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        var second = dateTime.getSeconds();
        if(month<10) {
            month="0"+month;
        }
        if(day<10) {
            day="0"+day;
        } 
        if(hour<10) {
            hour="0"+hour;
        } 
        if(minute<10) {
            minute="0"+minute;
        }
        if(second<10) {
            second="0"+second;
        }    
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    'fm': (timespan) => {
      var dateTime = new Date(timespan); 
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      var minute = dateTime.getMinutes();
      var second = dateTime.getSeconds();
      if(month<10) {
          month="0"+month;
      }
      if(day<10) {
          day="0"+day;
      } 
      if(hour<10) {
          hour="0"+hour;
      } 
      if(minute<10) {
          minute="0"+minute;
      }
      if(second<10) {
          second="0"+second;
      }    
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    },
    'sfmt': (dateStr) => { //timespan为字符串：2018-11-01 01:00:00
        var publishTime = Date.parse(dateStr.replace(/-/gi,"/"))/1000,
        d_seconds,
        d_minutes,
        d_hours,
        d_days,
        timeNow = parseInt(new Date().getTime()/1000),
        d,

        date = new Date(publishTime*1000),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        H = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
        //小于10的在前面补0
        if (M < 10) {
            M = '0' + M;
        }
        if (D < 10) {
            D = '0' + D;
        }
        if (H < 10) {
            H = '0' + H;
        }
        if (m < 10) {
            m = '0' + m;
        }
        if (s < 10) {
            s = '0' + s;
        }

        d = timeNow - publishTime;
        d_days = parseInt(d/86400);
        d_hours = parseInt(d/3600);
        d_minutes = parseInt(d/60);
        d_seconds = parseInt(d);

        if(d_days > 0 && d_days < 3){
            return d_days + '天前';
        }else if(d_days <= 0 && d_hours > 0){
            return d_hours + '小时前';
        }else if(d_hours <= 0 && d_minutes > 0){
            return d_minutes + '分钟前';
        }else if (d_seconds < 60) {
            if (d_seconds <= 0) {
                return '刚刚发表';
            }else {
                return d_seconds + '秒前';
            }
        }else if (d_days >= 3){
            return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
        }
    }
}