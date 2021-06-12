<template>
    <a-layout>
        <a-layout-header class="header">
            <h1 class="logo">conduit</h1>
            <div class="operation">
                <router-link to="/">Home</router-link>
                <template v-if="userInfo">
                    <router-link to="/editor"><DiffOutlined /> New Article</router-link>
                    <router-link to="/settings"><SettingOutlined /> Setting</router-link>
                    <router-link :to="`/user/${userInfo.username}`">{{userInfo.username}}</router-link>
                </template>
                <template v-else>
                    <router-link to="/login">Sign in</router-link>
                    <router-link to="/register">Sign up</router-link>
                </template>
            </div>
        </a-layout-header>

        <a-layout-content :style="{ padding: '2em 4em', marginTop: '64px' }">
            <router-view></router-view>
        </a-layout-content>

        <a-layout-footer :style="{ textAlign: 'center' }">
            <b>Github:</b>
            &nbsp;
            <a href="https://github.com/HoPGoldy/realworld-vue3-antd" target="__blank">RealWorld</a>
            &nbsp;&nbsp;
            <b>Author:</b>
            &nbsp;
            <a href="https://github.com/HoPGoldy" target="__blank">@HoPGoldy</a>
        </a-layout-footer>
    </a-layout>
</template>

<script lang="ts">
import { defineComponent, provide, onMounted, ref } from "vue";
import { setToken } from '@/plugins/axios';
import { UserAPI, SelfUserInfo } from '@/api';
import { userInfoKey, SetUserInfo, setUserInfoKey } from './contants';
import { DiffOutlined, SettingOutlined } from '@ant-design/icons-vue';

/** 创建全局用户信息 */
const useUserInfo = function () {
    // 用户信息
    const userInfo = ref<SelfUserInfo | undefined>(undefined);
    // 更新用户信息
    const setUserInfo: SetUserInfo = newInfo => {
        userInfo.value = newInfo;
        setToken(newInfo?.token);

        if (newInfo?.token) localStorage.setItem('token', newInfo.token);
        else localStorage.removeItem('token');
    }

    // 初始化时尝试用本地 token 请求用户信息
    onMounted(async () => {
        // 如果本地有 token 的话，就尝试用其获取用户信息
        const token = localStorage.getItem("token");
        if (!token) return;

        setToken(token);
        const userInfo = await UserAPI.getSelfUserInfo();
        setUserInfo(userInfo);
    });

    return { userInfo, setUserInfo };
}

export default defineComponent({
    name: "App",
    components: { DiffOutlined, SettingOutlined },
    setup() {
        const { userInfo, setUserInfo } = useUserInfo();

        // 提供给子组件
        provide(userInfoKey, userInfo)
        provide(setUserInfoKey, setUserInfo)

        return { userInfo }
    }
});
</script>

<style scoped>
.header {
    position: fixed;
    z-index: 1;
    width: 100%;

    display: flex;
    justify-content: space-between;
}

.header .logo {
    color: white;
}

.header .operation a {
    margin-left: 1em;
}
</style>