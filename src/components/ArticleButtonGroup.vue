<template>
<a-space style="width: 100%; justify-content: center;">
    <template v-if="showManageButton">
        <a-button key="edit">
            <router-link :to="`/editor/${article.slug}`">Edit Article</router-link>
        </a-button>
        <a-button key="delete" type="danger" @click="onDeleteArticle">Delete Article</a-button>
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
import { computed, inject, Ref, toRefs } from 'vue';
import FollowButton from '@/components/FollowButton.vue';
import LikeButton from '@/components/LikeButton.vue';
import { useRouter } from 'vue-router';
import { loginInfoKey } from '@/contants';
import { Article, UserInfo } from '@/types/services';
import { deleteArticle } from '@/services/article';

const emits = defineEmits<{ (event: 'update', data: Article): void }>();
const props = defineProps<{ article: Article }>();

const useArticleButton = function (article: Ref<Article>) {
    const router = useRouter();
    const userInfo = inject(loginInfoKey);
    const showManageButton = computed(() => {
        return !(!userInfo || userInfo.value?.username !== article.value?.author?.username);
    });

    const onDeleteArticle = async function () {
        await deleteArticle(article.value.slug);
        router.push(`/home`);
    }

    const onUpdateArticle = function (newArticle: Article) {
        emits('update', newArticle);
    }

    const onUpdateAuthor = function (newAuthor: UserInfo) {
        const newArticle: Article = { ...article.value, author: newAuthor };
        emits('update', newArticle);
    }

    return { showManageButton, onDeleteArticle, onUpdateAuthor, onUpdateArticle };
}

const { article } = toRefs(props);

const { showManageButton, onDeleteArticle, onUpdateAuthor } = useArticleButton(article);
</script>
