<template lang="pug">
  div
    .container-fluid.px-0.layout
      <!-- isLoading： false-停用/ true-啟用 -->
      loading(loader="dots" color="#D1ACA6" :active.sync='isLoading')
      Navbar
      Alert
      transition(mode="out-in")
        //- 加上key使同一頁面不同參數時重新載入component
        router-view(:key="$route.fullPath")
    Footer
</template>

<script>
import { mapGetters } from 'vuex';
import Navbar from '@/components/front/Navbar.vue';
import Footer from '@/components/Footer.vue';
import Alert from '@/components/AlertMessage.vue';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Footer,
    Alert,
  },
  computed: {
    ...mapGetters(['isLoading']),
  },
};
</script>

<style lang="sass" scope>
.layout
  min-width: 320px
  input
    -webkit-appearance: none
    -moz-appearance: none
    appearance: none
    margin: 0
    outline: 0 !important
    -webkit-box-shadow: none !important
    box-shadow: none  !important
</style>
