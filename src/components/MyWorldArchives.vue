<template>
  <div class="ocArchives-container">
    <van-swipe-cell>
      <template #left>
        <van-button square type="primary" text="删除" @click="emitDel" />
      </template>
      <!-- <template #left>
        <van-button square type="primary" text="不再显示" />
      </template> -->
      <div class="infoBox">
        <div class="round"></div>
        <div class="info">
          <div class="intro">
            <div class="name">{{ worldname }}</div>
            <div class="status">{{ worldstatus }}</div>
            <div class="text">{{ introduction }}</div>
          </div>
          <div class="qpic">
            <img
              :src="
                picture != null
                  ? 'http://localhost:80/upload' + picture
                  : 'http://localhost:80/upload/default.png'
              "
              alt=""
            />
          </div>
        </div>
      </div>
      <template #right>
        <van-button round type="danger" text="操作" @click="editmsg" />
        <van-button round type="danger" text="修改图片" @click="editpic" />
      </template>
    </van-swipe-cell>
    <!-- 这里存放已经添加进来的一些设定或者图 -->
  </div>
</template>

<script>
import request from "@/utils/request.js";
// import { getAllPath } from "@/api/ocArchivesAPI.js";
export default {
  name: "ArticleInfo",
  //   自定义属性
  props: {
    worldid: {
      type: Number,
      default: -1,
    },
    picture: {
      type: String,
      default: "",
    },
    worldname: {
      type: String,
      default: "oc1088",
    },
    worldstatus: {
      type: String,
      default: "请输入状态",
    },
    introduction: {
      // 可能会接受多个可能得类型
      type: String,
      // type: [Number, String],
      default: "输入简单介绍",
    },
    masterName: {
      type: [Number, String],
      default: "用户username",
    },
    notinvate: {
      type: Boolean,
      default: true,
    },
    notmine: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      imgBasepath: "",
    };
  },
  created() {
    // 获取基础路径
    // 获取完整路径
    var path = "";
    var pic = pic + "";
    request.get("/getpath").then((res) => {
      // 给每一个存上
      this.imgBasepath =
        "localhost:80/" + this.imgBasepath + res.data + this.picture;
    });
  },
  methods: {
    handleInvate() {
      // 处理 跳转到对应的页面
      // {path:'/home',query: {id:'1'}}
      this.$router.push({ path: "/square/invate", query: { id: this.ocid } });
    },
    editmsg() {
      this.$emit("editshow", true);
    },
    editpic() {
      this.$emit("picshow", true);
    },
    emitDel() {
      this.$emit("delOc", this.worldid);
    },
  },
};
</script>

<style lang="less" scoped>
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
</style>