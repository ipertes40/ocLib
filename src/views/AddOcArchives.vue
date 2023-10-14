<template>
  <div class="add-oc-archives-container">
    <!-- 提供用户新增oc的可视化功能 -->
    <!-- 实现oc的增添 ，但不提供修改故事的部分 -->
    <!-- <van-uploader  v-model="fileList" multiple :max-count="1" enctype=“multipart/form-data” :after-read="afterRead">
      <template #preview-cover="{ file }">
        <div class="preview-cover van-ellipsis">{{ file.name }}</div>
      </template>
    </van-uploader> -->
    <p>图片请到oc详情页面进行上传</p>
    <van-cell-group inset>
      <!-- 需要改的东西：图片 名字 状态 介绍 -->
      <!-- <van-field label="文本" value="输入框已禁用" disabled /> -->
      <van-field v-model="newoc.name" label="名字" />
      <van-field v-model="newoc.status" label="状态" />
      <van-field v-model="newoc.introduction" label="介绍" />
      提交世界
      <van-field
        readonly
        clickable
        label="世界"
        :value="state"
        placeholder="选择oc所属世界"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
      <div class="submit-box">
        <span>
          <van-button plain type="info" @click="submitAdd">生</van-button>
        </span>
        <span
          ><van-button plain type="info" @click="cancelAdd"
            >不生</van-button
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
      // fileList: [],
      // nowpic: {},
      state: "",
      showPicker: false,
      columns: [],
      // columns: ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华", "衢州"],
      newoc: { name: "", status: "", introduction: "", worldId: "" },
      chooseWorld: {},
    };
  },
  created() {
    // 初始化所有的世界
    request({
      url: "/world/byuser",
      method: "GET",
    }).then((res) => {
      console.log("-----<");
      console.log(res);
      if (res.data.flag) {
        // 获取到了数据
        const list = res.data.object;
        list.forEach((item) => {
          var newcol = {
            text: item.name,
            value: item.id,
          };
          this.columns.push(newcol);
        });
      }
    });
  },
  methods: {
    // // 每次上传图片后更新chooseOc里的图片
    // afterRead(file) {
    //   this.nowpic = file;
    // },
    submitAdd() {
      // 将人插进去，然后再将图片插进去
      if (this.newoc.worldId == "") {
        // 直接驳回
        console.log("不行 滚 蛋");
        return;
      }
      request({
        url: "/oc",
        method: "POST",
        data: this.newoc,
      }).then((res) => {
        if (res.data.flag) {
          // 添加成功，传回去
          this.$router.push("/myocdesign/myoc");
        }
      });
    },
    onConfirm(value, index) {
      this.chooseWorld = value;
      // console.log(choo);
      this.state = value.text;
      // 获取id
      this.newoc.worldId = value.value;
      this.showPicker = false;
    },
    // 取消创建
    cancelAdd() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.add-oc-archives-container {
  text-align: center;
}
</style>