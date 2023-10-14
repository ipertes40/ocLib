<template>
  <div class="worklist-container">
    <WorkInfo
      v-for="item in worklist"
      :key="item.id"
      :workid="item.id"
      :relateOc="item.relateOc"
      :relateWorld="item.relateWorld"
      :cover="item.cover"
      :introduction="item.introduction"
      :author="item.author"
      :notmine="item.author != user.id"
      :title="item.title"
    ></WorkInfo>
  </div>
</template>

<script>
import request from "@/utils/request";
import FromOcInvitation from "@/components/FromOcInvitation.vue";
import ToOcInvitation from "@/components/ToOcInvitation.vue";
import WorkInfo from "@/components/WorkInfo.vue";
export default {
  // 把所有的requestlist全都取出来
  components: {
    FromOcInvitation,
    ToOcInvitation,
    WorkInfo,
  },
  data() {
    return {
      // 存放所有的作品对象
      worklist: [],
      user: {},
    };
  },
  created() {
    // 获取当前用户
    request({
      method: "GET",
      url: "/user",
    }).then((res) => {
      if (res.data.flag) {
        this.user = res.data.object;
      }
    });
    // 首先获取全部的作品
    request({
      method: "GET",
      url: "/work",
    }).then((res) => {
      if (res.data.flag) {
        console.log("work==>");
        console.log(res.data.object);
        this.worklist = res.data.object;
      }
    });
  },
  methods: {
    onClick(name, title) {
      Toast(title);
    },
    // onClicksta(name, title) {
    //   Toast(title);
    // },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-sidebar .van-sidebar-item {
  float: left;
}
</style>