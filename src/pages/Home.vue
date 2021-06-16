<template>
<a-row>
    <a-col :offset="4" :span="12">
        <a-card>
            <ArticleList :tag="checkedTag" />
        </a-card>
        
    </a-col>
    <a-col :span="4">
        <a-card title="Popular Tags" :loading="loadingTag">
            <a-tag class="tag" v-for="tag in tagList" :key="tag" @click="onClickTag(tag)">{{tag}}</a-tag>
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { ArticleAPI } from '@/api';
import ArticleList from '@/components/ArticleList.vue';

const useTag = function () {
    // 当前选中的 tag
    const checkedTag = ref<string>('');
    // 所有热门 tag
    const tagList = ref<string[]>([]);
    // 是否加载中
    const loadingTag = ref(true);

    // 获取热门 tag
    const fetchTagList = async () => {
        loadingTag.value = true;
        const list = await ArticleAPI.getTagList();
        loadingTag.value = false;
        tagList.value = list;
    }

    const onClickTag = (value: string) => checkedTag.value = value;

    fetchTagList()

    return { tagList, checkedTag, loadingTag, onClickTag, fetchTagList }
}

export default defineComponent({
    name: 'Home',
    components: { ArticleList },
    setup() {
        return {
            ...useTag()
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