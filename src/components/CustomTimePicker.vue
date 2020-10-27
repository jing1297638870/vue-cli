<template>
	<div class="custom-time-picker" v-if="popupVisible">		
		<mt-popup v-model="popupVisible" position="bottom">
			<mt-picker :slots="slots" @change="onValuesChange" showToolbar>
				<div class="display-flex enter-btn">
					<div class="flex-1 align-center" @click="close">取消</div>
					<div class="flex-1 align-center" @click="enter">确定</div>
				</div>
			</mt-picker>
		</mt-popup>
	</div>
</template>

<script>
	export default {
		name: 'custom-time-picker',
		props:{
			value:{
				type:Array,
				default:[]
			}
		},
		data() {
			return {
				popupVisible:false,
				slots: [
				  {
	          flex: 1,
	          values: ['每周'],
	          className: 'slot1',
	          textAlign: 'center'
	       },{
	          flex: 1,
	          values: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
	          className: 'slot2',
	          textAlign: 'center'
	       }, {
	          divider: true,
	          content: '-',
	          className: 'slot3',
	        }, {
	          flex: 1,
	          values: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
	          className: 'slot4',
	          textAlign: 'center'
	        },{
	          divider: true,
	          content: ':',
	          className: 'slot5',
	        }, {
	          flex: 1,
	          values: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
	          className: 'slot6',
	          textAlign: 'center'
	        }
	      ],
	      times:[]
			}
		},
		methods: {
			onValuesChange(picker, values) {		
	      this.times = values;
	    },
	    open() {	    	
				this.popupVisible = true;
	    },
	    close(){
	    	this.popupVisible = false;
	    },
	    enter(){
	    	this.$emit('getCustomTimes', this.times)
	    	this.close();
	    }
		},
		mounted() {

		},
		watch: {
	    popupVisible(val) {
	      if (val && this.value.length>0) {
	      	let str = "一二三四五六日";
   				this.slots[1].defaultIndex = str.indexOf(this.value[1].substring(1));
					this.slots[3].defaultIndex = Number(this.value[2]);
					this.slots[5].defaultIndex = Number(this.value[3]);  
	      }
	    }
	  }
	}
</script>
<style lang="scss">
	@function px2rem($px) {
		@return ($px / 20) * 1rem * 0.5;
	}
	
	.custom-time-picker {
		.enter-btn{
			background:#eee;
			color:#0474FF;
		}
		.slot3{
			flex:none !important;
			width:px2rem(20);
			padding:0 px2rem(30);
		}
		.slot5{
			flex:none !important;
			width:px2rem(10);
		}
	}
</style>