<template>
    <div>
   
 
    </div>
</template>

<script>
import {getUserInfo,getUserAuthorized,getUserAuthorizedUrl} from '@/api/user'
import storage from '@/utils/storage.js';
export default {
	data(){
		return {
			auth_code:'',
			state:''
		}
	},
	methods:{
	  async getUserInfo(){
        var {data} = await getUserInfo(this.auth_code);
          if(data.code == 0){
          	storage.set("userInfo",data.data);
            this.$router.push({path:this.state})
          }else{
          	this.$toast(data.message);
          }
		}
	},
	created(){
	  this.auth_code = this.$route.query.auth_code;
	  this.state = this.$route.query.state;
	  this.getUserInfo();

	}
}
</script>

<style>

</style>
