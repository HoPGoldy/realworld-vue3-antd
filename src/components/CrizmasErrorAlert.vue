<template>
<div v-if="errorInfo" style="margin-bottom: 2em;" >
    <a-alert
        style="margin-bottom: 1em;"
        v-for="errorContent in errorInfo"
        :key="errorContent"
        :message="errorContent"
        show-icon
        type="error"
    />
</div>
</template>

<script setup lang="ts">
/**
 * 一个 crizmas-mvc 风格的错误显示组件
 * @see https://raulsebastianmihaila.github.io/crizmas-mvc-docs/form/theory#result
 */
import { CrizmasError } from "@/types/services";
import { computed, toRefs } from "@vue/reactivity";


const props = defineProps<{ errorMsg: CrizmasError | undefined }>();
const { errorMsg } = toRefs(props);

const errorInfo = computed(() => formatError(errorMsg.value))

/**
 * 格式化后端校验报错
 * 
 * @param errorMsg 后端表单校验报错信息
 * @returns 报错信息数组
 */
const formatError = function (errorMsg: CrizmasError | undefined): string[] | undefined {
    if (!errorMsg || Object.keys(errorMsg).length <= 0) return undefined;
    // 遍历对象，把每个键值对渲染成一行
    return Object.entries(errorMsg).map(line => line.join(' '));
}
</script>