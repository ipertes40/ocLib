<template>
  <div class="toinv-container">
    <!-- 这个是自己的邀请 对自己进行展示 -->
    <!-- 一个邀请的内容 需要有 选中的oc 连接的oc 和 提供的reamrk备注 -->
    <!-- 根据不同的status 显示不同的消息，如果不是1 就说明处理过了 提示现在状态 -->
    <!-- 放一个oc板块，然后底下一个text放入remark，我他妈太聪明了 -->
    <!-- 这个地方提示是自己的哪个角色去申请的和哪个角色玩耍 -->
    <van-cell :value="centens" />
    <div class="otherInfo">
      <span>
        <!-- 名字 -->
        -{{ invitation.time }}
      </span>
      <span>
        <router-link :to="'/detailPage/oc/' + fromOc.id">
          查看邀请的oc：{{ fromOc.name }} >
        </router-link>
      </span>
    </div>
    <TextF :it="text"> </TextF>
    <div class="submit-box" v-if="invitation.status == 1">
      <span>
        <!-- 创建一个连接link 将邀请的全部信息转移，并且将link连接到一个workid -->
        <van-button plain type="info" @click="agree">同意</van-button></span
      >
      <span
        ><van-button plain type="info" @click="disagree">拒绝</van-button></span
      >
    </div>
    <van-cell
      class="statu"
      value="已拒绝对方邀请。"
      v-if="invitation.status == 2"
    />
    <van-cell
      class="statu"
      value="已同意对方邀请。"
      v-if="invitation.status == 3"
    />
  </div>
</template>

<script>
import OcArchives from "@/components/OcArchives.vue";
import request from "@/utils/request";
import TextF from "@/components/Text.vue";
import qs from "qs";

export default {
  // 传进来的是一整个邀请信息 包含from、to的用户和oc，状态和remark以及自身id
  // 不需要明显的复用
  props: {
    // 包含一整个 邀请
    invitation: {
      type: Object,
      default: {},
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
  methods: {
    // 同意邀请，要按照邀请 建立一个新的link

    agree() {
      // let relateOc = {
      //   relateOc: [
      //     {
      //       id: this.fromOc.id,
      //       name: this.fromOc.name,
      //     },
      //     {
      //       id: this.fromOc.id,
      //       name: this.fromOc.name,
      //     },
      //   ],
      // };
      // let work = {
      //   title: "",
      //   relateOc: qs.stringify(relateOc),
      //   relateWorld: "",
      //   cover: "",
      //   introduction: "",
      // };
      // var form = new FormData();
      // form.append("work", work);
      // form.append("name", "88888");
      request({
        url: "/invate/agree",
        method: "POST",
        data: this.invitation,
      }).then((res) => {
        console.log("接受邀请");
        console.log(res);
        if (res.data.flag) {
          // 成功
          this.$router.go(0);
        }
      });
    },
    disagree() {},
  },
  created() {
    this.text = { title: "remark", text: this.invitation.invRemark, type: 1 };

    console.log(this.text);
    // 在最开始 要按照该邀请 获得这个oc的全部设定
    request({
      // 对提出的用户来说来说，自己需要知道每个邀请的状态
      url: "/oc/" + this.invitation.fromOc,
      method: "GET",
    }).then((res) => {
      if (res.data.flag) {
        // 拿到了数据
        this.fromOc = res.data.object;
        console.log("111");
        console.log(this.fromOc);
      }
      request({
        // 对提出的用户来说来说，自己需要知道每个邀请的状态
        url: "/oc/" + this.invitation.toOc,
        method: "GET",
      }).then((res) => {
        if (res.data.flag) {
          // 拿到了数据
          this.toOc = res.data.object;
          console.log("222");
          console.log(this.toOc);
          // 异步请求，放在这里解决。
          this.centens =
            "其他用户的 " +
            this.fromOc.name +
            " 对 " +
            this.toOc.name +
            " 发出了邀请";
        }
      });
    });
  },
  components: { OcArchives, TextF },
};
</script>

<style scoped >
.invitation-container {
  border: 1px solid #1e1e1e;
  border-radius: 15px;
  margin-top: 10px;
}

.van-cell {
  background-color: rgb(0, 0, 0, 0) !important;
  font-weight: 700;
  color: #9aa0a6;
}
.otherInfo {
  display: flex;
}

.otherInfo span {
  flex: 1;
  text-align: center;
  margin-bottom: 5px;
  font-size: 12px;
  color: #9aa0a6;
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
  font-size: 10px !important;
  color: #fc5430 !important;
}
</style>