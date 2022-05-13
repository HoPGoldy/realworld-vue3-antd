<template>
<div>
    <a-row type="flex" justify="center">
        <a-col>
            <a-typography-title>{{ isLoginPage ? 'Sign in' : 'Sign up' }}</a-typography-title>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col>
            <router-link v-if="isLoginPage" to="/register">
                Need an account?
            </router-link>
            <router-link v-else to="/login">
                Have an account?
            </router-link>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24" style="margin-top: 1em;">
            <CrizmasErrorAlert :error-msg="errorMsg" />

            <a-form ref="formRef">
                <a-form-item v-if="!isLoginPage" v-bind="validateInfos.username">
                    <a-input v-model:value="formData.username" placeholder="username" />
                </a-form-item>
                <a-form-item v-bind="validateInfos.email">
                    <a-input v-model:value="formData.email" placeholder="email" />
                </a-form-item>
                <a-form-item v-bind="validateInfos.password">
                    <a-input-password v-model:value="formData.password" placeholder="password" />
                </a-form-item>
            </a-form>
        </a-col>
    </a-row>
    <a-row type="flex" justify="center">
        <a-col :lg="6" :md="12" :xs="24">
            <a-button :loading="submiting" type="primary" block @click="onSubmit">
                {{ isLoginPage ? 'Sign in' : 'Sign up' }}
            </a-button>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts" setup>
import { toRef, computed, inject, ref, watch } from 'vue'
import { setLoginInfoKey } from '@/contants'
import { useRoute, useRouter } from 'vue-router'
import { login, register } from '@/services/user'
import CrizmasErrorAlert from '@/components/CrizmasErrorAlert.vue'
import { RegisterInfo } from '@/types/services'
import { FormRules, useForm } from '@/composable/useForm'

const path = toRef(useRoute(), 'path')
const isLoginPage = computed(() => path.value === '/login')
const router = useRouter()

// 设置全局用户信息
const setLoginInfo = inject(setLoginInfoKey, () => {
    throw new Error('Login 中找不到 setLoginInfo')
})

const formData = ref({
    username: '',
    password: '',
    email: ''
})

// 从登录页切换到注册页时（自己跳自己），清空表单验证
watch(isLoginPage, () => {
    resetFields()
    formRules.value = getRules()
})

const getRules = () => {
    const rules: FormRules = {
        password: [{ required: true, trigger: 'change' }],
        email: [{ required: true, trigger: 'change' }]
    }

    if (!isLoginPage.value) {
        rules.username = [{ required: true, trigger: 'change' }]
    }

    return rules
}

const formRules = ref<FormRules>(getRules())

const { onSubmit, validateInfos, errorMsg, submiting, resetFields } = useForm<RegisterInfo>(
    formData,
    formRules,
    async formData => {
        // 根据当前页面状态决定调用登录接口还是注册接口
        const request = isLoginPage.value ? login : register
        const selfUserInfo = await request(formData)
        setLoginInfo(selfUserInfo)
        router.replace(`/user/${selfUserInfo.username}`)
    }
)

</script>
