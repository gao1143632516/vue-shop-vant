import request from "../config/request";
import { baseUrl, dataSources, merchant_id, app_id ,third_account_type_id} from '../config/env';
import qs from 'qs'
import storage from '@/utils/storage.js';


export function getAvailableDeliveryType() {
    return request({
      url: 'api/nr_delivery/getAvailableDeliveryType',
      method: 'get',
      params:{
        merchant_id
      }
    })
  }

export function prepareOrder(query){
	return request({
		url:'api/nrOrder/prepareOrder',
		method:'post',
		data:qs.stringify(query)
	})
}  

export function createOrder(query){
  return request({
    url:'api/nrOrder/createMicroOrder?sessionkey='+storage.get("userInfo").sessionkey,
    method:'post',
    data:qs.stringify(query)
  })
}

export function queryNrOrderList(query){
  return request({
    url:'api/nrOrder/queryNrOrderList?sessionkey='+storage.get("userInfo").sessionkey,
    method:'get',
    params:{
      page_index:query.page_index,
      page_size:query.page_size, 
      status_ids:query.status_id
    }
  })
}
export function queryNrOrderItemDetail(order_number){
  return request({
    url:'api/nrOrder/queryNrOrderItemDetail?sessionkey='+storage.get("userInfo").sessionkey,
    method:'get',
    params:{
      order_number:order_number
    }
  })
}
export function deleteOrder(order_number){
  return request({
    url:'api/nrOrder/deleteOrder?sessionkey='+storage.get("userInfo").sessionkey,
    params:{
       order_number:order_number
    }
  })
}
export function cancelOrder(order_number){
  return request({
    url:"/api/nrOrder/cancelOrder?sessionkey="+storage.get("userInfo").sessionkey,
    method:'get',
    params:{
      order_number:order_number
    }
  })
}

export function wapRequest(data){
   return request({
     url:'/api/nrOrder/wapRequest?sessionkey='+storage.get("userInfo").sessionkey,
     method:'post',
     data:qs.stringify(data)
   })
}