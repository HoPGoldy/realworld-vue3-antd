<template>
<a-row type="flex" justify="center">
    <a-col :md="12" :xs="24">
        <a-space direction="vertical" style="width: 100%">
            <a-card :bordered="false">
                <!-- 标题 -->
                <template #title>
                    <a-typography-title>{{article.title}}</a-typography-title>
                    <a-space :size="32">
                        <Author
                            :author="article.author"
                            :date="article?.updatedAt"
                        />
                        <ArticleButtonGroup
                            :article="article"
                            @update="onUpdateArticle"
                        />
                    </a-space>
                </template>

                <!-- 正文 -->
                <v-md-preview :text="article.body"></v-md-preview>

                <TagList :tagList="article.tagList" />
            </a-card>

            <a-card :bordered="false">
                <a-space style="width: 100%; justify-content: center;" :size="32">
                    <Author :author="article.author" :date="article.updatedAt" />
                    <ArticleButtonGroup :article="article" @update="onUpdateArticle" />
                </a-space>
            </a-card>
        </a-space>
    </a-col>
</a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Author from '@/components/Author.vue';
import TagList from '@/components/TagList.vue';
import ArticleButtonGroup from '@/components/ArticleButtonGroup.vue';
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