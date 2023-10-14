<template>
  <div class="app-container">
    <!-- 占位符 -->
    <router-view></router-view>
    <!-- 下部分栏 -->
    <van-tabbar v-model="active" route @change="onChange">
      <!-- <van-tabbar-item badge="3" replace to="/"> 这个badge是消息提示，有空再说吧 -->
      <van-tabbar-item replace to="/square">
        <span>广场</span>
        <template #icon="props">
          <img v-if="props.active" src="./static/images/square-action.png" />
          <img v-else src="./static/images/square-inaction.png" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/home">
        <span>工作台</span>
        <template #icon="props">
          <img v-if="props.active" src="./static/images/main-action.png" />
          <img v-else src="./static/images/main-inaction.png" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/mypage" :badge="mesNum">
        <span>我的</span>
        <template #icon="props">
          <img v-if="props.active" src="./static/images/main-action.png" />
          <img v-else src="./static/images/main-inaction.png" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// 导入需要的组件库
import request from "@/utils/request";

export default {
  data() {
    return {
      active: 0,
      icon: {
        active1: "./static/images/ocpic.png",
        active2: "./static/images/square-action.png",
        inactive1: "./static/images/main-inaction.png",
        inactive2: "./static/images/square-inaction.png",
      },
      // 没有被处理的消息
      mesNum: 1,
    };
  },
  create() {
    // 初始化信息
    request({
      url: "/",
    });
  },
  setup() {
    const active = ref(0);
    const onChange = (index) => Toast(`标签 ${index}`);
    return {
      icon,
      onChange,
    };
  },
  beforeDestory() {
    console.log("111");
    localStorage.clear();
  },
  // 处理函数
  methods: {
    onChange() {
      console.log(this.active);
    },
  },
  mounted() {},
};
</script>

<style lang="less">
.app-container {
  padding: 1px 20px 20px;
  padding-top: 50px;
  background-color: #fdfdfd;
  padding-bottom: 50px;
}
.box {
  display: flex;
}
</style>
