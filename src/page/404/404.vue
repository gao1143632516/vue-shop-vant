<template>
    <div style="height: 100%">
        <!-- <van-empty class="custom-image" :image="require('../../assets/images/404.png') description="描述文字" /> -->
        <div class="not">
             <div class="img">
             	<img :src="imgpath" alt=""  />
             	<span>页面不存在</span>
             </div>
            <!--  <div>
             	你访问的页面不存在
             </div> -->
        </div>
        </div>
</template>
<script>
export default {
    data() {
        return {
            imgpath: require('../../assets/images/404.png')
        }
    }
}
</script>
<style>
.not{
	position: absolute;
	top:50%;
	left: 50%;
	transform: translate(-50%, -50%);

}
.not .img{
	text-align: center;
	font-size: 30px;
	
}
</style>