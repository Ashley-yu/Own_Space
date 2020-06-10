import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'product_list',
        name: 'ProductList',
        component: () => import('../components/front/ProductList.vue'),
      },
      {
        path: 'product_detail/:product_id',
        name: 'ProductDetail',
        component: () => import('../components/front/ProductDetail.vue'),
      },
      {
        path: 'check_order',
        name: 'CheckOrder',
        component: () => import('../components/front/CheckOrder.vue'),
      },
      {
        path: 'buyer_info',
        name: 'BuyerInfo',
        component: () => import('../components/front/BuyerInfo.vue'),
      },
      {
        path: 'order_info/:order_id',
        name: 'OrderInfo',
        component: () => import('../components/front/OrderInfo.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    // 在官方的範例中，根的路徑通常會加上 "/"，子路徑則不會加上 "/"
    path: '/admin',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('../components/admin/Products.vue'),
        // 路由訊息 (為了判斷必須被驗證)
        meta: { requiresAuth: true },
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../components/admin/Orders.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import('../components/admin/Coupons.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
];

// 升級vue-router至3.1以後版本，導航組件重複點擊報錯 NavigationDuplicated
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

export default router;
