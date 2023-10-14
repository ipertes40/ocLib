<template>
  <div class="mypage-index-container" @click="emitSignal">
    <!-- 放置一些没用的路由向导-->
    <van-cell title="我的探险消息" is-link to="/invitation" />
    <van-cell title="我的世界消息-还没写" is-link to="/msg" />
  </div>
</template>

<script>
export default {
  methods: {},
};
</script>

<style>
</style>