<template>
<div>
    <a-space direction="vertical" style="width: 100%">
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
import { ref, watch } from 'vue';
import TagList from '@/components/TagList.vue';
import ArticleMeta from '@/components/Article/ArticleMeta.vue';
import { fetchArticle } from '@/services/article';
import { Article, Slug } from '@/types/services';
import setDocumentTitle from '@/utils/setDocumentTitle';

const props = defineProps<{ slug: Slug }>();
const article = ref<Article>(await fetchArticle(props.slug));

// 标题变更时修改网页标题
watch(() => article.value.title, setDocumentTitle, { immediate: true });

const onUpdateArticle = function (newArticle: Article) {
    article.value = newArticle;
}
</script>

<style>
.ant-card-head-wrapper {
    align-items: flex-end !important;
}
</style>