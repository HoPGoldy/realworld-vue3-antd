<template>
<a-tag class="tag" v-for="tag in tagList" :key="tag" @click="onClickTag(tag)">{{tag}}</a-tag>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ tagList?: string[] }>(), { tagList: () => [] });
const emit = defineEmits(['click']);

const onClickTag = (value: string) => emit('click', value);
</script>

<style scoped>
.tag {
    margin-bottom: 1em;
    cursor: pointer;
}
</style>