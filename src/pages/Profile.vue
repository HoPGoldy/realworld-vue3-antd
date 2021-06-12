<template>
<div>
    <a-row type="flex" justify="center">
        <a-col>
            <a-typography-title>Your Settings</a-typography-title>
        </a-col>
    </a-row>

    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24" style="margin-top: 1em;">
            <div v-if="errorInfo" style="margin-bottom: 2em;" >
                <a-alert style="margin-bottom: 1em;" v-for="errorContent in errorInfo" :key="errorContent" :message="errorContent" type="error" />
            </div>
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
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24">
            <a-button type="primary" @click="onSubmit" block>Update Setting</a-button>
            <a-button style="margin-top: 1em" @click="onLogout" block>Or click here to logout</a-button>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts">
import { formatError, UpdateSelfUserInfo, UserAPI } from '@/api';
import { SetUserInfo, setUserInfoKey, userInfoKey } from '@/contants';
import { defineComponent, ref, inject, watch } from 'vue';
import { useRouter } from 'vue-router';
import { FormRules } from '@/common';

const useLoginForm = function (setUserInfo?: SetUserInfo) {
    const formRules: FormRules = {
        username: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }],
        email: [{ required: true, trigger: 'change' }],
    }
    const formRef = ref();
    const router = useRouter();
    const errorInfo = ref<string[]>();

    const formData = ref<UpdateSelfUserInfo>({ username: '', password: '', email: '', bio: '', image: '' });
    const onSubmit = async () => {
        errorInfo.value = undefined;
        await formRef.value.validate();

        try {
            const selfUserInfo = await UserAPI.updateUser(formData.value);
            setUserInfo && setUserInfo(selfUserInfo);
            router.replace(`/user/${selfUserInfo.username}`);
        }
        catch (e) {
            console.error(e);
            errorInfo.value = formatError(e.response.data.errors);
        }
    };

    return { formData, onSubmit, formRules, formRef, errorInfo };
}

export default defineComponent({
    name: 'Profile',
    setup() {
        const userInfo = inject(userInfoKey);
        const setUserInfo = inject(setUserInfoKey);
        const router = useRouter();

        if (!userInfo || !setUserInfo) {
            return new Error(`无效 inject ${userInfo} ${setUserInfo}`);
        }

        // 回调 - 点击登出按钮
        const onLogout = () => {
            localStorage.removeItem('token');
            setUserInfo(undefined);
            router.push('/home');
        }

        const { formData, onSubmit, formRules, formRef, errorInfo } = useLoginForm(setUserInfo);

        if (userInfo.value) formData.value = { ...userInfo.value, password: '' };

        watch(userInfo, newData => {
            if (!newData) return;
            formData.value = { ...newData, password: '' };
        })

        return {
            formData, onSubmit, formRules, formRef, errorInfo, onLogout
        }
    }
})
</script>

<style>

</style>