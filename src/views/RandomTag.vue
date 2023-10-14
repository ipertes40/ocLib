<template>
  <div class="RandomTag-container">
    <van-cell title="添加新的抽抽乐" is-link to="/game/addtag" />

    <!-- <van-cell title="删除已有的抽抽乐" is-link to="/game/deltag" /> -->

    <!-- 抽抽乐time -->
    <img src="../static/images/ocpic.png" alt="" />
    <van-field
      readonly
      clickable
      label="抽奖箱"
      :value="value"
      placeholder="请选择您要抽取的箱子"
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
    <van-field
      v-model="Tagnum"
      center
      clearable
      label="抽取tag数"
      placeholder="请输入数字！"
    >
      <template #button>
        <van-button size="small" type="primary" @click="getRandomTags"
          >抽抽抽</van-button
        >
      </template>
    </van-field>

    <van-cell v-for="item in alreadyget" :key="item" :value="item" />
  </div>
</template>

<script>
import { getAllTags } from "@/api/randomTags.js";
export default {
  data() {
    return {
      value: "",
      showPicker: false,
      // 存这个
      //   columns: ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华", "衢州"],
      columns: [],
      // 动态增添删除词条
      temptags: [],
      // 保存这个抽抽乐下的所有词条
      pretags: [],
      // 保存没有进行一定操作的原OBJ
      randomTagsList: [],
      // 这个是我们得到的
      alreadyget: [],
      Tagnum: "",
    };
  },
  async created() {
    //   完成初始化选项的操作
    // 1、获取所有的抽抽乐对象 包含的是有的和没有的
    const { data: res } = await getAllTags();
    this.randomTagsList = res.object;
    this.randomTagsList.forEach((item) => {
      // 将每一个的tags抽出来
      this.columns.push(item.tagsName);
    });
  },
  methods: {
    onConfirm(value) {
      this.value = value;
      console.log("value = " + value);
      this.pretags =
        this.randomTagsList[this.columns.indexOf(value)].tags.split(";");
      this.showPicker = false;
    },
    getRandomTags() {
      // 每一次点击后删除原来的
      this.alreadyget = [];
      // var newArr = arr.slice();
      this.temptags = this.pretags.slice();
      // 还得把最开始我们的tag找出来

      // 随机获得tags
      for (var i = 0; i < this.Tagnum; i++) {
        // 然后通过随机数乘以刚才的到的值，
        // 例如：Math.random() * 8，由于得到的是小于1的随机数，所以随机最大值0.99*8得到的数始终小于8
        // 然后使用floor方法向下取正得到的数最大值就是7，然后再加上最小值
        var index = Math.floor(Math.random() * this.temptags.length);
        console.log("index===>" + index);
        var str = this.temptags[index];
        console.log("str====>" + str);
        this.alreadyget.push(str);
        this.temptags.splice(index, 1);
      }
    },
    getList() {},
  },
};
</script>

<style scoped>
.RandomTag-container {
  padding-bottom: 40px;
}
.RandomTag-container img {
  width: 100%;
}
.van-button {
  background-color: #f4bd00;
  border: 1px solid #ce723b;
}
</style>