<template lang="pug">
  .manage
    .text-left.mt-4
      button.btn.addNewBtn(@click='openModal(true)')
        i.fas.fa-plus-square.mr-1
        | 新增優惠
    <!-- Table 顯示列表項目 -->
    .table-responsive-md.tableMain
      table.table.table-hover.mt-4
        thead
          tr
            th 名稱
            th 折扣(%)
            th 到期日
            th 是否啟用
            th 編輯
        tbody
          tr(v-for='(item) in coupons' :key='item.id')
            td {{ item.title }}
            td {{ item.percent }}%
            td {{ item.due_date | date }}
            td
              //- 產品啟用 is_enabled == 1
              span.text-success(v-if='item.is_enabled') 啟用
              span(v-else='') 未啟用
            td
              .btn-group(role='group' aria-label='Basic example')
                button.btn.btn-sm(@click='openModal(false, item)')
                  i.fas.fa-edit
                button.btn.btn-sm(@click='openDeleteModal(item)')
                  i.fas.fa-trash
    <!-- 頁碼 -->
    pagination(:pagination='pagination' @get-pagination='getCoupons' v-if="pagination.total_pages > 1")
    <!-- Modal 新增/編輯-->
    #couponModal.modal.fade(tabindex='-1' role='dialog' aria-labelledby='couponModallLabel' aria-hidden='true')
      .modal-dialog(role='document')
        .modal-content.border-0
          .modal-header
            h5#couponModallLabel.modal-title
              span 新增 / 編輯優惠
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              span(aria-hidden='true') &times;
          .modal-body
            .row
              .col-sm-12
                .form-group
                  label(for='title') 優惠方案
                  input.form-control#title(type="text" name="title" :class="{'is-invalid': errors.has('title')}" v-model="tempCoupon.title" v-validate="'required'" placeholder="請輸入優惠券名稱")
                  span.text-danger(v-if="errors.has('title')") 請輸入優惠券名稱
                .form-group
                  label(for='code') 優惠代碼
                  input.form-control#code(type="text" name="code" :class="{'is-invalid': errors.has('code')}" v-model="tempCoupon.code" v-validate="'required'" placeholder="請輸入優惠碼")
                  span.text-danger(v-if="errors.has('code')") 請輸入優惠碼
                .form-group
                  label(for='due_date') 到期日
                  input.form-control#code(type="date" name="date" :class="{'is-invalid': errors.has('date')}" v-model="tempCoupon.due_date" v-validate="'required'" placeholder="請輸入到期日")
                  span.text-danger(v-if="errors.has('date')") 請輸入到期日
                .form-group
                  label(for='percent') 折扣百分比(%)
                  input.form-control#percent(type="number" name="percent" :class="{'is-invalid': errors.has('percent')}" v-model="tempCoupon.percent" v-validate="'required'" placeholder="請輸入折扣百分比")
                  span.text-danger(v-if="errors.has('percent')") 請輸入折扣百分比
                .form-group
                  .form-check
                    input#is_enabled.form-check-input(type='checkbox' v-model='tempCoupon.is_enabled' :true-value='1' :false-value='0')
                    label.form-check-label(for='is_enabled')
                      | 是否啟用
          .modal-footer
            button.btn(type='button' data-dismiss='modal') 取消
            button.btn(type='button' @click='updateCoupons') 確定
    <!-- Modal 刪除 -->
    #delCouponModal.modal.fade(tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true')
      .modal-dialog(role='document')
        .modal-content.border-0
          .modal-header
            h5#exampleModalLabel.modal-title
              span 刪除優惠
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              span(aria-hidden='true') &times;
          .modal-body
            | 是否刪除優惠方案-
            strong.text-danger {{ tempCoupon.title }}
            |  ? (刪除後將無法恢復)
          .modal-footer
            button.btn(type='button' data-dismiss='modal') 取消
            button.btn(type='button' @click='deleteCoupons') 確定
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'Coupons',
  components: {
    Pagination,
  },
  data() {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {},
      isNew: false, // 預設編輯狀態
      status: {
        // 判斷顯示 font awesome 的 loading 動態圖示
        fileUploading: false, // 預設不顯示
      },
      currentPage: 1, // 目前頁碼
    };
  },
  methods: {
    // 取得優惠券
    getCoupons(page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;
      const vm = this;
      vm.currentPage = page;

      vm.$store.dispatch('updateLoading', true);
      vm.$http.get(api).then((response) => {
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        } else {
          vm.coupons = response.data.coupons;
          // 分頁相關參數
          vm.pagination = response.data.pagination;
        }
        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 開啟新增/編輯欄位畫面
    openModal(isNew, item) {
    // isNew 為 true 代表新增
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
      } else {
        this.tempCoupon = Object.assign({}, item);
        this.isNew = false;
      }

      // timestamp 轉換為 yyyy-mm-dd 格式
      this.tempCoupon.due_date = this.timestampConvert(this.tempCoupon.due_date);

      $('#couponModal').modal('show');
    },
    // 新增/編輯
    updateCoupons() {
      const vm = this;
      // 預設新增
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
      let httpMethod = 'post';
      // 編輯
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
        httpMethod = 'put';
      }

      // 將日期轉換為 timestamp
      vm.tempCoupon.due_date = Math.floor(new Date(vm.tempCoupon.due_date) / 1000);

      vm.$validator.validate().then((valid) => {
        if (valid) {
          vm.$http[httpMethod](api, { data: vm.tempCoupon }).then((response) => {
            $('#couponModal').modal('hide');
            vm.getCoupons(vm.currentPage);

            if (!response.data.success) {
              vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
            } else {
              vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'success' });
            }
          });
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: '請確認優惠方案是否填寫完整', status: 'danger' });
        }
      });
    },
    // 開啟刪除畫面
    openDeleteModal(item) {
      this.tempCoupon = item;
      $('#delCouponModal').modal('show');
    },
    // 刪除
    deleteCoupons() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;

      vm.$http.delete(api).then((response) => {
        $('#delCouponModal').modal('hide');
        vm.getCoupons(vm.currentPage);
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'success' });
        }
      });
    },
    // 時間戳記轉日期格式 (YYYY-MM-DD)
    timestampConvert(time) {
      if (time) {
        const date = new Date(time * 1000);

        const formatDate = (num) => {
          if (num < 10) {
            return `0${num}`;
          }
          return num;
        };
        // 解構賦值
        const [YYYY, MM, DD] = [
          date.getFullYear(),
          formatDate(date.getMonth() + 1),
          formatDate(date.getDate()),
        ];
        // ES6 template strings
        return `${YYYY}-${MM}-${DD}`;
      }
      return '';
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>
