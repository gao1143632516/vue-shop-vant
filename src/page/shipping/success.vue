<template>
  <div class="container">
    <van-empty :description="status"  image="https://img.yzcdn.cn/vant/custom-empty-image.png">
     <router-link v-if="out_trade_no.length!=0" tag="div" :to="'/user-order-info/'+out_trade_no"> <van-button round type="danger" class="bottom-button">查看订单</van-button></router-link>
     <router-link  tag="div" style="margin-top: 20px;" :to="'/home'"> <van-button round type="danger" class="bottom-button">回到首页</van-button></router-link>
    </van-empty>

    </van-empty>
  </div>
</template>
<script>
	// import {getQueryObject} from '@/utils/index';
	export default{
	  data(){
	  	return{
	  		status:'支付成功',
	  		out_trade_no:''
	  	}
	  },
      created(){
      	 this.out_trade_no = this.$route.query.out_trade_no||'';
      	 this.trade_status = this.$route.query.trade_status||'';

      	if(this.out_trade_no&&this.out_trade_no.length!=0&&this.trade_status=='TRADE_FINISHED'){
      	  //  this.$router.push({ path: '/user-order-info/' + trade_no})
      	}else{
      		this.status='网络错误，支付失败'
      	}
      
      }
	}
</script>
    <style>
.bottom-button {
  width: 160px;
  height: 40px;
}
</style>