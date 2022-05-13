<template>
<a-layout-header class="header">
    <h1 class="logo">
        conduit
    </h1>

    <a-space size="middle">
        <router-link to="/">
            Home
        </router-link>

        <!-- 登陆时 -->
        <template v-if="loginInfo">
            <router-link to="/editor">
                <DiffOutlined /> New Article
            </router-link>

            <router-link to="/settings">
                <SettingOutlined /> Setting
            </router-link>

            <router-link :to="`/user/${loginInfo.username}`">
                <a-space align="baseline">
                    <a-avatar size="small" :src="loginInfo.image" />
                    {{ loginInfo.username }}
                </a-space>
            </router-link>
        </template>

        <!-- 未登录时 -->
        <template v-else>
            <router-link to="/login">
                Sign in
            </router-link>
            <router-link to="/register">
                Sign up
            </router-link>
        </template>
    </a-space>
</a-layout-header>
</template>

<script setup lang="ts">
import { SelfUserInfo } from '@/types/services'
import { DiffOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { toRefs } from 'vue'

const props = defineProps<{ loginInfo: SelfUserInfo | undefined }>()
const { loginInfo } = toRefs(props)
</script>

<style scoped>
.header {
    position: fixed;
    z-index: 100;
    width: 100%;

    display: flex;
    justify-content: space-between;
}

.header .logo {
    color: white;
}
</style>
