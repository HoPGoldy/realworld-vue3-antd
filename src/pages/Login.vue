<template>
<div>
    <a-row type="flex" justify="center">
        <a-col>
            <h1>{{isLoginPage ? 'Sign in' : 'Sign up'}}</h1>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col>
            <router-link v-if="isLoginPage" to="/register">Need an account?</router-link>
            <router-link v-else to="/login">Have an account?</router-link>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col :md="8" :xs="24" style="margin-top: 1em;">
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
        <a-col :md="8" :xs="24">
            <a-button type="primary" @click="onSubmit" block>{{isLoginPage ? 'Sign in' : 'Sign up'}}</a-button>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts">
import { defineComponent, toRef, computed, reactive, inject, ref } from "vue";
import { ValidationRule } from 'ant-design-vue/es/form/Form';
import { setUserInfoKey } from '@/contants';
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { RegisterInfo, UserAPI, formatError } from '@/api';

type FormRules = {
    [field in keyof RegisterInfo]: ValidationRule[]
}

export default defineComponent({
    name: "Login",
    setup() {
        const path = toRef(useRoute(), "path");
        const isLoginPage = computed(() => path.value === "/login");

        const setUserInfo = inject(setUserInfoKey);
        if (!setUserInfo) console.error(setUserInfo, '不存在');

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
                console.error(e.response.data.errors);
                errorInfo.value = formatError(e.response.data.errors);
            }
        };
        onBeforeRouteLeave(() => formRef.value && formRef.value.resetFields());
        const errorInfo = ref<string[]>();

        return { isLoginPage, formData, onSubmit, formRules, formRef, errorInfo };
    },
});
</script>

<style></style>
