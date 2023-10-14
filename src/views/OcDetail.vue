<template>
  <!-- 放置全部的世界观设定 -->
  <div class="oc-detail-container">
    <!-- 明信片 -->
    <OcArchives
      :key="chooseOc.id"
      :picture="chooseOc.picture"
      :ocname="chooseOc.name"
      :ocstatus="chooseOc.status"
      :introduction="chooseOc.introduction"
      :masterName="chooseOc.userId"
      :ocid="chooseOc.id"
      :notindetails="false"
    ></OcArchives>

    <Cupboard :collection="'default.png'"></Cupboard>

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
import Cupboard from "@/components/Cupboard.vue";
import OcArchives from "@/components/OcArchives.vue";
import TextDetail from "@/components/Text.vue";
import request from "@/utils/request";
import qs from "qs";
export default {
  data() {
    return {
      worldid: -1,
      chooseOc: {},
      InfoList: [],
    };
  },
  components: {
    Cupboard,
    OcArchives,
    TextDetail,
  },
  created() {
    //   在最开始的时候获取到路径的id，去寻找全部id
    this.ocid = this.$route.params.id;
    // 获取worldall
    request({
      url: "oc/ocall/" + this.ocid,
    }).then((res) => {
      if (res.data.flag) {
        // 拿到了数据
        this.chooseOc = res.data.object;
        this.InfoList = qs.parse(this.chooseOc.textlist).textlist;
      }
    });
  },
};
</script>

<style>
</style>