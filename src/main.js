
import Vue from 'vue';

import { router } from './config/router';
// import './config/rem';
import App from './App.vue';
import VueLazyload from 'vue-lazyload'


 import components from './config/components.js';

Vue.use(components);

import * as filters from '@/utils/filter'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})


Vue.use(VueLazyload);
import store from '@/store/index';

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});