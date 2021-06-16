<template>
<a-list item-layout="vertical" :pagination="pagination" :data-source="articles" :loading="loadingSpin">
    <template #renderItem="{ item }">
        <a-list-item :key="item.title">
            <template #actions>
                <span v-for="{ type, text } in actions" :key="type">
                    <component v-bind:is="type" style="margin-right: 8px" />
                    {{ text }}
                </span>
            </template>
            <template #extra>
                213
            </template>
            <a-list-item-meta style="align-items: center;" :description="item.timeLabel">
                <template #title>
                    <a :href="item.href">{{ item.title }}</a>
                </template>
                <template #avatar>
                    <a-avatar class="a123" :src="item.author.image" />
                </template>
            </a-list-item-meta>
            <h1>{{ item.title }}</h1>
            <span>{{ item.description }}</span>
        </a-list-item>
    </template>
</a-list>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, toRefs, ref, reactive, computed } from "vue";
import { StarOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons-vue";
import { Article, ArticleAPI } from "@/api";
import dayjs from 'dayjs';

const formatArticle = (article: Article) => ({
    ...article,
    // 格式化日期
    timeLabel: dayjs(article.updatedAt).format('YYYY-MM-DD HH:mm:ss')
});

/** 每页展示的文章数量 */
const NUMBER_PER_PAGE = 10;

export default defineComponent({
    name: "ArticleList",
    components: { StarOutlined, LikeOutlined, MessageOutlined },
    props: {
        tag: String,
        defaultPage: Number,
        author: String,
        favorited: String,
        request: {
            type: Function as PropType<typeof ArticleAPI.getGlobalList>,
            default: ArticleAPI.getGlobalList,
        },
    },
    setup(props) {
        const { tag, author, favorited, defaultPage } = toRefs(props);

        const articles = ref<Article[]>([]);
        const currentPage = ref(0);
        const listLoading = ref(true);

        const loadingSpin = computed(() => ({
            spinning: listLoading.value,
            tip: 'Loading...',
            wrapperClassName: listLoading.value ? 'list-loading' : ''
        }));

        const pagination = reactive({
            onChange: (page: number) => (currentPage.value = page),
            pageSize: NUMBER_PER_PAGE,
            defaultCurrent: defaultPage.value,
            total: 0,
        });

        watchEffect(async () => {
            articles.value = [];
            listLoading.value = true;
            const data = await props.request({
                offset: currentPage.value * NUMBER_PER_PAGE,
                limit: NUMBER_PER_PAGE,
                tag: tag.value,
                author: author.value,
                favorited: favorited.value,
            });
            listLoading.value = false;
            articles.value = data.articles.map(formatArticle);
            pagination.total = data.articlesCount;
        });

        const actions: Record<string, string>[] = [
            { type: "StarOutlined", text: "156" },
            { type: "LikeOutlined", text: "156" },
            { type: "MessageOutlined", text: "2" },
        ];
        return {
            articles,
            pagination,
            actions,
            loadingSpin,
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
</style>
