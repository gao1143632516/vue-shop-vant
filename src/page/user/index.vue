<template>
    <div style="height:100%">
        <headerNav title="个人中心" />
        <div class="user-profile">
            <div class="user-profile-avatar">
                <!-- <a  href="/#/user/info"> -->
                <img :src="userInfo.head_img" alt="用户头像">
                <!--  </a> -->
            </div>
            <div class="user-profile-username">
                <!--  <a href="/#/user/info"> -->
                <span class="m-nick">{{userInfo.nickname}}</span>
                <!-- </a>  -->
            </div>
        </div>
 
        <van-cell-group class="user-group">
            <van-cell title="我的订单" value="查看全部订单" is-link to="/user/order/0" />
            <van-row class="user-links">
                <router-link to="/user-order/10">
                    <van-col span="6">
                        <van-icon name="pending-payment" :badge="orderInfo.wait">
                        </van-icon>
                        <div>待付款</div>
                    </van-col>
                </router-link>
                <router-link to="/user-order/20">
                    <van-col span="6">
                        <van-icon name="logistics" :badge="orderInfo.success">
                        </van-icon>
                        <div>待发货</div>
                    </van-col>
                </router-link>
                <router-link to="/user-order/30">
                    <van-col span="6">
                        <van-icon name="logistics" :badge="orderInfo.transit">
                        </van-icon>
                        <div>待收货</div>
                    </van-col>
                </router-link>
                <router-link to="/user-order/40">
                    <van-col span="6">
                        <van-icon name="point-gift">
                        </van-icon>
                        <div>已完成</div>
                    </van-col>
                </router-link>
                <router-link to="/user-refundorder">
                    <van-col span="6">
                        <van-icon name="after-sale">
                        </van-icon>
                        <div>售后/退款</div>
                    </van-col>
                </router-link>
            </van-row>
        </van-cell-group>
        <van-cell-group class="user-group">
            <van-cell title="我的服务" />
            <van-row class="user-links">
                <router-link to="/user-address">
                    <van-col span="6">
                        <van-icon name="location" />
                        <div>收货地址</div>
                    </van-col>
                </router-link>
            </van-row>
        </van-cell-group>
        <!--     <van-cell-group>
      <van-cell title="切换账号" is-link to="/login" />
    </van-cell-group> -->
        <navigate />
    </div>
</template>
<script>
import { getUserInfo, getUserAuthorized, getUserAuthorizedUrl, getOrderCategory } from '@/api/user'
import storage from '@/utils/storage.js';

export default {
    data() {
        return {
           
                userInfo: { head_img: '', nickname: '' },
                orderInfo: {}
            
        }
    },
    components: {},
    created: function() {
        // GetUserIndex().then(response=>{
        //     this.data=response;
        // });
        var info = storage.get("userInfo");
        if (info != null) {
            this.userInfo = info;
        } else { //授权登录
            // getUserAuthorizedUrl(this.$route.fullPath);
        }

        getOrderCategory().then(res => {
          console.log(res);
            if (res.data.code == 0) {

                this.orderInfo = res.data.data;
                for( var o in this.orderInfo  ){
                  this.orderInfo[o] = this.orderInfo[o]==0 ? '' : this.orderInfo[o];
                }
                console.log(this.orderInfo);

            }
        })

    },
};
</script>
<style lang="less">
.user {
    &-profile {
        text-align: center;
        display: block;
        width: 100%;
        height: 141px;
        background-color: #f1f5fa;
        background-repeat: no-repeat;
        background-size: 100% 100%;

        img {
            width: 100%;
        }

        &-avatar {
            padding-top: 23px;
            padding-bottom: 5px;

            img {

                width: 65px;
                height: 65px;
                border-radius: 50%;
                overflow: hidden;
            }
        }

        &-username {
            font-size: 20px;
        }
    }

    &-group {
        margin-bottom: .3rem;

        .van-cell__value {
            color: #999;
            font-size: 12px;
        }
    }

    &-links {
        padding: 15px 0;
        font-size: 12px;
        text-align: center;
        background-color: #fff;

        .van-icon {
            position: relative;
            width: 24px;
            font-size: 24px;
        }
    }
}
</style>