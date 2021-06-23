<template>
<a-row>
    <a-col :offset="4" :span="12">
        <a-card>
            <!-- tab 切换 -->
            <a-menu v-model:selectedKeys="currentTab" mode="horizontal">
                <a-menu-item key="global">
                    <MailOutlined /> Global Feed
                </a-menu-item>
                <a-menu-item v-if="!!userInfo" key="your">
                    <TeamOutlined /> Your Feed
                </a-menu-item>
                <a-menu-item v-if="!!checkedTag" :key="checkedTag">
                    <TagOutlined /> #{{checkedTag}}
                </a-menu-item>
            </a-menu>

            <!-- 文章列表 -->
            <ArticleList :query="query" :request="queryRequest" @tag-click="onClickTag"/>
        </a-card>
    </a-col>

    <!-- 右侧热门标签 -->
    <a-col :span="4">
        <a-card title="Popular Tags" :loading="loadingTag">
            <TagList :tagList="tagList" @click="onClickTag" />
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive, inject, Ref, watch } from 'vue';
import { ArticleAPI, ArticleQuery } from '@/api';
import ArticleList from '@/components/ArticleList.vue';
import { MailOutlined, TeamOutlined, TagOutlined } from '@ant-design/icons-vue';
import TagList from '@/components/TagList.vue';
import { userInfoKey } from '@/contants';
import { useRoute, useRouter } from 'vue-router';

/** 不是标签的 tab 页面值 */
const NOT_TAG_TAB = ['global', 'your']

/** 所有可能的 tab 值 */
type TabName = 'global' | 'your' | string

const useTag = function (currentTab: Ref<string[]>) {
    const currentTabValue = currentTab.value[0] || 'global';
    const defaultTag = NOT_TAG_TAB.includes(currentTabValue) ? '' : currentTabValue;
    // 当前选中的 tag
    const checkedTag = ref<string>(defaultTag);
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
        currentTab.value = [value];
        checkedTag.value = value;
    }

    fetchTagList();

    return { tagList, checkedTag, loadingTag, onClickTag, fetchTagList }
}

export default defineComponent({
    name: 'Home',
    components: { ArticleList, TagList, MailOutlined, TeamOutlined, TagOutlined },
    setup() {
        const router = useRouter();
        const route = useRoute();
        // 当前选中的标签页，会用 query 参数最为默认值
        const currentTab = ref<TabName[]>([route.query.tab as TabName || 'global']);

        // 生成列表查询参数，这个页面只用到了 tag
        const query = computed<ArticleQuery>(() => {
            const currentTabValue = currentTab.value[0] || 'global';
            const tag = NOT_TAG_TAB.includes(currentTabValue) ? '' : currentTabValue;
            return { tag };
        });

        // 根据当前标签页（如果是 Your Feed 的话）来选择对应的请求方法
        const queryRequest = computed(() => {
            return currentTab.value.includes('your') ? ArticleAPI.getFeedList : ArticleAPI.getGlobalList;
        });

        // 根据当前是否有用户信息决定是否显示 Your Feed 标签页
        const userInfo = inject(userInfoKey);

        // 把当前选择的标签同步到 url query
        watch(currentTab, tabs => {
            router.push({ query: { ...route.query, tab: tabs[0] }})
        })

        return {
            userInfo,
            currentTab,
            query,
            queryRequest,
            ...useTag(currentTab)
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