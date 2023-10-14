<template>
  <div class="login-container">
    <van-nav-bar
      title="欢迎来到广场"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />

    <van-cell-group>
      <van-field
        v-model="username"
        :error="nameerror"
        required
        label="用户名"
        placeholder="请输入用户名"
        @blur="verifyName"
      />
      <van-field
        v-model="password"
        required
        label="密码"
        placeholder="请输入密码"
        type="password"
      />
    </van-cell-group>
    <div class="btn-bosx">
      <van-button plain type="primary" @click="login">登陆</van-button>
      <van-button plain type="primary" @click="toRegist">注册</van-button>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      password: "",
      nameerror: false,
      username: "",
    };
  },
  methods: {
    toRegist() {
      this.$router.push("/regist");
    },
    verifyName() {
      this.nameerror = this.username.length > 6 ? false : true;
    },
    // 验证登录页
    login() {
      //   发送ajax请求，提交参数
      request({
        method: "POST",
        url: "/login",
        params: {
          username: this.username,
          password: this.password,
        },
      }).then((res) => {
        if (res.data.flag) {
          //   取到了 存入local
          sessionStorage.setItem("user", res.data.object.id);
          // console.log("这是我需要的：login后的数据");
          // console.log(sessionStorage.getItem("user"));
          ////
          localStorage.setItem("user", res.data.object.id);
          ////
          this.$router.push("/square");
        } else {
          // 错误了
          this.$toast("请检查您的账号和密码");
        }
      });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.login-container {
  padding-top: 50px;
}

.btn-bosx {
  display: flex;
  padding-left: 20%;
  padding-right: 20%;
  margin-top: 20px;
}

.btn-bosx .van-button:nth-child(1) {
  margin-right: 10%;
}
.van-button {
  border: 1px solid #cdcdcd;
  border-radius: 10px;
  flex: 1;
}
.van-button span {
  color: #cdcdcd;
  flex: 1;
}
</style>