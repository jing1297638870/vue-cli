import { Toast } from "mint-ui";
import router from '../../router'
import axios from 'axios'
export default {
    wxjssdk(ht_id, code, modId) {
        var uurl = this.getUrl();
        uurl = encodeURIComponent(uurl); 
        axios.post("/api/vue/signature.api?url=" + uurl)
        .then(res => {
            wx.config({
                debug: false,
                appId: res.data.appId,
                timestamp: res.data.timestamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: [
                    'previewImage',
                    'downloadImage',
                    "chooseImage",
                    "uploadImage",
                    "chooseWXPay",
                    "startRecord",
                    "stopRecord",
                    "playVoice",
                    "uploadVoice",
                    "downloadVoice",
                    "closeWindow"
                ]
            });
        }).catch(function (err) {
            console.warn(err);
        });
    },
    closeWindow(){
      wx.ready(function(){
          wx.closeWindow();
      })
    },
    errTips(code, message) {
        if (code) {   
            router.replace({ name: "errTips", query: { code: code, message:message } });
        }    
    },
    emoji(substring) {  //表情过滤 
        for ( var i = 0; i < substring.length; i++) {  
            var hs = substring.charCodeAt(i);  
            if (0xd800 <= hs && hs <= 0xdbff) {  
                if (substring.length > 1) {  
                    var ls = substring.charCodeAt(i + 1);  
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;  
                    if (0x1d000 <= uc && uc <= 0x1f77f) {  
                        Toast("不可输入表情");
                        return 1;
                    }  
                }  
            } else if (substring.length > 1) {  
                var ls = substring.charCodeAt(i + 1);  
                if (ls == 0x20e3) {  
                    Toast("不可输入表情");
                    return 1;  
                }  
            } else {  
                if (0x2100 <= hs && hs <= 0x27ff) {  
                    Toast("不可输入表情");
                    return 1; 
                } else if (0x2B05 <= hs && hs <= 0x2b07) {  
                    Toast("不可输入表情");
                    return 1;  
                } else if (0x2934 <= hs && hs <= 0x2935) {  
                    Toast("不可输入表情");
                    return 1;
                } else if (0x3297 <= hs && hs <= 0x3299) {  
                    Toast("不可输入表情");
                    return 1;  
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030  
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b  
                        || hs == 0x2b50) {  
                    Toast("不可输入表情");
                    return 1;
                }  
            }  
        }  
    },
    validate: (val, type) => {
        let ret = false;
        switch (type) {
            case '1':
                {
                    // 数字
                    var isNumber = /^[0-9]*$/g;
                    ret = isNumber.test(val);
                }
                break;
            case '2':
                {
                    // 字母
                    var isChar = /^[a-zA-Z]*$/g;
                    ret = isChar.test(val);
                }
                break;
            case '3':
                {
                    // 中文
                    var isCnChar = /^[\u2E80-\u9FFF]+$/;
                    ret = isCnChar.test(val);
                }
                break;
            case '4':
                {
                    // email
                    var isEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
                    ret = isEmail.test(val);
                }
                break;
            case '5':
                {
                    // var isPhone = /(^(\d{3,4}-)?\d{6,8}$)|(^(\d{3,4}-)?\d{6,8}(-\d{1,5})?$)|(\d{11})/g;
                    var isPhone = /^1[23456789]\d{9}$/g;
                    ret = isPhone.test(val);
                }
                break;
            case '6':
                {
                    var isIDCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                    ret = isIDCard.test(val);
                }
                break;

        }
        return ret;
    },
    getUrl() {
        var uurl = '';
        if (navigator.userAgent.toLowerCase().indexOf('iphone') !== -1){
          uurl = sessionStorage.landingUrl;
        } else {
          uurl = window.location.href;
        }
        return uurl;
    },
    getQueryString: (href, key) => {      
        // 获取URL中?之后的字符
        var strArr = href.split('?');
        var str = '';
        if (strArr.length == 2) {
            str = strArr[1];
        } else {
            return '';
        }
        // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
        var arr = str.split("&");
        var obj = new Object();

        // 将每一个数组元素以=分隔并赋给obj对象    
        for (var i = 0; i < arr.length; i++) {
            var tmp_arr = arr[i].split("=");
            obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
        }
        if(obj[key]) {
            return obj[key];
        } else {
            return "";
        }       
    }

}

