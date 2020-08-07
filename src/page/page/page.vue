<template>
    <div class="container">
        <!-- 首页轮播 -->
        <van-swipe :autoplay="3000" indicator-color="white">
            <van-swipe-item v-for="(image,index) in adList" :key="index">
                <a @click="toJump(image)">
                <img  v-lazy="image.ad_url+''" style="width: 100%;" />
                </a>
            </van-swipe-item>
        </van-swipe>
        <!-- 搜索 -->
        <van-search placeholder="请输入搜索关键词" @click="toSearch()" />
        <!-- 首页分类 -->
        <template>
            <van-grid :column-num="4">
                <van-grid-item v-for="(item,index) in cateList" :key="index" :icon="item.icon" :text="item.goods_type_name" @click="toProductlist(item)" />
            </van-grid>
        </template>
        <!-- 广告位一 -->
        <div class="ad-1">
            <van-image @click="toJump(item)" v-for="(item,index) in discount_ad" :src="item.ad_url" />
        </div>
        <!-- 折扣商品     -->
        <div style="margin: 10px 0;" v-if="discountGoodsList.length>0">
            <van-cell value="更多" is-link :to="{ name: 'discount' }">
                <!-- 使用 title 插槽来自定义标题 -->
                <template #title>
                   <span>折扣商品</span>
                </template>
            </van-cell>
        </div>
        <div class="discount_goods" v-if="discountGoodsList.length>0">
            <div class="goods-item" v-for="item in discountGoodsList" @click="toGoodsDetail(item)">
                <van-image :src="item.goods_images" style="width: 100%" />
                <div class="goods_des">
                    <div class="goods-name">
                        {{item.goods_name}}
                    </div>
                    <div class="goods-price">
                        <div class="sku_original_price">
                            {{item.sku_original_price|fenToyuan('C$')}}
                        </div>
                        <div class="sku_retail_price">
                            {{item.sku_retail_price|fenToyuan('C$')}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 广告位二 -->
        <div class="ad-2" style="margin:2px 0 4px 0;">
            <van-image @click="toJump(item)" v-for="(item,index) in recomment_ad" :src="item.ad_url" />
        </div>
        <div style="margin:10px 0">
            <van-cell value="推荐商品" />
        </div>
        <div class="discount_goods">
            <div class="goods-item" v-for="item in recommentGoodsList" @click="toGoodsDetail(item)">
                <van-image :src="item.goods_images" style="width: 100%" />
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
    </div>
</template>
<script>
import { getIndexData, GetDiscountInfo, getRecommentGoods } from "../../api/page.js";
 import { isDiscount } from "@/utils/index"

export default {
    name: "page",

    data: function() {
        return {
            discount_ad: [],
            recomment_ad: [],
            adList: [],
            cateList: [],
            discountGoodsList: [],
            recommentGoodsList: []

        }
    },
    created: function() {
        getIndexData().then(response => {
            console.log(response);
            this.adList = response.data.data.adList;
            this.cateList = response.data.data.cateList;
            this.discount_ad = response.data.data.discount_ad;
            this.recomment_ad = response.data.data.recomment_ad;
        });
        GetDiscountInfo().then(res => {
            // res.data.datalist.map(item => {
            //     item.sku_original_price = fenToyuan(item.sku_original_price);
            //     item.sku_retail_price = fenToyuan(item.sku_retail_price);
            // })
            this.discountGoodsList = res.data.datalist;

        })
        getRecommentGoods().then(res => {
            res.data.datalist.map(item => {
                // item.sku_original_price = fenToyuan(item.sku_original_price);
                // item.sku_retail_price = fenToyuan(item.min_price);
                item.sku_original_price = item.sku_original_price
                item.sku_retail_price = item.min_price;
                item.is_show_discount_price = isDiscount(item.is_discount, item.discount_start_time, item.discount_end_time)
            })
            this.recommentGoodsList = res.data.datalist;
        });



    },
    methods: {
        toGoodsDetail(item) {
            let goods_id = item.goods_id;
            this.$router.push({ path: '/product/' + goods_id });
        },
        toDiscountGoodsListDetail() {
            this.$router.push({ path: '/discount/' });
        },
        toJump(item) {
            var link_url_type = item.link_url_type;
            var ad_link_url_param = item.ad_link_url_param;
            if (link_url_type == 1) {
                this.$router.push({ path: '/product/' + ad_link_url_param });
            } else {
                this.$router.push({ path: '/productlist?goods_type_ids=' + ad_link_url_param });
            }
        },
        toProductlist(item) {
            var goods_type_ids = item.higher_type_id + ',' + item.goods_type_id;
            this.$router.push({ path: '/productlist?goods_type_ids=' + goods_type_ids });
        },
        toSearch() {
            this.$router.push({ path: '/search' });
        }
    }
}
</script>
<style scoped="scoped">
.container {
    font-size: 12px;
}

.discount_title {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    height: 30px;
    align-items: center;
}

.discount_title .left {
    margin: 2px;

}

.discount_title .right {
    margin: 2px;
}

.discount_goods {
    background: #eee;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-top: 2px;
    flex-wrap: wrap;


}

.discount_goods .goods-item {
    height: 190px;
    max-height: 190px;
    /*width: 33.333%;*/
    box-sizing: border-box;
    /*width: calc(33.3333% - 4px);*/
    width: calc(33.3333% - 2.666px);
    margin: 2px;
    /*padding: 2px;*/
    background: #fff;
}

.discount_goods .goods-item:nth-child(3n-1) {

    margin-left: 0px;
    margin-right: 0px;
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