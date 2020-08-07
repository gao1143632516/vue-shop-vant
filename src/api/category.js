import request from "../config/request";
import {baseUrl,dataSources,merchant_id} from '../config/env';
export function getGoodsCategoryBymcro() {
    return request({
      url: '/api/goods/getGoodsCategoryBymcro?merchant_id='+merchant_id,
      method: 'get',
      params:{
        
      }
    })
  }