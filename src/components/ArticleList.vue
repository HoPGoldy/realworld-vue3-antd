<template>
<a-list item-layout="vertical" :pagination="pagination" :data-source="articles" :loading="loadingSpin">
    <template #renderItem="{ item }">
        <a-list-item :key="item.title">

            <!-- 列表项标题 -->
            <a-list-item-meta style="align-items: center;" :description="item.timeLabel">
                <template #title>
                    <router-link :to="`/user/${item.author.username}`">{{ item.author.username }}</router-link>
                </template>
                <template #avatar>
                    <a-avatar class="a123" :src="item.author.image" />
                </template>
            </a-list-item-meta>

            <!-- 列表项正文 -->
            <h1>
                <router-link :to="`/article/${item.slug}`">{{ item.title }}</router-link>
            </h1>
            <span>{{ item.description }}</span>

            <!-- 右上角喜欢按钮 -->
            <template #extra>
                <LikeButton
                    :article="item"
                    @update="onArticleUpdate"
                />
            </template>

            <!-- 底部标签栏 -->
            <template #actions>
                <div class="tag-list">
                    <TagList :tagList="item.tagList" @click="onClickTag"/>
                </div>
            </template>

        </a-list-item>
    </template>
</a-list>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, toRefs, ref, reactive, computed, watch } from "vue";
import { LikeOutlined } from "@ant-design/icons-vue";
import { Article, ArticleAPI, ArticleQuery } from "@/api";
import dayjs from 'dayjs';
import LikeButton from './LikeButton.vue';
import TagList from './TagList.vue';
import { useRoute, useRouter } from "vue-router";

const formatArticle = (article: Article) => ({
    ...article,
    // 格式化日期
    timeLabel: dayjs(article.updatedAt).format('YYYY-MM-DD HH:mm:ss')
});

/** 每页展示的文章数量 */
const NUMBER_PER_PAGE = 10;

export default defineComponent({
    name: "ArticleList",
    components: { LikeOutlined, LikeButton, TagList },
    props: {
        /** 列表搜索项 */
        query: {
            type: Object as PropType<ArticleQuery>,
            default: {}
        },
        /** 搜索所处的请求 */
        request: {
            type: Function as PropType<typeof ArticleAPI.getGlobalList>,
            default: ArticleAPI.getGlobalList,
        },
    },
    emits: ['tag-click'],
    setup(props, { emit }) {
        const { query } = toRefs(props);
        const route = useRoute();
        const router = useRouter();

        // 文章列表
        const articles = ref<Article[]>([]);
        // 列表是否载入中
        const listLoading = ref(true);

        // 列表的载入 spin
        const loadingSpin = computed(() => ({
            spinning: listLoading.value,
            tip: 'Loading...',
            wrapperClassName: listLoading.value ? 'list-loading' : ''
        }));

        // 页面组件数据
        const pagination = reactive({
            onChange: (page: number) => (pagination.current = page),
            pageSize: NUMBER_PER_PAGE,
            total: 0,
            current: Number(route.query.page || 1)
        });

        // 页面变化了就同步到 url query
        watch(() => pagination.current, page => {
            router.push({ query: { ...route.query, page }})
        })

        // 查询条件变化时重置
        watch([query, props.request], () => {
            pagination.total = 0;
            pagination.current = 1;
        }, { deep: true });

        // 搜索条件变更时重新发起搜索
        watchEffect(async () => {
            articles.value = [];
            listLoading.value = true;

            const data = await props.request({
                offset: (pagination.current - 1) * NUMBER_PER_PAGE,
                limit: NUMBER_PER_PAGE,
                ...query.value
            });
            listLoading.value = false;

            // 更新文章列表和总数到本地
            articles.value = data.articles.map(formatArticle);
            pagination.total = data.articlesCount;
        });

        /** 文章内容突变 */
        const onArticleUpdate = function (newArticle: Article) {
            articles.value = articles.value.map(article => {
                return article.slug === newArticle.slug ? formatArticle(newArticle) : article;
            });
        }

        /** 点击列表项中的标签 */
        const onClickTag = function (value: string) {
            emit('tag-click', value)
        }

        return {
            articles,
            pagination,
            loadingSpin,
            onArticleUpdate,
            onClickTag
        };
    },
});
</script>

<style>
.list-loading {
    height: 100px;
}

.ant-list-vertical .ant-list-item-meta-title {
    margin-bottom: 0px !important;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
}
</style>
