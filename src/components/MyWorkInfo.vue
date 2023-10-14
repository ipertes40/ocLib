<template>
  <div class="workinfo-container">
    <!-- 简单的作品信息，不包含详细内容 -->
    <van-swipe-cell>
      <template #left>
        <van-button square type="primary" text="删除" @click="emitDel" />
      </template>
      <div class="infoBox">
        <div class="round"></div>
        <div class="info">
          <div class="intro">
            <div class="name">{{ title }}</div>
            <!-- <div class="status">{{ ocstatus }}</div> -->
            <div class="text">{{ introduction }}</div>
          </div>
          <div class="qpic">
            <img
              :src="
                cover != null
                  ? 'http://localhost:80/upload' + cover
                  : 'http://localhost:80/upload/default.png'
              "
              alt=""
            />
          </div>
        </div>
        <div class="tagsInfo">
          <!-- 标签 -->
          <p>
            <span>相关oc：</span>
            <span v-for="item in ocs" :key="item.id" @click="toOc(item.id)">{{
              item.name
            }}</span>
          </p>
          <p>
            <span>相关世界：</span>
            <span
              v-for="item in worlds"
              :key="item.id"
              @click="toWorld(item.id)"
              >{{ item.name }}</span
            >
          </p>
        </div>
        <div class="otherInfo" v-if="notmine">
          <span>
            <router-link to="/about/tab1">来自用户{{ author }}</router-link>
          </span>
          <span>
            <router-link :to="'/detailPage/work/' + workid"
              >查看详情></router-link
            >
          </span>
        </div>
        <div class="otherInfo" v-if="!notmine">
          <span
            ><router-link :to="'/workdesigns/edit/' + workid"
              >查看更多并修改></router-link
            ></span
          >
        </div>
      </div>
      <template #right>
        <van-button round type="danger" text="修改介绍" @click="editmsg" />
        <van-button round type="danger" text="修改封面" @click="editpic" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
import request from "@/utils/request.js";
// import { getAllPath } from "@/api/ocArchivesAPI.js";
import qs from "qs";
export default {
  name: "MyWorkInfo",
  //   自定义属性
  props: {
    ocList: {
      type: String,
    },
    worldList: {
      type: String,
    },
    workid: {
      type: Number,
      default: -1,
    },
    // 封面
    cover: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "对方并未输入标题",
    },
    introduction: {
      // 可能会接受多个可能得类型
      type: String,
      // type: [Number, String],
      default: "无简介",
    },
    author: {
      type: [Number, String],
      default: "位置用户发言",
    },
    notmine: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      imgBasepath: "",
      // 包含的全部oc
      ocs: {},
      worlds: {},
    };
  },
  created() {
    console.log(this.relateOc);
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.ocs = qs.parse(this.ocList).relateOc;
      this.worlds = qs.parse(this.worldList).relateWorld;
    },
    editmsg() {
      this.$emit("editshow", true);
    },
    editpic() {
      this.$emit("picshow", true);
    },
    emitDel() {
      this.$emit("delOc", this.workid);
    },
  },
};
</script>

<style lang="less"  scoped>
.infoBox {
  width: 360px;
  min-height: 140px;
  /* height: 140px; */
  background-color: #f5f5f5;
  /* position: relative; */
  border-radius: 15px;
}
.info {
  padding-top: 2%;
  padding-left: 9%;
  color: #828282;
  min-height: 100px;
  display: flex;
}
.intro {
  flex: 2;
  /* background-color: aqua; */
}
.status {
  font-size: 10px;
  margin-bottom: 3%;
}
.text {
  font-size: 12px;
  margin-bottom: 2%;
}
.qpic {
  flex: 1;
  padding: 5px;
  /* background-color: pink; */
  overflow: hidden;
}
.qpic img {
  width: 100%;
}

.round {
  width: 15px;
  height: 15px;
  border: 1px solid #969799;
  position: fixed;
  border-radius: 7.5px;
  top: 5%;
  left: 2%;
  background-color: white;
}

.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}

.van-pull-refresh {
  padding-top: 50px;
}

.otherInfo {
  display: flex;
}

.otherInfo span {
  flex: 1;
  text-align: center;
  margin-bottom: 5px;
}

.otherInfo span a {
  font-size: 12px;
  color: #828282;
}
.otherInfo span:nth-child(2) button {
  height: 25px;
  width: 60px;
  // background-color: red;
  background-color: #fdfdfd;
  color: #828282;
  border: 1px solid #828282;
}

.ocArchives-container {
  margin-bottom: 10px;
}

.tagsInfo {
  font-size: 12px;
  color: #ce9178;
  padding-left: 10px;
}
.tagsInfo span {
  padding-left: 3px;
}
</style>