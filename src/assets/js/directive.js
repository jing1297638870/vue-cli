export default {
    'drag':{ //拖拽
        inserted:function(el) {
            var oDiv = el;
            var oW, oH;
            oDiv.addEventListener('touchstart',function(e){
                var touches = e.touches[0];
                oW = touches.clientX - oDiv.offsetLeft;
                oH = touches.clientY - oDiv.offsetTop;   
                document.addEventListener("touchmove", defaultEvent, { passive: false });                             
            },{ passive: false })
            oDiv.addEventListener('touchmove',function(e){
                var touches = e.touches[0];
                var oLeft = touches.clientX - oW;
                var oTop = touches.clientY - oH;
                if(oLeft < 0) {
                    oLeft = 0;
                } else if(oLeft > document.documentElement.clientWidth - oDiv.offsetWidth) {
                    oLeft = (document.documentElement.clientWidth - oDiv.offsetWidth);
                }
                if(oTop < 0) {
                    oTop = 0;
                } else if(oTop > document.documentElement.clientHeight - oDiv.offsetHeight) {                        
                    oTop = (document.documentElement.clientHeight - oDiv.offsetHeight);
                }
                oDiv.style.left = oLeft + "px";
                oDiv.style.top = oTop + "px";
            },{ passive: false })
            oDiv.addEventListener('touchend',function(e){  
                document.removeEventListener("touchmove", defaultEvent, { passive: false });
            },{ passive: false })
            function defaultEvent(e) {
                e.preventDefault();
            }
        }
    },
    'inputblue':{
      inserted:function(el) {
        var oDiv = el;
        oDiv.addEventListener('blur',function(e){ 
          document.documentElement.scrollTop=1;
          document.body.scrollTop=1;
        })
      }
    }
}
  