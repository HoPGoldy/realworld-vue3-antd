import setDocumentTitle from '@/utils/setDocumentTitle'
import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/home',
        name: 'home',
        alias: '/',
        meta: { title: 'Home' },
        component: async () => await import('@/pages/Home.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: { title: 'Login' },
        component: async () => await import('@/pages/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        meta: { title: 'Register' },
        component: async () => await import('@/pages/Login.vue')
    },
    {
        path: '/editor/:id?',
        name: 'editor',
        meta: { title: 'Editor' },
        component: async () => await import('@/pages/Editor.vue')
    },
    {
        path: '/article/:id?',
        name: 'article',
        component: async () => await import('@/pages/Article.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        meta: { title: 'Settings' },
        component: async () => await import('@/pages/Profile.vue')
    },
    {
        path: '/user/:username',
        name: 'user',
        component: async () => await import('@/pages/User.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to, from) => {
    setDocumentTitle(to.meta.title as (string | undefined))
})

export default router
