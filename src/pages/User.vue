<template>
<a-row type="flex" justify="center">
    <a-col :md="16" :xs="24" style="margin-top: 1em;">
        <a-card>
            <!-- 顶部头像及信息 -->
            <a-row justify="center">
                <a-col>
                    <a-space direction="vertical" align="center">
                        <a-avatar :size="98" :src="userInfo.image"></a-avatar>
                        <a-typography-title style="margin-bottom: 0">{{userInfo.username}}</a-typography-title>
                        <a-typography-text v-if="!!userInfo.bio" type="secondary">{{userInfo.bio}}</a-typography-text>
                    </a-space>
                </a-col>
            </a-row>

            <!-- tab 切换 -->
            <a-tabs v-model:activeKey="currentTab" mode="horizontal">
                <a-tab-pane key="my">
                    <template #tab>
                        <BuildOutlined /> My Article
                    </template>
                </a-tab-pane>
                <a-tab-pane key="favorited">
                    <template #tab>
                        <HeartOutlined /> Favorited Article
                    </template>
                </a-tab-pane>

                <!-- 操作按钮 -->
                <template #tabBarExtraContent>
                    <a-button v-if="isSelf">
                        <router-link to="/settings">
                            <SettingOutlined /> Edit Profile Setting
                        </router-link>
                    </a-button>
                    <a-button v-else>
                        <PlusOutlined /> Follow {{userInfo.username}}
                    </a-button>
                </template>
            </a-tabs>

            <!-- 文章列表 -->
            <ArticleList v-if="!!userInfo.username" :query="query" @tag-click="onClickTag" />
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts">
import { ProfileAPI, UserInfo } from '@/api';
import { defineComponent, ref, inject, computed, watch, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HomeOutlined, SettingOutlined, PlusOutlined, BuildOutlined, HeartOutlined } from '@ant-design/icons-vue';
import { userInfoKey } from '@/contants';
import ArticleList from '@/components/ArticleList.vue';

/** 用户信息相关组合式 */
const useUserInfo = function () {
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
    }
    fetchUserInfo();

    // 当前用户是否为自己
    const isSelf = computed(() => {
        return selfInfo && selfInfo.value?.username === userInfo.value.username;
    });

    return { userInfo, isSelf }
}

/** 文章列表相关组合式 */
const useArticleList = function (userInfo: Ref<Partial<UserInfo>>) {
    const router = useRouter();
    const route = useRoute();

    // 当前选中的标签页，会用 query 参数最为默认值
    const defaultTab = typeof route.query.tab === 'string' ? route.query.tab : 'my';
    const currentTab = ref<string>(defaultTab);

    // 当前列表查询条件
    const query = computed(() => {
        if (currentTab.value === 'favorited') return { favorited: userInfo.value.username };
        else return { author: userInfo.value.username };
    });

    // 点击标签后回首页显示
    const onClickTag = function (tag: string) {
        router.push(`/home?tab=${tag}`);
    }

    return { currentTab, query, onClickTag };
}

export default defineComponent({
    name: 'User',
    components: { ArticleList, HomeOutlined, SettingOutlined, PlusOutlined, BuildOutlined, HeartOutlined },
    setup() {
        const { userInfo, isSelf } = useUserInfo();
        const { currentTab, query, onClickTag } = useArticleList(userInfo);

        return { userInfo, isSelf, currentTab, query, onClickTag };
    }
})
</script>

<style>

</style>