<template>
  <div style="background: #f7f7f7; height:100%;">
    <headerNav title="订单详情" />
    <div class="status">
      <h2>{{detail.status_name}}</h2>
    </div>
    <!-- <van-steps :active="active">
            <van-step>提交订单</van-step>
            <van-step>配送中</van-step>
            <van-step>交易完成</van-step>
    </van-steps>-->
    <!-- <van-cell class="logistics" to="/user/order/logistics/1" title="您的订单已由本人签收（已在配送员处采用无纸化方式签收本订单）。感谢您在京东购物，欢迎再次光临。参加评价还能赢取京豆哟。" label="2018-08-31 21:04:03" icon="logistics" is-link /> -->
    <!-- <div style="height:15px;"></div> -->
    <van-cell-group>
      <van-cell center :border="false">
        <template>
          <div style="display: flex;justify-content: space-between;">
            <div>收件人：{{detail.delivery.receiver_name}}</div>
            <div>{{detail.delivery.receiver_phone}}</div>
          </div>
          <div>收货地址：{{detail.delivery.address}}</div>
        </template>
      </van-cell>
    </van-cell-group>
    <div style="height:15px;"></div>
    <div class="order-list-goods-item">
      <div class="goods" v-for="(goods,i) in detail.order_item" :key="goods.sku_id">
        <div class="goods-img">
          <router-link :to="{path:'/product/'+goods.goods_id}">
            <img :src="goods.sku_pics" alt style="width:100%" />
          </router-link>
        </div>
        <div class="goods-info">
          <div>{{goods.goods_name}}</div>
          <div>{{goods.spec_name}}</div>
        </div>
        <div class="goods-count">
          <div>{{goods.sku_price|fenToyuan('C$')}}</div>
          <div>x{{goods.sku_num}}</div>
        </div>
      </div>
    </div>
    <div style="height:15px;"></div>
    <van-cell-group class="total">
      <van-cell title="商品总额" :value="detail.payment_fee|fenToyuan('C$')" />
      <van-cell title="运费" :value="detail.delivery.delivery_fee|fenToyuan('C$')" />
      <!-- <van-cell title="总金额" value="9.99" style="font-weight: 700;" /> -->
    </van-cell-group>
    <div style="height:15px;"></div>
    <van-cell-group>
      <van-cell title="订单编号" :value="detail.order_number" />
      <van-cell title="下单时间" :value="detail.create_ts" />
    </van-cell-group>

    <div class="footer" v-if="showOption">
      <div class="munu">
        <van-button
          size="small"
          v-if="detail.status_id==10"
          @click="cancelOrder(detail.order_number)"
        >取消订单</van-button>
        <van-button size="small" v-if="detail.status_id==10" type="danger">支付</van-button>
        <van-button
          size="small"
          v-if="detail.status_id>=25 && detail.status_id<40&&detail.payment_mode!=2"
          type="danger"
        >确认收货</van-button>
        <van-button
          size="small"
          v-if="detail.status_id>=20&&(detail.sku_num_sum+detail.refund_num_sum)>0"
          type="danger"
        >申请售后</van-button>
        <van-button size="small" v-if="detail.refund_num_sum!=0" type="danger">退款记录</van-button>
        <van-button
          size="small"
          v-if="(detail.status_id==40||detail.status_id==5)"
          type="danger"
          @click="deleteOrder"
        >删除</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { queryNrOrderItemDetail, cancelOrder, deleteOrder } from "@/api/order";
export default {
  data() {
    return {
      detail: { delivery: {} }
    };
  },
  methods: {
    cancelOrder(order_number) {
     
      cancelOrder(order_number).then(res => {
        if (res.data.code == 0) {
          this.$toast("取消成功");
          this.$router.back();
        }
      });
    },
    deleteOrder() {
      deleteOrder(this.detail.order_number).then(res => {
        if (res.data.code == 0) {
          this.$toast.success("删除成功");
          this.$router.back();
        }
      });
    }
  },
  created() {
    var order_number = this.$route.params.id;
    console.log(order_number);
    queryNrOrderItemDetail(order_number).then(res => {
      this.detail = res.data.data;
      // console.log(this.detail.delivery.receiver_name);
    });
  },
  computed: {
    showOption() {
      return (
        this.detail &&
        (this.detail.status_id == 10 ||
          this.detail.status_id == 40 ||
          this.detail.status_id == 5 ||
          (this.detail.status_id >= 25 && this.detail.status_id < 40))
      );
    }
  }
};
</script>
<style lang="less" scoped="scoped">
.order-list-goods-item {
  font-size: 12px;

  .goods {
    display: flex;

    .goods-img {
      padding: 5px;
      flex: 1;
    }

    .goods-info {
      padding: 2px;
      flex: 4;
    }

    .goods-count {
      padding: 5px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex: 1;
    }
  }
}

.status {
  height: 100px;
  background: #ccc999;
  line-height: 100px;
  text-align: center;
}

.logistics {
  margin-top: 15px;

  i {
    line-height: 60px;
    font-size: 20px;
  }

  .van-cell__title span {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .van-cell__label {
    color: #999;
  }
}

.total {
  .van-cell__value {
    color: red;
  }
}

.footer {
  height: 50px;
  position: fixed;
  height: 49px;
  bottom: 0;
  width: 100%;
  .munu {
    // position: fixed;
    // height: 49px;
    border-top: 1px solid #e5e5e5;
    // bottom: 0;
    background: #fff;

    line-height: 49px;
    text-align: right;

    .van-button {
      margin-right: 10px;
    }
  }
}
</style>