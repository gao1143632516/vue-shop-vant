<template>
  <div id="app">
  	<transition name="slide-fade">
    <router-view/>
   </transition>
  </div>
</template>

<script>

import './assets/style/common.css';
import '@/assets/style/index.css';
export default {
  name: 'app',
  components:{
       
    }
}

</script>
<style>
html,body,#app,.container{
  height: 100%;
}
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s ease;
}

.slide-fade-enter
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;

}
.slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-100%);
  opacity: 0;
  position: absolute;

}
</style>

