<template>
<div>
    <a-card :bordered="false">
        {{ comment.body }}
    </a-card>

    <a-card class="comment-meta" style="width: 100%; background-color: #f8f8f8;">
        <a-row justify="space-between">
            <a-col>
                <Author
                    size="small"
                    :author="comment.author"
                    :date="comment.updatedAt"
                    meta-direction="horizontal"
                />
            </a-col>
            <a-col>
                <a-button
                    v-if="showDeleteButton"
                    :loading="deleting"
                    type="text"
                    danger
                    size="small"
                    @click="onDeleteComment"
                >
                    <template #icon>
                        <DeleteFilled />
                    </template>
                </a-button>
            </a-col>
        </a-row>
    </a-card>
</div>
</template>

<script setup lang="ts">
import { Comment, CommentId, Slug } from '@/types/services'
import { computed, toRefs } from '@vue/reactivity'
import Author from '@/components/Author.vue'
import useLoading from '@/utils/useLoding'
import { deleteComment } from '@/services/comment'
import { DeleteFilled } from '@ant-design/icons-vue'

interface Props {
    data: Comment,
    selfUsername: string
    articleSlug: Slug
}

interface Emits {
    (event: 'delete', id: CommentId): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const { articleSlug, data: comment, selfUsername } = toRefs(props)

const showDeleteButton = computed(() => comment.value.author.username === selfUsername.value)

const { loading: deleting, run: onDeleteComment } = useLoading(async () => {
    await deleteComment(articleSlug.value, comment.value.id)
    emits('delete', comment.value.id)
})
</script>

<style>
.comment-meta .ant-card-body {
    padding: 12px 16px 12px 16px !important;
}
</style>
