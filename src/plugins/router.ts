import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'home',
        alias: '/',
        component: () => import('@/pages/Home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/Login.vue')
    },
    {
        path: '/editor/:id?',
        name: 'editor',
        component: () => import('@/pages/Editor.vue')
    },
    {
        path: '/article/:id?',
        name: 'article',
        component: () => import('@/pages/Article.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@/pages/Profile.vue')
    },
    {
        path: '/user/:username',
        name: 'user',
        component: () => import('@/pages/User.vue')
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})