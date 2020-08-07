import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage.js';
import cart from './modules/cart.js';
Vue.use(Vuex);

console.log(cart);

const store = new Vuex.Store({
  modules:{
  	cart:cart
  }
})

export default store;