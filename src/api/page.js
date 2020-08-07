import request from "../config/request";
import {baseUrl,dataSources,merchant_id} from '../config/env';

export function GetPage() {
    return request({
      url: '/api/goods/getIndexData?merchant_id='+merchant_id,
      method: 'get',
    })
  }
  export function GetDiscountInfo() {
    return request({
      url: '/api/goods/queryDiscountGoodsListByMerchant?type_id=0&merchant_id='+merchant_id,
      method: 'get',
      params:{
        page_index:1,
        page_size:10
      }
    })
  }
  export function getRecommentGoods(){
     return request({
      url: '/api/goods/queryRecommentGoodsListByMerchant?type_id=0&merchant_id='+merchant_id,
      method: 'get',
    })
  }
export function getIndexData() {
    return request({
      url: '/api/goods/getIndexData',
      method: 'get',
      params: {
       merchant_id:merchant_id ,
       goods_type_level:2
              }
    })
  }

  export function getShopInfo(){
    return request({
      url:'/api/merchant/getShopInfoByMacro?merchant_id='+merchant_id,
      method:'get',
      params:{}

    })
  }