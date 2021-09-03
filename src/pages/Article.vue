<template>
<a-row type="flex" justify="center">
    <a-col :md="12" :xs="24">
        <Suspense>
            <template #default>
                <ArticleDetail :slug="querySlug" />
            </template>
            <template #fallback>
                <a-skeleton active />
            </template>
        </Suspense>
    </a-col>
</a-row>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ArticleDetail from '@/components/Article/ArticleDetail.vue';
import { Slug } from '@/types/services';

const route = useRoute();
const querySlug = route.params.id as Slug;
</script>

<style>
.ant-card-head-wrapper {
    align-items: flex-end !important;
}
</style>