<template>
<a-row type="flex" justify="center">
    <a-col :md="12" :xs="24">
        <a-space direction="vertical" style="width: 100%">
            <a-card :bordered="false">
                <!-- 标题 -->
                <template #title>
                    <a-typography-title>{{article.title}}</a-typography-title>
                    <a-space :size="32">
                    <Author :author="article.author" :date="article.updatedAt" /><ArticleButtonGroup :article="article" @update="onUpdateArticle" />

                    </a-space>
                </template>

                <!-- 右侧操作区 -->
                <template #extra>
                    
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

<script lang="ts">
import { ArticleAPI, Slug, Article } from '@/api';
import { defineComponent, ref, computed, ComputedRef, inject, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Author from '@/components/Author.vue';
import TagList from '@/components/TagList.vue';
import ArticleButtonGroup from '@/components/ArticleButtonGroup.vue';
import { userInfoKey } from '@/contants';

const useArticleButton = function (article: Ref<Article>) {
    const router = useRouter();
    const userInfo = inject(userInfoKey);
    const showManageButton = computed(() => {
        return !(!userInfo || userInfo.value?.username !== article.value?.author?.username);
    });

    const deleteArticle = async function () {
        await ArticleAPI.delete(article.value.slug);
        router.push(`/home`);
    }

    return { showManageButton, deleteArticle };
}

export default defineComponent({
    name: 'Article',
    components: { Author, TagList, ArticleButtonGroup },
    setup() {
        const route = useRoute();
        const editSlug = route.params.id as Slug;
        const article = ref<Partial<Article>>({})

        const fetchArticle = async function () {
            article.value = await ArticleAPI.get(editSlug);
            console.log('🚀 ~ file: Article.vue ~ line 36 ~ fetchArticle ~ article', article.value)
        }
        fetchArticle();

        const onUpdateArticle = function (newArticle: Article) {
        console.log('🚀 ~ file: Article.vue ~ line 75 ~ onUpdateArticle ~ newArticle', newArticle)
            article.value = newArticle
        }

        return {
            article,
            onUpdateArticle,
            ...useArticleButton(article as Ref<Article>)
        }
    }
})
</script>

<style>
.ant-card-head-wrapper {
    align-items: flex-end !important;
}
</style>