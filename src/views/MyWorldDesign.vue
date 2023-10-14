<template>
  <div class="my-world-design-container">
    <van-nav-bar
      title="世界工作台"
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