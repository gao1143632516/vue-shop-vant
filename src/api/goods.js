import request from "../config/request";
import {baseUrl,dataSources,merchant_id} from '../config/env';

export function getGoodsById(goods_id) {
    return request({
      url: '/api/goods/getGoodsById',
      method: 'get',
      params:{
         goods_id:goods_id		
      }
    })
  }
export function queryGoodsByCategory(query){
	return request({
		url:'api/goods/queryGoodsByCategory',
		method:'get',
		params:{
			page_index:query.page_index,
			page_size:query.page_size,
			merchant_id:merchant_id,
			goods_type_ids:query.goods_type_ids,
			goods_brand:query.goods_brand,
			is_product_place:query.is_product_place,
			order_by_name:query.order_by_name,
			order:query.order,
			charset:'utf-8',
		}
	})
}  
export function queryGoodsByCategoryBrand(goods_type_ids) {
	return request({
		url:'api/goods/queryGoodsByCategoryBrand',
		method:'get',
		params:{
			merchant_id:merchant_id,
			goods_type_ids:goods_type_ids,
		}
	})
	
}

export function queryGoodsByMerchantId(query){
		return request({
		url:'api/goods/queryGoodsByMerchantId',
		method:'get',
		params:{
			merchant_id:merchant_id,
			page_index:query.page_index,
			page_size:query.page_size,
			keywords:query.keywords,
			charset:'utf-8'
		}
	})
}