<template>
<a-row type="flex" justify="center">
    <a-col :md="12" :xs="24" style="margin-top: 1em;">
        <a-card :bordered="false">
            <!-- 标题 -->
            <template #title>
                <a-typography-title>Your Settings</a-typography-title>
            </template>

            <CrizmasErrorAlert :error-msg="errorMsg" />

            <!-- 用户配置表单 -->
            <a-form :label-col="{ span: 5 }" label-align="left">
                <a-form-item label="Avatar">
                    <a-input v-model:value="formData.image" placeholder="URL of profile picture" />
                </a-form-item>
                <a-form-item v-bind="validateInfos.username" label="Username">
                    <a-input v-model:value="formData.username" placeholder="Username" />
                </a-form-item>
                <a-form-item name="bio" label="Short bio">
                    <a-textarea v-model:value="formData.bio" placeholder="Short bio about you" :auto-size="{ minRows: 3 }" />
                </a-form-item>
                <a-form-item v-bind="validateInfos.email" label="Email">
                    <a-input v-model:value="formData.email" placeholder="Email" />
                </a-form-item>
                <a-form-item v-bind="validateInfos.password" label="Password">
                    <a-input-password v-model:value="formData.password" placeholder="New Password" />
                </a-form-item>
            </a-form>

            <!-- 按钮区 -->
            <a-button :loading="submiting" type="primary" block @click="onSubmit">
                Update Setting
            </a-button>
            <a-button style="margin-top: 1em" type="link" block @click="onLogout">
                Or click here to logout
            </a-button>
        </a-card>
    </a-col>
</a-row>
</template>

<script lang="ts" setup>
import { setLoginInfoKey, loginInfoKey } from '@/contants'
import { ref, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import { UpdateSelfUserInfo } from '@/types/services'
import { updateSelfUserInfo } from '@/services/user'
import CrizmasErrorAlert from '@/components/CrizmasErrorAlert.vue'
import { useForm } from '@/composable/useForm'

const loginInfo = inject(loginInfoKey, ref(undefined))
const router = useRouter()

const setLoginInfo = inject(setLoginInfoKey, () => {
    throw new Error('Profile 中找不到 setLoginInfo')
})

const { formData, onSubmit, validateInfos, errorMsg, submiting } = useForm<UpdateSelfUserInfo>(
    {
        username: '',
        password: '',
        email: '',
        bio: '',
        image: ''
    },
    {
        username: [{ required: true, trigger: 'change' }],
        password: [{ required: true, trigger: 'change' }],
        email: [{ required: true, trigger: 'change' }]
    },
    async formData => {
        const selfUserInfo = await updateSelfUserInfo(formData)
        // 更新用户信息后把新的内容更新到全局
        setLoginInfo(selfUserInfo)
        router.replace(`/user/${selfUserInfo.username}`)
    }
)

// 组件初始化的时候用户信息不一定载入好了，这里要 watch 一下
watch(loginInfo, newData => {
    if (newData) formData.value = { ...newData, password: '' }
}, { immediate: true })

// 回调 - 点击登出按钮
const onLogout = () => {
    localStorage.removeItem('token')
    setLoginInfo(undefined)
    router.push('/home')
}
</script>
