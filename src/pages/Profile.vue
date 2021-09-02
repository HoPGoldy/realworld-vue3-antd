<template>
<a-row type="flex" justify="center">
    <a-col :md="12" :xs="24" style="margin-top: 1em;">
        <a-card :bordered="false">
            <!-- 标题 -->
            <template #title>
                <a-typography-title>Your Settings</a-typography-title>
            </template>

            <!-- 提交报错信息 -->
            <div v-if="errorInfo" style="margin-bottom: 2em;" >
                <a-alert style="margin-bottom: 1em;" v-for="errorContent in errorInfo" :key="errorContent" :message="errorContent" type="error" />
            </div>

            <!-- 用户配置表单 -->
            <a-form :model="formData" :label-col="{ span: 5 }" label-align="left" :rules="formRules" ref="formRef">
                <a-form-item name="image" label="Avatar">
                    <a-input v-model:value="formData.image" placeholder="URL of profile picture" />
                </a-form-item>
                <a-form-item name="username" label="Username">
                    <a-input v-model:value="formData.username" placeholder="Username" />
                </a-form-item>
                <a-form-item name="bio" label="Short bio">
                    <a-textarea v-model:value="formData.bio" placeholder="Short bio about you" :auto-size="{ minRows: 3 }" />
                </a-form-item>
                <a-form-item name="email" label="Email">
                    <a-input v-model:value="formData.email" placeholder="Email" />
                </a-form-item>
                <a-form-item name="password" label="Password">
                    <a-input-password v-model:value="formData.password" placeholder="New Password" />
                </a-form-item>
            </a-form>

            <!-- 按钮区 -->
            <a-button type="primary" @click="onSubmit" block>Update Setting</a-button>
            <a-button style="margin-top: 1em" type="link" @click="onLogout" block>Or click here to logout</a-button>
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts" setup>
import { SetLoginInfo, setLoginInfoKey, loginInfoKey } from '@/contants';
import { ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { FormRules } from '@/types/common';
import { UpdateSelfUserInfo } from '@/types/services';
import { updateSelfUserInfo } from '@/services/user';
import { formatError } from '@/utils/formatError';

const useProfileForm = function (setLoginInfo?: SetLoginInfo) {
    // 表单规则
    const formRules: FormRules = {
        username: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }],
        email: [{ required: true, trigger: 'change' }],
    }
    const formRef = ref();
    const router = useRouter();
    const errorInfo = ref<string[]>();

    // 表单数据
    const formData = ref<UpdateSelfUserInfo>({ username: '', password: '', email: '', bio: '', image: '' });

    // 回调 - 点击提交表单按钮
    const onSubmit = async () => {
        errorInfo.value = undefined;
        await formRef.value.validate();

        try {
            const selfUserInfo = await updateSelfUserInfo(formData.value);
            // 更新用户信息后把新的内容更新到全局
            setLoginInfo && setLoginInfo(selfUserInfo);
            router.replace(`/user/${selfUserInfo.username}`);
        }
        catch (e) {
            console.error(e);
            // 失败了就尝试显示错误信息
            errorInfo.value = formatError(e.response.data.errors);
        }
    };

    return { formData, onSubmit, formRules, formRef, errorInfo };
}

const userInfo = inject(loginInfoKey, ref(undefined));
const router = useRouter();

const setLoginInfo = inject(setLoginInfoKey, () => {
    throw new Error('Profile 中找不到 setLoginInfo');
});

// 回调 - 点击登出按钮
const onLogout = () => {
    localStorage.removeItem('token');
    setLoginInfo(undefined);
    router.push('/home');
}

const { formData, onSubmit, formRules, formRef, errorInfo } = useProfileForm(setLoginInfo);

// 组件初始化的时候用户信息不一定载入好了，这里要 watch 一下
watch(userInfo, newData => {
    if (newData) formData.value = { ...newData, password: '' };
}, { immediate: true });
</script>
