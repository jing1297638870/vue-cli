<template>      
	<div class="sd-cp">
		<!-- <span class="">———</span>
		<span class="cp-text">圣点校园 &copy; 圣点科技</span>
		<span class="">———</span> -->
	</div>   
</template>

<script>
export default {
    name: 'copyright',
}
</script>
<style lang="scss">
@function px2rem($px) {
    @return ($px / 20) * 1rem * 0.5;
}
.sd-cp {
	width: 100%;
	margin: 0 auto;
	padding: 2rem 0 2.8rem;
	text-align: center;
	position: relative;
	color: #ccc; 
	line-height:.8rem;
	.cp-text {
		padding: 0 .4rem;
		font-size: .6rem;		
	}
}
</style>
