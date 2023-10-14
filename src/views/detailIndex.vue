

<template>
  <div class="detailIndex-container">
    <van-nav-bar
      title="详情页面"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  components: {},
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>