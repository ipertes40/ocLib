<template>
  <div class="invate-form-container">
    <OcArchives
      :picture="to.picture"
      :ocname="to.name"
      :ocstatus="to.status"
      :introduction="to.introduction"
      :masterName="to.userId"
      :ocid="to.id"
      :notinvate="false"
    ></OcArchives>
    <div class="msg-container">
      <span>请填写邀请备注:</span>
      <div class="msg">
        <textarea
          cols="30"
          rows="5"
          v-model="remark"
          placeholder="请尽量简短叙述"
        ></textarea>
      </div>
    </div>
    <div class="chooseBox">
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        label="己方oc"
        placeholder="请选择世界观"
        @click="show = true"
      />
      <van-popup v-model="show" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择oc"
          :options="options"
          @close="show = false"
          @finish="onFinish"
        />
      </van-popup>
    </div>
    <OcArchives
      :picture="from.picture"
      :ocname="from.name"
      :ocstatus="from.status"
      :introduction="from.introduction"
      :masterName="from.userId"
      :ocid="from.id"
      :notinvate="false"
    ></OcArchives>
    <div class="submit-box">
      <span
        ><van-button plain type="info" @click="submit">提交</van-button></span
      >
      <span><van-button plain type="info">取消</van-button></span>
    </div>
  </div>
</template>

<script>
import OcArchives from "@/components/OcArchives.vue";
import axios from "axios";
import { submitInvitation } from "@/api/invitationAPI.js";
import request from "@/utils/request.js";
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      from: {},
      to: {},
      remark: "",
      //   实现多级选项的
      show: false,
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
    };
  },
  components: {
    OcArchives,
  },
  methods: {
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ selectedOptions }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      // 刷新底下的名片
      request({
        url: "/oc/" + this.cascaderValue,
        method: "GET",
      }).then((res) => {
        if (res.data.flag) {
          this.from = res.data.object;
        }
      });
    },
    submit() {
      // 提交申请
      let invitation = {
        toUser: this.to.userId,
        status: 1,
        fromOc: this.from.id,
        toOc: this.to.id,
        invRemark: this.remark,
      };
      request({
        url: "/invate/submit",
        method: "POST",
        data: invitation,
      }).then((res) => {
        if (res.data.flag) {
          // 拿到了数据
          this.$router.push("/square");
        }
      });
    },
  },
  async created() {
    // 选取出要邀请的oc;
    request.get("/oc/" + this.$route.query.id).then((res) => {
      if (res.data.flag) {
        this.to = res.data.object;
      }
    });
    // 获取我们用户的世界观，再通过用户和世界观获取所有的用户
    request.get("/oc/getworld").then((res) => {
      console.log(res);
      if (res.data.flag) {
        // 拿到了数据
        res.data.object.forEach((item) => {
          const newobj = {
            text: item.name,
            value: item.id,
            children: [],
          };
          // 通过用户和世界观获得级联的角色
          request.get("/oc/getoc/" + item.id).then((res) => {
            if (res.data.flag) {
              res.data.object.forEach((it) => {
                newobj.children.push({
                  text: it.name,
                  value: it.id,
                });
              });
            }
          });
          this.options.push(newobj);
        });
      }
    });
  },
};
</script>

<style scope>
.invate-form-container {
  margin-top: 20px;
  padding-bottom: 50px;
}
.msg {
  /* min-height: 50px; */
  text-align: center;
}
.msg-container span {
  display: block;
  font-size: 13px;
  color: #828282;
  padding-bottom: 10px;
}

.msg textarea {
  width: 90%;
  min-height: 40px;
  border-radius: 8px;
  border: 1px solid #737373;
  font-size: 14px;
  padding: 5px;
}

.msg-container {
  margin-bottom: 10px;
}
.submit-box {
  display: flex;
}

.submit-box span {
  text-align: center;
  flex: 1;
}

.submit-box span button {
  height: 25px;
  border-radius: 10px;
  border: 1px solid #7b7b7b;
}

.submit-box span button span {
  color: #7b7b7b;
}
</style>