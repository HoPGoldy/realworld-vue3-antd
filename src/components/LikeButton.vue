<template>
<a-button :type="article.favorited ? 'primary' : 'default'" size="small" @click="onClick">
    <LikeOutlined /> {{article.favoritesCount}}
</a-button>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, toRefs, ref, reactive, computed } from "vue";
import { LikeOutlined } from "@ant-design/icons-vue";
import { Article, ArticleAPI } from "@/api";

export default defineComponent({
    name: "LikeButton",
    components: { LikeOutlined },
    props: {
        /** 该按钮对应的文章 */
        article: {
            type: Object as PropType<Article>,
            required: true
        }
    },
    emits: ['update'],
    setup(props, { emit }) {
        const { article } = toRefs(props);

        /** 回调 - 点击喜欢按钮 */
        const onClick = async function () {
            const request = article.value.favorited ? ArticleAPI.unfavorite : ArticleAPI.favorite;
            const resp = await request(article.value.slug);
            emit('update', resp);
        }

        return {
            onClick
        };
    },
});
</script>

<style>
.list-loading {
    height: 100px;
}

.ant-list-vertical .ant-list-item-meta-title {
    margin-bottom: 0px !important;
}
</style>
