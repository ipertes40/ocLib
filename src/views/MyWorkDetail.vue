<template>
  <div class="my-workDetail-container">
    <!-- 进行增删改的操作，和oc的差不多 但是有一些区别 -->
    <MyWorkInfo
      :workid="chooseWork.id"
      :ocList="chooseWork.relateOc"
      :worldList="chooseWork.relateWorld"
      :cover="chooseWork.cover"
      :introduction="chooseWork.introduction"
      :author="chooseWork.author"
      :notmine="false"
      :title="chooseWork.title"
      v-if="showinfo"
      @editshow="showedit"
      @picshow="showPichandler"
      @delOc="delOc"
    ></MyWorkInfo>

    <!-- 对上面部分进行一些增删改查     -->
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
        <van-field v-model="chooseWork.title" label="标题" />
        <van-field v-model="chooseWork.introduction" label="介绍" />
        <div class="relate">
        <!-- 展示相关oc和世界观 -->
        <div class="relateoc">
            <!-- 展示全部oc -->
            相关oc：
            <span class="tag" v-for="item in relateoc" :key="item.id">{{item.name}} <button @click="deloc(item.id)">x</button></span>
            <button @click="addOcTag()">+</button>
        </div>
        <div class="relateworld">
            <!-- 展示全部的世界 -->
            相关世界：
            <span class="tag" v-for="item in relateworld" :key="item.id">{{item.name}} <button @click="delworld(item.id)">x</button></span>
            <button @click="addWorldTag()">+</button>
        </div>
        <van-popup v-model="showOc" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择oc"
          :options="options"
          @close="showOc = false"
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


    <!-- 1、type=1 是表示文本内容、type =2 是表示图片内容，别的再说 -->
    <MyWorktext v-for="item in InfoList" :key="item.id" :it="item" @delit="deltext">
    </MyWorktext>

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
import MyWorkInfo from "@/components/MyWorkInfo.vue";
import MyWorktext from "@/components/Mytext.vue";
// 导入ajax
import request from "@/utils/request.js";
// import axios from "axios";
// axios.defaults.withCredentials = true;
import { Notify } from "vant";
import qs from "qs";

