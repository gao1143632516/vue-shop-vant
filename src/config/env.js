/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * dataSources：数据源
 */

let baseUrl = 'http://retail.company.e9w.me'; 
let routerMode = 'hash';
let dataSources='';//local=本地，其他值代表非本地
let merchant_id = 4;
let third_account_type_id = 7001;
let app_id = 2016071701628788;


if (process.env.NODE_ENV == 'development') {
	baseUrl='http://192.168.19.52:8888';

}else if(process.env.NODE_ENV == 'production'){
	//baseUrl = 'http://xy.skywalker.19where.com';
}

export {
	baseUrl,
	routerMode,
	dataSources,
	merchant_id,
	app_id,
	third_account_type_id
}