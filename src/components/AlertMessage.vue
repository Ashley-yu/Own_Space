<template lang="pug">
  .message-alert
    .alert.alert-dismissible(:class="item.status" v-for='(item, i) in messages' :key='i')
      i.fas.fa-tired.mr-3(v-if="item.status == 'danger'")
      i.fas.fa-grin.mr-3(v-else)
      | {{ item.message }}
      button.close(type='button' @click='removeMessage(i)' aria-label='Close')
        span(aria-hidden='true') &times;
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AlertMessage',
  data() {
    return {
    };
  },
  methods: {
    removeMessage(num) {
      this.$store.dispatch('alertMessageModules/removeMessage', num);
    },
  },
  computed: {
    ...mapGetters('alertMessageModules', ['messages']),
  },
};
</script>
