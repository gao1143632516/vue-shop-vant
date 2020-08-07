<template>
  <div class="goods">
     <headerNav title="商品详情"/>
    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item v-for="(thumb,index) in goods.goods_image_list" :key="index">
        <img :src="thumb.url" style="width:100%">
      </van-swipe-item>
    </van-swipe>

    <van-cell-group>
      <van-cell>
        <span class="goods-price red">{{ formatPrice(goods.min_price) }}</span>
        <span v-if="is_show_orignal_price" class="goods-market-price delete-line">{{ formatPrice(goods.sku_original_price) }}</span>
        <div class="goods-title">{{ goods.goods_name }}</div>
 
      </van-cell>
  
    </van-cell-group>

    
    <van-cell-group class="goods-cell-group">
      <van-cell  is-link @click="showSku" >
        <template slot="title">
            <span style="margin-right: 10px;">已选</span>
            <span > {{propTitle}} x {{select_num}}</span>
        </template>
      </van-cell>
      
    </van-cell-group>
    
    <div class="goods-info">
        <p class="goods-info-title" >图文详情</p>
        <div class="goods-info-detail" v-html="goods.goods_text" ></div>
    </div>
    <van-goods-action>
        
   
      <van-goods-action-icon icon="cart-o" @click="onClickCart">
        购物车
      </van-goods-action-icon>
      <van-goods-action-button type="warning" @click="showSku">
        加入购物车
      </van-goods-action-button>
      <van-goods-action-button type="danger" @click="showSku">
        立即购买
      </van-goods-action-button>
    </van-goods-action>

    <van-sku v-if="isshow"
          v-model="showBase"
          :sku="sku"
          :goods="goods_moren_img"
          :goods-id="goods.goods_id"
          reset-stepper-on-hide
          reset-selected-sku-on-hide
          disable-stepper-input
          :close-on-click-overlay="closeOnClickOverlay"
          :message-config="messageConfig"
          :custom-sku-validator="customSkuValidator"
          @buy-clicked="onBuyClicked"
          @add-cart="onAddCartClicked"
          @sku-selected="skuSelected"
        >

     
        
    

      </van-sku>
  </div>
</template>

<script>
//import skuData from '../../data/sku';
import {isDiscount} from '@/utils/index';
import { getGoodsById } from "@/api/goods.js";
import storage from '@/utils/storage.js';
import { mapMutations } from 'vuex'

