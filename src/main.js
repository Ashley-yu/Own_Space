import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'bootstrap';
import VeeValidate, { Validator } from 'vee-validate';
import messages from 'vee-validate/dist/locale/zh_TW';

import App from './App.vue';
import router from './router';
import store from './store';
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Validator.localize('zh_TW', messages);
Vue.use(VueAxios, axios);

// 使用全域的方式啟用此元件
Vue.component('Loading', Loading);
// 全域的 filter 方式啟用
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);

// validator套用欄位文字
const dictionary = {
  zh_TW: {
    messages: {
      required: field => `請輸入${field}`,
    },
    attributes: {
      name: '姓名',
      tel: '手機號碼',
      email: 'Email',
      address: '地址',
    },
  },
};
Validator.localize(dictionary);

// validator 自訂手機號碼檢查
const cellphone = {
  validate: (value) => {
    const reg = /^09[0-9]{8}$/;
    return reg.test(value);
  },
};
Validator.extend('cellphone', cellphone);

// 將 cookie 存在前端(vue的伺服器)
axios.defaults.withCredentials = true;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

router.beforeEach((to, from, next) => {
  // 判斷若即將要到達的頁面有 requiresAuth(路由訊息) 時，需要驗證才可以放行，否則直接放行
  if (to.meta.requiresAuth) {
    // 檢查用戶是否仍持續登入的 API
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check`;
    // 因執行環境在 router 下，並非在 Vue 底下，所以無法使用 this.$http，替換成 axios 即可
    axios.post(api).then((response) => {
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
});
