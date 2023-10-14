<template>
  <div class="submitTags-container">
    <!-- 负责收集用户发送的tag信息并保存 -->
    <van-field
      v-model="message"
      rows="2"
      autosize
      label="标签文本"
      type="textarea"
      maxlength="200"
      placeholder="请在不同标签之间使用英文分号;进行分隔，例如：猫猫;眼球 [注意：不超过200字，且目前尚不允许更改，如需删除某些抽抽乐，请联系我]"
      show-word-limit
    />
    <van-cell-group>
      <van-field
        v-model="tagsname"
        label="抽抽乐命名"
        placeholder="请输入用户名"
      />
    </van-cell-group>

    <van-button round type="info" @click="submit">添加</van-button>
  </div>
</template>

<script>
import { getAllTags } from "@/api/randomTags.js";
import request from "@/utils/request.js";
export default {
  data() {
    return {
      message: "",
      tagsname: "",
    };
  },
  methods: {
    //   提交txt
    async submit() {
      var newtags = {
        tags: this.message,
        tagsName: this.tagsname,
      };
      const { data: res } = await request({
        method: "POST",
        url: "/randomtags",
        data: newtags,
        "Content-Type": "application/json",
      });
      if (res.flag) {
        //   拿到了数据，跳转
        this.$router.push("/game/tagchoose");
      }
    },
  },
  created() {},
};
</script>

<style scoped >
.submitTags-container {
  text-align: center;
}

.van-button {
  margin-top: 10px;
}

.van-cell-group {
  margin-bottom: 10px;
}
</style>