<template lang="pug">
  div.d-flex.justify-content-center.align-items-center.pb-5
    ul.pages
      li.page.previus(:class="{'disabled': !pagination.has_pre}")
        a.pageNumber(href="#" @click.prevent="getPages(pagination.current_page - 1)")
          i.fas.fa-angle-left
      li.page(v-for="page in pagination.total_pages" :key="page" :class="{'active': pagination.current_page === page}")
        a.pageNumber(href="#" @click.prevent="getPages(page)") {{ page }}
      li.page.next(:class="{'disabled': !pagination.has_next}")
        a.pageNumber(href="#" @click.prevent="getPages(pagination.current_page + 1)")
          i.fas.fa-angle-right
</template>

<script>
export default {
  name: 'Pagination',
  props: ['pagination'],
  methods: {
    getPages(page) {
      this.$emit('get-pagination', page);
    },
  },
};
</script>
