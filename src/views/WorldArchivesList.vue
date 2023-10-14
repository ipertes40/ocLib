<template>
  <div class="worldArchivesList-container">
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
        <WorldArchives
          v-for="item in artlist"
          :key="item.id"
          :picture="item.picture"
          :worldname="item.name"
          :worldstatus="item.status"
          :introduction="item.introduction"
          :masterName="item.userId"
          :worldid="item.id"
        ></WorldArchives>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import WorldArchives from "@/components/WorldArchives.vue";
import request from "@/utils/request";
// 导入ajax
export default {
  components: {
    WorldArchives,
  },
  data() {
    return {
      page: 1,
      limit: 1,
      artlist: [],
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
    // console.log(this.artlist);
  },
  methods: {
    // 封装获取文章数据的放发
    async initOcList(isRefresh = false) {
      const { data: res } = await request.get(
        "/world/" + this.page + "/" + this.limit
      );
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
.worldArchivesList-container {
  z-index: 5;
  padding-bottom: 50px;
  margin-top: -20px;
}
.van-pull-refresh {
  padding-top: 20px;
}
</style>