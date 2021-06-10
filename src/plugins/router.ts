import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/pages/Home.vue')
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})