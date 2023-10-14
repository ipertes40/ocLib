<template>
  <div class="mypage-container">
    <van-nav-bar
      title="用户中心"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />

    <div class="user-bar">
      <!-- 存放头像什么的地方 -->
      <UserBar :id="id"></UserBar>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import UserBar from "@/components/UserBar.vue";
export default {
  data() {
    return {
      showUserBar: true,
      id: window.sessionStorage.getItem("user"),
    };
  },
  components: {
    UserBar,
  },
  methods: {
    created(){
      console.log("this.id=" ,this.id);
    },
    hidden() {
      alert("get");
      this.showUserBar = false;
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>