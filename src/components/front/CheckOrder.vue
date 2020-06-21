<template lang="pug">
  .checkOrder
    HeaderPic
      OrderProgress(:currentStep='step')
    .container
      .listContent
        h3 購買清單
        .row
          .col-12(:class="{'col-md-7': isConfirm}")
            ul.order
              li.orderList(v-for="(item, index) in cart" :key="item.id")
                .row
                  .col-3.p-0(:class="{'col-md-3': isConfirm, 'col-md-2': !isConfirm}")
                    .productImg
                      img(:src="item.imageUrl", alt="")
                  .col-md-7.p-0(:class="{'col-7': isConfirm, 'col-6': !isConfirm}")
                    .row.m-0.w-100
                      .col-12.col-md-7.p-0
                        .productName(@click="$router.push(`/product_detail/${item.id}`)") {{ item.title }}
                      .col-12.col-md-5.p-0
                        .productQty(v-if="isConfirm") x {{ item.qty }}
                        .productNum(v-else)
                          .countNumber
                            button.btn.minus(@click="changeQty(item, -1)")
                              i.fas.fa-minus
                            input.productNumber(type='number' max='10' min='1' :value="cart[index].qty" @change="changeNumber(item, $event.target.value)")
                            button.btn.add(@click="changeQty(item, 1)")
                              i.fas.fa-plus
                  .col-2.p-0
                    .productTotal {{ item.price | currency }}
                  .col-1.p-0(v-if="!isConfirm")
                    .productDel
                      span(@click.prevent="removeCartItem(item.id)")
                        i.fas.fa-trash
              li.orderList.productSummary
                .row
                  .col-6.summary 共 {{ cartLength }} 項
                  .col-3.summary 總計
                  .summary(:class="{'col-3': isConfirm, 'col-2': !isConfirm}") {{ cartTotal | currency }}
                  .col-1.p-0(v-if="!isConfirm")
            .check(v-if="!isConfirm")
              button.btn(v-if="cartLength === 0" @click.prevent="$router.push('/product_list')")
                i.fas.fa-store-alt.mr-1
                | 回到商店
              button.btn(v-else @click.prevent="confirmCart")
                i.fas.fa-clipboard-check.mr-1
                | 確認送出
          .col-md-5(v-if="isConfirm")
            .infoArea.d-flex.justify-content-center.align-items-center.flex-column
              .input-group.couponInfo
                input.form-control(type='text' placeholder="優惠券代碼" v-model="coupon_code")
                .input-group-append
                  span.input-group-text(@click="addCouponCode") 確認
              table.table.totalInfo
                tbody
                  tr
                    td 總計金額
                    td.text-right NT {{ cartData.total | currency }}
                  tr
                    td 優惠折抵
                    td.text-right - NT {{ cartData.total-cartData.final_total | currency }}
                  tr
                    td 應付金額
                    td.text-right NT {{ cartData.final_total | currency }}
              .nextStep
                button.btn(@click.prevent="goNextPage") 下一步
                  i.fas.fa-angle-double-right.ml-1
        .row
          .col-sm-12
            .notice
              .backText NOTICE
              h5
                i.fas.fa-exclamation-circle.mr-3
                | 注意事項
              ul
                li 請確認所填寫的資料是否正確，下單後未提供修改付款方式服務。
                li 因拍攝略有色差，圖片僅供參考，顏色請以實際收到商品為準。
                li 本店商品目前只供應台灣地區，只提供宅配到府。
                li 目前支援貨到付款、超商付款、ATM付款。
                li 本店商品為統一會於付款後7個工作日內出貨(不含假日)。
                li 辦理退換貨時，商品必須是全新狀態與完整包裝，退回之商品必須於7日鑑賞期內寄回。
    #leaveModal.modal.fade.p-0(tabindex='-1' role='dialog' aria-hidden='true' data-backdrop='static')
      .modal-dialog.modal-dialog-centered(role='document')
        .modal-content.border-0
          .modal-body
            p 尚未完成訂購流程，請確認是否離開此頁?
          .modal-footer
            button.btn.cancel(type='button' data-dismiss='modal') 取消
            button.btn.confirm(type='button' data-dismiss='modal') 確定
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import $ from 'jquery';
import HeaderPic from '@/components/HeaderPic.vue';
import OrderProgress from '@/components/front/OrderProgress.vue';

export default {
  name: 'CheckOrder',
  components: {
    HeaderPic,
    OrderProgress,
  },
  data() {
    return {
      cartLength: '', // 購物車商品筆數(localStorage)
      coupon_code: '', // 優惠代碼
      step: 1, // 變更階段樣式(OrderProgress)
      isNext: false, // 是否為下一步
    };
  },
  methods: {
    // 取得暫存購物車
    getCart() {
      this.$store.commit('cartModules/CART');
      this.cartLength = this.cart.length;

      if (this.cartLength === 0) {
        this.isNext = true;
        this.$router.push('/product_list');
      }

      // 更新 navbar cart 資料
      this.$store.dispatch('cartModules/getCartInfo');
    },
    // 刪除暫存購物車商品
    removeCartItem(id) {
      const vm = this;
      let delIndex = -1;

      if (vm.cart.length > 0) {
        vm.cart.forEach((item, index) => {
          if (item.id === id) {
            delIndex = index;
          }
        });
      }
      vm.$store.commit('cartModules/REMOVECARTITEM', delIndex);
      vm.$store.commit('cartModules/UPDATECART');
      vm.$store.dispatch('alertMessageModules/updateMessage', { message: '商品已刪除', status: 'success' });
      vm.getCart();
    },
    // 商品數量變更做判斷
    changeQty(product, num) {
      const qty = parseInt((product.qty), 10) + parseInt(num, 10);
      this.changeNumber(product, qty);
    },
    // 數量欄位變動時判斷
    changeNumber(product, qty) {
      this.$store.dispatch('cartModules/changeNumber', { product, qty });
      this.getCart();
    },
    // 儲存購物資料 (確認送出按鈕), 取得確認購物資料
    ...mapActions('cartModules', ['confirmCart', 'getCartData']),
    // 套用優惠券
    addCouponCode() {
      this.$store.dispatch('cartModules/addCouponCode', this.coupon_code);
    },
    goNextPage() {
      this.isNext = true;
      this.$router.push('/buyer_info');
    },
  },
  created() {
    this.getCart();
    this.$store.dispatch('cartModules/getCartData');
  },
  computed: {
    // 模組化使用 mapGetters 方式
    ...mapGetters('cartModules', ['cart', 'cartData', 'isConfirm', 'cartTotal']),
  },
  beforeRouteLeave(to, from, next) {
    const vm = this;
    if (vm.isNext) {
      next();
    } else {
      $('#leaveModal').modal('show');
      $('.confirm').on('click', () => {
        this.$store.dispatch('cartModules/cancelCart');
        next();
      });
      $('.cancel').on('click', () => {
        next(false);
      });
    }
  },
};
</script>
