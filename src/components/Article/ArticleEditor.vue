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
    <a-form :label-col="{ span: 3 }" label-align="right">
        <a-form-item v-bind="validateInfos.title" label="Title">
            <a-input v-model:value="formData.title" placeholder="Article Title" />
        </a-form-item>
        <a-form-item v-bind="validateInfos.description" label="Description">
            <a-input v-model:value="formData.description" placeholder="What's this article about?" />
        </a-form-item>
        <a-form-item v-bind="validateInfos.body" label="Content">
            <v-md-editor v-model="formData.body" height="400px" placeholder="Write your article (in markdown)"></v-md-editor>
        </a-form-item>
        <a-form-item label="tags">
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
    <a-button :loading="submiting" type="primary" @click="onSubmit" block>Publish Article</a-button>
</a-card>
</template>

<script lang="ts" setup>
import { ref, computed, ComputedRef, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormRules } from '@/types/common';
import { ArticleContent, Slug } from '@/types/services';
import { createArticle, fetchArticle, updateArticle } from '@/services/article';
import { Form } from 'ant-design-vue';
import { formatError } from '@/utils/formatError';
import useLoading from '@/utils/useLoding';

const useArticleInfo = function () {
    const route = useRoute();

    const editSlug = route.params.id as Slug;
    const isCreatePage = computed(() => !editSlug);

    return { editSlug, isCreatePage };
}

const useEditForm = function (slug: Slug, isCreatePage: ComputedRef<boolean>) {
    const formRules = reactive<FormRules>({
        title: [{ required: true, trigger: 'change' }],
        body: [{ required: true, trigger: 'change' }],
        description: [{ required: true, trigger: 'change' }],
    });
    const formData = ref<ArticleContent>({ title: '', description: '', body: '', tagList: [] });
    const router = useRouter();
    const errorInfo = ref<string[]>();

    const { validate, validateInfos } = Form.useForm(formData, formRules);

    // 回调 - 点击发布按钮
    const { loading: submiting, run: onSubmit } = useLoading(async () => {
        try {
            errorInfo.value = undefined;
            await validate();

            // 根据页面状态选择是更新还是新建
            const newArticle = isCreatePage.value ?
                await createArticle(formData.value) :
                await updateArticle(slug, formData.value);

            console.log(newArticle)

            // 建好了就去对应的文章页面
            router.push(`/article/${newArticle.slug}`);
        }
        catch (e) {
            console.error(e);
            // 失败了就尝试显示错误信息
            errorInfo.value = formatError(e.response.data.errors);
        }
    });

    return { formData, onSubmit, submiting, validateInfos, errorInfo };
}

const { editSlug, isCreatePage } = useArticleInfo();

const { formData, onSubmit, validateInfos, errorInfo, submiting } = useEditForm(editSlug, isCreatePage);

// 是编辑页面的话就需要回显文章内容
if (!isCreatePage.value) {
    const article = await fetchArticle(editSlug);
    formData.value = article;
}

// 根据页面状态显示页面标题
const pageTitle = computed(() => {
    return isCreatePage.value ? 'New Article' : formData.value.title
});
</script>