export default {
  components: {
    MyWorkInfo,
    MyWorktext,
    // EditOcArchives,
  },
  data() {
    return {
      showinfo: false,
      chooseWork: {},
      //   是否展示
      showOc: false,
      showworld: false,
      fieldValue: "",
      cascaderValue: "",
      options: [],
      //   单独存放世界的，不包含里面的oc
      worldOps: [],
      // 新添加的text内容
      newText: "",
      newTextTitle: "",
      //   实现多级选项的
      radio: "",
      showtype: false,
      show: false,
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
      //   存放相关tag
      relateoc: [],
      relateworld: [],
    };
  },
  methods: {
    //   添加一个新的octag
    addOcTag() {
      this.showOc = true;
    },
    addWorldTag() {
      this.showworld = true;
    },
    // 删除某一个角色tag
    deloc(id) {
      this.relateoc = this.relateoc.filter((item) => item.id != id);
      let re = {
        relateOc: this.relateoc,
      };
      this.chooseWork.relateOc = qs.stringify(re);
    },
    delworld(id) {
      console.log("删除一个worldtag");
      // 过滤掉当前id
      this.relateworld = this.relateworld.filter((item) => item.id != id);
      let rel = {
        relateWorld: this.relateworld,
      };
      this.chooseWork.relateWorld = qs.stringify(rel);
    },
    // 取消增加图片
    canceladdPic() {
      this.newText = "";
      this.newTextTitle = "";
      this.radio = "";
      this.addfileList = [];
    },
    // 新增一张图片
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
          var worktext = {
            workId: this.chooseWork.id,
            textlist: qs.stringify(textlist),
          };
          // 然后进行更新
          request({
            url: "/work/uptext",
            method: "PUT",
            data: worktext,
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
    // 删除一个text
    deltext(val) {
      this.InfoList = this.InfoList.filter((item) => item.index != val);
      // this.InfoList.splice(val, 1); //删除第2个元素
      let textlist = {
        textlist: this.InfoList,
      };

      this.chooseWork.textlist = qs.stringify(textlist);
      var worktext = {
        workId: this.chooseWork.id,
        textlist: qs.stringify(textlist),
      };

      // 然后进行更新
      request({
        url: "/work/uptext",
        method: "PUT",
        data: worktext,
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
    // 添加文本
    addText() {
      console.log("添加文本");
      console.log(this.InfoList);
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
      var worktext = {
        workId: this.chooseWork.id,
        textlist: qs.stringify(textlist),
      };
      // 然后进行更新
      request({
        url: "/work/uptext",
        method: "PUT",
        data: worktext,
      }).then((res) => {
        if (res.data.flag) {
          // 说明传输成功,刷新界面
          // initOcAndWorld();
          // 然后隐藏添加文本的框框，并且清除原来的netText
          this.newText = "";
          this.newTextTitle = "";
          this.radio = "";
        } else {
          this.InfoList.splice(newobj.index, 1); //删除第2个元素
          // this.InfoList.remove(newobj);
        }
      });
    },
    showPopup() {
      this.showtype = true;
    },
    showradio() {
      this.showtype = false;
    },
    // 提交封面
    submitPic() {
      var formData = new FormData();
      formData.append("files", this.fileList[0].file);
      //   formData.append("workid", this.chooseWork.id);

      request({
        method: "POST",
        url: "/upimg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data != "file") {
          // 成功获取了文件名，更新chooseWork
          this.showPicEdit = false;
          this.fileList = [];
          this.chooseWork.cover = res.data;
          const updateWork = {
            id: this.chooseWork.id,
            title: this.chooseWork.title,
            relateOc: this.chooseWork.relateOc,
            relateWorld: this.chooseWork.relateWorld,
            cover: this.chooseWork.cover,
            introduction: this.chooseWork.introduction,
            worklist: this.chooseWork.worklist,
            author: this.chooseWork.author,
          };
          request({
            url: "/work",
            method: "PUT",
            data: updateWork,
          }).then((res) => {
            if (res.data.flag) {
              //   成功
            }
          });
        }
      });
    },
    // 全部选项选择完毕后，会触发 finish 事件

    showedit(val) {
      // 显示操作
      this.showEdit = val;
      this.initOcAndWorld();
    },
    // 展示图片修改窗口
    showPichandler(val) {
      this.showPicEdit = val;
    },
    // 提交文本的更改
    submitEdit() {
      const updateWork = {
        id: this.chooseWork.id,
        title: this.chooseWork.title,
        relateOc: this.chooseWork.relateOc,
        relateWorld: this.chooseWork.relateWorld,
        cover: this.chooseWork.cover,
        introduction: this.chooseWork.introduction,
        worklist: this.chooseWork.worklist,
        author: this.chooseWork.author,
      };
      request({
        url: "/work",
        method: "PUT",
        data: updateWork,
        header: {
          "Content-Type": "application/json", //规定传递的参数格式为json
        },
      }).then((res) => {
        if (res.data.flag) {
          // 成功了，将修改关闭 并重新刷新数据
          this.showEdit = false;
          this.$router.push("/detailPage/work/" + this.chooseWork.id);
          // this.$router.push({
          //   name: "editWork",
          //   params: { id: this.chooseWork.id, key: "link" },
          // });
        }
      });
    },
    // 取消提交文本更改操作
    cancelSubEdit() {
      this.showEdit = false;
      this.chooseWork = { ...this.tempOc };
    },
    // 取消对图片的上传
    cancelSubPic() {
      this.showPicEdit = false;
      this.fileList = [];
    },
    // 对oc进行删除
    delOc(val) {
      // 对oc进行删除 如果成功了就重新加载所有的世界和选项 同时清空已经选的
      request({
        url: "/work/" + val,
        method: "DELETE",
      }).then((res) => {
        if (res.data) {
          this.options = [];
          this.chooseWork = {};
          this.tempOc = {};
          this.$router.go(-1);
        }
      });
    },
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
      this.showOc = false;
      const oc = {
        id: selectedOptions[1].value,
        name: selectedOptions[1].text,
      };
      if (this.relateoc != null && this.relateoc.length != 0) {
        if (this.relateoc.every((item) => item.id != oc.id)) {
          this.relateoc.push(oc);
          let re = {
            relateOc: this.relateoc,
          };
          this.chooseWork.relateOc = qs.stringify(re);
        } else {
          //   提示重复添加
          Notify("选择了重复内容");
        }
      } else {
        this.relateoc = [];
        this.relateoc.push(oc);
        let re = {
          relateOc: this.relateoc,
        };
        this.chooseWork.relateOc = qs.stringify(re);
      }
    },
    onWorldFinish({ selectedOptions }) {
      this.showworld = false;
      const world = {
        id: selectedOptions[0].value,
        name: selectedOptions[0].text,
      };
      console.log("worldfinish");
      console.log(this.relateworld.length);
      if (this.relateworld != null && this.relateworld.length != 0) {
        if (this.relateworld.every((item) => item.id != world.id)) {
          this.relateworld.push(world);
          let re = {
            relateWorld: this.relateworld,
          };
          this.chooseWork.relateWorld = qs.stringify(re);
        } else {
          //   提示重复添加
          Notify("选择了重复内容");
        }
      } else {
        this.relateworld = [];
        this.relateworld.push(world);
        let re = {
          relateWorld: this.relateworld,
        };
        this.chooseWork.relateWorld = qs.stringify(re);
      }

      //   console.log(selectedOptions);
    },
  },
  beforeCreate() {
    //   对于这个异步请求，可能是先获取的数据，渲染放在了后面
    // 先获取用户id，如果这个用户id不是这个作品id的author，不让进入
    let userid = -1;
    request({ url: "user", method: "GET" }).then((ures) => {
      if (ures.data.flag) {
        userid = ures.data.object.id;
        request({
          url: "/work/workall/" + this.$route.params.id,
          method: "GET",
        }).then((res) => {
          if (res.data.flag) {
            this.chooseWork = res.data.object;
            if (this.chooseWork.author != userid) {
              if (this.$route.params.key != "link") {
                Notify("不要对其他人的东西下手哦~下不为例");
                this.$router.push("/square");
              }
            }
            this.showinfo = true;
            this.relateoc = qs.parse(this.chooseWork.relateOc).relateOc;

            if (this.relateoc == null) {
              this.relateOc = [];
            }
            this.relateworld = qs.parse(
              this.chooseWork.relateWorld
            ).relateWorld;

            if (this.relateworld == null) {
              this.relateworld = [];
            }
            this.InfoList = qs.parse(this.chooseWork.textlist).textlist;
            if (this.InfoList == null) {
              // 没有 默认一个空列表
              this.InfoList = [];
            }
          }
        });
      }
    });
  },
  created() {},
};
</script>

<style>
.my-workDetail-container {
  margin-bottom: 10px;
}
.my-oclist-container {
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