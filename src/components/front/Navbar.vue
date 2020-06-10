<template lang="pug">
  div
    .topBox(:class="{'hide': isClose}")
    .fixed-top
      .newsContent(:class="{'hide': isClose}")
        .news.d-flex.justify-content-sm-center.align-items-center.justify-content-start
          p 想要取得商品購物優惠嗎?
          button.btn.btn-sm(@click="openModal") 馬上領取
          .newsClose(@click="isClose = true") X
      nav.navbar.navbar-expand.d-flex.justify-content-center.align-items-center
        .container-fluid
          router-link.navbar-brand(to="/")
            i.fas.fa-seedling.mr-1.mr-sm-3
            span Own Space
          .collapse.navbar-collapse.ml-1.ml-sm-3#navbarContent
            ul.navbar-nav.mr-sm-auto.ml-auto.ml-sm-0
              li.nav-item
                router-link.nav-link(to="/product_list")
                  i.fas.fa-store-alt.mr-1
                  span.shop 逛商店
            ul.navbar-nav
              li.nav-item.dropdown(:class="{'avoid': avoidClick}" @click.prevent="getFavorites")
                .nav-link.dropdown-toggle#favorDropdown(data-toggle='dropdown' aria-haspopup="true" aria-expanded="false")
                  i.fas.fa-thumbs-up
                    span(v-if="favorLength > 0") {{ favorLength }}
                .dropdown-menu.dropdown-menu-right(aria-labelledby="favorDropdown")
                  table.itemContent
                    tbody.d-flex.justify-content-start.align-items-center.flex-column
                      h3.itemTitle(v-if='favorLength === 0') 還沒有喜歡的商品嗎?
                      h3.itemTitle(v-else) 按讚好物
                      tr(v-for="item in favorites" :key="item.id")
                        td
                          i.fas.fa-cart-plus.cartIcon(@click.stop="addtoCart(item)" v-if="item.id !== status.loadingItem")
                          i.fas.fa-spinner.fa-spin.disabled(@click.stop="" v-else)
                        td.itemPicture
                          .picturewrap
                            img(:src="item.imageUrl", alt="")
                        td.itemName(@click="$router.push(`/product_detail/${item.id}`)") {{ item.title }}
                        td.itemDelete(@click.stop="removeFavorItem(item)")
                          span X
              li.nav-item.dropdown(:class="{'avoid': avoidClick}" @click.prevent="getCart")
                .nav-link.dropdown-toggle#cartDropdown(data-toggle='dropdown' aria-haspopup="true" aria-expanded="false")
                  i.fas.fa-shopping-cart(:class="{'empty': cartQty === 0}")
                    span(v-if="cartQty > 0") {{ cartQty }}
                .dropdown-menu.dropdown-menu-right(aria-labelledby="cartDropdown")
                  table.itemContent
                    tbody.d-flex.justify-content-start.align-items-center.flex-column
                      h3.itemTitle(v-if='cartQty === 0') 快將想要的商品丟進來!
                      h3.itemTitle(v-else) 購物車
                      tr(v-for="item in cart" :key="item.id")
                        td.itemPicture
                          .picturewrap
                            img(:src="item.imageUrl", alt="")
                        td.itemName(@click="$router.push(`/product_detail/${item.id}`)") {{ item.title }}
                        td x{{ item.qty }}
                        td {{ item.price | currency }}
                        td.itemDelete(@click.stop="removeCartItem(item.id)")
                          span X
                  .totalInfo
                    div 小計
                    .itemTotal {{ cartTotal | currency }}
                    button.btn.checkOut(@click="$router.push('/product_list')" v-if="!cartQty || cartQty === 0") 購物去
                    button.btn.checkOut(@click="$router.push('/check_order')" v-else) 結帳去
    #getCouponModal.modal.fade(tabindex='-1' role='dialog' aria-hidden='true' data-backdrop='static')
      .modal-dialog.modal-dialog-centered(role='document')
        .modal-content.border-0
          .modal-header
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              span(aria-hidden='true') &times;
          .modal-body
            .modalContent(v-if="!isSubscribe")
              p 立即訂閱我們，請在下方留下您的Email，就不會錯過任何最新消息，並能獲取購物優惠折扣碼唷!!
              .form-group
                input.form-control(type="email" name="email" :class="{'is-invalid': errors.has('email')}" v-validate="'required'" placeholder="Email")
                span.text-danger(v-if="errors.has('email')") {{ errors.first('email') }}
            .modalContent(v-else)
              p 訂閱成功!! 結帳時，請別忘記輸入下方優惠代碼以取得折扣~!
              .coupon
                .backImg
                h3 輸入優惠券代碼「
                  span OWNSPACE20
                  | 」即享8折優惠
            .subscribeButton
              button.btn(type='button' @click='subscribe' v-if="!isSubscribe") 訂閱
</template>

<script>
import { mapGetters } from 'vuex';
import $ from 'jquery';

export default {
  name: 'Navbar',
  data() {
    return {
      status: {
        loadingItem: '', // 當筆點選商品 id
      },
      isClose: false,
      isSubscribe: false,
    };
  },
  methods: {
    // 取得購物車
    getCart() {
      this.$store.commit('cartModules/CART');
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

      vm.getCart();
    },
    // 取得喜歡的商品
    getFavorites() {
      this.$store.commit('favoritesModules/FAVORITES');
      this.$store.commit('favoritesModules/FAVORITESLENGTH');
    },
    // 移除喜歡的商品
    removeFavorItem(product) {
      const index = this.favorites.indexOf(product);

      this.$store.commit('favoritesModules/REMOVEFAVORITEM', index);

      // 儲存至 localStorage
      this.$store.commit('favoritesModules/UPDATEFAVORITES', index);
      this.getFavorites();
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
    openModal() {
      $('#getCouponModal').modal('show');
    },
    // 訂閱取得折扣碼
    subscribe() {
      const vm = this;
      vm.$validator.validate().then((valid) => {
        if (valid) {
          vm.isSubscribe = true;
        }
      });
    },
  },
  computed: {
    // 結帳階段避免navbar購物車被異動
    avoidClick() {
      if (this.$route.path === '/check_order' || this.$route.path === '/buyer_info') {
        $('#cartDropdown').dropdown('hide');
        $('#favorDropdown').dropdown('hide');
        return true;
      }
      return false;
    },
    ...mapGetters('cartModules', ['cart', 'cartQty', 'cartTotal']),
    ...mapGetters('favoritesModules', ['favorites', 'favorLength']),
  },
  mounted() {
    // 進入網頁/重新整理時，若購物車無資料則開啟dropdown-menu
    if (this.cartQty === 0) {
      $('#cartDropdown').dropdown('show');
    }
  },
  created() {
    const vm = this;
    vm.getCart();
    vm.getFavorites();
  },
};
</script>
