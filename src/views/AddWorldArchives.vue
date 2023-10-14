<template>
  <div class="add-oc-archives-container">
    <!-- 实现世界的增添 ，但不提供修改故事的部分 -->
    <p>图片请到world详情页面进行上传</p>
    <van-cell-group inset>
      <!-- 需要改的东西：图片 名字 状态 介绍 -->
      <!-- <van-field label="文本" value="输入框已禁用" disabled /> -->
      <van-field v-model="newWorld.name" label="世界命名" />
      <van-field v-model="newWorld.status" label="展示状态" />
      <van-field v-model="newWorld.introduction" label="世界简介" />
      <div class="submit-box">
        <span>
          <van-button plain type="info" @click="submitAdd"
            >helloworld</van-button
          >
        </span>
        <span
          ><van-button plain type="info" @click="cancelAdd"
            >放弃创建</van-button
          ></span
        >
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      state: "",
      showPicker: false,
      newWorld: {},
    };
  },
  created() {
    // 什么都不用
    // // 初始化所有的世界
    // request({
    //   url: "/world/byuser",
    //   method: "GET",
    // }).then((res) => {
    //   console.log("-----<");
    //   console.log(res);
    //   if (res.data.flag) {
    //     // 获取到了数据
    //     const list = res.data.object;
    //     list.forEach((item) => {
    //       var newcol = {
    //         text: item.name,
    //         value: item.id,
    //       };
    //       this.columns.push(newcol);
    //     });
    //   }
    // });
  },
  methods: {
    submitAdd() {
      // 将oc插进去，然后再将图片插进去
      request({
        url: "/world",
        method: "POST",
        data: this.newWorld,
      }).then((res) => {
        if (res.data.flag) {
          // 添加成功，传回去
          this.$router.push("/myworlddesign/myworld");
        }
      });
    },
    // onConfirm(value, index) {
    //   this.chooseWorld = value;
    //   // console.log(choo);
    //   this.state = value.text;
    //   // 获取id
    //   this.newoc.worldId = value.value;
    //   this.showPicker = false;
    // },
    cancelAdd() {
      // 放弃添加
      this.$router.push("/myworlddesign/myworld");
    },
  },
};
</script>

<style>
.add-oc-archives-container {
  text-align: center;
}
.submit-box {
  margin-top: 15px;
}
</style>