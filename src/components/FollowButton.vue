<template>
<a-button :type="followed ? 'primary' : 'default'" :size="size" @click="onClick">
    <PlusOutlined /> {{showLabel}}
</a-button>
</template>

<script lang="ts">
import { defineComponent, PropType, watchEffect, toRefs, ref, reactive, computed } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { Article, ArticleAPI, ProfileAPI } from "@/api";

export default defineComponent({
    name: "FollowButton",
    components: { PlusOutlined },
    props: {
        followed: {
            type: Boolean,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        label: {
            type: String
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    emits: ['update'],
    setup(props, { emit }) {
        const { username, followed, label } = toRefs(props);

        /** 回调 - 点击喜欢按钮 */
        const onClick = async function () {
            const request = followed.value ? ProfileAPI.unfollowUser : ProfileAPI.followUser;
            const resp = await request(username.value);
            emit('update', resp);
        }

        const showLabel = computed(() => {
            if (label.value) return label.value;
            return `${followed.value ? 'Unfollow' : 'Follow'} ${username.value}`

        })

        return {
            onClick,
            showLabel
        };
    },
});
</script>

<style>
.list-loading {
    height: 100px;
}

.ant-list-vertical .ant-list-item-meta-title {
    margin-bottom: 0px !important;
}
</style>
