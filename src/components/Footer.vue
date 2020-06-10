<template lang="pug">
  div
    footer
      .container
        .row.d-flex.justify-content-between.align-items-center
          .col-xs-12.d-flex.align-items-center
            span.title 追蹤我們
            span
              a(href="#")
                i.fab.fa-instagram.follow-icon
            span
              a(href="#")
                i.fab.fa-line.follow-icon
            span
              a(href="#")
                i.fab.fa-facebook-square.follow-icon
          .col-xs-12.d-flex.align-items-center
            span.title 聯絡方式
            span.col-xs-6.d-flex.align-items-center
              i.fas.fa-phone
              span.info
                a(href="tel:+886-2-1234567") 02-1234567
            span.col-xs-6.d-flex.align-items-center
              i.far.fa-envelope
              span.info
                a(href="mailto:ownspace@mail.com") ownspace@mail.com
          .col-xs-12.copyright
            span ⓒ AshleyFan 僅個人作品練習，無任何商業用途
              router-link(to="/login")
                i.fas.fa-user-cog.ml-1.adminLogin
</template>

<script>
export default {
  name: 'Footer',
};
</script>
