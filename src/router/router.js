import Vue from 'vue'
import VueRouter from 'vue-router'

import login from '@/view/login'
import home from '@/view/home'
import overview from '@/view/overview/overview'
import manageAdd from '@/view/manage/manageAdd'
import addSuccess from '@/view/manage/addSuccess'
import manageSchool from '@/view/manage/manageSchool'
import manageDetail from '@/view/manage/manageDetail'
import account from '@/view/account/account'
import complaint from '@/view/complaint/complaint'
import permission from '@/view/permission/permission'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        // 登录 一级组件
        { path: '/login', name: 'login', component: login },
        // 首页 一级组件
        {
            path: '/',
            name: 'home',
            component: home,
            // 重定向至概况 二级组件
            redirect: 'overview',
            children: [
                // 概况 二级组件
                {
                    path: 'overview',
                    name: 'overview',
                    component: overview
                },
                // 学校管理 增加学校 二级组件
                {
                    path: 'manageAdd',
                    name: 'manageAdd',
                    component: manageAdd
                },
                // 学校管理 增加学校成功 二级组件
                {
                    path: 'addSuccess',
                    name: 'addSuccess',
                    component: addSuccess
                },
                // 学校管理 学校列表 二级组件
                {
                    path: 'manageSchool',
                    name: 'manageSchool',
                    component: manageSchool
                },
                // 学校管理 学校详情 二级组件
                {
                    path: 'manageDetail',
                    name: 'manageDetail',
                    component: manageDetail
                },
                // 学校账号 二级组件
                {
                    path: 'account',
                    name: 'account',
                    component: account
                },
                // 用户投诉 二级组件
                {
                    path: 'complaint',
                    name: 'complaint',
                    component: complaint
                },
                // 权限管理 二级组件
                {
                    path: 'permission',
                    name: 'permission',
                    component: permission
                },
            ]
        }
    ]
})