/**
 * 格式化后端校验报错
 * 
 * @param errorMsg 后端表单校验报错信息
 * @returns 报错信息数组
 */
export const formatError = function (errorMsg: { [errorKey: string]: string[] }): string[] | undefined {
    if (!errorMsg || Object.keys(errorMsg).length <= 0) return undefined;
    // 遍历对象，把每个键值对渲染成一行
    return Object.entries(errorMsg).map(line => line.join(' '));
}