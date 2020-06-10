<template lang="pug">
  .orderInfo
    HeaderPic
      OrderProgress(:currentStep='step')
    .container
      .listContent
        h3 訂單資訊
        .row
          .col-md-6
            ul.order
              p.purchaseDate 訂購日期 - {{ order.create_at | date }}
              li.orderList(v-for="item in order.products" :key="item.id")
                .row
                  .col-6.p-0
                    .productName(@click="$router.push(`/product_detail/${item.product.id}`)") {{ item.product.title }}
                  .col-2.p-0
                    .productQty x {{ item.qty }}
                  .col-4.p-0
                    .productTotal NT {{ item.final_total / item.qty | currency }}
                li.orderList.productSummary
                  .row
                    .col-8.summary 總計
                    .col-4.summary NT {{ order.total | currency }}
          .col-md-6
            .infoArea
              table.table
                tbody
                  tr
                    td.title 姓名
                    td.text {{ order.user.name }}
                  tr
                    td.title 電話
                    td.text {{ order.user.tel }}
                  tr
                    td.title Email
                    td.text {{ order.user.email }}
                  tr
                    td.title 地址
                    td.text {{ order.user.address }}
                tfoot
                  tr(v-if="order.user.payment === 'CVS'")
                    td.title 超商付款代碼
                    td.text-left.payCode LCB40611000744
                  tr(v-if="order.user.payment === 'ATM'")
                    td.title ATM匯款帳號
                    td.text-left.payCode (808)9278119118014012
                  tr
                    td.title 付款狀態
                    td.incomplete.text-left(v-if="!order.is_paid") 尚未付款
                    td.complete.text-left(v-else) 完成付款
              .payment
                button.btn(v-if="!order.is_paid" @click.prevent="payOrder")
                  i.fas.fa-wallet.mr-1
                  | 確認付款
                button.btn(v-else @click.prevent="$router.push('/product_list')")
                  i.fas.fa-store-alt.mr-1
                  | 回到商店
    #completeModal.modal.fade.p-0(tabindex='-1' role='dialog' aria-hidden='true')
      .modal-dialog.modal-sm.modal-dialog-centered(role='document')
        .modal-content.border-0
          .modal-header
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              span(aria-hidden='true') &times;
          .modal-body.completeMessage
            h3 付款完成
            i.fas.fa-check-circle.ckeckIcon
</template>

<script>
import $ from 'jquery';
import HeaderPic from '@/components/HeaderPic.vue';
import OrderProgress from '@/components/front/OrderProgress.vue';

export default {
  name: 'OrderInfo',
  components: {
    HeaderPic,
    OrderProgress,
  },
  data() {
    return {
      orderId: '', // 訂單編號
      order: { // 訂單內容
        user: {},
      },
      step: 3, // 變更階段樣式(OrderProgress)
    };
  },
  methods: {
    // 取得訂單資料
    getOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${vm.orderId}`;

      vm.$http.get(url).then((response) => {
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
          vm.$router.push('/product_list');
        } else {
          vm.order = response.data.order;
        }
      });
    },
    // 確認付款
    payOrder() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/pay/${vm.orderId}`;

      vm.$store.dispatch('updateLoading', true);
      vm.$http.post(url).then((response) => {
        if (response.data.success) {
          vm.getOrder();
          $('#completeModal').modal('show');
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        }
        vm.$store.dispatch('updateLoading', false);
      });
    },
  },
  created() {
    // 接訂單編號參數
    this.orderId = this.$route.params.order_id;
    this.getOrder();
  },
};
</script>
