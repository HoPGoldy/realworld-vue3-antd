import { ref, reactive, UnwrapRef, Ref } from 'vue'
import { FormRules } from '@/types/common'
import { CrizmasError } from '@/types/services'
import { Form } from 'ant-design-vue'
import useLoading from '@/utils/useLoding'
import { validateInfos } from 'ant-design-vue/lib/form/useForm'
import axios from 'axios'

interface UseFormReturn<T> {
    /**
     * 表单内容的 ref
     */
    formData: Ref<UnwrapRef<T>>
    /**
     * 表单提交异步函数
     */
    onSubmit: (...args: any[]) => Promise<void>
    /**
     * 是否正在提交
     */
    submiting: Ref<boolean>
    /**
     * form 校验提示
     */
    validateInfos: validateInfos
    /**
     * 后端校验报错提示
     */
    errorMsg: Ref<CrizmasError | undefined>
    /**
     * 清除验证提示
     */
    clearValidate: (names?: string | string[] | undefined) => void
    /**
     * 重置表单
     */
    resetFields: (newValues?: { [key: string]: unknown } | undefined) => void
}

/**
 * 组合表单响应式
 *
 * @param defaultModal 默认的表单内容
 * @param defaultRules 默认的表单规则
 * @param submit 表单提交异步函数，接受通过规则的表单内容
 */
export const useForm = function <T>(
    defaultModal: T,
    defaultRules: FormRules,
    submit: (formData: UnwrapRef<T>) => void
): UseFormReturn<T> {
    const formRules = reactive(defaultRules)
    const formData = ref(defaultModal)
    const errorMsg = ref<CrizmasError>()

    const { validate, validateInfos, clearValidate, resetFields } = Form.useForm(formData, formRules)

    // 回调 - 点击发布按钮
    const { loading: submiting, run: onSubmit } = useLoading(async () => {
        try {
            errorMsg.value = undefined
            await validate()
            await submit(formData.value)
        }
        catch (e) {
            console.error(e)
            if (axios.isAxiosError(e)) {
                // 失败了就尝试显示错误信息
                errorMsg.value = e?.response?.data?.errors
            }
        }
    })

    return { formData, onSubmit, submiting, validateInfos, errorMsg, clearValidate, resetFields }
}
