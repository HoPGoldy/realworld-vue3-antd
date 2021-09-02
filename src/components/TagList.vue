<template>
<a-tag class="tag" v-for="tag in tagList" :key="tag" @click="onClickTag(tag)">{{tag}}</a-tag>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ tagList?: string[] }>(), { tagList: () => [] });
const emits = defineEmits<{ (event: 'click', data: string): void }>();

const onClickTag = (value: string) => emits('click', value);
</script>

<style scoped>
.tag {
    margin-bottom: 1em;
    cursor: pointer;
}
</style>