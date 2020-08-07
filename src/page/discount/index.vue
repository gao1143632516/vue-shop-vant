<template>
    <div class="product-list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div class="goods-container">
            	
                <div class="goods-item" v-for="(item,index) in discountGoodsList" :key="index" @click="toGoodsDetail(item.goods_id)">
                    <div class="goods-left">
                        <img style="width:100%;margin:4px" :src="item.goods_images" alt="">
            		</div>
                        <div class="goods-right">
                            <div class="goods-title">
                                {{item.goods_name}}
                            </div>
                            <div class="goods-desc">
                                <div class="price red">{{item.sku_retail_price|fenToyuan('C$')}}</div>
                                <div class="discount-price delete-line" >
                                   原价:{{item.sku_original_price|fenToyuan('C$')}}
                                </div>
                                <div class="time" style="font-size:10px;margin: 2px;">
                                   截止时间:{{item.discount_end_time}}
                                </div>
                            </div>
                        </div>
                    </div>
               
                </div>
        </van-list>
    </div>
</template>
<script>

import { GetDiscountInfo } from "@/api/page";
import {  isDiscount } from "@/utils/index"
export default {

    data() {
        return {
            discountGoodsList: [],
            loading: false,
            finished: false,
        };
    },
    methods: {
        onLoad() {
            GetDiscountInfo().then(res => {
                // res.data.datalist.map(item => {
                //     item.sku_original_price = fenToyuan(item.sku_original_price);
                //     item.sku_retail_price = fenToyuan(item.sku_retail_price);
                // })
                this.discountGoodsList = res.data.datalist;
                this.loading = false;
                if (res.data.page.hasmore == false) {
                    this.finished = true;
                }
            })

        },
        toGoodsDetail(goods_id){
        	this.$router.push({path: '/product/'+goods_id});
        }


    },
    created() {

    }
};
</script>
<style scoped="scoped">
.product-list {
    font-size: 12px;
    height: 100vh;
    background: #eee;
}

.goods-container {
    display: flex;
    flex-wrap: wrap;
}

.goods-item {
    background: #fff;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 5px;


}

.goods-left {
    flex: 1.5
}

.goods-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 3;
    margin-left: 8px;
}

.goods-title {}
</style>