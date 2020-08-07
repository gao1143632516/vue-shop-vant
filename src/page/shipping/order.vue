<template>
    <div class="order">
        <headerNav title="确认订单" />
        <!-- <van-loading color="#1989fa" v-show="loading" class="loading" /> -->
        <van-cell center :border="false" class="contact-card" is-link :to="'/user/address?delivery_address_id='+addressInfo.delivery_address_id+'&from='+from+'&sku_ids='+sku_ids" v-show="islogistics">
            <template v-if="type === 'add'">
                <strong>选择地址</strong>
            </template>
            <template v-else>
                <strong>{{addressInfo.receiver_name}}{{addressInfo.receiver_phone}}</strong>
                <div>{{addressInfo.address}} </div>
            </template>
        </van-cell>
        <div style="height:15px;"></div>
        <!-- 商品展示区 -->
        <div class="sku-goods-list">
            <van-card v-for="(item,index) in skuGoodsList" :num="item.sku_num" :price="item.sku_retail_price|fenToyuan" :desc="item.sku_attr" :title="item.goods_name" :thumb="item.sku_banner_image">
            </van-card>
        </div>
        <div style="height:15px;"></div>
        <van-cell-group class="total">
            <van-cell>
                <template #title>
                    <div class="deliver">
                        <div class="custom-title">配送方式</div>
                        <van-radio-group v-model="third_delivery_type_id" direction="horizontal" @change="getDeliverInfo">
                            <van-radio v-for="(item,index)  in deliverTypeList" :key="item.third_delivery_type_id" :name="item.third_delivery_type_id">{{item.third_delivery_type_alias}}
                            </van-radio>
                        </van-radio-group>
                    </div>
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group>
            <van-cell title="支付方式" value="支付宝" />
        </van-cell-group>
        <div style="height:15px;"></div>
        <van-cell-group v-show="!islogistics">
            <van-cell>
                <template #title>
                    <div class="deliver">
                        <div class="custom-title">自提地点</div>
                        {{shopInfo.address}}
                    </div>
                </template>
            </van-cell>
            <van-cell>
                <template #title>
                    <div class="deliver">
                        <div style="width: 70px;line-height: 44px;">联系方式</div>
                        <div style="display: flex;">
                            <van-field v-model="receiver_name" placeholder='取货人姓名' />
                            <van-field v-model="receiver_phone" type="digit" maxlength=10 placeholder='取货人电话' />
                        </div>
                    </div>
                </template>
            </van-cell>
        </van-cell-group>
        <div style="height:15px;"></div>
        <van-cell-group class="total">
            <van-cell title="商品总额" :value="prepareOrderInfo.total_price|fenToyuan('C$')" />
            <van-cell v-show="islogistics" title="配送服务" :value="prepareOrderInfo.fright|fenToyuan('C$')" />
        </van-cell-group>
        <div style="height:15px;"></div>
        <van-cell-group>
            <van-field label="备注" type="textarea" v-model="order_description" placeholder="请输入留言" rows="2" autosize />
        </van-cell-group>
        <div style="height:50px;"></div>
        <van-submit-bar :price="prepareOrderInfo.total_price" currency='C$' :loading="loading" button-text="提交订单" label='实付金额：' @submit="onSubmit" />
    </div>
