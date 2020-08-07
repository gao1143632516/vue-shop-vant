import request from "../config/request";
import {baseUrl,dataSources,merchant_id} from '../config/env';
import qs from 'qs'
import storage from '@/utils/storage.js';


export function getProvinces(country_id = 1) {

    return request({
      url: '/api/area/getProvinces?sessionkey='+storage.get("userInfo").sessionkey,
      method: 'get',
      params:{
        country_id:country_id
      }
    })
  }

  export function getCities(province_id){
    return request({
      url: '/api/area/getCities?sessionkey='+storage.get("userInfo").sessionkey,
      method: 'get',
      params:{
        province_id:province_id
      }
    })
  }
