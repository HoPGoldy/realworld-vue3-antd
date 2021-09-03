<template>
<div>
    <a-card :bordered="false">
        <a-textarea
            v-model:value="commentContent"
            placeholder="Write a comment..."
            :auto-size="{ minRows: 2 }"
        />
    </a-card>

    <a-card class="comment-meta" style="width: 100%; background-color: #f8f8f8;">
        <a-row justify="space-between" >
            <a-col>
                <a-avatar size="small" :src="selfAvatarSrc" />
            </a-col>
            <a-col>
                <a-button type="primary" :loading="submiting" size="small" @click="onSubmit">
                    Post Comment
                </a-button>
            </a-col>
        </a-row>
    </a-card>
</div>
</template>

<script setup lang="ts">
import { Comment, Slug } from "@/types/services";
import { toRefs } from "@vue/reactivity";
import useLoading from "@/utils/useLoding";
import { addComment } from "@/services/comment";
import { ref } from "vue";

interface Props {
    articleSlug: Slug
    selfAvatarSrc: string
    selfUsername: string
}

const props = defineProps<Props>();
const emits = defineEmits<{ (event: 'add', comment: Comment): void }>();
const { articleSlug, selfAvatarSrc } = toRefs(props);

const commentContent = ref('');

const { loading: submiting, run: onSubmit } = useLoading(async () => {
    const newComment = await addComment(articleSlug.value, commentContent.value);
    emits('add', newComment);
})
</script>

<style>
.comment-meta .ant-card-body {
    padding: 12px 16px 12px 16px !important;
}
</style>