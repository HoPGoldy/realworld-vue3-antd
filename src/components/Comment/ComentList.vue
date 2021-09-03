<template>
<a-space style="width: 100%;" direction="vertical">
    <a-typography-text v-if="!loginInfo">
        <router-link to="/login">Sign in</router-link> or
        <router-link to="/register">Sign up</router-link> to
        add comments on this article.
    </a-typography-text>

    <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :data="comment"
        :article-slug="slug"
        :self-username="selfUsername"
        @delete="onDeleteComment"
    />

    <CommentEditor
        :article-slug="slug"
        :self-avatar-src="selfAvatarSrc"
        :self-username="selfUsername"
        @add="runFetchComments"
    />
</a-space>
</template>

<script setup lang="ts">
import { fetchCommentList } from '@/services/comment';
import { Comment, CommentId, Slug } from '@/types/services';
import { ref, toRefs } from '@vue/reactivity';
import CommentItem from './CommentItem.vue';
import CommentEditor from './CommentEditor.vue';
import { computed, inject } from 'vue';
import { loginInfoKey } from '@/contants';

const props = defineProps<{ slug: Slug }>();
const { slug } = toRefs(props);

const loginInfo = inject(loginInfoKey, ref(undefined));

// 自己的用户名
const selfUsername = computed(() => {
    if (loginInfo.value) return loginInfo.value.username;
    return '';
});

const selfAvatarSrc = computed(() => {
    if (loginInfo.value) return loginInfo.value.image;
    return '';
});

const comments = ref<Comment[]>([]);

const runFetchComments = async () => {
    comments.value = await fetchCommentList(slug.value)
}

const onDeleteComment = (deletedCommentId: CommentId) => {
    comments.value = comments.value.filter(({ id }) => id !== deletedCommentId);
}

runFetchComments();
</script>