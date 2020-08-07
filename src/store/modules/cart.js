import storage from '@/utils/storage.js';

const state =  {
    cart: storage.get("cart")||[]
  };
const getters={
	cartGoodsNum:state=>{
		return state.cart.length;
	}
};
const mutations = {
	addCart(state,payload){
		console.log(payload);
		state.cart = payload;
	},
	upCart(state,payload){
		state.cart = payload;
	},
	delCart(state,payload){
	state.cart = payload;
	}
};
const actions = {};

export default {state,getters,mutations};