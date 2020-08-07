<template>
    <van-cell-group class="additional">
        <van-card
        :title="product.goods_name"
        :num="(iscard?null:product.sku_num)"
        style="background:#fff"
        >
            <template slot="thumb">
                <img :src="product.sku_banner_image" width="100%" />
                <p v-if="product.imageTag!=null&&product.imageTag!=''" class="image_tag">{{product.imageTag}}</p>
            </template>
            <template slot="tags">
                <p class="price" v-if="product.sku_retail_price!=null&&product.sku_retail_price!=''" >
                    ￥<span>{{product.sku_retail_price}}</span>
                    <van-tag v-if="product.tags!=null" v-for="tag in product.tags" :key="tag" plain type="danger">{{tag}}</van-tag>
                </p>
                <van-stepper v-if="iscard" v-model="product.sku_num" :max="product.max"  :min="product.min" />
            </template>
        </van-card>

        <slot />
    </van-cell-group>
</template>

<script>
export default {
    name:'product-card',
    props:{
        product:Object,
        iscard: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<style lang="less">
.additional {
    .van-cell {
        padding: 0 15px;
        font-size: 12px;
    }
    .van-cell:not(:last-child)::after{
        border:0;
    }
    .van-card__title{
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
      .van-tag{
        font-size: 12px;
      }
    }
    .van-stepper{
        position: absolute;
        bottom: 5px;
        right: 5px;
        &__plus{
            width: 30px;
        }
        &__minus{
            width: 30px;
        }
    }
    .image_tag{
        position: absolute;
        bottom: 0;
        width: 90px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #fff;
        text-align: center;
        background-color: rgba(0,0,0,.7);
    }
}
.additional::after{
    border-color: #f7f7f7;

}
</style>
