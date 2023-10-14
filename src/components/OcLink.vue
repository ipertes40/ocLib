<template>
  <div class="oclink-container">
    <!-- 在这里可以看到链接的一些基本信息 和一些作品 -->
    <van-cell :value="centens" />
    <span class="danger">
      链接只可创建一次作品，删除作品后链接失效，且不可逆
    </span>
    <div class="delete" @click.stop="deleteLink">删除</div>

    <div class="otherInfo">
      <span></span>
      <span>
        <router-link :to="'/detailPage/oc/' + toOc.id"
          >查看邀请的oc：{{ toOc.name }} >
        </router-link>
      </span>
    </div>
    <!-- 跳转到作品更新列表 -->
    <div class="btnBox">
      <button @click="toWorkDesign()">修改</button>
      <span></span>
      <button @click="toWorkDetail()">查看详情</button>
    </div>
    <!-- <TextF :it="text"> </TextF> -->
  </div>
</template>

<script>
// import OcArchives from "@/components/OcArchives.vue";
import request from "@/utils/request";
import TextF from "@/components/Text.vue";

export default {
  // 传进来的是一整个邀请信息 包含from、to的用户和oc，状态和remark以及自身id
  // 不需要明显的复用
  props: {
    // 包含一整个 邀请
    oclink: {
      type: Object,
      default: {},
    },
  },
  methods: {
    // 跳转到详情页
    deleteLink() {
      request({
        method: "DELETE",
        url: "/oclink/" + this.oclink.id,
      }).then((res) => {
        if (res.data.flag) {
          this.$router.go(0); // 刷新
        }
      });
    },
    toWorkDetail() {
      this.$router.push("/detailPage/work/" + this.oclink.workId);
    },
    toWorkDesign() {
      this.$router.push({
        name: "editWork",
        // path: "/workdesigns/edit/" + this.oclink.workId,
        // 传入workId
        params: { id: this.oclink.workId, key: "link" },
        //有时候也会存在一个query的对象参数
      });
    },
  },
  data() {
    return {
      fromOc: {},
      toOc: {},
      centens: "",
      text: {},
    };
  },
  created() {
    // console.log(this.oclink);
    // this.text = { title: "remark", text: this.invitation.invRemark, type: 1 };
    // console.log(this.text);
    // // 在最开始 要按照该邀请 获得这个oc的全部设定
    request({
      // 对提出的用户来说来说，自己需要知道每个邀请的状态
      url: "/oc/" + this.oclink.fromOc,
      method: "GET",
    }).then((res) => {
      if (res.data.flag) {
        // 拿到了数据
        this.fromOc = res.data.object;
      }
      request({
        // 对提出的用户来说来说，自己需要知道每个邀请的状态
        url: "/oc/" + this.oclink.toOc,
        method: "GET",
      }).then((res) => {
        if (res.data.flag) {
          // 拿到了数据
          this.toOc = res.data.object;
          // 异步请求，放在这里解决。
          this.centens =
            this.fromOc.name + " 对 " + this.toOc.name + " 发出的邀请";
        }
      });
    });
  },
  components: { TextF },
};
</script>

<style scoped >
.oclink-container {
  border: 1px solid #dddddd !important;
  border-radius: 15px;
  padding-bottom: 10px;
  margin-top: 10px;
  text-align: center;
  position: relative;
}
.delete {
  position: absolute;
  right: 5%;
  top: 3%;
  font-size: 10px;
  color: #828282;
}

.van-cell {
  background-color: rgb(0, 0, 0, 0) !important;
  font-weight: 700;
  color: #9aa0a6;
}
.otherInfo {
  display: flex;
}

.danger {
  color: #fc5430;
  font-size: 12px;
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
  background-color: #fdfdfd;
  color: #828282;
  border: 1px solid #828282;
}
.statu span {
  text-align: center;
  font-size: 10px !important;
  color: #fc5430 !important;
}
.btnBox {
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
}
.btnBox span {
  flex: 0.2;
}
.btnBox button {
  font-size: 12px;
  flex: 1;
  border: none;
  color: #626262;
  background-color: #eeeeee;
  border-radius: 3px;
}
</style>