<template>
  <div class="my-worldlist-container">
    <!-- 我的世界 -->
    <van-cell title="添加新世界" is-link to="/myworlddesign/addWorld" />

    <!-- 选择你的世界观 世界观的初始化 -->
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
    <!-- 展示小块 -->
    <MyWorldArchives
      :picture="chooseWorld.picture"
      :worldname="chooseWorld.name"
      :worldstatus="chooseWorld.status"
      :introduction="chooseWorld.introduction"
      :masterName="chooseWorld.userId"
      :worldid="chooseWorld.id"
      :notmine="false"
      @editshow="showedit"
      @picshow="showPichandler"
      @delOc="delWorld"
    ></MyWorldArchives>

    <!-- 进行增删改查的部分 -->
    <div class="edit-oc-pic" v-if="showPicEdit">
      <p>修改图片</p>
      <van-uploader  v-model="fileList" multiple :max-count="1" enctype=“multipart/form-data”>
        <template #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </template>
      </van-uploader>

      <div class="submit-box">
        <span>
          <van-button plain type="info" @click="submitPic">提交</van-button>
        </span>
        <span
          ><van-button plain type="info" @click="cancelSubPic"
            >取消</van-button
          ></span
        >
      </div>
    </div>
    <div class="edit-oc-archives">
      <van-cell-group inset v-if="showEdit">
        <p>提交修改</p>
        <!-- 需要改的东西：图片 名字 状态 介绍 -->
        <!-- <van-field label="文本" value="输入框已禁用" disabled /> -->
        <van-field v-model="chooseWorld.name" label="名字" />
        <van-field v-model="chooseWorld.status" label="状态" />
        <van-field v-model="chooseWorld.introduction" label="介绍" />
        <div class="submit-box">
          <span>
            <van-button plain type="info" @click="submitEdit">提交</van-button>
          </span>
          <span
            ><van-button plain type="info" @click="cancelSubEdit"
              >取消</van-button
            ></span
          >
        </div>
      </van-cell-group>
    </div>

    <!-- 展示已有的 -->
    <!-- 1、type=1 是表示文本内容、type =2 是表示图片内容，别的再说 -->
    <MyWorldtext v-for="item in InfoList" :key="item.id" :it="item" @delit="deltext">
    </MyWorldtext>
    
    <!-- 提供添加入口 -->
    <button class="addEditBtn" @click="showPopup" v-if="radio==''"> +</button>
    
    <van-popup v-model="showtype" round position="bottom" :style="{ height: '30%' }" >
      <van-radio-group v-model="radio" >
      <van-cell-group @click="showradio">
        <van-cell title="文本内容" clickable @click="radio = '1'">
          <template #right-icon>
            <van-radio name="1" />
          </template>
        </van-cell>
        <van-cell title="图片内容" clickable @click="radio = '2'">
          <template #right-icon>
            <van-radio name="2" />
          </template>
        </van-cell>
      </van-cell-group>
      </van-radio-group>
    </van-popup>
    <!-- 添加数据部分用radio的选项说明哪个出现 -->
    <div class="addText" v-if="radio == '1'">
      <van-field v-model="newTextTitle" label="标题" />
      <van-field
        v-model="newText"
        rows="2"
        autosize
        label="简述"
        type="textarea"
        maxlength="500"
        placeholder="请输入"
        show-word-limit
      />
      <button class="addEditBtn" @click="addText" > 添加文本 </button>
      <button class="addEditBtn" @click="canceladdText" > 取消添加 </button>

    </div>
    <div class="addPic" v-if="radio == '2'">
       <van-field v-model="newTextTitle" label="标题" />
      <van-uploader  v-model="addfileList" multiple :max-count="1" enctype=“multipart/form-data”>
        <template #preview-cover="{ file }">
          <div class="preview-cover van-ellipsis">{{ file.name }}</div>
        </template>
      </van-uploader>
      <div class="submit-box">
        <span>
          <van-button plain type="info" @click="addPic">提交</van-button>
        </span>
        <span><van-button plain type="info" @click="canceladdPic">取消</van-button></span >
      </div>
    </div>


  </div>
</template>

<script>
import MyWorldArchives from "@/components/MyWorldArchives.vue";
// 导入ajax
import request from "@/utils/request.js";
import MyWorldtext from "@/components/Mytext.vue";
import qs from "qs";

