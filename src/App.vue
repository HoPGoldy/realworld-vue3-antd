<template>
<a-layout>
    <LayoutHeader :login-info="loginInfo" />

    <a-layout-content :style="{ padding: '2em 4em', marginTop: '64px' }">
        <router-view />
    </a-layout-content>

    <LayoutFooter />
</a-layout>
</template>

<script lang="ts" setup>
import { provide, onMounted, ref } from 'vue'
import { setToken } from '@/plugins/axios'
import { loginInfoKey, SetLoginInfo, setLoginInfoKey } from './contants'
import { fetchSelfUserInfo } from './services/user'
import { SelfUserInfo } from './types/services'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutHeader from './components/LayoutHeader.vue'

const useLoginInfo = function () {
    // 用户信息
    const loginInfo = ref<SelfUserInfo | undefined>(undefined)
    // 更新用户信息
    const setLoginInfo: SetLoginInfo = newInfo => {
        loginInfo.value = newInfo
        setToken(newInfo?.token)

        if (newInfo?.token) localStorage.setItem('token', newInfo.token)
        else localStorage.removeItem('token')
    }

    // 初始化时尝试用本地 token 请求用户信息
    onMounted(async () => {
        // 如果本地有 token 的话，就尝试用其获取用户信息
        const token = localStorage.getItem('token')
        if (!token) return

        setToken(token)
        const userInfo = await fetchSelfUserInfo()
        setLoginInfo(userInfo)
    })

    return { loginInfo, setLoginInfo }
}

const { loginInfo, setLoginInfo } = useLoginInfo()

// 提供给子组件
provide(loginInfoKey, loginInfo)
provide(setLoginInfoKey, setLoginInfo)
</script>

<style>
body::-webkit-scrollbar {
    width: 0px;
}
</style>
