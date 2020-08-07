import request from "../config/request";
import { baseUrl, dataSources, merchant_id, app_id ,third_account_type_id} from '../config/env';
import qs from 'qs'
import storage from '@/utils/storage.js';
var sessionkey = storage.get("userInfo")==null ? '' : storage.get("userInfo").sessionkey
export function queryDeliveryAddressList() {
   
    return request({
        url: '/api/nr_delivery/queryDeliveryAddressList',
        method: 'get',
        params: { sessionkey:storage.get("userInfo").sessionkey }
    })
}
export function addDeliveryAddress(params) {
    return request({
        url: "/api/nr_delivery/addDeliveryAddress?sessionkey="+storage.get("userInfo").sessionkey,
        method: 'post',
        data: qs.stringify(params)
    })
}
export function updateDeliveryAddress(params) {
    return request({
        url: "/api/nr_delivery/updateDeliveryAddress?sessionkey="+storage.get("userInfo").sessionkey,
        method: 'post',
        data: qs.stringify(params)
    })
}
export function deleteDeliveryAddress(delivery_address_id) {
    return request({
        url: '/api/nr_delivery/deleteDeliveryAddress?sessionkey='+storage.get("userInfo").sessionkey,
        method: 'get',
        params: {
            delivery_address_id
        }
    })
}
export function setDefaultDeliveryAddress(delivery_address_id) {
    return request({
        url: '/api/nr_delivery/setDefaultDeliveryAddress?sessionkey='+storage.get("userInfo").sessionkey,
        method: 'get',
        params: {
            delivery_address_id
        }
    })
}
export function getUserAuthorized() {
     return new Promise(function(resolve,reject){
         ap.getAuthCode({
                appId: `${app_id}`,
                scopes: ['auth_user'],
            }, function(res,error,errorDesc) {
               
                ap.alert(JSON.stringify(res));
                 ap.alert(11);
                ap.alert(res.authCode)
                 ap.alert(22)
                resolve(res.authCode);        
            
            })
     })
      

}
export function getUserAuthorizedUrl(form_url){

     // var url = encodeURIComponent("http://192.168.19.52:8888/#/auth");
     var url = encodeURIComponent(process.env.NODE_ENV === 'production' ? baseUrl+'/h5/shop/auth':baseUrl+'/auth');
   //  console.log('url',url);
   //  console.log('form_url',form_url)
      // var form_url = encodeURIComponent("http://192.168.19.52:8888/#/home");
      var redirect_uri =  `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${app_id}&scope=auth_user&redirect_uri=${url}&state=${form_url}`;
      window.location.href = redirect_uri;
}
export function getUserInfo(code){
    return request({
      url:"/api/promoter/loginByThirdAccount3",
      method:'get',
      params:{
        third_token:code,
        account_type_id:third_account_type_id
      }
    })
}

export function getOrderCategory(){
  return request({
    url:'/api/nrOrder/getOrderCategory?sessionkey='+storage.get("userInfo").sessionkey,
    method:'get'
  })
}