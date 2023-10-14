<template>
  <div class="ocArchivesList-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <van-nav-bar title="头条新闻" left-arrow :fixed="true" /> -->
        <!-- 导入 注册 并使用组件 -->
        <!-- 在使用组件的时候 如果某个属性名是小驼峰，则绑定属性的时候 建议改写成连字符格式 -->
        <!-- 例如cmtCount建议写成cmt-count -->
        <OcArchives
          v-for="item in artlist"
          :key="item.id"
          :picture="item.picture"
          :ocname="item.name"
          :ocstatus="item.status"
          :introduction="item.introduction"
          :masterName="item.userId"
          :ocid="item.id"
          :notmine="item.userId != user.id"
        ></OcArchives>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import OcArchives from "@/components/OcArchives.vue";
// 导入ajax
import { getArchivesList } from "@/api/ocArchivesAPI.js";
import request from "@/utils/request";

export default {
  components: {
    OcArchives,
  },
  data() {
    return {
      // 当前用户
      user: {},
      page: 1,
      limit: 3,
      artlist: [],
      // oc文件查找路径的前缀
      suffix: "",
      // 是否正在加载下一页数据  如果为true 不会反复出发load事件
      loading: true,
      // 是否所有的数据都加载完毕了，如果没有了，吧finished改为true
      finished: false,
      // 是否正在下拉刷新
      refreshing: false,
    };
  },
  created() {
    this.initOcList();
    // 获取用户id
    request({
      method: "GET",
      url: "/user",
    }).then((res) => {
      if (res.data.flag) {
        this.user = res.data.object;
      }
    });
  },
  methods: {
    // 封装获取文章数据的放发
    async initOcList(isRefresh = false) {
      const { data: res } = await getArchivesList(this.page, this.limit);

      //   console.log(res);
      // 拼接 上拉加载更多 就数据在前 新数据在后
      if (!isRefresh) {
        this.artlist = [...this.artlist, ...res.object];
        this.loading = false;
      } else {
        this.artlist = [...res.object, ...this.artlist];
        this.refreshing = false;
      }
      // 如果res啥也没的，那就是说明没有了，finished = flase
      if (res.object.length == 0) {
        this.finished = true;
      }
    },
    // 只要onLoad被调用 就请求下一页数据
    onLoad() {
      this.page += 1;
      this.initOcList();
    },
    // 下拉刷新
    onRefresh() {
      // 让页码+1 重新请求接口获取数据
      this.page += 1;
      this.initOcList(true);
    },
  },
};
</script>

<style scoped>
.ocArchivesList-container {
  z-index: 5;
  margin-top: -20px;
  padding-bottom: 50px;
}
.van-pull-refresh {
  padding-top: 20px;
}
</style>