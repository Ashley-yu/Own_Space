<template lang="pug">
  .productDetail
    HeaderPic
      nav.bookmark(aria-label='breadcrumb')
        ol.breadcrumb
          li.breadcrumb-item
            router-link(to='/') 首頁
          li.breadcrumb-item
            a(@click.prevent="$router.push('/product_list')") 商店
          li.breadcrumb-item
            a(@click.prevent="$router.push({ name: 'ProductList', params: { category: product.category }})") {{ product.category }}
          li.breadcrumb-item.active
            | {{ product.title }}
    .container
      .row.m-0
        .col-md-7.col-lg-6
          .productPicture
            img(:src="product.imageUrl", alt="")
        .col-md-5.col-lg-6
          ul.productInfo
            li
              h3.productTitle {{ product.title }}
            li
              p.productOriginal(v-if="product.price !== product.origin_price") NT {{ product.origin_price | currency }}
            li
              p.productPrice NT {{ product.price | currency }}
            li
              .form-control
                .countNumber.d-flex.justify-content-start.align-items-center
                  button.btn.minus(@click="changeQty(-1)")
                    i.fas.fa-minus
                  input.productNumber(type='number' max='10' min='1' v-model="productNum" @change="changeNumber(productNum)")
                  button.btn.add(@click="changeQty(1)")
                    i.fas.fa-plus
                button.btn.productBuy(@click.prevnt="addtoCart(product, productNum)")
                  i.fas.fa-shopping-cart.mr-1(v-if="!status.loadingItem")
                  i.fas.fa-spinner.fa-spin.mr-1(v-else)
                  | 加入購物車
            li
              p.productDescription {{ product.description }}
            li
              p.productDescription {{ product.content }}
      .row.m-0
        .notice
          .backText Q&A
          h5
            i.fas.fa-exclamation-circle.mr-3
            | 常見問題
          ul
            li 有哪些付款方式?
              p 目前提供「貨到付款」、「超商繳費付款」與「ATM轉帳匯款」三種方式。
            li 如何確認是否訂購成功？
              p 完成訂購流程後，系統將會發送「訂單確認通知函」至您訂購時所留存的聯絡E-mail，此即代表您已經訂購成功。
            li 商品出貨後是否會通知？
              p 商品出貨後，系統將會發送「出貨通知信」至您訂購時所留存的聯絡E-mail。
            li 需要負擔運費嗎？
              p 目前商店訂購不限金額免運。
            li 海外地區可以寄送嗎？
              p 目前無法提供海外地區配送服務，不便之處，敬請見諒。
            li 退換貨說明?
              p 如需要退換貨，請先聯絡客服，說明退換貨原因。
            li 什麼情況可能無法辦理退貨？
              p
                ol
                  li 超過7天鑑賞期。
                  li 客製化商品。
                  li 已非全新狀態（外觀不得有刮傷、破損、受潮...等）。
                  li 沒有完整包裝（商品、附件、外盒、保護袋、配件紙箱、保麗龍、隨貨文件、贈品...等）。
            li 如何計算「七天鑑賞期」？
              p 由消費者完成簽收取件的隔日開始算起至第7天止。
            li 退款方式?
              p 需提供您的匯款資料（存摺封面）E-mail 至客服中心，退款申請後預計7-10天(不含假日)退還至您指定的帳戶中。
      .similarContent
        h5 類似商品
        .row.similar
          .col-lg-3.col-md-4.col-sm-6.col-12.d-flex.justify-content-center.align-items-center(v-for="item in filterSimilarProducts" :key="item.id")
            .productCard(@click.prevent="getDetail(item.id)")
              .imgWrap
                img(:src="item.imageUrl" alt='')
              .cardText {{ item.title }}
              .cardText.text-right NT {{ item.price | currency }}
</template>

<script>
import { mapGetters } from 'vuex';
import HeaderPic from '@/components/HeaderPic.vue';

export default {
  name: 'ProductDetail',
  components: {
    HeaderPic,
  },
  data() {
    return {
      productId: '', // 儲存 router 傳遞的 id 參數
      product: [], // 單件商品資料
      productNum: 1, // 數量
      status: {
        loadingItem: '', // 當筆點選商品 id
      },
      products: [], // 所有商品資料(類似商品使用)
    };
  },
  methods: {
    // 取得單件商品資料
    getProduct() {
      const vm = this;
      vm.productId = vm.$route.params.product_id;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${vm.productId}`;

      vm.$store.dispatch('updateLoading', true);
      vm.$http.get(api).then((response) => {
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
          vm.$router.push('/product_list');
        } else {
          vm.product = response.data.product;
        }
        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 取得購物車
    getCart() {
      this.$store.commit('cartModules/CART');
      this.cartLength = this.cart.length;

      // 更新 navbar cart 資料
      this.$store.dispatch('cartModules/getCartInfo');
    },
    // 加入購物車，預設數量為 1
    addtoCart(product, qty = 1) {
      this.status.loadingItem = product.id;
      this.getCart();

      this.$store.dispatch('cartModules/addtoCart', { product, qty });

      // 重新整理
      this.getCart();
      this.status.loadingItem = '';
    },
    // 商品數量變更做判斷
    changeQty(num) {
      const qty = this.productNum + num;
      this.changeNumber(qty);
    },
    // 商品數量欄位變動時判斷
    changeNumber(num) {
      const qty = num;
      if (qty >= 10) {
        this.productNum = 10;
      } else if (qty <= 1) {
        this.productNum = 1;
      } else {
        this.productNum = qty;
      }
    },
    // 取得所有商品資料
    getProducts() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;

      vm.$http.get(api).then((response) => {
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        } else {
          // 儲存所有商品資料
          vm.products = response.data.products;
        }
      });
    },
    // 取得新一筆商品資料
    getDetail(id) {
      const vm = this;
      vm.$router.push(`/product_detail/${id}`);
      vm.getProduct();
    },
  },
  computed: {
    filterSimilarProducts() {
      const vm = this;
      return vm.products.filter(item => (item.id !== this.productId) && (item.category === vm.product.category) && (item.is_enabled));
    },
    ...mapGetters('cartModules', ['cart']),
  },
  created() {
    this.getProduct();
    this.getProducts();
    this.getCart();
  },
};
</script>
