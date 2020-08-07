<template>
    <div style="height:100%">
        <page />
        <navigate />
    </div>
</template>
<script>
import navigate from '@/components/footer/navigate.vue'
import page from './page/page.vue'
import {getUserInfo,getUserAuthorized,getUserAuthorizedUrl} from '@/api/user'
import storage from '@/utils/storage.js';
import userAgent from '@/utils/userAgent.js'
export default {
    components: {
        page,
        navigate
    },
 
    created() {
      let agent = userAgent();
      if(agent == 'wx'){
          this.$toast.fail("请在支付宝里边打开此页面");
      }else if(agent == 'ali'){

      }else{
        this.$toast.fail("请在支付宝里边打开此页面");
      }
    // var info = storage.get("userInfo");
    //   if(info != null){
     
    //   }else{//授权登录
    //        getUserAuthorizedUrl(this.$route.path);
       
    //   }

      
      // getUserAuthorized().then(res=>{
      	// ap.alert(33);
       //  ap.alert(res)
       //	getUserInfo(res).then(res=>{
       //   ap.alert(JSON.stringify(res.data));
       //   storage.set('userInfo',res.data.data);
        //});
      // });
    }
}
</script>
<style>
</style>