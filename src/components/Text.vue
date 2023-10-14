<template>
  <div class="myoc-text-container">
    <div class="funcbar">
      <div class="left">
        {{ it.title }}
      </div>
    </div>
    <!-- 这个部分就是一个灰格子，按照解析的json数据对每一段落进行展示 -->
    <!-- 说明是文本内容 -->
    <div class="textinfo" v-if="it.type == 1">
      {{ it.text }}
    </div>
    <!-- 说明是图片内容 -->
    <div class="picinfo" v-if="it.type == 2">
      <img
        :src="
          it.text != null
            ? 'http://localhost:80/upload' + it.text
            : 'http://localhost:80/upload/default.png'
        "
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    it: {},
  },
  created() {
    console.log("it=");
    console.log(this.it);
  },
  methods: {
    deleteit() {
      this.$emit("delit", this.it.index);
    },
  },
};
</script>

<style  lang="less">
.myoc-text-container {
  font-size: 14px;
  color: #202023;
  background-color: #f4f4f4;
  margin-bottom: 15px;
  border-radius: 15px;
  padding-left: 5%;
  padding-top: 1%;
}

.textinfo {
  width: 100%;
  word-wrap: break-word;
  font-size: 13px;
  color: #292a2d;
}
.funcbar {
  display: flex;
  min-height: 20px;
  padding-right: 10px;
}
.left {
  color: #202023;
  font-size: 14px;
  font-weight: 700;
  max-height: 15px;
  flex: 8;
}
.funct {
  max-height: 15px;
  flex: 1;
}

.funcbar div:nth-child(2) button {
  height: 15px;
  // background-color: red;
  background-color: #bdbdbd;
  color: white;
  border: 1px solid white;
}

.picinfo img {
  padding-top: 1%;
  width: 95%;
}
</style>