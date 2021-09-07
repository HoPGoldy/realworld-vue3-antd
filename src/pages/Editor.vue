<template>
<a-row type="flex" justify="center">
    <a-col :md="14" :xs="24" style="margin-top: 1em;">
        <Suspense>
            <template #default>
                <ArticleEditor />
            </template>
            <template #fallback>
                <a-skeleton active />
            </template>
        </Suspense>
    </a-col>
</a-row>
</template>

<script lang="ts" setup>
import ArticleEditor from '@/components/Article/ArticleEditor.vue'
</script>
