<template>
<a-row>
    <a-col :offset="4" :span="12">
        <a-card>
            <a-menu v-model:selectedKeys="currentTab" mode="horizontal" @select="onTabSelect">
                <a-menu-item key="global">
                    <MailOutlined />
                    Global Feed
                </a-menu-item>
                <a-menu-item v-if="!!userInfo" key="your">
                    <TeamOutlined />
                    Your Feed
                </a-menu-item>
                <a-menu-item v-if="!!checkedTag" :key="checkedTag">
                    <TagOutlined />
                    #{{checkedTag}}
                </a-menu-item>
            </a-menu>
            <ArticleList :query="query" :request="queryRequest" @tag-click="onClickTag"/>
        </a-card>
    </a-col>
    <a-col :span="4">
        <a-card title="Popular Tags" :loading="loadingTag">
            <TagList :tagList="tagList" @click="onClickTag" />
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, inject, Ref } from 'vue';
import { ArticleAPI, ArticleQuery } from '@/api';
import ArticleList from '@/components/ArticleList.vue';
import { MailOutlined, TeamOutlined, TagOutlined } from '@ant-design/icons-vue';
import TagList from '@/components/TagList.vue';
import { userInfoKey } from '@/contants';
import { useRoute, useRouter } from 'vue-router';

const useTag = function (currentTab: Ref<string[]>) {
    // 当前选中的 tag
    const checkedTag = ref<string>('');
    // 所有热门 tag
    const tagList = ref<string[]>([]);
    // 是否加载中
    const loadingTag = ref(true);

    // 获取热门 tag
    const fetchTagList = async () => {
        loadingTag.value = true;
        const list = await ArticleAPI.getTagList();
        loadingTag.value = false;
        tagList.value = list;
    }

    const onClickTag = (value: string) => {
        currentTab.value[0] = value;
        checkedTag.value = value;
    }

    fetchTagList();

    return { tagList, checkedTag, loadingTag, onClickTag, fetchTagList }
}

type TabName = 'global' | 'your' | string

export default defineComponent({
    name: 'Home',
    components: { ArticleList, TagList, MailOutlined, TeamOutlined, TagOutlined },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const currentTab = ref<TabName[]>([route.query.tab as TabName || 'global']);

        const query = computed<ArticleQuery>(() => {
            const currentTabValue = currentTab.value[0] || 'global';
            const tag = ['global', 'your'].includes(currentTabValue) ? '' : currentTabValue;
            return { tag };
        });

        const queryRequest = computed(() => {
            return currentTab.value.includes('your') ? ArticleAPI.getFeedList : ArticleAPI.getGlobalList;
        });

        const userInfo = inject(userInfoKey);
        if (!userInfo) return new Error(`无效 inject ${userInfo}`);

        
        const composableTag = useTag(currentTab);

        const onTabSelect = function ({ key }: { key: TabName }) {
            router.push({ query: { ...route.query, tab: key } });
        }

        return {
            ...composableTag,
            userInfo,
            currentTab,
            query,
            queryRequest,
            onTabSelect
        }
    }
})
</script>

<style scoped>
.tag {
    margin-bottom: 1em;
    cursor: pointer;
}
</style>