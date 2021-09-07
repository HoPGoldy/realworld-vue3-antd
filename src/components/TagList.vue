<template>
<a-tag v-for="tag in tagList" :key="tag" class="tag" @click="onClickTag(tag)">
    {{ tag }}
</a-tag>
</template>

<script lang="ts" setup>

interface Emits {
    (event: 'click', data: string): void
}

withDefaults(defineProps<{ tagList?: string[] }>(), { tagList: () => [] })
const emits = defineEmits<Emits>()

const onClickTag = (value: string) => emits('click', value)
</script>

<style scoped>
.tag {
    margin-bottom: 1em;
    cursor: pointer;
}
</style>
