<template>
  <div class="Game-container">
    <van-nav-bar
      title="抽抽乐"
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

<style lang="less" scoped>

</style>