<template>
<a-tag class="tag" v-for="tag in tagList" :key="tag" @click="onClickTag(tag)">{{tag}}</a-tag>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'TagList',
    props: {
        tagList: {
            type: Array as PropType<string[]>,
            default: []
        }
    },
    emits: ['click'],
    setup(props, { emit }) {
        const onClickTag = (value: string) => emit('click', value);

        return {
            onClickTag
        }
    }
})
</script>

<style scoped>
.tag {
    margin-bottom: 1em;
    cursor: pointer;
}
</style>