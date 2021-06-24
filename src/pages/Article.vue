<template>
<a-row type="flex" justify="center">
    <a-col :md="12" :xs="24" style="margin-top: 1em;">
        <a-card :bordered="false">
            <!-- 标题 -->
            <template #title>
                <a-typography-title>{{article.title}}</a-typography-title>

                <Author :author="article.author" :date="article.updatedAt" />
            </template>

        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts">
import { ArticleContent, ArticleAPI, Slug, Article } from '@/api';
import { defineComponent, ref, computed, ComputedRef, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Author from '@/components/Author.vue';

export default defineComponent({
    name: 'Article',
    components: { Author },
    setup() {
        const route = useRoute();
        const editSlug = route.params.id as Slug;
        const article = ref<Partial<Article>>({})

        const fetchArticle = async () => {
            article.value = await ArticleAPI.get(editSlug);
            console.log('🚀 ~ file: Article.vue ~ line 36 ~ fetchArticle ~ article', article.value)
        }
        fetchArticle();

        return {
            article
        }
    }
})
</script>

<style>

</style>