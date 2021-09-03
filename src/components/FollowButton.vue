<template>
<a-button :loading="loading" :type="followed ? 'primary' : 'default'" :size="size" @click="onClick">
    <template #icon>
      <PlusOutlined /> 
    </template>
    {{label}}
</a-button>
</template>

<script lang="ts" setup>
import { toRefs, computed } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { UserInfo } from "@/types/services";
import { followUser, unfollowUser } from "@/services/profile";
import useLoading from "@/utils/useLoding";

interface Props {
    followed: boolean
    username: string
    label?: string
    size?: string
}

const props = withDefaults(defineProps<Props>(), { size: 'small', followed: false });
const emit = defineEmits<{ (event: 'update', data: UserInfo): void }>();

const { username, followed, label: defaultLabel } = toRefs(props);

/** 回调 - 点击喜欢按钮 */
const { loading, run: onClick } = useLoading(async () => {
    const request = followed.value ? unfollowUser : followUser;
    const resp = await request(username.value);
    emit('update', resp);
})

const label = computed(() => {
    if (defaultLabel && defaultLabel.value) return defaultLabel.value;
    return `${followed.value ? 'Unfollow' : 'Follow'} ${username.value}`;
})
</script>

<style>
.list-loading {
    height: 100px;
}

.ant-list-vertical .ant-list-item-meta-title {
    margin-bottom: 0px !important;
}
</style>
