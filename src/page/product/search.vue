<template>
    <div class="container">
        <headerNav title="搜索" />
        <van-search v-model="query.keywords" show-action placeholder="请输入搜索关键词" @search="onSearch">
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
        </van-search>
        <div class="search-history">
            <div class="search-history-title">
                <div class="search-history-title-1">搜索历史</div>
                <div class="search-history-title-2" @click="deleteAllKeywords">
                    <van-icon size='16' name="delete" />
                </div>
            </div>
            <div class="serch-history-list" >
                <div class="serch-history-list-item" v-for="(item,index) in keywordsList" :key="index">
                    <van-tag round color="#969799" @click="onSearch(item)" closeable type="success" @close="deleteKeyward(index)">
                        {{item}}
                    </van-tag>
                </div>
            </div>
        </div>
        <van-list finished-text="没有更多了" :immediate-check="false" v-model="loading" :finished="finished" @load="onLoad" :offset ="0" >
            <div class="product">
                <div class="product-item" v-for="(item,index) in goodsList" :key="index">
                    <router-link :to="{path:'/product/'+item.goods_id}">
                        <van-image :src="item.goods_images" style="width: 100%;height:120px;" />
                    </router-link>
                    <div class="goods_des">
                        <div class="goods-name">
                            {{item.goods_name}}
                        </div>
                        <div class="goods-price">
                            <div class="sku_original_price" v-if="item.is_show_discount_price == true">
                                C${{item.sku_original_price}}
                            </div>
                            <div class="sku_retail_price">
                                C${{item.sku_retail_price}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>
<script>
import { queryGoodsByCategory, queryGoodsByCategoryBrand, queryGoodsByMerchantId } from "@/api/goods";
import { fenToyuan, isDiscount } from "@/utils/index"
import storage from '@/utils/storage.js';
export default {

    data() {
        return {
            keyword: '',
            keywordsList: [],
            price_order: 0,
            query: {
                'page_index': 0,
                'page_size': 10,
                'keywords': '',
            },
            goodsList: [],
            goodsBrand: [],
            loading: false,
            finished: false,

        };
    },
    methods: {
        onLoad() {
            this.query.page_index++;
            queryGoodsByMerchantId(this.query).then(res => {
                if (res.data.code == 0) {
                    var goodslist = res.data.datalist;
                    goodslist.map(item => {
                        item.sku_original_price = fenToyuan(item.sku_original_price);
                        item.sku_retail_price = fenToyuan(item.min_price);
                        item.is_show_discount_price = isDiscount(item.is_discount, item.discount_start_time, item.discount_end_time)
                    })
                    this.goodsList = this.goodsList.concat(goodslist);
                    this.loading = false;
                    if (res.data.page.hasmore == false) {
                        this.finished = true;
                    }
                    if (this.query.keywords.trim().length != 0) {
                        var value = this.keywordsList.find(value => value == this.query.keywords);
                        if (undefined == value) {
                            this.keywordsList.push(this.query.keywords);
                            storage.set("keywords", this.keywordsList);
                        }
                    }


                }


            })
        },
        onSearch(keyword='') {
            keyword=='' ? "" : this.query.keywords = keyword;
            this.onLoad()
            this.goodsList = [];
            //this.loading = false;

        },
        deleteKeyward(index) {
            this.keywordsList.splice(index, 1);
            storage.set("keywords", this.keywordsList);
        },
        deleteAllKeywords() {
            this.keywordsList = [];
            storage.set("keywords", this.keywordsList);
        }

    },
    created() {
        var keywordsList = storage.get("keywords");
        if (keywordsList != null) {
            this.keywordsList = keywordsList;
        } else {
            storage.set("keywords", []);
        }

    }

};
</script>
<style scoped="scoped">
.search-history-title {
    margin-left: 5px;
    display: flex;
    align-items: center;
    height: 20px;
    font-size: 14px;
}

.search-history-title .search-history-title-1 {
    margin-right: 10px;
}

.search-history-title .search-history-title-2 {
    display: flex;
    align-items: center;

}

.serch-history-list {
    display: flex;
    flex-wrap: wrap;
    margin: 10px;

}

.serch-history-list-item {
    margin: 3px 0 0 3px;

    /*flex:0 0 25%;*/
}

.red {
    color: red;
}

.brand {
    float: left;
    width: 50%;
}

.tab {

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