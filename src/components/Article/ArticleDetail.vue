<template>
<div>
    <a-result v-if="notFound" status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
        <template #extra>
            <router-link to="/home">
                <a-button type="primary">Back Home</a-button>
            </router-link>
        </template>
    </a-result>
    <a-space v-else direction="vertical" style="width: 100%">
        <a-card :bordered="false">
            <a-typography-title>{{article.title}}</a-typography-title>
             <ArticleMeta :article="article" @update="onUpdateArticle" />
        </a-card>

        <a-card :bordered="false">
            <v-md-preview :text="article.body"></v-md-preview>
            <TagList :tagList="article.tagList" />
        </a-card>

        <a-card :bordered="false">
            <ArticleMeta
                style="width: 100%; justify-content: center;"
                :article="article"
                @update="onUpdateArticle"
            />
        </a-card>
    </a-space>
</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import TagList from '@/components/TagList.vue';
import ArticleMeta from '@/components/Article/ArticleMeta.vue';
import { fetchArticle } from '@/services/article';
import { Article, Slug } from '@/types/services';

const props = defineProps<{ slug: Slug }>();
const article = ref<Article>(await fetchArticle(props.slug));

const onUpdateArticle = function (newArticle: Article) {
    article.value = newArticle;
}

// 未找到该文章
const notFound = computed(() => Object.keys(article.value).length <= 0)
</script>

<style>
.ant-card-head-wrapper {
    align-items: flex-end !important;
}
</style>