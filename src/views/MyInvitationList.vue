<template>
  <div class="message-list-container">
    <van-nav-bar
      title="我的oc邀请"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />
    <!-- 能展示其他人的oc图，并确定是否同意 -->
    <!-- xx用户希望加入您的xx世界，左边是oc 右边是 -->
    <!-- 可以分批查看已经解决的和没有解决的 -->
    <van-tabs @click="onClick">
      <van-tab title="提出邀请">
        <!-- 这里放置用户提出的邀请，也就是from_user为自己id的   -->
        <FromOcInvitation
          v-for="item in FromMeInvitation"
          :key="item.id"
          :invitation="item"
        ></FromOcInvitation>
      </van-tab>
      <van-tab title="收到邀请">
        <ToOcInvitation
          v-for="item in ToMeInvitation"
          :key="item.id"
          :invitation="item"
        ></ToOcInvitation>
      </van-tab>
      <van-tab title="建立连接">
        <!-- 这里放置用户提出的邀请，也就是from_user为自己id的   -->
        <OcLink v-for="item in OcLink" :key="item.id" :oclink="item"></OcLink>
      </van-tab>
      <!-- <van-tab title="标签 1">全部消息</van-tab> -->
      <!-- <van-tab title="标签 2">未处理消息</van-tab> -->
    </van-tabs>
  </div>
</template>

<script>
import request from "@/utils/request";
import FromOcInvitation from "@/components/FromOcInvitation.vue";
import ToOcInvitation from "@/components/ToOcInvitation.vue";
import OcLink from "@/components/OcLink.vue";
import { Toast } from "vant";
export default {
  // 把所有的requestlist全都取出来
  components: {
    FromOcInvitation,
    ToOcInvitation,
    OcLink,
  },
  data() {
    return {
      // 个人提出的邀请
      FromMeInvitation: {},
      ToMeInvitation: {},
      OcLink: [],
    };
  },
  created() {
    // 首先获取全部的邀请
    request({
      method: "GET",
      url: "/invate/getfrom",
    }).then((res) => {
      if (res.data.flag) {
        this.FromMeInvitation = res.data.object;
      }
    });
    request({
      method: "GET",
      url: "/invate/getto",
    }).then((res) => {
      if (res.data.flag) {
        this.ToMeInvitation = res.data.object;
      }
    });
    request({
      url: "/oclink",
      method: "GET",
    }).then((res) => {
      if (res.data.flag) {
        // 获得数据
        this.OcLink = res.data.object;
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