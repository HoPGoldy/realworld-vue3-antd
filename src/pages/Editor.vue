<template>
<div>
    <a-row type="flex" justify="center">
        <a-col>
            <a-typography-title>{{pageTitle}}</a-typography-title>
        </a-col>
    </a-row>

    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24" style="margin-top: 1em;">
            <div v-if="errorInfo" style="margin-bottom: 2em;" >
                <a-alert style="margin-bottom: 1em;" v-for="errorContent in errorInfo" :key="errorContent" :message="errorContent" type="error" />
            </div>
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
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24">
            <a-button type="primary" @click="onSubmit" block>Publish Article</a-button>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts">
import { formatError, ArticleContent, ArticleAPI, Slug } from '@/api';
import { defineComponent, ref, computed, ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormRules } from '@/common';

const useArticleInfo = function () {
    const route = useRoute();

    const editSlug = route.params.id as Slug;
    const isCreatePage = computed(() => !editSlug);

    return { editSlug, isCreatePage };
}

const useLoginForm = function (slug: Slug, isCreatePage: ComputedRef<boolean>) {
    const formRules: FormRules = {
        title: [{ required: true, trigger: 'change' }],
        body: [{ required: true, trigger: 'change' }],
    }
    const formRef = ref();
    const router = useRouter();
    const errorInfo = ref<string[]>();

    const formData = ref<ArticleContent>({ title: '', description: '', body: '', tagList: [] });
    const onSubmit = async () => {
        errorInfo.value = undefined;
        await formRef.value.validate();

        const newArticle = isCreatePage.value ?
            await ArticleAPI.create(formData.value) :
            await ArticleAPI.update(slug, formData.value);

        router.push(`/article/${newArticle.slug}`);
    };

    return { formData, onSubmit, formRules, formRef, errorInfo };
}

export default defineComponent({
    name: 'Editor',
    setup() {
        const { editSlug, isCreatePage } = useArticleInfo();

        const formOperator = useLoginForm(editSlug, isCreatePage);

        if (!isCreatePage.value) {
            const fetchArticle = async () => {
                const article = await ArticleAPI.get(editSlug);
                formOperator.formData.value = article;
            }
            fetchArticle();
        }

        const pageTitle = computed(() => {
            return isCreatePage.value ? 'New Article' : `Edit Article ${formOperator.formData.value.title}`
        })

        return {
            isCreatePage,
            pageTitle,
            ...formOperator
        }
    }
})
</script>

<style>

</style>