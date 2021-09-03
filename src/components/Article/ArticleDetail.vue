<template>
<div>
    <a-space direction="vertical" style="width: 100%">
        <a-card :bordered="false">
            <!-- 标题 -->
            <template #title>
                <a-typography-title>{{article.title}}</a-typography-title>
                <ArticleMeta :article="article" @update="onUpdateArticle" />
            </template>

            <!-- 正文 -->
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
import { ref } from 'vue';
import TagList from '@/components/TagList.vue';
import ArticleMeta from '@/components/ArticleMeta.vue';
import { fetchArticle } from '@/services/article';
import { Article, Slug } from '@/types/services';

const props = defineProps<{ slug: Slug }>();
const article = ref<Article>(await fetchArticle(props.slug));

const onUpdateArticle = function (newArticle: Article) {
    article.value = newArticle;
}
</script>

<style>
.ant-card-head-wrapper {
    align-items: flex-end !important;
}
</style>