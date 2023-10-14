<template>
  <div class="add-oc-archives-container">
    <!-- 上传封面 -->
    <p>上传封面</p>
    <van-uploader  v-model="fileList" multiple :max-count="1" enctype=“multipart/form-data”>
        <template #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </template>
    </van-uploader>
    <van-cell-group inset>
      <van-field v-model="title" label="标题" />
      <van-field v-model="introduction" label="简介" />
    </van-cell-group>
    <div class="relate">
        <!-- 展示相关oc和世界观 -->
        <div class="relateoc">
            <!-- 展示全部oc -->
            相关oc：
            <span class="tag" v-for="item in relateoc" :key="item.id">{{item.name}} <button @click="deloc(item.id)">x</button></span>
            <button @click="show=true">+</button>
        </div>
        <div class="relateworld">
            <!-- 展示全部的世界 -->
            相关世界：
            <span class="tag" v-for="item in relateworld" :key="item.id">{{item.name}} <button @click="delworld(item.id)">x</button></span>
            <button @click="showworld = true">+</button>
        </div>
    </div>
    <div class="chooseBox">
      <!-- <van-field
        v-model="fieldValue"
        is-link
        readonly
        label="查找oc"
        placeholder="请选择世界观"
      /> -->
      <van-popup v-model="show" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择oc"
          :options="options"
          @close="show = false"
          @finish="onFinish"
        />
      </van-popup>
      <van-popup v-model="showworld" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择相关世界"
          :options="worldOps"
          @close="showworld = false"
          @finish="onWorldFinish"
        />
      </van-popup>
    </div>

    <div class="submit-box">
        <span>
          <van-button plain type="info" @click="submitAdd">记录</van-button>
        </span>
        <span>
            <van-button plain type="info" @click="cancelAdd">放弃</van-button>
        </span>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import { Notify } from "vant";
import qs from "qs";
export default {
  data() {
    return {
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
      //   单独存放世界的，不包含里面的oc
      worldOps: [],
      // 存放需要上传的图片
      fileList: [],
      // nowpic: {},
      relateworld: [],
      relateoc: [],
      state: "",
      showPicker: false,
      columns: [],
      // columns: ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华", "衢州"],
      newWork: { name: "", status: "", introduction: "", worldId: "" },
      chooseWorld: {},
      show: false,
      showworld: false,
      title: "",
      introduction: "",
    };
  },
  created() {
    //   首先应该获得所有的世界和oc，能够实现对作品添加oc和世界的功能
    // 还是需要用到qs
    this.initOcAndWorld();
  },
  methods: {
    initOcAndWorld() {
      // 获取我们用户的世界观，再通过用户和世界观获取所有的用户
      request.get("/oc/getworld").then((res) => {
        console.log(res);
        if (res.data.flag) {
          // 拿到了数据
          res.data.object.forEach((item) => {
            //   内部直接存一个东西 而不是id
            const newobj = {
              text: item.name,
              value: item.id,
              children: [],
            };
            const newworld = {
              text: item.name,
              value: item.id,
            };
            this.worldOps.push(newworld);
            // 通过用户和世界观获得级联的角色
            request.get("/oc/getoc/" + item.id).then((res) => {
              if (res.data.flag) {
                res.data.object.forEach((it) => {
                  newobj.children.push({
                    text: it.name,
                    value: it.id,
                  });
                });
              }
            });
            this.options.push(newobj);
          });
        }
      });
    },
    onFinish({ selectedOptions }) {
      console.log(selectedOptions);
      this.show = false;
      const oc = {
        id: selectedOptions[1].value,
        name: selectedOptions[1].text,
      };
      if (this.relateoc.every((item) => item.id != oc.id)) {
        this.relateoc.push(oc);
      } else {
        //   提示重复添加
        Notify("选择了重复内容");
      }
    },
    onWorldFinish({ selectedOptions }) {
      this.showworld = false;
      const world = {
        id: selectedOptions[0].value,
        name: selectedOptions[0].text,
      };
      if (this.relateworld.every((item) => item.id != world.id)) {
        this.relateworld.push(world);
      } else {
        //   提示重复添加
        Notify("选择了重复内容");
      }
      //   console.log(selectedOptions);
    },
    // 删除某一个世界tag
    deloc(id) {
      console.log("删除一个octag");
      console.log(id);
      // 过滤掉当前id
      this.relateoc = this.relateoc.filter((item) => item.id != id);
    },
    delworld(id) {
      console.log("删除一个worldtag");
      // 过滤掉当前id
      this.relateworld = this.relateworld.filter((item) => item.id != id);
    },
    submitAdd() {
      console.log("this)))))))))))");
      console.log(this.relateoc);
      console.log(this.relateworld);
      if (this.relateoc.length == 0 || this.relateworld.length == 0) {
        // 不行 弹回去
        Notify("最少添加一个octag 和一个 世界tag");
        return;
      }
      // 先上传文字内容，再上传全部消息
      let relateOc = {
        relateOc: this.relateoc,
      };
      let relateWorld = {
        relateWorld: this.relateworld,
      };
      let newwork = {
        title: this.title,
        relateOc: qs.stringify(relateOc),
        relateWorld: qs.stringify(relateWorld),
        introduction: this.introduction,
        cover: null,
      };
      // 上传图片，如果图片成功会返回名城，把名称塞进work里面就行了
      var filename = "";
      var formData = new FormData();
      // 获取图片
      formData.append("files", this.fileList[0].file);

      request({
        method: "POST",
        url: "/upimg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data != "file") {
          // 成功了，获取图片名
          newwork.cover = res.data;
          // 添加新的Work
          request({
            url: "/work",
            method: "POST",
            data: newwork,
          }).then((res) => {
            if (res.data.flag) {
              //   说明添加成功了
              this.$router.push("/workdesigns/index");
            } else {
              Notify("抱歉，发生错误！");
            }
          });
        } else {
          Notify("抱歉，上传图片时发生错误！");
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
.relate {
  font-size: 12px;
  color: #785932;
}
.relate button {
  border: none;
  /* border: 1px solid #785932; */
  border-radius: 5px;
  max-height: 80%;
  background: none;
  color: #785932;
}
.tag {
  font-size: 12px;
  color: #9cdcf0;
  padding-right: 3px;
}

.tag button {
  background: none;
  color: #ce9178;
  border: none;
  margin-left: -5px;
}
</style>