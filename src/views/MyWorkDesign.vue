<template>
  <div class="my-work-design-container">
    <van-nav-bar
      title="事件记录仪"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
    };
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>