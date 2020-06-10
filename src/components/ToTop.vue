<template lang="pug">
  div.toTop(@click="scrollToTop")
    i.fas.fa-angle-double-up
</template>

<script>
import $ from 'jquery';

export default {
  name: 'ToTop',
  methods: {
    scrollToTop() {
      $('body,html').animate({
        scrollTop: 0,
      }, 'slow');
    },
    handleScroll() {
      if ($(window).scrollTop() > 500) {
        $('.toTop').addClass('show');
      } else {
        $('.toTop').removeClass('show');
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
