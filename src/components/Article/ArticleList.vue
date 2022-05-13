<template>
<a-list item-layout="vertical" :pagination="pagination" :data-source="articles" :loading="loadingSpin">
    <template #renderItem="{ item }">
        <a-list-item :key="item.title">
            <!-- 列表项标题 -->
            <a-list-item-meta style="align-items: center;" :description="item.timeLabel">
                <template #title>
                    <router-link :to="`/user/${item.author.username}`">
                        {{ item.author.username }}
                    </router-link>
                </template>
                <template #avatar>
                    <a-avatar class="a123" :src="item.author.image" />
                </template>
            </a-list-item-meta>

            <!-- 列表项正文 -->
            <h1>
                <router-link :to="`/article/${item.slug}`">
                    {{ item.title }}
                </router-link>
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
                    <TagList :tag-list="item.tagList" @click="onClickTag" />
                </div>
            </template>
        </a-list-item>
    </template>
</a-list>
</template>

<script lang="ts" setup>
import { watchEffect, toRefs, ref, reactive, computed, watch } from 'vue'
import dayjs from 'dayjs'
import LikeButton from '@/components/LikeButton.vue'
import TagList from '@/components/TagList.vue'
import { useRoute, useRouter } from 'vue-router'
import { Article, ArticleList, ArticleParams, ArticleQuery } from '@/types/services'
import { fetchGlobalArticleList } from '@/services/article'

interface Props {
    /** 列表搜索项 */
    query: ArticleQuery
    /** 搜索所处的请求 */
    request?: (params: ArticleParams) => Promise<ArticleList>
}

const props = withDefaults(defineProps<Props>(), {
    request: fetchGlobalArticleList
})

const emit = defineEmits<{(event: 'tag-click', clickedTag: string): void}>()

const formatArticle = (article: Article) => ({
    ...article,
    // 格式化日期
    timeLabel: dayjs(article.updatedAt).format('YYYY-MM-DD HH:mm:ss')
})
const NUMBER_PER_PAGE = 10

const { query } = toRefs(props)
const route = useRoute()
const router = useRouter()

// 文章列表
const articles = ref<Article[]>([])
// 列表是否载入中
const listLoading = ref(true)

// 列表的载入 spin
const loadingSpin = computed(() => ({
    spinning: listLoading.value,
    tip: 'Loading...',
    wrapperClassName: listLoading.value ? 'list-loading' : ''
}))

// 页面组件数据
const pagination = reactive({
    onChange: (page: number) => (pagination.current = page),
    pageSize: NUMBER_PER_PAGE,
    total: 0,
    current: Number(route.query.page || 1)
})

// 页面变化了就同步到 url query
watch(() => pagination.current, page => {
    router.push({ query: { ...route.query, page } })
})

// 查询条件变化时重置
watch([query, props.request], () => {
    pagination.total = 0
    pagination.current = 1
}, { deep: true })

// 搜索条件变更时重新发起搜索
watchEffect(async () => {
    articles.value = []
    listLoading.value = true

    const queryData = {
        offset: (pagination.current - 1) * NUMBER_PER_PAGE,
        limit: NUMBER_PER_PAGE,
        ...query.value
    }
    if (queryData.tag === '') delete queryData.tag

    const data = await props.request(queryData)
    listLoading.value = false

    // 更新文章列表和总数到本地
    articles.value = data.articles.map(formatArticle)
    pagination.total = data.articlesCount
})

/** 文章内容突变 */
const onArticleUpdate = function (newArticle: Article) {
    articles.value = articles.value.map(article => {
        return article.slug === newArticle.slug ? formatArticle(newArticle) : article
    })
}

/** 点击列表项中的标签 */
const onClickTag = function (value: string) {
    emit('tag-click', value)
}
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
