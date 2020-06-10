<template lang="pug">
  .sidebar
    ul
      li(v-for="item in category" :key="item.id" :value='item' :class="{'active': item === currentOption}" @click.prevent="getCategory(item)") {{ item }}
</template>

<script>
export default {
  name: 'Category',
  props: ['category', 'currentOption'],
  methods: {
    getCategory(option) {
      this.$emit('get-category', option);
    },
  },
};
</script>
