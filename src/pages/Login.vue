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

<script lang="ts" setup>
import { toRef, computed, reactive, inject, ref, Ref } from "vue";
import { setLoginInfoKey } from '@/contants';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { FormRules } from '@/types/common';
import { login, register } from "@/services/user";
import { formatError } from "@/utils/formatError";
import { RegisterInfo } from "@/types/services";

const useLoginForm = function (isLoginPage: Ref<boolean>) {
    const formRules: FormRules = {
        username: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }],
        email: [{ required: true, trigger: 'change' }],
    }
    const formRef = ref();
    const errorInfo = ref<string[]>();
    const router = useRouter();

    const formData = reactive<RegisterInfo>({ username: '', password: '', email: '', });
    
    // 设置全局用户信息
    const setUserInfo = inject(setLoginInfoKey);

    // 回调 - 点击登录 / 注册按钮
    const onSubmit = async () => {
        errorInfo.value = undefined;
        await formRef.value.validate();

        try {
            // 根据当前页面状态决定调用登录接口还是注册接口
            const request = isLoginPage.value ? login : register;
            const selfUserInfo = await request(formData);
            setUserInfo && setUserInfo(selfUserInfo);
            router.replace(`/user/${selfUserInfo.username}`);
        }
        catch (e) {
            console.error(e);
            errorInfo.value = formatError(e.response.data.errors);
        }
    };

    // 从登录页切换到注册页时（自己跳自己），清空表单验证
    onBeforeRouteLeave(() => formRef.value && formRef.value.resetFields());

    return { formData, onSubmit, formRules, formRef, errorInfo };
}

const path = toRef(useRoute(), 'path');
const isLoginPage = computed(() => path.value === "/login");
const { formData, onSubmit, formRules, formRef, errorInfo } = useLoginForm(isLoginPage);
</script>

<style></style>
