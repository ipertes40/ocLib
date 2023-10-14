<template>
  <div class="my-oclist-container">
    <van-cell title="发布新的作品" is-link to="/workdesigns/addwork" />
    <!-- 按照作品集筛选的功能暂时懒得做 先隐藏掉-->
    <div class="chooseBox">
      <van-popup v-model="show" round position="bottom">
        <van-cascader
          v-model="cascaderValue"
          title="请选择作品集"
          :options="options"
          @close="show = false"
          @finish="onFinish"
        />
      </van-popup>
    </div>
    <!-- 展示全部作品 不提供修改页面 -->
    <WorkInfo
      v-for="item in worklist"
      :key="item.id"
      :workid="item.id"
      :relateOc="item.relateOc"
      :relateWorld="item.relateWorld"
      :cover="item.cover"
      :introduction="item.introduction"
      :author="item.author"
      :notmine="false"
      :title="item.title"
    ></WorkInfo>
  </div>
</template>

<script>
import WorkInfo from "@/components/WorkInfo.vue";
// 导入ajax
import request from "@/utils/request.js";
import qs from "qs";

export default {
  components: {
    WorkInfo,
  },
  data() {
    return {
      // 存放所有的作品对象
      worklist: [],
      user: {},
      show: false,
      cascaderValue: "",
      options: [],
    };
  },
  created() {
    // 获取当前用户
    request({
      method: "GET",
      url: "/user",
    }).then((res) => {
      if (res.data.flag) {
        this.user = res.data.object;
      }
    });
    // 首先获取全部的作品
    request({
      method: "GET",
      url: "/work/byuser",
    }).then((res) => {
      console.log("work/byuser");
      console.log(res);
      if (res.data.flag) {
        console.log(res.data.object);
        this.worklist = res.data.object;
      }
    });
  },
  methods: {
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
          // 进行更新，但首先要吧选中的oc里的textlist更新
          // this.chooseOc.textlist = qs.stringify(textlist);

          // 这是传入controller的octext对象
          var octext = {
            ocid: this.chooseOc.id,
            textlist: qs.stringify(textlist),
          };
          // 然后进行更新
          request({
            url: "/oc/uptext",
            method: "PUT",
            data: octext,
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

      this.chooseOc.textlist = qs.stringify(textlist);
      var octext = {
        ocid: this.chooseOc.id,
        textlist: qs.stringify(textlist),
      };

      // 然后进行更新
      request({
        url: "/oc/uptext",
        method: "PUT",
        data: octext,
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
      // this.chooseOc.textlist = qs.stringify(textlist);
      var octext = {
        ocid: this.chooseOc.id,
        textlist: qs.stringify(textlist),
      };
      // 然后进行更新
      request({
        url: "/oc/uptext",
        method: "PUT",
        data: octext,
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
    // 提交oc的图片
    submitPic() {
      var formData = new FormData();
      formData.append("files", this.fileList[0].file);
      formData.append("ocid", this.chooseOc.id);

      request({
        method: "POST",
        url: "/upocimg",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        if (res.data) {
          console.log(res);
          // 成功了，将修改关闭 并重新刷新数据
          this.showPicEdit = false;
          this.fileList = [];
          request.get("/oc/" + this.cascaderValue).then((res) => {
            if (res.data.flag) {
              this.chooseOc = { ...res.data.object };
              this.tempOc = { ...res.data.object };
            }
          });
        }
      });
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ selectedOptions }) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      // 刷新底下的名片
      request.get("/oc/ocall/" + this.cascaderValue).then((res) => {
        console.log("选项！");
        console.log(res);
        if (res.data.flag) {
          this.chooseOc = { ...res.data.object };
          this.tempOc = { ...res.data.object };
          // 完成转换过程 将数据保存到textList里
          if (this.chooseOc.textlist == "" || this.chooseOc.textlist == null) {
            this.InfoList = [];
            console.log("如果是什么都没有的情况：");
            console.log(typeof this.InfoList);
            console.log(this.InfoList);
          } else {
            this.InfoList = qs.parse(this.chooseOc.textlist).textlist;
            console.log("如果本来不是全没有的情况：");
            console.log(this.InfoList);
          }
          //然后再修改原型链
          // Vue.prototype.$axios = axios;
        }
      });
    },
    // 获得世界和oc
    initOcAndWorld() {
      // 获取我们用户的世界观，再通过用户和世界观获取所有的用户
      request.get("/oc/getworld").then((res) => {
        console.log(res);
        if (res.data.flag) {
          // 拿到了数据
          res.data.object.forEach((item) => {
            const newobj = {
              text: item.name,
              value: item.id,
              children: [],
            };
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
    showedit(val) {
      // 显示操作
      this.showEdit = val;
    },
    // 展示图片修改窗口
    showPichandler(val) {
      this.showPicEdit = val;
    },
    // 提交文本的更改
    submitEdit() {
      var updateOc = {
        id: this.chooseOc.id,
        name: this.chooseOc.name,
        introduction: this.chooseOc.introduction,
        status: this.chooseOc.status,
      };
      request({
        url: "/oc/expic",
        method: "PUT",
        data: updateOc,
        header: {
          "Content-Type": "application/json", //规定传递的参数格式为json
        },
      }).then((res) => {
        if (res.data.flag) {
          // 成功了，将修改关闭 并重新刷新数据
          this.showEdit = false;
          request.get("/oc/" + this.cascaderValue).then((res) => {
            if (res.data.flag) {
              this.chooseOc = { ...res.data.object };
              this.tempOc = { ...res.data.object };
            }
          });
        }
      });
    },
    // 取消提交文本更改操作
    cancelSubEdit() {
      this.showEdit = false;
      this.chooseOc = { ...this.tempOc };
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
        url: "/oc/" + val,
        method: "DELETE",
      }).then((res) => {
        if (res.data) {
          this.options = [];
          this.chooseOc = {};
          this.tempOc = {};
          this.initOcAndWorld();
        }
      });
    },
  },

  mounted() {},
};
</script>

<style>
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
</style>