<template>
  <div class="userbar-container">
    <!-- 展示 头像、名称、个签等信息 -->
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click="show = false">
        <van-uploader :after-read="afterRead" />
      </div>
    </van-overlay>
    <div class="head" @click="submitHeadPic">
      <img
        class="profilePicture"
        :src="'http://localhost:80/upload' + user.profilePicture"
        alt=""
      />
    </div>

    <div class="info">
      <span>{{ user.username }}</span>
      <button @click="logout">--登出</button>
    </div>
    <div class="info">
      <input
        style="font-size: 11px"
        id="infoInput"
        type="text"
        v-model="user.introduction"
        :disabled="able"
      />
    </div>
    <div class="editInfo">
      <div
        class="beginedit"
        v-if="!showyes"
        @click.stop="Editdisabled"
        style="color: #cfcfcf"
      >
        修改签名
      </div>
      <div class="subedit" v-if="showyes" @click.stop="subEdit">√</div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
// import Header from "../../../demo-cart/src/components/Header/Header.vue";
export default {
  props: {
    id: {
      Headerdefault: null,
    },
  },
  data() {
    return {
      // 默认要有一张自己的头像
      fileList: [],
      //   用户信息条
      user: {},
      show: false,
      able: "disabled",
      showyes: false,
    };
  },
  methods: {
    subEdit() {
      request({
        method: "PUT",
        url: "/user",
        data: this.user,
      }).then((res) => {
        if (res.data.flag) {
          this.showyes = false;
          this.able = true;
        }
      });
    },
    Editdisabled() {
      this.able = false;
      this.showyes = true;
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器

      // 最后的文件名;
      var filename = "";
      var formData = new FormData();
      // 获取图片
      formData.append("files", file.file);

      request({
        method: "POST",
        url: "/upimg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        // 更新头像
        if (res.data != "file") {
          // 上传成功。
          var filename = res.data;
          this.user.profilePicture = filename;
          console.log("上传成功");
          request({
            method: "PUT",
            url: "/user",
            data: this.user,
          }).then((res) => {
            if (res.data.flag) {
              this.show = false;
            }
          });
        }
      });
    },
    //  提交新头像
    submitHeadPic() {
      this.show = true;
    },
    // 退出账号
    logout() {
      request({
        url: "/login/out",
        method: "GET",
      }).then((res) => {
        if (res.data.flag) {
          console.log("移除登陆信息");
          window.sessionStorage.removeItem("user"); // 清理缓存
          // 证明成功了 进行刷新
          this.$router.go(0);
        }
      });
    },
  },
  created() {
    //   最开始先把用户信息拿到
    request({
      url: "/user",
      method: "GET",
    }).then((res) => { 
      this.user = res.data.object;
      console.log("this user = ");
      console.log(this.user);
      this.fileList.push(res.data.object.profilePicture);
    });
  },
};
</script>

<style scoped lang="less" scoped>
.beginedit {
  flex: 1;
  text-align: center;
}
.subedit {
  flex: 1;
  text-align: center;
}

.editInfo {
  font-size: 12px;
  display: flex;
}

#infoInput {
  border: none;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 15px;
}
.profilePicture {
  width: 100%;
}
.head {
  background: #fff;
  border: 1px solid #fefefe;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  margin: 0 auto;
  overflow: hidden;
}
.userbar-container {
  text-align: center;
  margin: auto 0;
}
/deep/ .van-uploader {
  border-radius: 50%;
  overflow: hidden;
  //   background-color: #1e1e1e;
}
/deep/ .van-uploader div {
  text-align: center;
  //   min-height: 0;
  margin: 0;
}

.info {
  display: block;
  padding-left: 0;
  min-height: 0;
}

.info button {
  color: #29b8db;
  font-size: 12px;
  background: none;
  border: none;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>