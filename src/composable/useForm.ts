import { ref, reactive, UnwrapRef } from 'vue';
import { FormRules } from '@/types/common';
import { CrizmasError } from '@/types/services';
import { Form } from 'ant-design-vue';
import useLoading from '@/utils/useLoding';

/**
 * 组合表单响应式
 * 
 * @param defaultModal 默认的表单内容
 * @param defaultRules 默认的表单规则
 * @param submit 表单提交异步函数，接受通过规则的表单内容
 * @returns {
 *  formData: 表单内容的 ref
 *  onSubmit: 表单提交函数
 *  submiting: 是否正在提交
 *  validateInfos: 校验提示
 *  errorMsg: 后端校验报错提示
 * }
 */
export const useForm = function <T>(
    defaultModal: T,
    defaultRules: FormRules,
    submit: (formData: UnwrapRef<T>) => void
) {
    const formRules = reactive(defaultRules);
    const formData = ref(defaultModal);
    const errorMsg = ref<CrizmasError>();

    const { validate, validateInfos, clearValidate, resetFields } = Form.useForm(formData, formRules);

    // 回调 - 点击发布按钮
    const { loading: submiting, run: onSubmit } = useLoading(async () => {
        try {
            errorMsg.value = undefined;
            await validate();
            await submit(formData.value);
        }
        catch (e) {
            console.error(e);
            // 失败了就尝试显示错误信息
            errorMsg.value = e.response.data.errors;
        }
    });

    return { formData, onSubmit, submiting, validateInfos, errorMsg, clearValidate, resetFields };
}