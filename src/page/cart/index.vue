<template>
    <div class="container">
         <headerNav title="购物车" />
  
    <div class="card" v-if="cartList.length>=1">
        <div class="cart-title">
            <div class="cart-title-left">
                <van-checkbox v-model="checkedAll" @change="changeToogle">全选</van-checkbox>
            </div>
            <div class="cart-title-right" v-html="editValue" @click="editGoods">
            </div>
        </div>
        <van-checkbox-group class="card-goods" v-model="checkedGoods" ref="checkboxGroup">
            <div class="promotion-group">
                <div v-for="(item,index) in cartList" :key="index" class="card-goods__item">
                    <van-checkbox :name="item.sku_id"></van-checkbox>
                    <van-cell-group class="additional">
                        <van-card :title="item.goods_name" style="background:#fff">
                            <template slot="thumb">
                                <img :src="item.sku_banner_image" width="100%" />
                            </template>
                                <template slot="tags">
                                    <p>{{item.sku_attr}}</p>
                                    <p class="price" style="margin-top:5px;" v-if="item.sku_retail_price!=null&&item.sku_retail_price!=''">
                                        <span>{{item.sku_retail_price|fenToyuan('C$')}}</span>
                                    </p>
                                    <van-stepper v-model="item.sku_num" @change="onChange" />
                                </template>
                        </van-card>
                        <slot />
                    </van-cell-group>
                </div>
            </div>
        </van-checkbox-group>
        <div style="height:50px;"></div>
        <van-submit-bar currency='C$' v-if="editValue=='编辑商品'" :price="totalPrice" :disabled="!checkedGoods.length" :button-text="submitBarText" @submit="onSubmit">
            <template slot>
                <van-checkbox v-model="checkedAll">全选</van-checkbox>
            </template>
        </van-submit-bar>
        <van-submit-bar v-if="editValue=='完成'" button-text="删除" @submit="deleteCart">
        </van-submit-bar>
     
    </div>
     <van-empty v-else class="custom-image" image="https://img.yzcdn.cn/vant/custom-empty-image.png" description="暂无商品" />
        <navigate />
      </div>
</template>
<script>
import storage from '@/utils/storage.js';
import { fenToyuan } from "@/utils/index";
import { mapMutations } from 'vuex'
import navigate from '@/components/footer/navigate.vue'
export default {
    components: { navigate },
    data() {
        return {
            iscard: true,
            checkedAll: false,
            checkedGoods: [],
            cartList: [],
            editValue: '编辑商品',

        };
    },
    computed: {
        submitBarText() {
            const count = this.checkedGoods.length;
            return '结算' + (count ? `(${count})` : '');
        },
        totalPrice() {
            return this.cartList.reduce((total, item) => total + (this.checkedGoods.indexOf(item.sku_id) !== -1 ? parseFloat(item.sku_retail_price * item.sku_num) : 0), 0);
        },

    },
    methods: {
        ...mapMutations([
            'upCart',
            'delCart'

        ]),
        onSubmit() {
            this.$router.push({ path: '/order', query: { sku_ids: this.checkedGoods.join(","), from: 'cart' } })
        },
        changeToogle() {
            if (this.checkedAll == true) {
                this.$refs.checkboxGroup.toggleAll(true);
            } else {
                this.$refs.checkboxGroup.toggleAll();
            }

        },
        editGoods() {
            this.editValue = this.editValue == '编辑商品' ? '完成' : '编辑商品';
        },
        onChange() {
            storage.set('cart', this.cartList);
            this.upCart(this.cartList);
        },
        deleteCart() {
            var checkGoods = this.checkedGoods;
            console.log("checkGoods", checkGoods);
            var cartList = this.cartList.filter((item) => {

                return checkGoods.indexOf(item.sku_id) == -1;
            })
            storage.set('cart', cartList);
            this.delCart(cartList);
            this.cartList = cartList;
            this.checkedGoods = [];
        }
    },
    // filters:{
    //   fenToyuan(value){
    //       return  parseFloat(Number(value)/100,2);
    //   }
    // },

    created() {

        var cartList = storage.get('cart');
        if (cartList != null) {
            this.cartList = cartList;
        }
    }
};
</script>
<style lang="less" scoped="scoped">
.additional {
    .van-cell {
        padding: 0 15px;
        font-size: 12px;
    }

    .van-cell:not(:last-child)::after {
        border: 0;
    }

    .van-card__title {
        font-size: 14px;
    }

    .van-cell__title {
        flex: 10;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .van-tag {
        line-height: 12px;
        margin-right: 5px;
    }

    .price {
        color: #e93b3d;
        font-size: 10px;
        overflow: hidden;
        height: 18px;

        span {
            font-size: 16px;
            margin-right: 5px;
        }

        .van-tag {
            font-size: 12px;
        }
    }

    .van-stepper {
        position: absolute;
        bottom: 5px;
        right: 5px;

        &__plus {
            width: 30px;
        }

        &__minus {
            width: 30px;
        }
    }

    .image_tag {
        position: absolute;
        bottom: 0;
        width: 90px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #fff;
        text-align: center;
        background-color: rgba(0, 0, 0, .7);
    }
}

.additional::after {
    border-color: #f7f7f7;

}

.card-goods {
    font-size: 12px;

    &__item {
        position: relative;

        .van-checkbox {
            width: 20px;
            height: 20px;
            top: 40px;
            left: 5px;
            z-index: 1;
            position: absolute;
        }

        .additional {
            width: 100%;
            padding-left: 15px;
            box-sizing: border-box;
        }
    }
}

.head {
    padding-left: 5px;
    border-bottom: 1px solid #eee;
}

.card {
    background: #f7f7f7;

    .van-submit-bar__bar {
        border-top: 1px solid #f7f7f7;

        .van-checkbox {
            padding-left: 5px;
        }
    }

    .promotion {
        .van-tag {
            line-height: 12px;
            margin-right: 5px;
        }

        .van-cell__title {

            flex: 4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

    .promotion-group {
        margin-top: 10px;
        box-shadow: 5px 5px 5px #e5e5e5;
    }
}

.cart-title {
    background: #FFF;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
}

.cart-title .cart-title-left {
    margin-left: 5px;
}

.cart-title .cart-title-right {
    margin-right: 5px;
}

.van-submit-bar {
    bottom: 50px;
}
</style>