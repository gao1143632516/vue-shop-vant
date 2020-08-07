<template>
<div>
    <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
 <div v-for='(item, index) in list' :key="index"> 
        <div>{{item}}循环出来的数据<div>
  
  </div>
  
</van-list>
    
</div>
</template>

<script>
import {getRecommentGoods} from "../../api/page.js";

export default {
    name:'product',
    data () {
       return {
           productlist: [],
           loading: false,
           finished: false,
       }
     },
    props:{
        data:Object
    }, 
    created:function(){
    
        if(type=='recomment'){
            getRecommentGoods(id).then(response => {
            console.log(response);
            this.productlist=response.data.datalist;
        })

        }else if(type=='discount'){
            GetDiscountInfo(id).then(response => {
            console.log(response);
            this.productlist=response.data.datalist;
        })
        }


        
    },
    methods:{
     onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },

    }
}
</script>

<style>

</style>
