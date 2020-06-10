<template lang="pug">
  div
    nav.navbar.navbar-expand-md.fixed-top.d-flex.justify-content-center.align-items-center
      .container-fluid
        router-link.navbar-brand(to="/")
          i.fas.fa-seedling.mr-3
          span Own Space
        button.navbar-toggler(type='button' data-toggle='collapse' data-target='#topbarContent' aria-controls="topbarContent"
       aria-expanded="false")
          i.fas.fa-bars.navbarToggler-icon
        .collapse.navbar-collapse.ml-3#topbarContent
          ul.navbar-nav.mr-auto
            li.nav-item
              router-link.nav-link(to="/admin/products") 產品列表
            li.nav-item
              router-link.nav-link(to="/admin/orders") 訂單列表
            li.nav-item
              router-link.nav-link(to="/admin/coupons") 優惠方案
          ul.navbar-nav
            li.nav-item
              .nav-link(@click.prevent="$router.push(`/product_list`)")
                i.fas.fa-store-alt
            li.nav-item
              .nav-link(href='#' @click.prevent='signout')
                i.fas.fa-sign-out-alt
</template>

<script>
export default {
  name: 'Topbar',
  methods: {
    signout() {
      const vm = this;
      const url = `${process.env.VUE_APP_APIPATH}/logout`;
      vm.$http.post(url).then((response) => {
        if (response.data.success) {
          vm.$router.push('/login');
        }
      });
    },
  },
};
</script>
