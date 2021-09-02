<template>
<a-card :bordered="false">
    <!-- 标题 -->
    <template #title>
        <a-typography-title>{{pageTitle}}</a-typography-title>
    </template>

    <!-- 提交报错信息 -->
    <div v-if="errorInfo" style="margin-bottom: 2em;" >
        <a-alert style="margin-bottom: 1em;" v-for="errorContent in errorInfo" :key="errorContent" :message="errorContent" type="error" />
    </div>

    <!-- 编辑表单 -->
    <a-form :model="formData" :label-col="{ span: 5 }" label-align="left" :rules="formRules" ref="formRef">
        <a-form-item name="title" label="Title">
            <a-input v-model:value="formData.title" placeholder="Article Title" />
        </a-form-item>
        <a-form-item name="description" label="Description">
            <a-input v-model:value="formData.description" placeholder="What's this article about?" />
        </a-form-item>
        <a-form-item name="body" label="Content">
            <a-textarea v-model:value="formData.body" placeholder="Write your article (in markdown)" :auto-size="{ minRows: 3 }" />
        </a-form-item>
        <a-form-item name="tagList" label="tags">
            <a-select
                v-model:value="formData.tagList"
                mode="tags"
                :token-separators="[',', '，']"
                :open="false"
                placeholder="Enter tags, split with comma"
            >
            </a-select>
        </a-form-item>
    </a-form>

    <!-- 操作区域 -->
    <a-button type="primary" @click="onSubmit" block>Publish Article</a-button>
</a-card>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormRules } from '@/types/common';
import { ArticleContent, Slug } from '@/types/services';
import { createArticle, fetchArticle, updateArticle } from '@/services/article';

const useArticleInfo = function () {
    const route = useRoute();

    const editSlug = route.params.id as Slug;
    const isCreatePage = computed(() => !editSlug);

    return { editSlug, isCreatePage };
}
const useEditForm = function (slug: Slug, isCreatePage: ComputedRef<boolean>) {
    const formRules: FormRules = {
        title: [{ required: true, trigger: 'change' }],
        body: [{ required: true, trigger: 'change' }],
    }
    const formRef = ref();
    const router = useRouter();
    const errorInfo = ref<string[]>();

    const formData = ref<ArticleContent>({ title: '', description: '', body: '', tagList: [] });

    // 回调 - 点击发布按钮
    const onSubmit = async () => {
        errorInfo.value = undefined;
        await formRef.value.validate();

        // 根据页面状态选择是更新还是新建
        const newArticle = isCreatePage.value ?
            await createArticle(formData.value) :
            await updateArticle(slug, formData.value);

        // 建好了就去对应的文章页面
        router.push(`/article/${newArticle.slug}`);
    };

    return { formData, onSubmit, formRules, formRef, errorInfo };
}

const { editSlug, isCreatePage } = useArticleInfo();

const { formData, onSubmit, formRules, formRef, errorInfo } = useEditForm(editSlug, isCreatePage);

// 是编辑页面的话就需要回显文章内容
if (!isCreatePage.value) {
    const article = await fetchArticle(editSlug);
    formData.value = article;
}

// 根据页面状态显示页面标题
const pageTitle = computed(() => {
    return isCreatePage.value ? 'New Article' : formData.value.title
})
</script>