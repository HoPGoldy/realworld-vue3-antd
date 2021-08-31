<template>
<Suspense>
    <template #default>
        <ArticleDetail :slug="querySlug" />
    </template>
    <template #fallback>
        <a-row type="flex" justify="center">
            <a-col :md="12" :xs="24">
                <a-spin />
            </a-col>
        </a-row>
    </template>
</Suspense>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import ArticleDetail from '@/components/ArticleDetail.vue';
import { Slug } from '@/types/services';

const route = useRoute();
const querySlug = route.params.id as Slug;
</script>

<style>
.ant-card-head-wrapper {
    align-items: flex-end !important;
}
</style>