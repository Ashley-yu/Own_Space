<template lang="pug">
  .orderProgress
    .row.m-0
      .col-sm-4
        .step(:class="{'current': currentStep === 1}") Step1
          p 確認購買
      .col-sm-4
        .step(:class="{'current': currentStep === 2}") Step2
          p 填寫資料
      .col-sm-4
        .step(:class="{'current': currentStep === 3}") Step3
          p 完成訂單
</template>

<script>
export default {
  name: 'OrderProgress',
  props: ['currentStep'],
};
</script>
