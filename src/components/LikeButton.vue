<template>
<a-button :loading="loading" :type="article.favorited ? 'primary' : 'default'" :size="size" @click="onClick">
    <template #icon>
        <LikeOutlined />
    </template>
    {{ article.favoritesCount }}
</a-button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { LikeOutlined } from '@ant-design/icons-vue'
import { Article } from '@/types/services'
import { favoriteArticle, unfavoriteArticle } from '@/services/article'
import useLoading from '@/utils/useLoding'

interface Props {
    article: Article
    size?: string
}

interface Emits {
    (event: 'update', data: Article): void
}

const props = withDefaults(defineProps<Props>(), { size: 'small' })
const emits = defineEmits<Emits>()

const { article, size } = toRefs(props)

/** 回调 - 点击喜欢按钮 */
const { loading, run: onClick } = useLoading(async () => {
    const request = article.value.favorited ? unfavoriteArticle : favoriteArticle
    const resp = await request(article.value.slug)
    emits('update', resp)
})
</script>

<style>
.list-loading {
    height: 100px;
}

.ant-list-vertical .ant-list-item-meta-title {
    margin-bottom: 0px !important;
}
</style>
