<template>
<a-space v-if="!!article.slug" style="width: 100%; justify-content: center;">
    <template v-if="showManageButton">
        <a-button key="edit">
            <router-link :to="`/editor/${article.slug}`">Edit Article</router-link>
        </a-button>
        <a-button key="delete" type="danger" @click="deleteArticle">Delete Article</a-button>
    </template>

    <template v-else>
        <FollowButton :followed="article.author?.following" :username="article.author?.username" size="default" @update="onUpdateAuthor" />
        <a-button key="favorite" @click="favoriteArticle">Favorite Article ({{article.favoritesCount}})</a-button>
    </template>
</a-space>
</template>

<script lang="ts">
import { ArticleAPI, Slug, Article, UserAPI, ProfileAPI, UserInfo } from '@/api';
import { defineComponent, ref, computed, ComputedRef, inject, Ref, PropType, toRefs, useContext } from 'vue';
import FollowButton from '@/components/FollowButton.vue';
import LikeButton from '@/components/LikeButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { userInfoKey } from '@/contants';

const useArticleButton = function (article: Ref<Article>) {
    const { emit } = useContext()
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

export default defineComponent({
    name: 'ArticleButtonGroup',
    props: {
        article: {
            type: Object as PropType<Article>,
            required: true
        }
    },
    emits: ['update'],
    components: { FollowButton, LikeButton },
    setup(props) {
        const { article } = toRefs(props);
        return useArticleButton(article);
    }
})
</script>

<style>

</style>