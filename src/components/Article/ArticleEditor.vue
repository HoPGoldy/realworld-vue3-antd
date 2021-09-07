<template>
<a-card :bordered="false">
    <!-- 标题 -->
    <template #title>
        <a-typography-title>{{ pageTitle }}</a-typography-title>
    </template>

    <CrizmasErrorAlert :error-msg="errorMsg" />

    <!-- 编辑表单 -->
    <a-form :label-col="{ span: 3 }" label-align="right">
        <a-form-item v-bind="validateInfos.title" label="Title">
            <a-input v-model:value="formData.title" placeholder="Article Title" />
        </a-form-item>
        <a-form-item v-bind="validateInfos.description" label="Description">
            <a-input v-model:value="formData.description" placeholder="What's this article about?" />
        </a-form-item>
        <a-form-item v-bind="validateInfos.body" label="Content">
            <v-md-editor v-model="formData.body" height="400px" placeholder="Write your article (in markdown)" />
        </a-form-item>
        <a-form-item label="tags">
            <a-select
                v-model:value="formData.tagList"
                mode="tags"
                :token-separators="[',', '，']"
                :open="false"
                placeholder="Enter tags, split with comma"
            />
        </a-form-item>
    </a-form>

    <!-- 操作区域 -->
    <a-button :loading="submiting" type="primary" block @click="onSubmit">
        Publish Article
    </a-button>
</a-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArticleContent, Slug } from '@/types/services'
import { createArticle, fetchArticle, updateArticle } from '@/services/article'
import CrizmasErrorAlert from '@/components/CrizmasErrorAlert.vue'
import { useForm } from '@/composable/useForm'

const useArticleInfo = function () {
    const route = useRoute()

    const editSlug = route.params.id as Slug
    const isCreatePage = computed(() => !editSlug)

    return { editSlug, isCreatePage }
}

const router = useRouter()
const { editSlug, isCreatePage } = useArticleInfo()

// 生成表单相关响应式
const { formData, onSubmit, validateInfos, errorMsg, submiting } = useForm<ArticleContent>(
    {
        title: '',
        description: '',
        body: '',
        tagList: []
    },
    {
        title: [{ required: true, trigger: 'change' }],
        body: [{ required: true, trigger: 'change' }],
        description: [{ required: true, trigger: 'change' }]
    },
    async formData => {
        // 根据页面状态选择是更新还是新建
        const newArticle = isCreatePage.value
            ? await createArticle(formData)
            : await updateArticle(editSlug, formData)

        // 建好了就去对应的文章页面
        router.push(`/article/${newArticle.slug}`)
    }
)

// 是编辑页面的话就需要回显文章内容
if (!isCreatePage.value) {
    const article = await fetchArticle(editSlug)
    formData.value = article
}

// 根据页面状态显示页面标题
const pageTitle = computed(() => {
    return isCreatePage.value ? 'New Article' : formData.value.title
})
</script>
