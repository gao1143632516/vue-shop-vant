<template>
    <div>
        <headerNav title="修改地址" />
        <van-form ref='form' @submit="submit">
            <van-field v-model="addressInfo.receiver_name" name="姓名" label="姓名" :rules="[{ required: true, message: '姓名' }]" />
            <van-field v-model="addressInfo.receiver_phone" name="电话" label="电话"  :rules="[{validator:validatorPhone, message: '请输入正确的电话' }]" />
    
            <van-field readonly clickable name="area" :value="value" label="地区选择" placeholder="点击选择省市区" @click="showArea = true" />
            <van-popup v-model="showArea" position="bottom">
                <van-area :area-list="areaList" @confirm="onConfirm" @cancel="showArea = false" @change="getCity" :columns-num="2" :columns-placeholder="['请选择']" />
            </van-popup>
            <van-field v-model="addressInfo.address" name="详细地址" label="详细地址"  :rules="[{ required: true, message: '详细地址' }]" />
            <van-field v-model="addressInfo.postalcode" name="邮政编码" label="邮政编码" placeholder="邮政编码" :rules="[{ required: true, message: '邮政编码' }]" />
            <!--   <van-field name="switch" label="设为默认">
                <template #input>
                   <van-switch v-model="addressInfo.is_default" size="20" />
                </template>
            </van-field> -->
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                    提交
                </van-button>
            </div>
            <div style="margin: 16px;" v-if="this.delivery_address_id != undefined">
                <van-button round block type="danger" @click="onDetete">
                    删除
                </van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
//import areaList from '../../../data/area';
import { getProvinces, getCities } from '@/api/area';
import { queryDeliveryAddressList, addDeliveryAddress, updateDeliveryAddress, deleteDeliveryAddress } from "@/api/user.js";

import { AddressEdit } from 'vant';
export default {
    components: {
        [AddressEdit.name]: AddressEdit,
    },
    data() {
        return {
            areaList: {},
            showArea: false,
            showDelete: false,
            value: '请选择',
            info: {},
            addressInfo: { province_id: 0, county_id: 0, address: '', receiver_name: '', receiver_phone: '', city_id: 0, is_default: false, receiver_lat: 0, receiver_lng: 0 },
            province_list: {},
            city_list: {},

        }
    },
    props: ['delivery_address_id'],


    methods: {
        validatorPhone(value){
            console.log("validator",value);
            return /\d{10,11}/.test(value);
        },
        getCity(cur, data, index) {
            if (index == 0) {
                getCities(data[index].code).then(res => {
                    this.city_list = {};
                    res.data.datalist.map(item => {
                        this.city_list[item.city_id] = item.city_name
                    })
                    console.log("this.city_list=", this.city_list);
                    // this.areaList.city_list = this.city_list;
                    this.$set(this.areaList, 'city_list', this.city_list)
                })
            }


        },
        // onSave(data) {
        //     console.log(data);
        //    var  addressInfo = this.addressInfo;
        //     addDeliveryAddress(addressInfo).then(res=>{
        //      if(res.data.code == 0){
        //           this.$toast('保存成功');
        //           this.$router.go(-1);
        //          }
        //     })

        // },
        onConfirm(values) {
            console.log(values);
            this.value = values.map((item) => item.name).join('/');
            this.addressInfo.province_id = values[0].code;
            this.addressInfo.city_id = values[1].code;
            this.showArea = false;
        },
        onDetete(data) {
            deleteDeliveryAddress(this.delivery_address_id).then(res => {
                if (res.data.code == 0) {
                    this.$toast('删除成功');
                    this.$emit('edit-finish');

                }
            })


        },
        changeArea(values) {
            console.log(values);
        },
        changeDefault(value) {
            console.log(value)
        },
        getProvinces(country_id) {
            return new Promise((resolve, reject) => {
                getProvinces(country_id).then(res => {
                    resolve(res.data.datalist);
                    res.data.datalist.map(item => {
                        this.province_list[item.province_id] = item.province_name;
                    })
                    console.log("llprovince_list", this.province_list);
                    this.areaList.province_list = this.province_list;
                }).catch(err => {
                    reject(err.data);
                })
            }).then(res => {
                console.log(res);
                // this.getCities(res[0].province_id);
            })
        },
        getCities(province_id) {
            return new Promise((resolve, reject) => {
                getCities(province_id).then(res => {
                    resolve(res.data.datalist);

                    res.data.datalist.map(item => {
                        this.city_list[item.city_id] = item.city_name
                    })
                    console.log("llcity_list", this.city_list);
                    this.areaList.city_list = this.city_list;
                }).catch(err => {
                    reject(err.data);
                })
            })

        },
        submit() {
            var addressInfo = this.addressInfo;
            if(addressInfo.city_id==0 || addressInfo.province_id==0){
                this.$toast("地址必须选择！");
                return false;
            }
            if (this.delivery_address_id !== 0) {
                updateDeliveryAddress(addressInfo).then(res => {
                    if (res.data.code == 0) {
                        this.$toast('修改成功');
                        this.$emit('edit-finish');

                    }
                })
            } else {
                addDeliveryAddress(addressInfo).then(res => {
                    if (res.data.code == 0) {
                        this.$toast('添加成功');
                        this.$emit('edit-finish');

                    }
                })
            }


        }

    },
    created: function() {
        console.log(this.delivery_address_id);
        if (0 != this.delivery_address_id) {
            queryDeliveryAddressList().then(res => {
                var deliveryList = res.data.datalist;
                var addressInfo = deliveryList.find(item => item.delivery_address_id == this.delivery_address_id);
                this.addressInfo = addressInfo;
                this.value = addressInfo.province_name + "/" + this.addressInfo.city_name

                // Promise.all([ this.getProvinces(2), this.getCities(102)]).then(res=>{
                //    var province_list_arr = res[0];
                //    var city_list_arr = res[1];

                //       province_list_arr.map(item=>{
                //          this.province_list[item.province_id] = item.province_name;
                //    })
                //     city_list_arr.map(item=>{
                //          this.city_list[item.city_id] = item.city_name
                //       })

                //    this.areaList.province_list = this.province_list;
                //     this.areaList.city_list = this.city_list;

                // })



            })

        }
        this.getProvinces(2);


    }

}
</script>
<style>
.van-picker__toolbar {
    font-size: 16px;
}
</style>