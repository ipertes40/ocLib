import Vue from 'vue'
import App from './App.vue'
// 设置路由
import router from './router'

// 组件库走起
import Vant from 'vant';
import 'vant/lib/index.css';
import { Toast } from "vant";
// axios组件
import axios from 'axios'
import request from "@/utils/request.js";

request.defaults.withCredentials = true;

// 使用组件库
Vue.use(Vant)
Vue.use(Toast);

Vue.config.productionTip = false

// 设置路由拦截 
router.beforeEach((to, from, next) => {
    if (to.path === '/regist' || to.path === '/login') { //若是进入登录与注册页面 ==> pass
        next();
    } else {
        // 如果有权限可以， 没有就滚蛋
        // 这里改成ajax

        // request.get("/login").then((res) => {
        //     console.log(res.data);
        //     if (res.data.flag) {
        //         if (res.data.object != null) {
        //             // localStorage.setItem("user", res.data.object)
        //             next();
        //         } else {
        //             next('/login')
        //         }
        //     } else {
        //         next('/login')
        //     }
        // })

        // session方式获取
        var userid = JSON.parse(window.sessionStorage.getItem('user'));
        console.log("window.sessionStorage");
        console.log(userid);
        if (userid != null) {
            next();
        } else {
            next('/login')
        }
        ///////////
    }
    next();
});

// //打包配置文件
// module.exports = {
//     assetsDir: 'static',
//     parallel: false,
//     publicPath: './',
// };

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')