<template>
<a-row type="flex" justify="center">
    <a-col :md="16" :xs="24" style="margin-top: 1em;">
        <a-card>
            <template #actions>
                <a-button>
                    <router-link to="/home">
                        <HomeOutlined /> Back Home
                    </router-link>
                </a-button>
                <a-button v-if="isSelf">
                    <router-link to="/settings">
                        <SettingOutlined /> Edit Profile Setting
                    </router-link>
                </a-button>
                <a-button v-else>
                    <PlusOutlined /> Follow {{userInfo.username}}
                </a-button>
            </template>
            <a-row justify="center">
                <a-col>
                    <a-space direction="vertical" align="center">
                        <a-avatar :size="98" :src="userInfo.image"></a-avatar>
                        <a-typography-title>{{userInfo.username}}</a-typography-title>
                        <a-typography-text type="secondary">{{userInfo.bio}}</a-typography-text>
                    </a-space>
                </a-col>
            </a-row>
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts">
import { ProfileAPI, UserInfo } from '@/api';
import { defineComponent, ref, inject, computed } from 'vue';
import { useRoute } from 'vue-router';
import { HomeOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { userInfoKey } from '@/contants';

export default defineComponent({
    name: 'User',
    components: { HomeOutlined, SettingOutlined, PlusOutlined },
    setup() {
        const route = useRoute();
        const username = route.params.username;
        // 当前页面用户的信息
        const userInfo = ref<Partial<UserInfo>>({});
        // 自己的信息
        const selfInfo = inject(userInfoKey);

        const fetchUserInfo = async function () {
            userInfo.value = await ProfileAPI.getUser(
                typeof username == 'string' ? username : username[0]
            );
            console.log('🚀 ~ file: User.vue ~ line 16 ~ setup ~ userInfo', userInfo.value)

        }
        fetchUserInfo();

        // 当前用户是否为自己
        const isSelf = computed(() => {
            return selfInfo && selfInfo.value?.username === userInfo.value.username;
        });

        return { userInfo, isSelf };
    }
})
</script>

<style>

</style>