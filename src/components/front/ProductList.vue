<template lang="pug">
  .products
    HeaderPic
      Category(:category='category' :currentOption='isCurrent' @get-category='changeCategory')
    .container-fluid.productsContent
      .row
        .col-xl-3.col-lg-4.col-sm-6.px-xl-3.px-3(v-for="item in filterProducts" :key="item.id")
          .productBox(:class="{'mask': !item.is_enabled}" @click="$router.push(`/product_detail/${item.id}`)")
            .soldOut(v-if="!item.is_enabled")
              h6 已售完
            .top
              img(:src="item.imageUrl", alt="")
              .tag(v-if="item.price !== item.origin_price") 特價中
            .bottom
              h3 {{ item.title }}
              .text.d-flex.justify-content-start.align-items-center
                .price NT {{ item.price | currency }}
                i.fas.fa-thumbs-up.like.liked(v-if="setliked(item)" @click.stop="changeFavorite(item)")
                i.fas.fa-thumbs-up.like(v-else @click.stop="changeFavorite(item)")
                i.fas.fa-cart-plus.cart(@click.stop="addtoCart(item)" v-if="item.id !== status.loadingItem")
                i.fas.fa-spinner.fa-spin.disabled(@click.stop="" v-else)
    <!-- 頁碼 -->
    pagination(:pagination='pagination' @get-pagination='setPagination' v-if="pagination.total_pages > 1")
    ToTop
</template>

<script>
import { mapGetters } from 'vuex';
import HeaderPic from '@/components/HeaderPic.vue';
import Category from '@/components/front/Category.vue';
import Pagination from '@/components/Pagination.vue';
import ToTop from '@/components/ToTop.vue';

export default {
  name: 'ProductList',
  components: {
    HeaderPic,
    Category,
    Pagination,
    ToTop,
  },
  data() {
    return {
      products: [], // 所有商品資料
      category: [], // 儲存類別
      isCurrent: '全部商品', // 目前選擇類別
      currentPageNum: 1, // 目前頁碼
      showPages: '', // 顯示頁數
      pagination: {
        total_pages: '',
        current_page: '',
        has_pre: false,
        has_next: true,
      },
      status: {
        loadingItem: '', // 當筆點選商品 id
      },
    };
  },
  methods: {
    // 取得所有商品資料
    getProducts() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;

      vm.$store.dispatch('updateLoading', true);
      vm.$http.get(api).then((response) => {
        if (!response.data.success) {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
          vm.$router.push('/product_list');
        } else {
          // 儲存所有商品資料
          vm.products = response.data.products;

          // 取得商品類別
          vm.getCategory();

          // 初始頁數以所有資料計算(8筆資料為一頁，使用無條件進位)
          vm.showPages = Math.ceil(vm.products.length / 8);
        }
        vm.$store.dispatch('updateLoading', false);
      });
    },
    // 取得類別項目
    getCategory() {
      const vm = this;
      const allCategory = [];
      vm.products.forEach(item => allCategory.push(item.category));
      // 篩選不重複的類別
      vm.category = allCategory.filter((element, index, array) => array.indexOf(element) === index);
      vm.category.unshift('全部商品');
    },
    // 頁碼變數處理 (pagination 呼叫)
    setPagination(page = 1) {
      // 儲存目前點擊頁碼
      this.currentPageNum = page;
      // 總頁數
      this.pagination.total_pages = this.showPages;
      // 目前頁數
      this.pagination.current_page = this.currentPageNum;
      // 判斷目前頁碼，若小於1，則前一頁按鈕無法點選
      if (this.currentPageNum <= 1) {
        this.pagination.has_pre = false;
      } else {
        this.pagination.has_pre = true;
      }
      // 判斷目前頁碼，若大於總頁數，則後一頁按鈕無法點選
      if (this.currentPageNum >= this.pagination.total_pages) {
        this.pagination.has_next = false;
      } else {
        this.pagination.has_next = true;
      }
    },
    // 處理畫面一頁顯示8筆資料
    setShowData(data) {
      // 8筆資料為一頁，使用無條件進位
      const pages = Math.ceil(data.length / 8);
      // 更新目前顯示頁數
      this.showPages = pages;
      // 更新頁碼
      this.setPagination(this.currentPageNum);
      // 計算要顯示的資料
      const startNum = (parseInt(this.currentPageNum, 10) - 1) * 8;
      const endNum = ((parseInt(this.currentPageNum, 10) - 1) * 8 + 8);
      return data.slice(startNum, endNum);
    },
    // 類別變動時，更新相關變數 (Category.vue 點擊呼叫)
    changeCategory(option = '全部商品') {
      // 目前點擊類別
      this.isCurrent = option;
      // 頁碼重設初始值
      this.currentPageNum = 1;
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
    // 取得購物車資料
    getCart() {
      this.$store.commit('cartModules/CART');
      this.$store.dispatch('cartModules/getCartInfo');
    },
    // 取得喜歡的商品
    getFavorites() {
      this.$store.commit('favoritesModules/FAVORITES');
    },
    // 變更喜愛的商品資料(新增/移除)
    changeFavorite(product) {
      this.$store.dispatch('favoritesModules/changeFavorite', product);
      this.$store.commit('favoritesModules/FAVORITESLENGTH');
    },
    // 判斷顯示/隱藏關注樣式
    setliked(item) {
      const liked = this.favorites.filter(favor => favor.id === item.id);
      if (liked.length > 0) {
        return true;
      }
      return false;
    },
  },
  computed: {
    // 依類別篩選要顯示的商品資料
    filterProducts() {
      let tempProducts = this.products;
      if (this.isCurrent && this.isCurrent !== '全部商品') {
        tempProducts = this.products.filter(item => item.category === this.isCurrent);
      }

      return this.setShowData(tempProducts);
    },
    ...mapGetters('favoritesModules', ['favorites']),
  },
  created() {
    const vm = this;
    // 接類別變數
    if (vm.$route.params.category) {
      vm.isCurrent = vm.$route.params.category;
    }
    vm.getProducts();
    vm.getCart();
    vm.getFavorites();
  },
};
</script>
