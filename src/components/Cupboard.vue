<template>
  <div class="cupboard-container">
    <div id="collection-small-intro" v-if="isshowItro & collection!=null" >      
      <p style="font-size:15px; color:white;">{{collection.name}}</p>
      <p style="font-size:12px; color:white;">{{collection.introduction}}</p>

    </div>
    <div class="small-container" @click="showItro">
        <img
        @click="showEdit"
          class="collection"
          :src="
            collection == null
              ? 'http://localhost/upload/default.png'
              : 'http://localhost:80/upload' + collection.picture
          "
          alt=""
      />
      <img src="../static/images/board.png" alt="" />
    </div>
    <div id="editCollection" v-show="isshowEdit">
      <!-- 左边放图片栏 右边是简介，移动上来点击的时候
        如果是本人操作可以弹出这个框上传图片 如果不是本人的操作，则弹出一个介绍
        可以看到介绍 -->
      <div id="left-img">
        <van-uploader  v-model="addfileList" multiple :max-count="1" enctype=“multipart/form-data”>
        <template #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </template>
      </van-uploader>
      </div>
      <div id="right-text">
        <div id="collection-name">
          <input class='cupb-input' type="text" v-model="name" placeholder="物品名">
        </div>
        <div id="collection-intro">
          <input  class='cupb-input' type="text" v-model="introduction"  placeholder="简介">
        </div>
      </div>
      <div id="collection-sub-box">
        <button id="colletionSub"  @click="submit">修改物品</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import request from "@/utils/request.js";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  props: {
    //   展品链接
    collection: {
      default: null,
    },
    ocid: {
      default: -1,
    },
  },
  data() {
    // 图片列表
    return {
      addfileList: [],
      introduction: "",
      name: "",
      isshowEdit: false,
      isshowItro: false,
    };
  },
  methods: {
    showItro() {
      this.isshowItro = !this.isshowItro;
    },
    showEdit() {
      this.isshowEdit = !this.isshowEdit;
    },
    submit() {
      // 上传图片和设定 线弹窗

      // 最后的文件名;
      var filename = "";
      var formData = new FormData();
      // 获取图片
      formData.append("files", this.addfileList[0].file);

      if (this.ocid == -1) {
        return;
      }

      request({
        method: "POST",
        url: "/upimg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data != "file") {
          var filename = res.data;
          this.isshowEdit = false;
          // 提交
          if (this.collection == null) {
            // 插入
            var newCollection = {
              picture: filename,
              ocId: this.ocid,
              introduction: this.introduction,
              name: this.name,
            };
            this.collection = newCollection;
            request({
              method: "POST",
              url: "/collection",
              data: newCollection,
            }).then((res) => {
              console.log(res);
              if (res.data.flag) {
                console.log("ok");
              }
            });
          } else {
            console.log("应该进行更新");
            // 更新
            // 插入
            var newCollection = {
              name: this.name,
              introduction: this.introduction,
              picture: filename,
              ocId: this.collection.ocId,
            };
            console.log(newCollection);
            console.log("1");
            this.collection = newCollection;
            console.log("2");
            request({
              method: "POST",
              url: "/collection/up",
              data: newCollection,
            }).then((res) => {
              console.log("进入update方法！！！！！");
              console.log(res);
              if (res.data.flag) {
                console.log("ok");
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style>
#collection-small-intro {
  position: absolute;
  left: 10px;
  top: 10px;
  background: rgba(230, 230, 230, 0.7);
  width: 140px;
  min-height: 50px;
  border-radius: 15px;
  z-index: 10;
}

#editCollection {
  /* float: left; */
  left: 0;
  /* height: 80px; */
  width: 100%;
  background-color: #f5f5f5;
  border-radius: 20px;
}
.small-container {
  height: 100%;
}

.cupboard-container {
  position: relative;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 15px;
  /* background-color: #7b7b7b; */
  text-align: center;
}
.cupboard-container:after {
  /*伪元素是行内元素 正常浏览器清除浮动方法*/
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.cupboard-container {
  zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
}

.cupboard-container img:nth-child(2) {
  width: 100%;
  margin: 0 auto;
}
.cupboard-container img:nth-child(1) {
  /* width: 20%; */
  height: 80px;
  position: absolute;
  left: 50%;
  top: 84px;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
}

#left-img {
  float: left;
}
#right-text {
  float: left;
  margin-left: 10px;
  padding-top: 10px;
  font-size: 14px;
  color: #a1a1a1;
}
#collection-name {
  font-size: 18px;
  margin-bottom: 3px;
}

.cupb-input {
  background: #f5f5f5;
  border: 0px;
}

#collection-sub-box {
  /* background: #a1a1a1; */
  float: left;
  margin: 0 auto;
  width: 100%;
}

#colletionSub {
  border: 0px;
  border-radius: 5px;
  color: #757575;
  background: #dcdee0;
  width: 100%;
}
</style>