<template lang="pug">
  .buyerInfo
    HeaderPic
      OrderProgress(:currentStep='step')
    .container
      .listContent
        h3 收件資訊
        .row
          .col-md-5
            ul.order
              li.orderList(v-for="item in cartData.carts" :key="item.id")
                .row
                  .col-2.p-0
                    .productImg
                      img(:src="item.product.imageUrl", alt="")
                  .col-4.p-0
                    .productName(@click="$router.push(`/product_detail/${item.product.id}`)") {{ item.product.title }}
                  .col-2.p-0
                    .productQty x {{ item.qty }}
                  .col-4.p-0
                    .productTotal NT {{ item.final_total / item.qty | currency }}
              li.orderList.productSummary
                .row
                  .col-8.col-md-7.summary 總計金額
                  .col-4.col-md-5.summary NT {{ cartData.final_total | currency }}
          .col-md-7
            form.infoArea(@submit.prevent="createOrder")
              .form-row.userInfo
                .form-group.col-sm-6
                  label(for='userName') 收件人姓名
                    |
                    span.marker *
                  input.form-control#userName(type="text" name="name" :class="{'is-invalid': errors.has('name')}" v-model="form.user.name" v-validate="'required'" placeholder="請輸入姓名")
                  span.text-danger(v-if="errors.has('name')") {{ errors.first('name') }}
                .form-group.col-sm-6
                  label(for='usertel') 收件人手機
                    |
                    span.marker *
                  input.form-control#userTel(type="tel" name="tel" :class="{'is-invalid': errors.has('tel')}" v-model="form.user.tel" v-validate="'required|cellphone'" placeholder="09xxxxxxxx" maxlength="10")
                  span.text-danger(v-if="errors.has('tel')") {{ errors.first('tel') }}
              .form-row
                .form-group.col-sm-6
                  label(for='userEmail') 收件人Email
                    |
                    span.marker *
                  input.form-control#userEmail(type="email" name="email" :class="{'is-invalid': errors.has('email')}" v-model="form.user.email" v-validate="'required'" placeholder="your@email.com")
                  span.text-danger(v-if="errors.has('email')") {{ errors.first('email') }}
                .form-group.col-sm-6
                  .select-wrapper
                    label(for='payment') 付款方式
                      |
                      span.marker *
                    select#payment.form-control(v-model="form.user.payment")
                      option(value='COD') 貨到付款
                      option(value='CVS') 超商付款
                      option(value='ATM') ATM付款
              .form-group
                label(for='userAddress') 收件人地址
                  |
                  span.marker *
                input.form-control#userAddress(type="text" name="address" :class="{'is-invalid': errors.has('address')}" v-model="form.user.address" v-validate="'required'" placeholder="請輸入地址")
                span.text-danger(v-if="errors.has('address')") {{ errors.first('address') }}
              .form-group.mb-5
                label(for='message') 備註
                textarea.form-control#message(name="message" cols='10' rows='3' v-model="form.user.message" placeholder="歡迎留下想對我們說的話")
              .btnArea.d-flex.justify-content-between
                button.btn(@click.prevent="goBack")
                  i.fas.fa-angle-double-left.mr-1
                  | 上一步
                button.btn(type="submit")
                  | 下一步
                  i.fas.fa-angle-double-right.ml-1
        .row(v-if="form.user.payment === 'CVS'")
          .col-sm-12
            .notice
              .backText PAYMENT
              h5
                i.fas.fa-exclamation-circle.mr-3
                | 超商付款
              ul
                li 可至7-11，全家，萊爾富，ok便利商店進行列印單據並且繳款。
                li 在完成訂單的頁面，會顯示您此筆交易專屬的超商代碼，請記下這組代碼至鄰近的超商利用服務機器列印帳單進行繳費。
                li 繳費期限為訂單成立時間起24小時內須完成交易，若逾期超商代碼將失效，並自動取消訂單。
        .row(v-if="form.user.payment === 'ATM'")
          .col-sm-12
            .notice
              .backText PAYMENT
              h5
                i.fas.fa-exclamation-circle.mr-3
                | 注意事項
              ul
                li 包含實體ATM轉帳，或是網路ATM線上轉帳。
                li 在完成訂單的頁面，會顯示您此筆交易專屬的虛擬帳號，請記下這組帳號至鄰近的ATM或網路ATM進行轉帳。
                li 繳費期限為訂單成立時間起24小時內須完成交易，若逾期虛擬帳號將失效，並自動取消訂單。
    #leaveBuyerModal.modal.fade.p-0(tabindex='-1' role='dialog' aria-hidden='true' data-backdrop='static')
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
  name: 'BuyerInfo',
  components: {
    HeaderPic,
    OrderProgress,
  },
  data() {
    return {
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
          payment: 'COD',
        },
        message: '',
      },
      step: 2, // 變更階段樣式(OrderProgress)
      isNext: false, // 是否為上一步/下一步
    };
  },
  methods: {
    // 取得購物資料
    ...mapActions('cartModules', ['getCartData']),
    // 送出訂單
    createOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
      const order = vm.form;

      vm.isNext = true;
      vm.$store.dispatch('updateLoading', true);
      // 送出時套件驗證
      vm.$validator.validate().then((valid) => {
        if (valid) {
          vm.$http.post(url, { data: order }).then((response) => {
            if (response.data.success) {
              // 清除 localStorage cart 資料
              localStorage.removeItem('cart');
              // 更新 Navbar
              this.$store.commit('cartModules/CART');
              this.$store.dispatch('cartModules/getCartInfo');
              vm.$router.push(`/order_info/${response.data.orderId}`);
            } else {
              vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
              vm.$router.push('/check_order');
            }
            vm.$store.dispatch('updateLoading', false);
          });
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: '請確認資料是否填寫完整', status: 'danger' });
          vm.$store.dispatch('updateLoading', false);
        }
      });
    },
    goBack() {
      this.isNext = true;
      this.$router.go(-1);
    },
    // 刪除確認購買商品
    cancelCart() {
      this.$store.dispatch('cartModules/getCartData');
      this.$store.dispatch('cartModules/cancelCart');
    },
  },
  created() {
    this.$store.dispatch('cartModules/getCartData');
  },
  computed: {
    ...mapGetters('cartModules', ['cartData', 'isConfirm']),
  },
  beforeRouteLeave(to, from, next) {
    const vm = this;
    if (vm.isNext) {
      next();
    } else {
      $('#leaveBuyerModal').modal('show');
      $('.confirm').on('click', () => {
        vm.cancelCart();
        next();
      });
      $('.cancel').on('click', () => {
        next(false);
      });
    }
  },
};
</script>
