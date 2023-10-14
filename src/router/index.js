import Vue from 'vue'
import VueRouter from 'vue-router'

// 组件导入
import Home from '@/views/Home.vue'
import Square from '@/views/Square.vue'
import User from '@/views/User.vue'
import OcArchivesList from '@/views/OcArchivesList.vue'
import InvateForm from '@/views/InvateForm.vue'
import Login from '@/views/Login.vue'
import WorldArchivesList from '@/views/WorldArchivesList.vue'
import HistoryList from '@/views/HistoryList.vue'
import MyOcDesign from '@/views/MyOcDesign.vue'
import Game from '@/views/Game.vue'
import RandomTag from '@/views/RandomTag.vue'
import SubmitTags from '@/views/SubmitTags.vue'
import DelTags from '@/views/DelTag.vue'
import AddOcArchives from '@/views/AddOcArchives.vue'
import MyOcDesignIndex from '@/views/MyOcDesignIndex.vue'
import OcList from '@/views/MyOcList.vue'
import MyPage from '@/views/MyPage.vue'
import MyPageIndex from '@/views/MyPageIndex.vue'
import MyInvitationList from '@/views/MyInvitationList'
import MyWorldDesign from '@/views/MyWorldDesign.vue'
import MyWorldDesignIndex from '@/views/MyWorldDesignIndex.vue'
import WorldList from '@/views/MyWorldList.vue'
import AddWorldArchives from '@/views/AddWorldArchives.vue'
import DetailIndex from '@/views/detailIndex.vue'
import WorldDetail from '@/views/WorldDetail.vue'
import OcDetail from '@/views/OcDetail.vue'
import Worklist from '@/views/WorkList.vue'
import MyWorkDesign from '@/views/MyWorkDesign.vue'
import MyWorkDesignIndex from '@/views/MyWorkDesignIndex.vue'
import MyWorkList from '@/views/MyWorkList.vue'
import AddWork from '@/views/AddWork.vue'
import WorkDetail from '@/views/WorkDetail.vue'
import MyWorkDetail from '@/views/MyWorkDetail.vue'
import Regist from '@/views/Regist.vue'

// 吧Router安装位Vue插件
Vue.use(VueRouter)


//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
    //修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err)
    }
    // 路由规则数组
const routes = [
    { path: '/', redirect: '/home' },
    {
        path: '/home',
        component: Home,
    },
    // 展示单独角色
    {
        path: "/detailPage",
        component: DetailIndex,
        children: [
            { path: "world/:id", component: WorldDetail },
            { path: "oc/:id", component: OcDetail },
            { path: "work/:id", component: WorkDetail }

        ]
    },
    // 个人界面
    {
        path: "/mypage",
        component: MyPage,
        redirect: '/mypage/index',
        children: [
            { path: "index", component: MyPageIndex },
            // 探险消息
        ]
    },
    // 邀请消息
    { path: "/invitation", component: MyInvitationList },
    // 个人oc广场
    {
        path: '/square',
        redirect: '/square/ocSquare',
        component: Square,
        children: [
            { path: 'ocSquare', component: OcArchivesList },
            { path: 'worldSquare', component: WorldArchivesList },
            { path: 'invate', component: InvateForm },
            { path: 'worldLib', component: WorldArchivesList },
            // { path: 'historyLib', component: HistoryList },
            { path: 'worklist', component: Worklist },
        ]
    },
    { path: '/user', component: User },
    { path: '/login', component: Login },
    { path: '/regist', component: Regist },
    // 关于个人作品的设计页面
    {
        path: '/workdesigns',
        component: MyWorkDesign,
        redirect: '/workdesigns/index',
        children: [
            { path: "index", component: MyWorkDesignIndex },
            // 查看个人全部的作品
            { path: "mywork", component: MyWorkList },
            // 对个人某一个单独作品进行增删改查
            {
                path: 'edit/:id',
                component: MyWorkDetail,
                name: 'editWork'
            },
            { path: "addwork", component: AddWork }
        ]
    },
    // 个人oc设计
    {
        path: "/myocdesign",
        component: MyOcDesign,
        redirect: '/myocdesign/index',
        children: [
            { path: "index", component: MyOcDesignIndex },
            { path: "myoc", component: OcList },
            { path: "addoc", component: AddOcArchives }
        ]
    },
    // 个人世界设计
    {
        path: "/myworlddesign",
        component: MyWorldDesign,
        redirect: '/myworlddesign/index',
        children: [
            { path: "index", component: MyWorldDesignIndex },
            { path: "myworld", component: WorldList },
            { path: "addWorld", component: AddWorldArchives }
        ]
    },
    {
        path: "/game",
        component: Game,
        redirect: "/game/tagchoose",
        children: [{
                path: "tagchoose",
                component: RandomTag
            },
            {
                path: "addtag",
                component: SubmitTags
            }, {
                path: "deltag",
                component: DelTags
            }

        ]
    },
];

// 创建路由实例
const router = new VueRouter({
    routes
});






export default router