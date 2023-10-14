<template>
  <!-- 放置全部的世界观设定 -->
  <div class="world-detail-container">
    <!-- 明信片 -->
    <WorldArchives
      :key="chooseWorld.id"
      :picture="chooseWorld.picture"
      :worldname="chooseWorld.name"
      :worldstatus="chooseWorld.status"
      :introduction="chooseWorld.introduction"
      :masterName="chooseWorld.userId"
      :worldid="chooseWorld.id"
      :notindetails="false"
    ></WorldArchives>

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
import WorldArchives from "@/components/WorldArchives.vue";
import TextDetail from "@/components/Text.vue";
import request from "@/utils/request";
import qs from "qs";
export default {
  data() {
    return {
      worldid: -1,
      chooseWorld: {},
      InfoList: [],
    };
  },
  components: {
    WorldArchives,
    TextDetail,
  },
  created() {
    //   在最开始的时候获取到路径的id，去寻找全部id
    this.worldid = this.$route.params.id;
    // 获取worldall
    request({
      url: "world/worldall/" + this.worldid,
    }).then((res) => {
      if (res.data.flag) {
        // 拿到了数据
        this.chooseWorld = res.data.object;
        this.InfoList = qs.parse(this.chooseWorld.textlist).textlist;
      }
    });
  },
};
</script>

<style>
</style>