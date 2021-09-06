<template>
<a-row type="flex" justify="center">
    <a-col :md="16" :xs="24" style="margin-top: 1em;">
        <a-card>
            <!-- 顶部头像及信息 -->
            <a-row justify="center">
                <a-col>
                    <a-space direction="vertical" align="center">
                        <a-avatar :size="98" :src="userInfo?.image"></a-avatar>
                        <a-typography-title style="margin-bottom: 0">{{userInfo?.username}}</a-typography-title>
                        <a-typography-text v-if="!!userInfo?.bio" type="secondary">{{userInfo?.bio}}</a-typography-text>
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
                    <FollowButton v-else :username="username" :followed="followed" @update="setUserInfo" />
                </template>
            </a-tabs>

            <!-- 文章列表 -->
            <ArticleList :query="query"  @tag-click="onClickTag" />
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts" setup>
import { ref, inject, computed, Ref, watchEffect, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SettingOutlined, BuildOutlined, HeartOutlined } from '@ant-design/icons-vue';
import { loginInfoKey } from '@/contants';
import ArticleList from '@/components/Article/ArticleList.vue';
import FollowButton from '@/components/FollowButton.vue';
import { UserInfo } from '@/types/services';
import { fetchUserProfile } from '@/services/profile';
import setDocumentTitle from '@/utils/setDocumentTitle';

const useUserInfo = function (username: Ref<string>) {
    // 当前页面用户的信息
    const userInfo = ref<UserInfo | undefined>();
    // 自己的信息
    const selfInfo = inject(loginInfoKey);

    watchEffect(async () => {
        userInfo.value = await fetchUserProfile(username.value);
    });

    const setUserInfo = (newUserInfo: UserInfo) => {
        userInfo.value = newUserInfo;
    }

    const followed = computed(() => {
        if (!userInfo.value) return false;
        return userInfo.value.following;
    })

    // 当前用户是否为自己
    const isSelf = computed(() => {
        if (!userInfo.value || !selfInfo) return false;
        return selfInfo.value?.username === userInfo.value.username;
    });

    return { userInfo, isSelf, setUserInfo, followed };
}

const useUserArticleList = function (defaultTab: string, username: Ref<string>) {
    const router = useRouter();
    const currentTab = ref(defaultTab);

    // 当前列表查询条件
    const query = computed(() => {
        if (currentTab.value === 'favorited') return { favorited: username.value };
        else return { author: username.value };
    });

    // 点击标签后回首页显示
    const onClickTag = function (tag: string) {
        router.push(`/home?tab=${tag}`);
    }

    return { currentTab, query, onClickTag };
}

const route = useRoute();
const username = computed(() => route.params.username as string);

// 用户名变更时修改标题
watch(username, setDocumentTitle, { immediate: true });

// 当前选中的标签页，会用 query 参数作为默认值
const defaultTab = typeof route.query.tab === 'string' ? route.query.tab : 'my';

const { userInfo, isSelf, followed, setUserInfo } = useUserInfo(username);
const { currentTab, query, onClickTag } = useUserArticleList(defaultTab, username);
</script>
