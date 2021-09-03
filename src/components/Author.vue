<template>
<a-space>
    <a-avatar :size="size" :src="author.image" />
    
    <a-space :direction="metaDirection" :size="metaSpaceSize">
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
    /** 用户名和日期的对齐方向 */
    metaDirection?: 'vertical' | 'horizontal'
    /** 组件大小 */
    size?: 'small' | 'default'
}

const props = withDefaults(defineProps<Props>(), { date: '', metaDirection: 'vertical', size: 'default' });
const { date, metaDirection } = toRefs(props);

const dateLabel = computed(() => {
    if (!date.value) return '';
    return dayjs(date.value).format('YYYY-MM-DD HH:mm:ss');
})

const metaSpaceSize = computed(() => {
    if (metaDirection.value === 'horizontal') return 8;
    return 2;
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
