<template>
  <div class="square-container">
    <van-nav-bar
      title="欢迎来到广场"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />
    <div class="squarenav">
      <span>
        <router-link to="/square/ocSquare">oc广场</router-link>
      </span>
      <span>
        <router-link to="/square/worldLib">世界图鉴</router-link>
      </span>
      <span>
        <router-link to="/square/worklist">作品展示</router-link>
      </span>
    </div>
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

<style scope>
/* .square-container {
  padding-top: 45px;
  position: relative;
} */
.squarenav {
  z-index: 8;
  height: 20px;
  display: flex;
  background: #f0f0f0;
  border-radius: 10px;
  margin-bottom: 10px;
}

.squarenav span {
  z-index: 9;
  flex: 10;
  text-align: center;
  color: #999999;
}

.squarenav span a {
  color: #999999;
}

.squarenav span a.router-link-active {
  color: #ff6c37;
}
</style>