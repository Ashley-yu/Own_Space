import axios from 'axios';

export default {
  namespaced: true,
  state: {
    cart: {}, // 購物車資料(localStorage)
    cartQty: 0,
    cartTotal: 0,
    cartData: {},
    isConfirm: false, // 是否已呼叫API存購物車商品
  },
  actions: {
    // 加入購物車
    addtoCart(context, { product, qty }) {
      let productIndex = -1;

      if (context.state.cart.length > 0) {
        context.state.cart.forEach((item, index) => {
          if (item.id === product.id) {
            productIndex = index;
          }
        });
      }

      if (productIndex === -1) {
        const total = parseInt((product.price * qty), 10);
        const tempProduct = Object.assign({}, product);

        // 不存在則加入陣列
        tempProduct.qty = qty;
        tempProduct.total = total;
        context.commit('ADDTOCART', tempProduct);
      } else {
        // 存在則先計算數量
        const tempCart = Object.assign({}, context.state.cart[productIndex]);
        const total = parseInt((product.price * qty), 10);

        tempCart.qty += qty;
        tempCart.total += total;

        // 刪除該筆資料
        context.commit('REMOVECARTITEM', productIndex);
        // 將新資料存入陣列
        context.commit('ADDTOCART', tempCart);
      }

      // 儲存至 localStorage
      context.commit('UPDATECART');
      context.dispatch('alertMessageModules/updateMessage', { message: '商品已加入購物車', status: 'success' }, { root: true });
    },
    // 變更商品數量
    changeNumber(context, { product, qty }) {
      let productIndex = -1;
      let num = qty;

      if (context.state.cart.length > 0) {
        context.state.cart.forEach((item, index) => {
          if (item.id === product.id) {
            productIndex = index;
          }
        });
      }

      if (qty >= 10) {
        num = 10;
        context.commit('CHANGEQTY', { productIndex, num });
      } else if (qty <= 1) {
        num = 1;
        context.commit('CHANGEQTY', { productIndex, num });
      } else {
        context.commit('CHANGEQTY', { productIndex, num });
      }

      // 計算金額
      const total = parseInt((context.state.cart[productIndex].price * context.state.cart[productIndex].qty), 10);
      context.commit('CHANGESUM', { productIndex, total });

      // 更新
      context.commit('UPDATECART');
    },
    // 送出購物車資料
    confirmCart(context) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;

      context.dispatch('updateLoading', true, { root: true });

      context.commit('CART');
      context.state.cart.forEach((item) => {
        const cart = {
          product_id: item.id,
          qty: item.qty,
        };
        axios.post(api, { data: cart }).then((response) => {
          if (!response.data.success) {
            context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' }, { root: true });
          } else {
            context.dispatch('getCartData');
          }
          context.dispatch('updateLoading', false, { root: true });
        });
      });
    },
    // 取得購物車資料
    getCartData(context) {
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;

      axios.get(url).then((response) => {
        if (!response.data.success) {
          context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' }, { root: true });
        } else {
          context.commit('CARTDATA', response.data.data);
          context.commit('CONFIRM', response.data.data.carts.length);
        }
      });
    },
    // 取得購物車計算資料
    getCartInfo(context) {
      context.commit('CARTQTY');
      context.commit('CARTTOTAL');
    },
    // 刪除購物車資料
    cancelCart(context) {
      if (context.state.isConfirm) {
        context.state.cartData.carts.forEach((item) => {
          const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${item.id}`;

          axios.delete(url).then((response) => {
            if (!response.data.success) {
              context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' }, { root: true });
            }
          });
        });
      }
    },
    // 套用優惠券
    addCouponCode(context, couponCode) {
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      const coupon = {
        code: couponCode,
      };

      context.dispatch('updateLoading', true, { root: true });
      axios.post(url, { data: coupon }).then((response) => {
        context.dispatch('getCartData');

        if (!response.data.success) {
          context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' }, { root: true });
        } else {
          context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'success' }, { root: true });
        }
        context.dispatch('updateLoading', false, { root: true });
      });
    },
  },
  mutations: {
    CART(state) {
      state.cart = JSON.parse(localStorage.getItem('cart')) || [];
    },
    ADDTOCART(state, payload) {
      state.cart.push(payload);
    },
    REMOVECARTITEM(state, payload) {
      state.cart.splice(payload, 1);
    },
    CHANGEQTY(state, payload) {
      state.cart[payload.productIndex].qty = payload.num;
    },
    CHANGESUM(state, payload) {
      state.cart[payload.productIndex].total = payload.total;
    },
    UPDATECART(state) {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    CARTDATA(state, payload) {
      state.cartData = payload;
    },
    CONFIRM(state, payload) {
      if (payload > 0) {
        state.isConfirm = true;
      } else {
        state.isConfirm = false;
      }
    },
    CARTQTY(state) {
      state.cartQty = 0;
      state.cart.forEach((item) => {
        state.cartQty += item.qty;
      });
    },
    CARTTOTAL(state) {
      state.cartTotal = 0;
      state.cart.forEach((item) => {
        state.cartTotal += item.total;
      });
    },
  },
  getters: {
    cart: state => state.cart,
    cartData: state => state.cartData,
    isConfirm: state => state.isConfirm,
    cartQty: state => state.cartQty,
    cartTotal: state => state.cartTotal,
  },
};
