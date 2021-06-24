<template>
<a-space>
    <a-avatar class="a123" :src="author.image" />
    
    <a-space direction="vertical" size="2">
        <a-typography-text>{{author.username}}</a-typography-text>
        <a-typography-text type="secondary">{{dateLabel}}</a-typography-text>
    </a-space>
</a-space>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, toRefs, ref, reactive, computed, watch } from "vue";
import { LikeOutlined } from "@ant-design/icons-vue";
import { Article, ArticleAPI, UserInfo } from "@/api";
import dayjs from 'dayjs';
import LikeButton from './LikeButton.vue';
import TagList from './TagList.vue';
import { useRoute, useRouter } from "vue-router";

/** 每页展示的文章数量 */
const NUMBER_PER_PAGE = 10;

export default defineComponent({
    name: "Author",
    components: { LikeOutlined, LikeButton, TagList },
    props: {
        /** 列表搜索项 */
        author: {
            type: Object as PropType<UserInfo>,
            default: {}
        },
        /** 显示的日期字符串 */
        date: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const { date } = toRefs(props);

        const dateLabel = computed(() => {
            if (!date.value) return '';
            return dayjs(date.value).format('YYYY-MM-DD HH:mm:ss');
        })
        return {
            dateLabel
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

.tag-list {
    display: flex;
    flex-wrap: wrap;
}
</style>
