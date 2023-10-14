<template>
  <!-- 放置全部的世界观设定 -->
  <div class="work-detail-container">
    <!-- 明信片 -->
    <WorkInfo
      :workid="chooseWork.id"
      :relateOc="chooseWork.relateOc"
      :relateWorld="chooseWork.relateWorld"
      :cover="chooseWork.cover"
      :introduction="chooseWork.introduction"
      :author="chooseWork.author"
      :notmine="true"
      :title="chooseWork.title"
      v-if="showInfo"
    ></WorkInfo>

    <TextDetail
      v-for="item in InfoList"
      :key="item.id"
      :it="item"
      @delit="deltext"
    >
    </TextDetail>
  </div>
</template>

<script>
import WorkInfo from "@/components/WorkInfo.vue";
import TextDetail from "@/components/Text.vue";
import request from "@/utils/request";
import qs from "qs";
export default {
  data() {
    return {
      // 传入作品
      chooseWork: {},
      InfoList: [],
      showInfo: false,
    };
  },
  components: {
    WorkInfo,
    TextDetail,
  },
  created() {
    //   在最开始的时候获取到路径的id，去寻找全部id
    const workid = this.$route.params.id;
    // 获取worldall
    request({
      url: "work/workall/" + workid,
    }).then((res) => {
      if (res.data.flag) {
        // 拿到了数据
        this.chooseWork = res.data.object;
        this.InfoList = qs.parse(this.chooseWork.textlist).textlist;
        this.showInfo = true;
      }
    });
  },
};
</script>

<style>
</style>