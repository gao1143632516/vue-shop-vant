import Vue from 'vue';
import Router from 'vue-router';
import {getUserAuthorizedUrl} from '@/api/user'
import storage from '@/utils/storage.js';
import userAgent from '@/utils/userAgent.js'
import {Toast} from 'vant';
Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    name: 'home',
    component: () => import('../page/index'),
    meta: {
      title: '首页'
    }
  },
  {
		path: '/login',
    component: () => import('../page/account/login'),
    meta: {
      title: '登录'
    }
  },
  {
		path: '/login/password',
    component: () => import('../page/account/password'),
    meta: {
      title: '登录'
    }
  },
  {
		path: '/login/phone',
    component: () => import('../page/account/phonelogin'),
    meta: {
      title: '手机号登录'
    }
  },
  {
		path: '/login/register',
    component: () => import('../page/account/register'),
    meta: {
      title: '注册'
    }
  },
  {
		path: '/user/index',
    component: () => import('../page/user/index'),
    name: 'user',
    meta: {
      title: '会员中心'
    }
  },
  {
		path: '/user-info',
    component: () => import('../page/user/info/detail'),
    name: 'user',
    meta: {
      title: '账号管理'
    }
  },
  {
    path: '/user-address',
    component: () => import('../page/user/address/list'),
    meta: {
      title: '我的地址'
    }
  },
  {
    path: '/user-address-edit',
    component: () => import('../page/user/address/edit'),
    meta: {
      title: '修改地址'
    }
  },
  {
    path: '/user/favorite',
    component: () => import('../page/user/favorite/list'),
    meta: {
      title: '我的收藏'
    }
  },
  {
    path: '/user/coupon',
    component: () => import('../page/user/coupon/list'),
    meta: {
      title: '我的优惠券'
    }
  },
  {
    path: '/user-order',
    component: () => import('../page/user/order/list'),

    meta: {
      title: '我的订单'
    }
  },
  {
    path: '/user-order/:id',
    component: () => import('../page/user/order/list'),
    props:true,
    meta: {
      title: '我的订单'
    }
  },
  {
    path: '/user-order-info/:id',
    component: () => import('../page/user/order/info'),
    meta: {
      title: '我的订单'
    }
  },
  {
    path: '/user/order/logistics/:id',
    component: () => import('../page/user/order/logistics'),
    meta: {
      title: '订单追踪'
    }
  },
  {
    path: '/user/aftersale',
    component: () => import('../page/user/aftersale/list'),
    meta: {
      title: '售后'
    }
  },
  {
    path: '/user/aftersale/apply',
    component: () => import('../page/user/aftersale/apply'),
    meta: {
      title: '申请售后'
    }
  },
  {
    path: '/user/aftersale/detail',
    component: () => import('../page/user/aftersale/detail'),
    meta: {
      title: '服务单详情'
    }
  },
  {
    path: '/user/aftersale/track/:id',
    component: () => import('../page/user/aftersale/track'),
    meta: {
      title: '进度详情'
    }
  },
  {
    path: '/product/:id',
    component: () => import('../page/product/detail'),
    meta: {
      title: '商品详情'
    }
  },
  // {
  //   path: '/search',
  //   component: () => import('../page/product/list'),
  //   meta: {
  //     title: '商品列表'
  //   }
  // },
    {
    path: '/productlist',
    component: () => import('../page/product/list'),
    meta: {
      title: '商品列表'
    }
  },
  {
    name: 'cart',
    component: () => import('../page/cart/index'),
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/order',
    component: () => import('../page/shipping/order'),
    meta: {
      title: '确认订单'
    }
  },
  {
    path: '/success',
    component: () => import('../page/shipping/success'),
    meta: {
      title: '成功'
    }
  },
  {
    name: 'category',
    component: () => import('../page/category/index'),
    meta: {
      title: '分类'
    }
  },
   {
    name: 'discount',
    component: () => import('../page/discount/index'),
    meta: {
      title: '折扣商品'
    }
  },
     {
    path: '/search',
    component: () => import('../page/product/search'),
    meta: {
      title: '搜索商品'
    }
  },
     {
    path: '/auth',
    component: () => import('../page/account/auth'),
    meta: {
      title: '授权'
    }
  },
  {
    path: '*',
    component:() => import('../page/404/404'),
    meta:{
      title:'404'
    }
  },
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});
console.log(process.env);

const router = new Router({ mode: 'history',base:process.env.NODE_ENV === 'production' ?'/h5/shop':'/',routes });

router.beforeEach((to, from, next) => {
  //需要登录的url
  // console.log(to);
  if(storage.get("userInfo") !=null && storage.get("userInfo").sessionkey != undefined){

  }else{
    if(/order|user/.test(to.path)){
    let agent = userAgent();
    if(agent !== "ali"){
      Toast.fail({ duration: 3000,message:"请在支付宝里边打开此页面"});
     // next(false);
      //return false;
    }  
    getUserAuthorizedUrl(from.fullPath);
    next(false)
    return false;
  }
  }




  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export {
  router
};
