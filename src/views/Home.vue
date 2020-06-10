<template lang="pug">
  div
    header
      .container-fluid.px-0
        .carousel.slide.carousel-fade(data-ride='carousel' data-pause="false")
          .carousel-inner
            .carousel-item.active
              img.picture(src='../assets/img/desktop.jpg' alt='')
              .pictureBox
              h1 簡潔。俐落
              h3 隨手可得的實用文具，崇尚自然簡約的風格
                button.btn(@click.prevent="$router.push('/product_list')")
                  i.fas.fa-arrow-right.mr-1
                  | 逛起來
            .carousel-item
              img.picture(src='../assets/img/green_succulent_plant.jpg' alt='')
              .pictureBox
              h1 生活。質感
              h3 幾樣實用小物就能營造出不同的氛圍，轉換美好心情
                button.btn(@click.prevent="$router.push('/product_list')")
                  i.fas.fa-arrow-right.mr-1
                  | 逛起來
            .carousel-item
              img.picture(src='../assets/img/table.jpg' alt='')
              .pictureBox
              h1 空間。創意
              h3 百搭色調的物品，隨意擺放都別有意境
                button.btn(@click.prevent="$router.push('/product_list')")
                  i.fas.fa-arrow-right.mr-1
                  | 逛起來
      .explore(href="#sectionNewArrival" @click.prevent="scrollIntoView('#sectionNewArrival')")
        i.fas.fa-angle-double-down
    section#sectionNewArrival
      .container-fluid.p-0
        .newArrivalTop
          h3
            span NEW ARRIVAL
            i.fas.fa-shipping-fast.mr-2
            | 本月新品到貨
          .row.d-flex.justify-content-center.align-items-center
            .col-md-6.newItem
              .newArrivalImg(@click.prevent="$router.push({ name: 'ProductList', params: { category: '紙本記事' }})")
                img(src="../assets/img/journal.jpg", alt="alt")
                p 實用好物
              .newArrivalTitle 想要理清滿腹的思緒、靈感，不被眼前凌亂的桌面所影響，您需要來件簡潔又不失質感的日常用品!
            .col-md-6.newItem
              .newArrivalImg(@click.prevent="$router.push({ name: 'ProductList', params: { category: '裝飾小物' }})")
                img(src="../assets/img/tray.jpg", alt="alt")
                p 療癒擺飾
              .newArrivalTitle 總是覺得待在室內令人備感壓迫、毫無生氣嗎? 嘗試擺放一些清新小物，讓空間看起來更愜意!
          .newArrivalButton
            hr
            button.btn(@click.prevent="$router.push('/product_list')") 購物去
      .backgroundImg
    section#popularCategories
      .background
        .text 想提升生活美學，就從現在開始
          button.btn(@click.prevent="$router.push('/product_list')") 去逛逛
      .container-fluid.popularContent
        .popularTop
          h3
            span HOT SALE
            i.fas.fa-fire.mr-2
            | 熱門商品類別
        .popularBottom.pb-0
          .row
            .col-sm-6.p-0
              .popularImg(@click.prevent="$router.push({ name: 'ProductList', params: { category: '紙本記事' }})")
                img(src="../assets/img/writing_list.jpg", alt="alt")
                p 紙本記事
            .col-sm-6.p-0
              .popularImg(@click.prevent="$router.push({ name: 'ProductList', params: { category: '裝飾小物' }})")
                img(src="../assets/img/decors.jpg", alt="alt")
                p 裝飾小物
            .col-sm-6.p-0
              .popularImg(@click.prevent="$router.push({ name: 'ProductList', params: { category: '書寫用具' }})")
                img(src="../assets/img/pink_pen.jpg", alt="alt")
                p 書寫用具
            .col-sm-6.p-0
              .popularImg(@click.prevent="$router.push({ name: 'ProductList', params: { category: '事務文具' }})")
                img(src="../assets/img/glass_jars.jpg", alt="alt")
                p 事務文具
    section#cooperation
      .container
        .row.d-flex.justify-content-center
          .left.col-md-5
            h3 聯絡我們
            p 如有任何問題或商品合作洽談，請留下訊息讓我們知道~!
              |  若是對商店有任何建議與回饋，也歡迎留言，讓我們能夠為您提供更好的購物體驗!
            span
              i.fas.fa-seedling.mr-2
              | OWN SPACE
          .right.col-md-7
            .contactPic
            form.contact
              .form-group
                input.form-control(type="text" name="name" :class="{'is-invalid': errors.has('name')}" v-validate="'required'" placeholder="您的姓名或稱呼")
              .form-group
                input.form-control(type="email" name="email" :class="{'is-invalid': errors.has('email')}" v-validate="'required'" placeholder="您的Email")
              .form-group
                textArea.form-control(type="text" name="message" :class="{'is-invalid': errors.has('message')}" v-validate="'required'" placeholder="想要說的話")
              .formButton
                button.btn(@click.prevent="sendOver") 確認送出
    #sendOverModal.modal.fade(tabindex='-1' role='dialog' aria-hidden='true')
      .modal-dialog.modal-dialog-centered(role='document')
        .modal-content.border-0
          .modal-header
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              span(aria-hidden='true') &times;
          .modal-body
            .modalContent
              p 訊息已送出，非常感謝您的聯繫! 我們收到訊息後，近期將會安排與您聯絡。
</template>

<script>
import $ from 'jquery';

export default {
  name: 'Home',
  methods: {
    sendOver() {
      const vm = this;
      vm.$validator.validate().then((valid) => {
        if (valid) {
          $('#sendOverModal').modal('show');
        }
      });
    },
    scrollIntoView(viewId) {
      $(viewId)[0].scrollIntoView(true);
    },
    handleScroll() {
      if ($(window).scrollTop() > $('#sectionNewArrival').offset().top - 480) {
        $('.newArrivalTitle').addClass('fadInUp');
      } else {
        $('.newArrivalTitle').removeClass('fadInUp');
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    // carousel autoplay do not stop on flag change
    $('.carousel').carousel('cycle');
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
