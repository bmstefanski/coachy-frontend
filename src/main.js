import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import Vuelidate from 'vuelidate'
import VueCookie from 'vue-cookie'
import i18n from '@/i18n'

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(VueCookie);

new Vue({
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
