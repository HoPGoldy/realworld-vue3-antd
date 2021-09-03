<template>
<a-row>
    <a-col :offset="4" :span="12">
        <a-card>
            <!-- tab 切换 -->
            <a-menu v-model:selectedKeys="[currentTab]" mode="horizontal">
                <a-menu-item key="global">
                    <MailOutlined /> Global Feed
                </a-menu-item>
                <a-menu-item v-if="!!loginInfo" key="your">
                    <TeamOutlined /> Your Feed
                </a-menu-item>
                <a-menu-item v-if="!!checkedTag" :key="checkedTag">
                    <TagOutlined /> {{checkedTag}}
                </a-menu-item>
            </a-menu>

            <!-- 文章列表 -->
            <ArticleList :query="query" :request="queryRequest" @tag-click="onClickTag"/>
        </a-card>
    </a-col>

    <!-- 右侧热门标签 -->
    <a-col :span="4">
        <a-card title="Popular Tags" :loading="loadingTag">
            <TagList :tagList="popularTags" @click="onClickTag" />
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts" setup>
import { ref, computed, inject, Ref, watch, watchEffect } from 'vue';
import ArticleList from '@/components/Article/ArticleList.vue';
import { MailOutlined, TeamOutlined, TagOutlined } from '@ant-design/icons-vue';
import TagList from '@/components/TagList.vue';
import { loginInfoKey } from '@/contants';
import { useRoute, useRouter } from 'vue-router';
import { ArticleQuery } from '@/types/services';
import { fetchFeedArticleList, fetchGlobalArticleList, fetchTagList } from '@/services/article';
import useLoading from '@/utils/useLoding';

enum TabType {
    /** 首页选项卡 */
    Global = 'global',
    /** 个人推送选项卡 */
    Your = 'your'
}

const TAB_TYPE: string[] = [TabType.Global, TabType.Your];

const useTag = function (currentTab: Ref<string>) {
    // 当前选中的标签，如果是固定 tab 的话就说明没有选择标签
    const checkedTag = ref<string>('');
    // 所有热门标签
    const popularTags = ref<string[]>([]);

    const onClickTag = (value: string) => {
        currentTab.value = value;
        checkedTag.value = value;
    }

    // 选中了固定选项卡的话，就清空当前选中标签，否则进行同步
    watchEffect(() => {
        if (TAB_TYPE.includes(currentTab.value)) checkedTag.value = '';
        else checkedTag.value = currentTab.value;
    })

    // 获取热门 tag
    const { loading, run: runFetchTagList } = useLoading(async () => {
        popularTags.value = await fetchTagList();
    })

    return { popularTags, checkedTag, loading, onClickTag, runFetchTagList }
}

const router = useRouter();
const route = useRoute();
// 当前选中的标签页，会用 query 参数最为默认值
const currentTab = ref(route.query.tab as string || TabType.Global);

const { popularTags, checkedTag, loading: loadingTag, onClickTag, runFetchTagList } = useTag(currentTab);

// 生成列表查询参数，这个页面只用到了标签
const query = computed<ArticleQuery>(() => ({ tag: checkedTag.value }));

// 根据当前选中标签页来选择对应的请求方法
const queryRequest = computed(() => {
    return currentTab.value === TabType.Your ? fetchFeedArticleList : fetchGlobalArticleList;
});

// 根据当前是否有用户信息决定是否显示 Your Feed 标签页
const loginInfo = inject(loginInfoKey, ref(undefined));

// 把当前选择的标签同步到 url query
watch(currentTab, tab => {
    router.push({ query: { ...route.query, tab }});
});

runFetchTagList();
</script>

<style scoped>
.tag {
    margin-bottom: 1em;
    cursor: pointer;
}
</style>