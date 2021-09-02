<template>
<a-space>
    <a-avatar class="a123" :src="author.image" />
    
    <a-space direction="vertical" size="2">
        <a-typography-text>{{author.username}}</a-typography-text>
        <a-typography-text type="secondary">{{dateLabel}}</a-typography-text>
    </a-space>
</a-space>
</template>

<script lang="ts" setup>
import { toRefs, computed } from "vue";
import dayjs from 'dayjs';
import { UserInfo } from "@/types/services";

interface Props {
    /** 头像对应的用户信息 */
    author: UserInfo
    /** 显示在头像下方的日期字符串 */
    date?: string
}

const props = withDefaults(defineProps<Props>(), { date: '' });
const { date } = toRefs(props);

const dateLabel = computed(() => {
    if (!date.value) return '';
    return dayjs(date.value).format('YYYY-MM-DD HH:mm:ss');
})
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