export default {
  components: {
    MyWorldArchives,
    MyWorldtext,
    // EditOcArchives,
  },
  data() {
    return {
      state: "",
      showPicker: false,
      columns: [],
      //   存放选中的世界
      chooseWorld: {},
      // 新添加的text内容
      newText: "",
      newTextTitle: "",
      //   实现多级选项的
      radio: "",
      showtype: false,
      show: false,
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: ["11", "222", "222"],
      //   是否展示更新模块
      showEdit: false,
      showPicEdit: false,
      tempOc: {},
      // 图片列表
      fileList: [],
      // 新添加的列表
      addfileList: [],
      // 现在的文件 好像没啥用
      nowfile: {},
      // 存放所有的qs转换的数组数据 最后需要转换为String 传给后端进行保存
      InfoList: [],
    };
  },
  created() {
    this.initPage();
  },
  methods: {
    // 重新获取列表
    initPage() {
      // 初始化所有的世界
      request({
        url: "/world/byuser",
        method: "GET",
      }).then((res) => {
        if (res.data.flag) {
          // 获取到了数据
          const list = res.data.object;
          list.forEach((item) => {
            var newcol = {
              text: item.name,
              value: item,
            };
            this.columns.push(newcol);
          });
        }
      });
    },
    //   选完了
    onConfirm(value, index) {
      this.state = value.text;
      this.chooseWorld = value.value;
      this.showPicker = false;
      // 刷新底下的名片和文本内容 获取全部的worldAll
      request.get("/world/worldall/" + this.chooseWorld.id).then((res) => {
        console.log("选项！");
        console.log(res);
        if (res.data.flag) {
          this.chooseWorld = { ...res.data.object };
          this.tempOc = { ...res.data.object };
          // 完成转换过程 将数据保存到textList里
          if (
            this.chooseWorld.textlist == "" ||
            this.chooseWorld.textlist == null
          ) {
            this.InfoList = [];
            console.log("如果是什么都没有的情况：");
            console.log(typeof this.InfoList);
            console.log(this.InfoList);
          } else {
            this.InfoList = qs.parse(this.chooseWorld.textlist).textlist;
            console.log("如果本来不是全没有的情况：");
            console.log(this.InfoList);
          }
          //然后再修改原型链
          // Vue.prototype.$axios = axios;
        }
      });
      console.log("value=");
      console.log(value);
      this.chooseWorld = value.value;
      // 显示在选取框上的
      this.state = value.text;
      //   隐藏
      this.showPicker = false;
    },
    // 关于文本修改的部分
    // 显示操作
    showedit(val) {
      this.showEdit = val;
    },
    // 关于图片修改的部分
    showPichandler(val) {
      this.showPicEdit = val;
    },
    // 在上传图片并点击提交后，对图片进行上传
    submitPic() {
      var formData = new FormData();
      formData.append("files", this.fileList[0].file);
      formData.append("worldid", this.chooseWorld.id);
      // 提交图片文件并更新到
      request({
        method: "POST",
        url: "/upworldimg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data != "file") {
          // 成功了，将修改关闭 并清空上传列表
          this.showPicEdit = false;
          this.fileList = [];
          //   重新获得世界,并且更新
          request.get("/world/" + this.chooseWorld.id).then((res) => {
            if (res.data.flag) {
              this.chooseWorld = { ...res.data.object };
              this.tempOc = { ...res.data.object };
            }
          });
        }
      });
    },
    // 取消对图片的上传
    cancelSubPic() {
      this.showPicEdit = false;
      this.fileList = [];
    },
    // 提交文本的更改
    submitEdit() {
      var updateWorld = {
        id: this.chooseWorld.id,
        name: this.chooseWorld.name,
        introduction: this.chooseWorld.introduction,
        status: this.chooseWorld.status,
        picture: this.chooseWorld.picture,
      };
      request({
        url: "/world",
        method: "PUT",
        data: updateWorld,
        header: {
          "Content-Type": "application/json", //规定传递的参数格式为json
        },
      }).then((res) => {
        if (res.data.flag) {
          // 成功了，将修改关闭 并重新刷新数据
          this.showEdit = false;
          request.get("/world/" + this.chooseWorld.id).then((res) => {
            if (res.data.flag) {
              this.chooseWorld = { ...res.data.object };
              this.tempOc = { ...res.data.object };
            }
          });
        }
      });
    },
    // 取消提交文本更改操作
    cancelSubEdit() {
      this.showEdit = false;
      this.chooseWorld = { ...this.tempOc };
    },
    // 删除当前世界
    delWorld(val) {
      request({
        url: "/world/" + val,
        method: "DELETE",
      }).then((res) => {
        console.log(res);
        if (res.data.flag) {
          // 获取到了数据
          //   清除原本的数据
          this.chooseWorld = {};
          this.columns = [];
          this.initPage();
        }
      });
    },
    // 展示添加栏
    showPopup() {
      this.showtype = true;
    },
    showradio() {
      this.showtype = false;
    },
    // 添加文本内容
    addText() {
      var newobj = {
        index: this.InfoList.length,
        title: this.newTextTitle,
        type: 1,
        text: this.newText,
      };
      console.log(this.InfoList);
      // 加入新的文本内容
      this.InfoList.push(newobj);
      let textlist = {
        textlist: this.InfoList,
      };
      // 进行更新，但首先要吧选中的oc里的textlist更新
      var worldtext = {
        worldid: this.chooseWorld.id,
        textlist: qs.stringify(textlist),
      };
      // 然后进行更新
      request({
        url: "/world/uptext",
        method: "PUT",
        data: worldtext,
      }).then((res) => {
        if (res.data.flag) {
          // 然后隐藏添加文本的框框，并且清除原来的netText
          this.newText = "";
          this.newTextTitle = "";
          this.radio = "";
        } else {
          this.InfoList.splice(newobj.index, 1); //删除第2个元素
        }
      });
    },
    // 取消添加文本内容
    canceladdText() {
      this.newText = "";
      this.newTextTitle = "";
      this.radio = "";
      this.addfileList = [];
    },
    // 删除文本内容
    deltext(val) {
      this.InfoList = this.InfoList.filter((item) => item.index != val);
      // this.InfoList.splice(val, 1); //删除第2个元素
      let textlist = {
        textlist: this.InfoList,
      };
      this.chooseWorld.textlist = qs.stringify(textlist);
      var worldtext = {
        worldid: this.chooseWorld.id,
        textlist: qs.stringify(textlist),
      };

      // 然后进行更新
      request({
        url: "/world/uptext",
        method: "PUT",
        data: worldtext,
      }).then((res) => {
        if (res.data.flag) {
          // 成功了
          // alert("ok");
        } else {
          // 如果没有成功，说明元素虽然删除了，但是数据库里还是存在，从新加回去然后给个提示
          this.initOcAndWorld();
        }
      });
    },
    // 添加图片
    addPic() {
      // 最后的文件名;
      var filename = "";
      var formData = new FormData();
      // 获取图片
      formData.append("files", this.addfileList[0].file);

      request({
        method: "POST",
        url: "/upimg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data != "file") {
          this.addfileList = [];
          // 成功了，获取图片名
          filename = res.data;
          // console.log("filename = " + filename);
          // 声明一个图片变量
          var newobj = {
            index: this.InfoList.length,
            title: this.newTextTitle,
            type: 2,
            text: filename,
          };
          // 加入新的文本内容
          this.InfoList.push(newobj);
          let textlist = {
            textlist: this.InfoList,
          };
          // 进行更新，但首先要吧选中的oc里的textlist更新
          // 这是传入controller的octext对象
          var worldtext = {
            worldid: this.chooseWorld.id,
            textlist: qs.stringify(textlist),
          };
          // 然后进行更新
          request({
            url: "/world/uptext",
            method: "PUT",
            data: worldtext,
          }).then((res) => {
            if (res.data.flag) {
              // 成功了，把图片栏给隐藏
              this.newText = "";
              this.newTextTitle = "";
              this.addfileList = [];
              this.radio = "";
            } else {
              this.InfoList.splice(newobj.index, 1); //删除第2个元素
              // this.InfoList.remove(newobj);
            }
          });
        }
      });
    },
    // 取消对图片的添加
    canceladdPic() {
      this.newText = "";
      this.newTextTitle = "";
      this.radio = "";
      this.addfileList = [];
    },
    // 提交文本的更改
    submitEdit() {
      var updateWorld = {
        id: this.chooseWorld.id,
        name: this.chooseWorld.name,
        introduction: this.chooseWorld.introduction,
        status: this.chooseWorld.status,
        picture: this.chooseWorld.picture,
      };
      request({
        url: "/world",
        method: "PUT",
        data: updateWorld,
        header: {
          "Content-Type": "application/json", //规定传递的参数格式为json
        },
      }).then((res) => {
        if (res.data.flag) {
          // 成功了，将修改关闭 并重新刷新数据
          this.showEdit = false;
          request.get("/world/" + this.chooseWorld.id).then((res) => {
            if (res.data.flag) {
              this.chooseWorld = { ...res.data.object };
              this.tempOc = { ...res.data.object };
            }
          });
        }
      });
    },
    // 取消对文字修改的提交
    cancelSubEdit() {
      this.showEdit = false;
      this.chooseWorld = { ...this.tempOc };
    },
  },
};
</script>

<style>
.my-worldlist-container {
  padding-bottom: 50px;
}
.addEditBtn {
  width: 100%;
  background: #bdbdbd;
  border: 1px solid #bbbbbb;
  border-radius: 30px;
  color: #aaaaaa;
}

.submit-box {
  display: flex;
}

.submit-box span {
  text-align: center;
  flex: 1;
}

.submit-box span button {
  height: 25px;
  border-radius: 10px;
  border: 1px solid #7b7b7b;
}

.submit-box span button span {
  color: #7b7b7b;
}

.edit-oc-pic {
  text-align: center;
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}

.edit-oc-archives {
  margin-bottom: 20px;
}
.addPic {
  text-align: center;
}
</style>