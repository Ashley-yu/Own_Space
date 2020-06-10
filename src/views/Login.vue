<template lang="pug">
  .login.d-flex.justify-content-center.align-items-center
    Alert
    .signBox
      form.form-signin.d-flex.justify-content-center.flex-column(@submit.prevent='signin')
        h3.mb-3.font-weight-normal
          i.fas.fa-user-cog.mr-1
          | 後台管理者登入
        .form-group
          input#inputEmail.form-control(type='email' placeholder='Email address' v-model='user.username' required='' autofocus='')
        .form-group
          input#inputPassword.form-control(type='password' v-model='user.password' placeholder='Password' required='')
        button.btn(type='submit') Sign in
</template>

<script>
import Alert from '@/components/AlertMessage.vue';

export default {
  name: 'Login',
  components: {
    Alert,
  },
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    signin() {
      // 登入的 API
      const api = `${process.env.VUE_APP_APIPATH}/admin/signin`;
      const vm = this;
      vm.$http.post(api, vm.user).then((response) => {
        // 登入成功時回到首頁
        if (response.data.success) {
          vm.$router.push('/admin/products');
        } else {
          vm.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' });
        }
      });
    },
  },
};
</script>

<style lang="sass" scope>
.login
  input
    -webkit-appearance: none
    -moz-appearance: none
    appearance: none
    margin: 0
    outline: 0 !important
    -webkit-box-shadow: none !important
    box-shadow: none  !important
</style>
