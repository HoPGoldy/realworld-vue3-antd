<template>
<a-space v-if="!!article.slug" style="width: 100%; justify-content: center;">
    <template v-if="showManageButton">
        <a-button key="edit">
            <router-link :to="`/editor/${article.slug}`">Edit Article</router-link>
        </a-button>
        <a-button key="delete" type="danger" @click="deleteArticle">Delete Article</a-button>
    </template>

    <template v-else>
        <FollowButton
            :followed="article.author?.following"
            :username="article.author?.username"
            size="default"
            @update="onUpdateAuthor"
        />
        <LikeButton :article="article" size="default" />
    </template>
</a-space>
</template>

<script setup lang="ts">
import { ArticleAPI, Article, UserInfo } from '@/api';
import { computed, inject, Ref, toRefs } from 'vue';
import FollowButton from '@/components/FollowButton.vue';
import LikeButton from '@/components/LikeButton.vue';
import { useRouter } from 'vue-router';
import { userInfoKey } from '@/contants';

const useArticleButton = function (article: Ref<Article>) {
    const emit = defineEmits<{ (event: 'update', data: Article): void }>()
    const router = useRouter();
    const userInfo = inject(userInfoKey);
    const showManageButton = computed(() => {
        return !(!userInfo || userInfo.value?.username !== article.value?.author?.username);
    });

    const deleteArticle = async function () {
        await ArticleAPI.delete(article.value.slug);
        router.push(`/home`);
    }

    const onUpdateArticle = function (newArticle: Article) {
        emit('update', newArticle);
    }

    const onUpdateAuthor = function (newAuthor: UserInfo) {
        const newArticle: Article = { ...article.value, author: newAuthor };
        emit('update', newArticle);
    }

    return { showManageButton, deleteArticle, onUpdateAuthor, onUpdateArticle };
}


const props = defineProps<{ article: Article }>();
const { article } = toRefs(props);

const { showManageButton, deleteArticle, onUpdateAuthor } = useArticleButton(article);
</script>

<style>

</style>