export default {

  data() {
   // this.skuData = skuData;
    return {
      goods:{},
      select_num:1,
      is_show_orignal_price:false,
      sku_selected:{},
      goods_moren_img:{},
      checkedAttributes:[],
      specifications:[],
      sku:{},
      propTitle:'',
      show:false,
      showTag:false,
      showBase: false,
      showCustom: false,
      showStepper: false,
      closeOnClickOverlay: true,
      isshow:false,
      initialSku: {
        s1: '1',
        selectedNum:1
      },
      customSkuValidator: (component) => {
        return '请选择xxx';
      },
      customStepperConfig: {
        quotaText: '单次限购100件',
        stockFormatter: (stock) => `剩余${stock}间`,
        handleOverLimit: (data) => {
          const { action, limitType, quota } = data;
          if (action === 'minus') {
            this.$toast('至少选择一件商品');
          } else if (action === 'plus') {
            if (limitType === LIMIT_TYPE.QUOTA_LIMIT) {
              this.$toast(`限购${quota}件`);
            } else {
              this.$toast('库存不够了~~');
            }
          }
        }
      },
      messageConfig: {
        uploadImg: (file, img) => {
          return new Promise(resolve => {
            setTimeout(() => resolve(img), 1000);
          });
        },
        uploadMaxSize: 3
      }
    };
  },
  methods: {
     ...mapMutations([
      'addCart', // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
    ]),
    formatPrice(data) {
      return 'C$' + (data / 100).toFixed(2);
    },
    onClickCart() {
      this.$router.push('/cart');
    },
    sorry() {
      Toast('暂无后续逻辑~');
    },
    showPromotion() {
        this.show=true;
    },
    showSku(){
        this.showBase=true;
    },
    onClickShowTag(){
        this.showTag=true;
    },
    onBuyClicked(data) {

      var goods_id = data.goodsId;
      var sku_num = data.selectedNum;
      var sku_id = data.selectedSkuComb.id
      var sku_retail_price = data.selectedSkuComb.price;
      var sku_banner_image = data.selectedSkuComb.sku_banner_image;
      var sku_attr = this.propTitle.replace('已选',"");
      var goods_name = this.goods.goods_name;
      let catObject = {goods_id,sku_num,sku_id,sku_retail_price,sku_banner_image,sku_attr,goods_name}
      storage.set('buy',catObject);
      this.$router.push({path:'/order',query:{sku_ids:sku_id,from:'buy'}});

      // this.$toast(JSON.stringify(data));
    },
    onAddCartClicked(data) {
      var goods_id = data.goodsId;
      var sku_num = data.selectedNum;
      var sku_id = data.selectedSkuComb.id
      var sku_retail_price = data.selectedSkuComb.price;
      var sku_banner_image = data.selectedSkuComb.sku_banner_image;
      var sku_attr = this.propTitle.replace('已选',"");
      var goods_name = this.goods.goods_name;
      let catObject = {goods_id,sku_num,sku_id,sku_retail_price,sku_banner_image,sku_attr,goods_name}
      let goodsCatInfo = storage.get('cart')||[];
    
        var goodsItem = goodsCatInfo.find(v=>v.sku_id == sku_id);
      if(goodsItem != undefined){
        goodsItem.sku_num =  goodsItem.sku_num + sku_num
      }else{
        goodsCatInfo.push(catObject);
      }
      storage.set('cart',goodsCatInfo);
 
      this.addCart(goodsCatInfo);


      this.$toast('添加成功');
       this.showBase=false;
       this.select_num = sku_num;
     
    
      // this.$toast(JSON.stringify(data));
      //获取选择的数据，放进本地缓存中
      // let goodsInfo = {
      //   goods_id:
      //   goods_name:
      //   sku_id:
      //   sku_pic:
      //   sku_retail_price:
      //   sku_num:
      // }

    },
    skuSelected(data){

         if (data.selectedSkuComb) {
        const title = []
        this.sku.tree.forEach((item, index) => {
         
          console.log(data.selectedSku[`s${index + 1}`])
          const current = item['v'].find((v)=>v.id === data.selectedSku[`s${index + 1}`])
         title.push(current.name)
        })
         // this.propTitle = `已选 ${title.join(',')}`
         this.propTitle = title.join(',');
         // this.select_num = data.selectedNum;
        // this.sku_selected = skuValue;
}
    },
    toGetSku(checkedAttributes,specifications){
        let tree = [];
        let list = [];
        for (var i = 0; i < checkedAttributes.length; i++) {
          let tree_key = {
            k:checkedAttributes[i].spec_name,
            v:[],
            k_s:"s"+ (i+1)
          }
          for (var j = 0; j < checkedAttributes[i].attributeValues.length; j++) {
            let tree_v = {
                id:checkedAttributes[i].attributeValues[j].spec_detail_id,
                name:checkedAttributes[i].attributeValues[j].spec_detail_name
            }

            tree_key.v.push(tree_v); 

          }

         tree.push(tree_key);
        }
        for (var i = 0; i < specifications.length; i++) {
           let sku = {
             id : specifications[i].sku_id,
             price:specifications[i].sku_retail_price,
             stock_num:specifications[i].sku_num,
             sku_banner_image:specifications[i].sku_banner_image
           }
            for(var k = 0; k < specifications[i].attributeValues.length; k++){
                console.log("s"+specifications[i].attributeValues[k].spec_id);

                 sku["s"+ (k+1)] = specifications[i].attributeValues[k].spec_detail_id
             }
           list.push(sku); 
        }
      
        this.sku.tree = tree;
        this.sku.list = list;
        var goods_sku_default_img = this.goods.goods_images;
        console.log(goods_sku_default_img);
        this.goods_moren_img = {  picture: goods_sku_default_img};
    }


  },
  created(){
    var goods_id = this.$route.params.id;
    getGoodsById(goods_id).then(res=>{
          this.goods = res.data.data.goods;
          this.goods.goods_image_list = JSON.parse(res.data.data.goods.goods_image_list);
          this.checkedAttributes = res.data.data.specification.checkedAttributes;
          this.specifications = res.data.data.specification.specifications;
          this.toGetSku(this.checkedAttributes,this.specifications);  
          this.isshow = true;
          this.is_show_orignal_price = isDiscount(this.goods.is_discount,this.goods.discount_start_time,this.goods.discount_end_time)
     
    })
  }
};
</script>

<style scoped="scoped">

.goods-info-detail >>> img{
  width: 100%;
}
.goods-info-title{
  margin: 5px;
}
.goods {
  padding-bottom: 50px;
 
}
.goods-info{
  font-weight: bold;
  font-size: 16px;
  text-align: center;

}
.goods-market-price{
  margin-left: 5px; 
}
</style>