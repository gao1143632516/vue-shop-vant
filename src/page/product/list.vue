<template>
    <div class="product-list">
        <headerNav title="列表" />
        <div class="tab">
            <div :class="[query.order_by_name=='default' ? 'red' : '','tab-item']"  @click="getGoodsListBycategory('default')">
                默认
            </div>
            <div :class="[query.order_by_name=='goods_id' ? 'red' : '','tab-item']" @click="getGoodsListBycategory('goods_id')">
                新品
            </div>
            <div :class="[query.order_by_name=='sale_num' ? 'red' : '','tab-item']" @click="getGoodsListBycategory('sale_num')">
                销量
            </div>
            <div :class="[query.order_by_name=='min_price' ? 'red' : '','tab-item']" @click="getGoodsListBycategory('min_price')">
                价格
                <van-icon v-if="price_order==1" name="arrow-up" size="10" color="red" />
                <van-icon v-if="price_order==2" name="arrow-down" size="10" color="red"/>
            </div>
            <div class="tab-item">
                <van-dropdown-menu>
                    <van-dropdown-item :title="query.goods_brand==''?'品牌':query.goods_brand" ref="item">
                        <div class="brand" @click="onConfirm(item)" v-for="(item,index) in goodsBrand">
                            {{item.goods_brand}}
                        </div>
                    </van-dropdown-item>
                </van-dropdown-menu>
            </div>
        </div>
        <van-list finished-text="没有更多了" v-model="loading" :finished="finished" @load="onLoad" offset="10">
            <div class="product">
                <div class="product-item" v-for="(item,index) in goodsList" :key="index">
                    <router-link :to="{path:'/product/'+item.goods_id}">
                    <van-image :src="item.goods_images" style="width: 100%;height:120px;"  />
                </router-link>
                    <div class="goods_des">
                        <div class="goods-name">
                            {{item.goods_name}}
                        </div>
                        <div class="goods-price">
                            <div class="sku_original_price" v-if="item.is_show_discount_price == true">
                                {{item.sku_original_price|fenToyuan('C$')}}
                            </div>
                            <div class="sku_retail_price">
                                {{item.sku_retail_price|fenToyuan('C$')}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>
<script>
import { queryGoodsByCategory, queryGoodsByCategoryBrand } from "@/api/goods";
import { isDiscount } from "@/utils/index"
export default {

    data() {
        return {
            price_order:0,
            query: {
                'page_index': 0,
                'page_size': 10,
                'goods_type_ids': 0,
                'goods_brand': '',
                'is_product_place': 0,
                'order': 'desc',
                'order_by_name': 'default'
            },
            goodsList: [],
            goodsBrand: [],
            loading: false,
            finished: false,
           
        };
    },
    methods: {
        onLoad() {
            console.log('onLoad');
            this.query.page_index = this.query.page_index + 1;
            this.query.goods_type_ids = this.$route.query.goods_type_ids;
            this.queryGoodsByCategory(this.query);
        },
        reset(){
             this.query.page_index = 1;
             this.query.page_size = 10; 
          
        },
        onConfirm(item) {
            this.query.goods_brand = item.goods_brand;
            this.query.is_product_place = item.is_product_place == undefined ? 0:1 ;
            this.goodsList = [];
            this.queryGoodsByCategory(this.query);

            this.$refs.item.toggle();
        },
        queryGoodsByCategory(query) {
            queryGoodsByCategory(query).then(res => {
                if (res.data.status.code == 0) {
                    var goodsListInfo = res.data.datalist;
                    goodsListInfo.map(item => {
                        item.sku_original_price = item.sku_original_price;
                        item.sku_retail_price = item.min_price;
                        item.is_show_discount_price = isDiscount(item.is_discount, item.discount_start_time, item.discount_end_time)
                    })
                    this.goodsList = this.goodsList.concat(goodsListInfo);

                }
                this.loading = false;
                if (res.data.page.hasmore == false) {
                    this.finished = true;
                }
            })
        },
        queryGoodsByCategoryBrand(goods_type_ids) {
            queryGoodsByCategoryBrand(goods_type_ids).then(res => {
                this.goodsBrand = res.data.datalist;
            })
        },
        getGoodsListBycategory(type) {
              this.reset();
              this.goodsList = [];
            switch (type) {
                case 'default':
                    this.query.order_by_name = type;
                    break;
                case 'goods_id':
                    this.query.order_by_name = type;
                    break;
                case 'sale_num':
                    this.query.order_by_name = type;
                    break;
                case 'min_price':
                    this.query.order_by_name = type;
                    this.price_order = this.price_order == 1 ? 2 : 1;
                    break;
                default:
                  break;    
            }
            if(type=='min_price'){
                this.query.order = this.price_order == 1 ? 'desc' : 'asc';
            }else{
               this.query.order = 'desc'; 
               this.price_order = 0;
            }
            this.queryGoodsByCategory(this.query);
        }

    },
    created() {
        this.query.goods_type_ids = this.$route.query.goods_type_ids;
        this.queryGoodsByCategoryBrand(this.query.goods_type_ids);
        this.onLoad();
    }

};
</script>
<style scoped="scoped">
.red{
    color: red;
}
.brand {
    float: left;
    width: 50%;
}

.tab {
    background: #fff;
    font-size: 15px;
    font-weight: bold;
    display: flex;
}

.tab-item {
    text-align: center;
    height: 48px;
    line-height: 48px;
    flex: 0 0 20%;
}

.product {
    box-sizing: border-box;
    font-size: 12px;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    background: #eee;

}

.product-item {
    margin: 2px;
    background: #FFF;
    box-sizing: border-box;
    width: calc(33.3333% - 4px);
    ;
    height: 190px;
    max-height: 190px;

    text-align: center;
}

.goods-name {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    height: 34px;
}

.goods-price {
    margin-top: 2px;
    margin-left: 5px;
    display: flex;
    justify-content: space-between;
}

.goods-price .sku_original_price {
    color: gray;
    text-decoration: line-through;
    margin-left: 5px;
}

.goods-price .sku_retail_price {
    color: red;
    margin-right: 5px;
}
</style>