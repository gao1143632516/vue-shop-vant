<template>
    <div>
        <headerNav :title="typeName" ref="title" />
        <van-list finished-text="没有更多了" v-model="loading" :finished="finished" offset="10" @load="onLoad()">
            <div v-for="(item,index) in orderList" :key="item.order_id">
                <div class="order-list" @click="toOrderDetail(item.order_number)">
                    <div class="order-list-header">
                        <div>订单号:{{item.order_number}}</div>
                        <div>{{item.payment_status_name}}</div>
                    </div>
                    <van-divider :style="{ color: '#1989fa', borderColor: '#999'}" />
                    <div class="order-list-goods-item">
                        <div class="goods" v-for="(goods,i) in item.order_item" :key="goods.sku_id">
                            <div class="goods-img">
                                <img :src="goods.sku_pics" alt="" style="width:100%">
                                     </div>
                                <div class="goods-info">
                                    <div>{{goods.goods_name}}</div>
                                    <div style="margin-top:15px;color:gray">{{goods.spec_name}}</div>
                                </div>
                                <div class="goods-count">
                                    <div>{{goods.sku_price|fenToyuan('C$')}}</div>
                                    <div>x{{goods.sku_num}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="total-price">
                            <div style="margin:10px 0px;">总金额:</div>
                            <div style="color: red;margin-left: 10px;">{{item.payment_fee|fenToyuan('C$')}}</div>
                        </div>
                        <van-divider :style="{ color: '#1989fa', borderColor: '#999'}" />
                        <div class="footer">
                            <div>下单时间:{{item.create_ts}}</div>
                            <van-button v-if="id ==10" plain type="info" @click.stop="toPay(item.order_number)" size="mini">付款</van-button>
                            <van-button v-else-if="id >=25 && id<40" plain type="info" @click.stop="$toast('确认收货')" size="mini">确认收货</van-button>
                            <van-button v-else-if="id==40 || id==5" size="mini" @click.stop="deleteOrder(item.order_number)" plain type="info">删除</van-button>
    
                        </div>
                    </div>
                </div>
        </van-list>
    </div>
</template>
<script>
import { queryNrOrderList, deleteOrder,wapRequest} from '@/api/order';

import { baseUrl} from '@/config/env';
export default {
    components: {},
    data() {
        return {

            query: {
                page_index: 0,
                page_size: 10,
                status_id: '',
            },
            typeName: '全部',
            finished: false,
            loading: false,
            orderList: [],


            statusIdMap: {
                '10': '待付款',
                '20': '待发货',
                '30': '待收货',
                '40': '已完成',
                '0': '全部'
            }
        }
    },
    methods: {
        onLoad() {
            this.query.page_index = this.query.page_index + 1;
            this.queryNrOrderList(this.query);
        },
        toOrderDetail(order_number) {
            this.$router.push({ path: '/user-order-info/' + order_number, })
        },
        queryNrOrderList(query) {
            queryNrOrderList(query).then(res => {
                if (res.data.status.code == 0) {
                    var orderList = res.data.datalist;
                    this.orderList = this.orderList.concat(orderList);

                }
                this.loading = false;
                if (res.data.page.hasmore == false) {
                    this.finished = true;
                }
            })
        },
        deleteOrder(order_number) {
            this.$toast(order_number);
            this.query.page_index = 1;
            this.orderList = [];
            this.queryNrOrderList(this.query);
            return false;
            deleteOrder(order_number).then(res => {
                if (res.data.code == 0) {
                    this.$toast("删除成功");

                }
            })
        },
          wapRequest(order_number){
            var postdata = {order_number,'wap_url':baseUrl+'/success'}
            wapRequest(postdata).then(res=>{
                 if (res.data.code == 0) {
                   window.open(res.data.data);
                 }
            })
        },
        toPay(order_number){
          
            this.wapRequest(order_number);
        }
    },
    props: {
        id: {
            type: String,
        }
    },
    created() {

        // queryNrOrderList().then()
        var status_id = this.id;
        //console.log(this.id);
        //console.log(this.statusIdMap[status_id]);
        this.typeName = this.statusIdMap[status_id];
        this.query.status_id = status_id;
         this.onLoad();

    }

}
</script>
<style lang="less">
.order-list {
    background-color: #FFF;
    font-size: 12px;
    padding: 3px 10px 3px 10px;
    margin: 10px 5px;

    border-radius: 12px;

    .order-list-header {
        display: flex;
        justify-content: space-between;
        height: 25px;
        align-items: center;

    }

    .van-divider {
        margin: 0px 0px;
    }

    .order-list-goods-item {

        .goods {
            display: flex;

            .goods-img {
                padding: 5px;
                flex: 1.5;
            }

            .goods-info {
                margin-top: 5px;
                padding: 2px;
                flex: 4
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

    .total-price {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .footer {
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        align-items: center;
    }
}
</style>