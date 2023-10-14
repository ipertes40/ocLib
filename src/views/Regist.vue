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
        label="设置用户名"
        placeholder="请输入用户名"
        @blur="verifyName"
      />
      <van-field
        v-model="password"
        required
        label="设置密码"
        placeholder="请输入密码"
        type="password"
      />
    </van-cell-group>
    <div class="btn-bosx">
      <van-button plain type="primary" @click="register">注册</van-button>
      <van-button plain type="primary" @click="toLogin">登陆</van-button>
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
    toLogin() {
      this.$router.push("/login");
    },
    verifyName() {
      this.nameerror = this.username.length > 6 ? false : true;
    },
    // 验证登录页
    register() {
      //   发送ajax请求，提交参数
      var user = {
        username: this.username,
        password: this.password,
      };
      if (this.nameerror == true) {
        this.$toast("请检查您的账号和密码");

        return;
      }

      request({
        method: "POST",
        url: "/user",
        data: user,
      }).then((res) => {
        if (res.data.flag) {
          this.$router.push("/login");
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