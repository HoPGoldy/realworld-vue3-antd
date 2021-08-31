import { ValidationRule } from "ant-design-vue/lib/form/Form";

/** 表单校验规则 */
export type FormRules = {
    [field: string]: ValidationRule[]
}