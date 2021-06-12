<template>
<div>
    <a-row type="flex" justify="center">
        <a-col>
            <a-typography-title>{{isLoginPage ? 'Sign in' : 'Sign up'}}</a-typography-title>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col>
            <router-link v-if="isLoginPage" to="/register">Need an account?</router-link>
            <router-link v-else to="/login">Have an account?</router-link>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24" style="margin-top: 1em;">
            <div v-if="errorInfo" style="margin-bottom: 2em;" >
                <a-alert style="margin-bottom: 1em;" v-for="errorContent in errorInfo" :key="errorContent" :message="errorContent" type="error" />
            </div>
            <a-form :model="formData" :rules="formRules" ref="formRef">
                <a-form-item v-if="!isLoginPage" name="username">
                    <a-input v-model:value="formData.username" placeholder="username" />
                </a-form-item>
                <a-form-item name="email">
                    <a-input v-model:value="formData.email" placeholder="email" />
                </a-form-item>
                <a-form-item name="password">
                    <a-input-password v-model:value="formData.password" placeholder="password" />
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24">
            <a-button type="primary" @click="onSubmit" block>{{isLoginPage ? 'Sign in' : 'Sign up'}}</a-button>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts">
import { defineComponent, toRef, computed, reactive, inject, ref, ComputedRef } from "vue";
import { SetUserInfo, setUserInfoKey } from '@/contants';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { RegisterInfo, UserAPI, formatError } from '@/api';
import { FormRules } from '@/common';

const usePageMode = function () {
    const path = toRef(useRoute(), "path");
    return computed(() => path.value === "/login");
}

const useLoginForm = function (isLoginPage: ComputedRef<boolean>, setUserInfo?: SetUserInfo) {
    const formRules: FormRules = {
        username: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }],
        email: [{ required: true, trigger: 'change' }],
    }
    const formRef = ref();

    const router = useRouter();
    const formData = reactive<RegisterInfo>({ username: '', password: '', email: '', });
    const onSubmit = async () => {
        errorInfo.value = undefined;
        await formRef.value.validate();
        
        try {
            const request = isLoginPage.value ? UserAPI.login : UserAPI.register;
            const selfUserInfo = await request(formData);
            setUserInfo && setUserInfo(selfUserInfo);
            router.replace(`/user/${selfUserInfo.username}`);
        }
        catch (e) {
            console.error(e);
            errorInfo.value = formatError(e.response.data.errors);
        }
    };
    onBeforeRouteLeave(() => formRef.value && formRef.value.resetFields());
    const errorInfo = ref<string[]>();

    return { formData, onSubmit, formRules, formRef, errorInfo };
}

export default defineComponent({
    name: "Login",
    setup() {
        const isLoginPage = usePageMode();

        const setUserInfo = inject(setUserInfoKey);
        if (!setUserInfo) console.error(setUserInfo, '不存在');

        return {
            isLoginPage,
            ...useLoginForm(isLoginPage, setUserInfo)
        };
    },
});
</script>

<style></style>