</template>
<script>
import storage from '@/utils/storage.js';
import { bus } from '@/utils/empty.js'
import { queryDeliveryAddressList } from "@/api/user.js";
import { getAvailableDeliveryType, prepareOrder, createOrder ,wapRequest} from "@/api/order";
import { getShopInfo } from "@/api/page";
import { baseUrl} from '@/config/env';
export default {
    data() {
        return {
            sku_ids: '',
            from: 'cart',
            cartList: [],
            skuGoodsList: [],
            addressInfo: { delivery_address_id: 0 },
            type: "add1",
            chosenAddressId: 0,
            deliverTypeList: [],
            third_delivery_type_id: 0,
            checkDeliverInfo: {},
            third_delivery_type_id: 0,
            flag1: false,
            flag2: false,
            prepareOrderInfo: {},
            order_description: '',
            shopInfo: {},
            receiver_name: '',
            receiver_phone: '',
            loading: false,
            wap_url:''

        };
    },
    computed: {
        islogistics() { //是否是送送货上门
            return this.third_delivery_type_id == 3
        },
        warUrl(){
            
            return baseUrl+'/success';
           // return 'http%3a%2f%2f192.168.19.52%3a8888%2f%23%2fsuccess';
        }
    },
    created() {
    
        var cartList = storage.get('cart');
        this.sku_ids = this.$route.query.sku_ids;
        this.from = this.$route.query.from;
        this.chosenAddressId = this.$route.query.chosenAddressId == undefined ? 0 : this.$route.query.chosenAddressId;

        //  console.log(sku_ids_arr);
        if (this.from == 'cart') {
            var sku_ids_arr = this.sku_ids.split(",");
            if (cartList != null) {
                this.cartList = cartList;
                this.skuGoodsList = this.cartList.filter(item => sku_ids_arr.indexOf(item.sku_id + '') != -1);
            }
        } else if (this.from == 'buy') {
            var buyList = storage.get('buy');
            this.skuGoodsList.push(buyList);

        }

        this.queryDeliveryAddressList(this.chosenAddressId);

        this.getAvailableDeliveryType();

        getShopInfo().then(res => {
            if (res.data.code == 0) {
                this.shopInfo = res.data.data;
            }

        })



    },
    methods: {
        onSubmit() {
            if (!this.flag2 || !this.flag1) {
                return false;
            }
            var delivery_address_id = this.addressInfo.delivery_address_id;
            var orderType = 1; //1 默认商城售卖 2 线下售卖
            var third_delivery_type_id = this.checkDeliverInfo.third_delivery_type_id;
            var delivery_type_id = this.checkDeliverInfo.delivery_type_id;
            var receiver_phone = this.receiver_phone.trim();
            var receiver_name = this.receiver_name.trim();
            var extract_time = '';
            //var delivery_timing_time = '';配送时间
            var delivery_order_number = this.prepareOrderInfo.postage_info.delivery_order_number;
            var delivery_out_order_number = this.prepareOrderInfo.postage_info.out_order_number;
            var order_description = this.order_description;

            var payment_mode = 1;//1先付款2.后付款
            var payment_type_id = 31; //支付宝支付
            var estimated_arrival_time = ""//预计送达时间;
            var seller_type_id = 5; //来源支付宝
            var sku_ids_arr = [];
            var sku_num_arr = [];
            this.skuGoodsList.map(item => {
                sku_ids_arr.push(item.sku_id);
                sku_num_arr.push(item.sku_num);
            })
            var sku_nums = sku_num_arr.join(",");
            var sku_ids = sku_ids_arr.join(",");
            let data = {};
            if (this.islogistics) { //如果是上门服务
                if (this.addressInfo.delivery_address_id == 0) {
                    this.$toast.fail("你选择地址");
                    return false;
                }



            } else { //门店自提
                if (this.receiver_phone.trim().length == 0 || this.receiver_name.trim().length == 0) {
                    this.$toast.fail("请填写联系手机和姓名！");
                    return false;
                }



            }

            data = {
                sku_ids,
                sku_nums,
                orderType,
                delivery_address_id,
                third_delivery_type_id,
                delivery_type_id,
                receiver_phone,
                receiver_name,
                extract_time,
                delivery_order_number,
                delivery_out_order_number,
                order_description,
                payment_mode,
                payment_type_id,
                estimated_arrival_time,
                seller_type_id
            }



            //console.log(data);
            this.loading = true;
            createOrder(data).then(res => {
             
                if (res.data.code == 0) { //支付宝支付
                    
              
                   // const div = document.createElement('div')
                    /* 此处form就是后台返回接收到的数据 */
                    // div.innerHTML = res.data.data.alipayInfo
                    // document.body.appendChild(div)
                    // document.forms[0].submit()
                    // console.log(res);
                    this.loading = false;
                    this.wapRequest(res.data.data.order_number);
                }

            }).catch(err => {
                this.loading = false;
            })

            //this.$toast("点击按钮");
        },
        wapRequest(order_number){
            var postdata = {order_number,'wap_url':this.warUrl}
            wapRequest(postdata).then(res=>{
                 if (res.data.code == 0) {
                   window.open(res.data.data);
                 }
            })
        },
        queryDeliveryAddressList(chosenAddressId) {

            queryDeliveryAddressList().then(res => {

                if (res.data.code == 0) {
                    this.flag1 = true;
                    var addressList = res.data.datalist;
                    if (chosenAddressId == 0) { //还没有选择 默认
                        if (addressList.length != 0) {
                            this.addressInfo = addressList.find(item => item.is_default == true);
                        } else {
                            this.type == 'add';
                        }
                    } else {
                        this.addressInfo = addressList.find(item => item.delivery_address_id == chosenAddressId);
                    }

                }
                this.prepareOrder();
            })
        },
        getAvailableDeliveryType() {
            getAvailableDeliveryType().then(res => {
                if (res.data.code == 0) {
                    this.flag2 = true;
                    this.deliverTypeList = res.data.datalist;
                    this.checkDeliverInfo.third_delivery_type_id = this.deliverTypeList[0].third_delivery_type_id;
                    this.checkDeliverInfo.delivery_type_id = this.deliverTypeList[0].delivery_type_id;
                    this.third_delivery_type_id = this.deliverTypeList[0].third_delivery_type_id;
                    this.prepareOrder();
                }
            })
        },
        getDeliverInfo(third_delivery_type_id) { //3 送货上门 4.门店自提

            this.checkDeliverInfo = this.deliverTypeList.find(item => item.third_delivery_type_id == third_delivery_type_id);
            this.prepareOrder();
            //this.checkDeliverInfo = item;
            //this.$set(this.checkDeliverInfo,'third_delivery_type_id',item.third_delivery_type_id);
            //this.$set(this.checkDeliverInfo,'delivery_type_id',item.delivery_type_id)



        },
        prepareOrder() {

            if (!this.flag2 || !this.flag1) {
                return false;
            }
            var sku_ids_arr = [];
            var sku_num_arr = [];
            this.skuGoodsList.map(item => {
                sku_ids_arr.push(item.sku_id);
                sku_num_arr.push(item.sku_num);
            })
            var sku_nums = sku_num_arr.join(",");
            var sku_ids = sku_ids_arr.join(",");
            // console.log(this.checkDeliverInfo);
            var delivery_address_id = this.addressInfo.delivery_address_id;
            var third_delivery_type_id = this.checkDeliverInfo.third_delivery_type_id;
            var delivery_type_id = this.checkDeliverInfo.delivery_type_id;
            var merchant_id = 4;
            var delivery_order_number = '';
            var delivery_out_order_number = '';
            var data = { sku_ids, sku_nums, delivery_address_id, delivery_type_id, third_delivery_type_id, merchant_id, delivery_order_number, delivery_out_order_number }
            const toast = this.$toast.loading({
                duration: 0, // 持续展示 toast
                message: '加载中...',
                forbidClick: true,
                loadingType: 'spinner',
            });
            prepareOrder(data).then(res => {
                if (res.data.code == 0) {

                    this.prepareOrderInfo = res.data.data;
                    toast.clear();
                }
            }).catch(err => {
                console.log(err);
                //toast.clear();
            })
        }
    }



};
</script>
<style lang="less">
.loading {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 121;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
}

.deliver {
    display: flex;

}

.custom-title {
    margin-right: 10px;
}

.order {
    font-size: 14px;
    background: #f7f7f7;

    .contact-card::before {
        content: "";
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        position: absolute;
        background: -webkit-repeating-linear-gradient(135deg,
            #ff6c6c 0,
            #ff6c6c 20%,
            transparent 0,
            transparent 25%,
            #3283fa 0,
            #3283fa 45%,
            transparent 0,
            transparent 50%);
        background: repeating-linear-gradient(-45deg,
            #ff6c6c 0,
            #ff6c6c 20%,
            transparent 0,
            transparent 25%,
            #3283fa 0,
            #3283fa 45%,
            transparent 0,
            transparent 50%);
        background-size: 80px;
    }

    .total {
        .van-cell__value {
            color: red;
        }
    }

    .van-submit-bar__bar {
        border-top: 1px solid #f7f7f7;
    }

    .additional {
        .van-cell {
            padding: 0 15px;
            font-size: 12px;
        }

        .van-cell__title {
            flex: 11;
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

            span {
                font-size: 16px;
            }
        }
    }
}
</style>