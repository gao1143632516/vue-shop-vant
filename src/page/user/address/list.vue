<template>
    <div class="container">
        <headerNav title="我的地址" />
        <div class="address-list" style=" background:#eee;">
            <div class="address-item" v-for="(item,index) in list"  @click.stop="onSelect(item)">
                <div class="title1">
                    <div class="title1-1">
                        {{item.receiver_name}} {{item.receiver_phone}}
                    </div>
                    <div class="title1-2">
                        <span style="margin:2px;" @click.stop="ondit(item.delivery_address_id)">编辑</span>
                    </div>
                </div>
                <div class="title2">
                    {{item.province_name}} {{item.city_name}} {{item.address}}
                </div>
                <div class="title3" @click.stop="setDefaultAddress(item.delivery_address_id)">
                    <div class="title3-1">
                        <van-icon size='18px' :name="item.is_default? 'passed':'circle'" color="#07c160" />
                    </div>
                    <div class="title3-2">设为默认</div>
                </div>
            </div>
        </div>
        <van-popup v-model="show_edit_address"  closeable position="bottom" :style="{ height: '100%' }">
            <edit v-if="show_edit_address" :delivery_address_id="delivery_address_id" v-on:edit-finish="editFinish" />    
        </van-popup>
         <van-button class="add-button" type="primary" @click="onAdd" block>添加</van-button>
    </div>

</template>
<script>
import { queryDeliveryAddressList, setDefaultDeliveryAddress } from "@/api/user.js";
import Vue from 'vue';
import { Dialog } from 'vant';
import { bus } from '@/utils/empty.js'
import edit from './edit.vue';

export default {
    components: {
        [Dialog.Component.name]: Dialog.Component,
        edit
    

    },

    data() {
        return {
            value: '',
            show_edit_address: false,
            chosenAddressId: 0,
            isSelect: false,
            list: [],
            delivery_address_id:0,
            tempForm: {}
        }
    },

    methods: {
        onAdd() {
             this.delivery_address_id =0;
             this.show_edit_address = true;
            // this.$router.push('/user/address/edit')
        },
        onInput(check) {
            console.log(item);
            console.log(check);
        },

        ondit(delivery_address_id) {
            // this.tempForm = { ...item };
            this.delivery_address_id = delivery_address_id;
            this.show_edit_address = true;
          //  this.$router.push('/user/address/edit?id=' + item.id);
        },
        setDefaultAddress(delivery_address_id) {
            setDefaultDeliveryAddress(delivery_address_id).then(res => {
                if (res.data.code == 0) {
                    this.$toast("设置成功");
                    this.getData();
                }
            })
        },
        chooseAddress(item) {

        },
        editFinish(){
            console.log("editFinish")
            this.getData();
            this.show_edit_address = false;
        },
        getData() {
            queryDeliveryAddressList().then(response => {
                this.list = response.data.datalist;
                // this.list.map(item => {
                //     item.id = item.delivery_address_id
                //     item.name = item.receiver_name
                //     item.tel = item.receiver_phone
                //     item.address = item.address
                //     item.isDefault = item.is_default

                //     })
            })
        },


        onSelect(item, index) {
            if(this.$route.query.from == undefined){
                return false;
            }
            this.chosenAddressId = item.delivery_address_id;
            var query = this.$route.query;
            query['chosenAddressId'] = this.chosenAddressId;
          
            this.$router.push({path:'/order',query:query});
           
        }
    },

    created: function() {

         this.chosenAddressId = this.$route.query.delivery_address_id;
        // this.isSelect = this.$route.query.delivery_address_id > 0;
        this.getData();

    }

}
</script>
<style lang="less" scoped="scoped">
.container{
    height: 100%;
}
.hideselect {
    .van-radio__input {
        display: none;
    }
}

.title1 {
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    margin-bottom: 8px;

}

.address-list {
    display: flex;
    flex-direction: column;
}

.address-item {
    background: #FFF;
    display: flex;
    flex-direction: column;
    margin: 5px;
    padding: 2px;
}

.title2 {
    margin-top: 2px;
    margin-bottom: 2px;
    border-bottom: 1px #eee solid;
}

.title3 {
    height: 30px;
    font-size: 14px;
    display: flex;
    line-height: 30px;
    align-items: center;
    width:80px;
}

.title3-1 {
    display: flex;
    align-items: center;
}

.title1-2 {
    font-size: 14px;

}
.add-button{

    position:fixed;
    bottom:10px;
}

</style>