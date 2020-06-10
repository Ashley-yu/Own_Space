<template lang="pug">
  .manage
    <!-- Table 顯示列表項目 -->
    .table-responsive-md.tableMain
      table.table.table-hover.mt-4
        thead
          tr
            th 訂單日期
            th 姓名
            th 購買品項
            th 應付金額
            th 付款狀態
            th 編輯
        tbody
          tr(v-for='(item) in sortOrder' :key='item.id')
            td {{ item.create_at | date }}
            td {{ item.user.name }}
            td
              ul.list-unstyled
                li(v-for='(product) in item.products' :key='product.id')
                  | {{ product.product.title }} : {{ product.qty }} {{ product.product.unit }}
            td.text-right {{ item.total | currency }}
            td
              span.text-success(v-if='item.is_paid') 已付款
              span(v-else='') 尚未付款
            td
              .btn-group(role='group' aria-label='Basic example')
                button.btn.btn-sm(@click='openModal(item)')
                  i.fas.fa-edit
    <!-- 頁碼 -->
    pagination(:pagination='pagination' @get-pagination='getOrders' v-if="pagination.total_pages > 1")
    <!-- Modal 編輯-->
    #orderModal.modal.fade(tabindex='-1' role='dialog' aria-labelledby='orderModalLabel' aria-hidden='true')
      .modal-dialog.modal-lg(role='document')
        .modal-content.border-0
          .modal-header
            h5#orderModalLabel.modal-title
              span 修改訂單
            button.close(type='button' data-dismiss='modal' aria-label='Close' @click='getOrders')
              span(aria-hidden='true') &times;
          .modal-body
            .row
              .col-sm-12
                .form-row
                  .form-group.col-lg-4.col-md-6
                    label(for='create_at') 訂單編號
                    div {{ tempOrder.id }}
                  .form-group.col-lg-2.col-md-6
                    label(for='create_at') 訂單日期
                    div {{ tempOrder.create_at | date }}
                  .form-group.col-lg-3.col-md-6
                    label(for='is_paid') 付款狀態
                    .text-success(v-if='tempOrder.is_paid')
                      span {{ tempOrder.paid_date | date }}
                      | 已付款
                    .text-danger(v-else='') 尚未付款
                  .form-group.col-lg-3.col-md-6
                    label(for='name') 收件人
                    div {{ tempOrder.user.name }}
                hr
                .form-row
                  .form-group.col-md-6
                    label(for='email') Email
                    input.form-control#email(type="email" name="email" :class="{'is-invalid': errors.has('email')}" v-model="tempOrder.user.email" v-validate="'required'" placeholder="請輸入Email")
                    span.text-danger(v-if="errors.has('email')") {{ errors.first('email') }}
                  .form-group.col-md-6
                    label(for='tel') 手機號碼
                    input.form-control#tel(type="tel" name="tel" :class="{'is-invalid': errors.has('tel')}" v-model="tempOrder.user.tel" v-validate="'required|cellphone'" placeholder="請輸入手機號碼 (ex: 09xxxxxxxx)" maxlength="10")
                    span.text-danger(v-if="errors.has('tel')") 請輸入手機號碼
                .form-row
                  .form-group.col-md-12
                    label(for='address') 收件地址
                    input.form-control#address(type="text" name="address" :class="{'is-invalid': errors.has('address')}" v-model="tempOrder.user.address" v-validate="'required'" placeholder="請輸入地址")
                    span.text-danger(v-if="errors.has('address')") 請輸入地址
                .table-responsive.tableDetail
                  table.table.table-hover.my-2
                    thead
                      tr
                        th(width='300') 品項
                        th(width='100') 數量
                        th(width='30')
                        th(width='100') 單價
                        th(width='100') 小計
                        th(width='150') 優惠
                        th(width='120') 總計
                    tbody
                      tr(v-for='(item) in tempOrder.products' :key='item.id')
                        //- 品項
                        td
                          | {{ item.product.title }}
                        //- 數量
                        td
                          | {{ item.qty }}
                        //- 單位
                        td
                          | {{ item.product.unit }}
                        //- 單價
                        td.text-right
                          | {{ item.product.price | currency }}
                        //- 小計
                        td
                          | {{ item.total | currency }}
                        //-  優惠券
                        td(v-if="item.hasOwnProperty('coupon')") {{ item.coupon.percent }}%
                        td(v-else='') 未使用
                        //-  總計
                        td
                          | {{ item.final_total | currency }}
                      tr
                        td(colspan='6') 應付金額
                        td
                          | {{ tempOrder.total | currency }}
          .modal-footer
            button.btn(type='button' data-dismiss='modal' @click='getOrders') 取消
            button.btn(type='button' @click='updateOrder') 確認
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'Orders',
  components: {
    Pagination,
  },
  data() {
    return {
      orders: [], // 訂單資料
      pagination: {},
      tempOrder: { // 暫存編輯訂單資料
        create_at: '',
        is_paid: '',
        message: '',
        paid_date: '',
        products: [],
        total: '',
        user: {
          address: '',
          email: '',
          name: '',
          tel: '',
        },
      },
      currentPage: 1, // 目前頁碼
    };
  },
  methods: {
    // 取得訂單
    getOrders(page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${page}`;
      const vm = this;
      vm.currentPage = page;

      vm.$store.dispatch('updateLoading', true);
      vm.$http.get(api).then((response) => {
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        } else {
          vm.orders = response.data.orders;
          // 分頁相關參數
          vm.pagination = response.data.pagination;
        }
        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 開啟編輯畫面
    openModal(item) {
      this.tempOrder = Object.assign({}, item);
      $('#orderModal').modal('show');
    },
    // 編輯訂單資料
    updateOrder() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/order/${vm.tempOrder.id}`;

      vm.$validator.validate().then((valid) => {
        if (valid) {
          vm.$http.put(api, { data: vm.tempOrder }).then((response) => {
            $('#orderModal').modal('hide');
            vm.getOrders(vm.currentPage);

            if (!response.data.success) {
              vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
            } else {
              vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'success' });
            }
          });
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: '請確認訂單資料是否填寫完整', status: 'danger' });
        }
      });
    },
  },
  computed: {
    // 依付款狀態排序
    sortOrder() {
      const vm = this;
      let newOrder = [];

      if (vm.orders.length) {
        newOrder = vm.orders.sort((a, b) => {
          const aIsPaid = a.is_paid ? 1 : 0;
          const bIsPaid = b.is_paid ? 1 : 0;
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder.filter(item => (item.user));
    },
  },
  created() {
    this.getOrders();
  },
};
</script>
