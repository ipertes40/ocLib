<template>
  <div class="home-container">
    <van-nav-bar
      title="工作台"
      left-arrow
      :fixed="true"
      @click-left="onClickLeft"
    />
    <!-- <van-uploader
      :after-read="afterRead"
      v-model="fileList"
      multiple
      :max-count="1"
    /> -->
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="档案簿" name="1"
        ><van-cell title="我的世界簿" is-link to="/myworlddesign" />
        <van-cell title="Oc工作台" is-link to="/myocdesign" />
        <van-cell title="事件记录簿" is-link to="/workdesigns" />
      </van-collapse-item>
      <van-collapse-item title="小游戏" name="2">
        <div class="row">
          <div class="game-box">
            <div class="img-box">
              <img src="../static/images/tagchoose.png" alt="" />
            </div>
            <van-cell title="抽抽乐" is-link to="/Game" />
            <!-- <router-link to="/Game">抽抽乐</router-link> -->
          </div>
        </div>
        <div class="row">
          <div class="game-box">
            <div class="img-box">
              <img src="../static/images/tagchoose.png" alt="" />
            </div>
            <van-cell title="抽抽乐" is-link to="/Game" />
            <!-- <router-link to="/Game">抽抽乐</router-link> -->
          </div>
        </div>
        <div class="row">
          <div class="game-box">
            <div class="img-box">
              <img src="../static/images/tagchoose.png" alt="" />
            </div>
            <van-cell title="抽抽乐" is-link to="/Game" />
            <!-- <router-link to="/Game">抽抽乐</router-link> -->
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="我的探险" name="3"></van-collapse-item>
    </van-collapse>
    <!-- <div class="desk-box">
      <div class="title">档案堆</div>
      <van-cell title="我的世界簿" is-link to="index" />
      <van-cell title="我的oc" is-link to="index" />
      <van-cell title="事件记录簿" is-link to="index" />
    </div> -->
    <div class="game-box"></div>
    <div class="invitation-box"></div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      activeName: "1",
      fileList: [],
    };
  },
  created() {
    // 发送异步请求，获取数据
    // axios.get("http://localhost:80/oc").then((res) => {
    //   console.log(res);
    // });
  },
  methods: {
    afterRead() {
      // console.log("afterRead");
      // van-uploader__upload隐藏
    },
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
/* .home-container {
  padding-top: 50px;
} */

.desk-box .van-cell {
  background-color: #f0f0f0;
  border-radius: 20px;
  margin-bottom: 10px;
  /* line-height: 35px; */
  min-height: 20px;
}
.row {
  /* background: #8f8f8f; */
  /* max-height: 35px; */
  display: flex;
}
.row .game-box {
  height: 50px;
  flex: 1;
  display: flex;
}

.row .game-box .img-box {
  flex: 1;
}
.row .game-box img {
  /* flex: 1; */
  height: 100%;
}
.row .game-box .van-cell {
  margin-bottom: 0;
  flex: 2;
  width: 50%;
}
</style>