<template lang="pug">
  .manage
    .text-left.mt-4
      button.btn.addNewBtn(@click='openModal(true)')
        i.fas.fa-plus-square.mr-1
        | 新增商品
    <!-- Table 顯示列表項目 -->
    .table-responsive-md.tableMain
      table.table.table-hover.mt-4
        thead
          tr
            th 類別
            th 商品名稱
            th 原價
            th 售價
            th 是否啟用
            th 編輯
        tbody
          tr(v-for='(item) in products' :key='item.id')
            td {{ item.category }}
            td {{ item.title }}
            td.text-right {{ item.origin_price | currency }}
            td.text-right {{ item.price | currency }}
            td
              <!-- 產品如果為啟用 is_enabled == 1 -->
              span.text-success(v-if='item.is_enabled') 啟用
              span(v-else='') 未啟用
            td
              .btn-group(role='group' aria-label='Basic example')
                button.btn.btn-sm(@click='openModal(false, item)')
                  i.fas.fa-edit
                button.btn.btn-sm(@click='openDeleteModal(item)')
                  i.fas.fa-trash
    <!-- 頁碼 -->
    pagination(:pagination='pagination' @get-pagination='getProducts' v-if="pagination.total_pages > 1")
    <!-- Modal 新增/編輯-->
    #productModal.modal.fade(tabindex='-1' role='dialog' aria-labelledby='productModalLabel' aria-hidden='true')
      .modal-dialog.modal-lg(role='document')
        .modal-content.border-0
          .modal-header
            h5#productModalLabel.modal-title
              span 新增 / 編輯商品
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              span(aria-hidden='true') &times;
          .modal-body
            .row
              .col-sm-4
                .form-group
                  label(for='image') 輸入圖片網址
                  input#image.form-control(type='text' name="image" :class="{'is-invalid': errors.has('image')}" v-model='tempProduct.imageUrl' v-validate="'required'" placeholder='請輸入圖片連結')
                .form-group
                  label(for='customFile')
                    | 或 上傳圖片
                    //- 判斷顯示 font awesome 的 loading 動態圖示
                    //- status.fileUploading： false-不顯示/ true-顯示
                    i.fas.fa-spinner.fa-spin(v-if='status.fileUploading')
                  input#customFile.form-control(type='file' ref='files' @change='uploadFile')
                  span.text-danger(v-if="errors.has('image')") 還沒有商品圖片
                img.img-fluid(:src='tempProduct.imageUrl' alt='')
              .col-sm-8
                .form-group
                  label(for='title') 商品名稱
                  input#title.form-control(type='text' name="title" :class="{'is-invalid': errors.has('title')}" v-model='tempProduct.title' v-validate="'required'" placeholder='請輸入商品名稱')
                  span.text-danger(v-if="errors.has('title')") 請輸入商品名稱
                .form-row
                  .form-group.col-md-6
                    .select-wrapper
                      label(for='category') 類別
                      select#category.form-control(type='text' v-model='tempProduct.category')
                        option(v-for="item in category" :key="item.id") {{ item }}
                  .form-group.col-md-6
                    label(for='unit') 單位
                    input#unit.form-control(type='text' name="unit" :class="{'is-invalid': errors.has('unit')}" v-model='tempProduct.unit' v-validate="'required'" placeholder='請輸入單位')
                    span.text-danger(v-if="errors.has('unit')") 請輸入單位
                .form-row
                  .form-group.col-md-6
                    label(for='origin_price') 原價
                    input#origin_price.form-control(type='number' name="oprice" :class="{'is-invalid': errors.has('oprice')}" v-model='tempProduct.origin_price' v-validate="'required'" placeholder='請輸入原價')
                    span.text-danger(v-if="errors.has('oprice')") 請輸入原價
                  .form-group.col-md-6
                    label(for='price') 售價
                    input#price.form-control(type='number' name="price" :class="{'is-invalid': errors.has('price')}" v-model='tempProduct.price' v-validate="'required'" placeholder='請輸入售價')
                    span.text-danger(v-if="errors.has('price')") 請輸入售價
                hr
                .form-group
                  label(for='description') 產品描述
                  textarea#description.form-control(type='text' name="description" :class="{'is-invalid': errors.has('description')}" v-model='tempProduct.description' v-validate="'required'" placeholder='請輸入產品描述')
                  span.text-danger(v-if="errors.has('description')") 請輸入產品描述
                .form-group
                  label(for='content') 說明內容
                  textarea#content.form-control(type='text' v-model='tempProduct.content' placeholder='請輸入產品說明內容')
                .form-group
                  .form-check
                    input#is_enabled.form-check-input(type='checkbox' v-model='tempProduct.is_enabled' :true-value='1' :false-value='0')
                    label.form-check-label(for='is_enabled')
                      | 是否啟用
          .modal-footer
            button.btn(type='button' data-dismiss='modal') 取消
            button.btn(type='button' @click='updateProduct') 確認
    <!-- Modal 刪除 -->
    #delProductModal.modal.fade(tabindex='-1' role='dialog' aria-labelledby='delProductModalLabel' aria-hidden='true')
      .modal-dialog(role='document')
        .modal-content.border-0
          .modal-header
            h5#delProductModalLabel.modal-title
              span 刪除商品
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              span(aria-hidden='true') &times;
          .modal-body
            | 是否刪除商品-
            strong.text-danger {{ tempProduct.title }}
            |  ? (刪除後將無法恢復)
          .modal-footer
            button.btn(type='button' data-dismiss='modal') 取消
            button.btn(type='button' @click='deleteProduct') 確定
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'Products',
  components: {
    Pagination,
  },
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false, // 預設編輯狀態
      status: {
        // 判斷顯示 font awesome 的 loading 動態圖示
        fileUploading: false, // 預設不顯示
      },
      category: [
        '紙本記事',
        '書寫用具',
        '事務文具',
        '收納用品',
        '裝飾小物',
      ],
      currentPage: 1, // 目前頁碼
    };
  },
  methods: {
    // 取得產品
    // 使用ES6的參數預設值，若未傳值則參數帶1
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;
      const vm = this;
      vm.currentPage = page;

      vm.$store.dispatch('updateLoading', true);
      vm.$http.get(api).then((response) => {
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        } else {
          vm.products = response.data.products;
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
        this.tempProduct = {};
        this.isNew = true;
      } else {
        // 避免 this.tempProduct 與 item 有傳參考的特性
        // 使用 Object.assign 將 item 的值寫入空的物件 (ES6寫法)
        this.tempProduct = Object.assign({}, item);
        this.isNew = false;
      }
      // 使用 toggle 的話會立即打開 modal
      // 使用 methods 的方式可以決定在何種情況下打開 modal
      $('#productModal').modal('show');
    },
    // 新增/編輯
    updateProduct() {
      const vm = this;
      // 預設新增
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
      let httpMethod = 'post';
      // 編輯
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
        httpMethod = 'put';
      }

      vm.$validator.validate().then((valid) => {
        if (valid) {
          vm.$http[httpMethod](api, { data: vm.tempProduct }).then((response) => {
            $('#productModal').modal('hide');
            vm.getProducts(vm.currentPage);

            if (!response.data.success) {
              vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
            } else {
              vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'success' });
            }
          });
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: '請確認商品資料是否填寫完整', status: 'danger' });
        }
      });
    },
    // 開啟刪除畫面
    openDeleteModal(item) {
      this.tempProduct = item;
      $('#delProductModal').modal('show');
    },
    // 刪除
    deleteProduct() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;

      vm.$http.delete(api).then((response) => {
        $('#delProductModal').modal('hide');
        vm.getProducts(vm.currentPage);
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'success' });
        }
      });
    },
    // 上傳圖片
    uploadFile() {
      const vm = this;
      // 取得上傳的檔案
      const uploadedFile = vm.$refs.files.files[0];
      // 建立一個 formData 的物件
      const formData = new FormData();
      // 將上傳的檔案加至物件中
      formData.append('file-to-upload', uploadedFile);
      // 上傳時顯示 loading 動畫
      vm.status.fileUploading = true;
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
      // 將此物件送出
      vm.$http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        // 上傳完成後不顯示 loading 動畫
        vm.status.fileUploading = false;
        if (response.data.success) {
          // 需使用 set 的方式將值塞入
          vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
        } else {
          // 上傳圖片錯誤時顯示錯誤訊息
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        }
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>
