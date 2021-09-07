<template>
<a-space :size="32">
    <Author :author="article.author" :date="article.updatedAt" />

    <a-space>
        <template v-if="showManageButton">
            <a-button key="edit" size="small">
                <router-link :to="`/editor/${article.slug}`">
                    Edit Article
                </router-link>
            </a-button>
            <a-button
                key="delete"
                size="small"
                danger
                :loading="deleting"
                @click="onDeleteArticle"
            >
                Delete Article
            </a-button>
        </template>

        <template v-else>
            <FollowButton
                :followed="article.author?.following"
                :username="article.author?.username"
                size="small"
                @update="onUpdateAuthor"
            />
            <LikeButton :article="article" size="small" @update="onUpdateArticle" />
        </template>
    </a-space>
</a-space>
</template>

<script setup lang="ts">
import { computed, inject, Ref, toRefs } from 'vue'
import Author from '@/components/Author.vue'
import FollowButton from '@/components/FollowButton.vue'
import LikeButton from '@/components/LikeButton.vue'
import { useRouter } from 'vue-router'
import { loginInfoKey } from '@/contants'
import { Article, UserInfo } from '@/types/services'
import { deleteArticle } from '@/services/article'
import useLoading from '@/utils/useLoding'

interface Emits {
    (event: 'update', data: Article): void
}

const emits = defineEmits<Emits>()
const props = defineProps<{ article: Article }>()

const useArticleButton = function (article: Ref<Article>) {
    const router = useRouter()
    const userInfo = inject(loginInfoKey)
    const showManageButton = computed(() => {
        return !(!userInfo || userInfo.value?.username !== article.value?.author?.username)
    })

    const { loading: deleting, run: onDeleteArticle } = useLoading(async () => {
        await deleteArticle(article.value.slug)
        router.push('/home')
    })

    const onUpdateArticle = function (newArticle: Article) {
        emits('update', newArticle)
    }

    const onUpdateAuthor = function (newAuthor: UserInfo) {
        const newArticle: Article = { ...article.value, author: newAuthor }
        emits('update', newArticle)
    }

    return { showManageButton, deleting, onDeleteArticle, onUpdateAuthor, onUpdateArticle }
}

const { article } = toRefs(props)

const {
    showManageButton, deleting,
    onDeleteArticle, onUpdateAuthor, onUpdateArticle
} = useArticleButton(article)
</script>
