<template>
  <div class="my-oc-design-container">
    <van-nav-bar
      title="oc工作台"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>