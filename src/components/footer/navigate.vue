<template>
    <!-- <div style="height:100%;"> -->
    <van-tabbar v-model="active">
        <van-tabbar-item icon="wap-home" to="/home" name="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="wap-nav" to="/category" name="/category" >分类</van-tabbar-item>
        <van-tabbar-item v-if="cartGoodsNum>=1" icon="cart" to="/cart" name="/cart"  :badge="cartGoodsNum">购物车</van-tabbar-item>
         <van-tabbar-item v-else icon="cart" to="/cart" name="/cart">购物车</van-tabbar-item>
        <van-tabbar-item icon="contact" to="/user/index" name="/user/index">我的</van-tabbar-item>
    </van-tabbar>
    <!-- //</div> -->
</template>

<script>
import { Tabbar, TabbarItem } from "vant";
import { mapGetters } from 'vuex'
export default {
    data(){
        return {
            active:'/home'
        } 
    },
    name:'navigate',
    components:{
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem,
    },
    computed:{
        ...mapGetters(['cartGoodsNum'])
    },
    created(){
      this.active = this.$route.path;
      console.log(this.$store);

    }
}
</script>

