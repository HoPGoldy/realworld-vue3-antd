import { ref, Ref } from 'vue'

interface UseLoadingReture<R> {
    loading: Ref<boolean>
    run: (...args: any[]) => Promise<R>
}

/**
 * 为异步调用组合一个加载状态
 * 当异步调用执行时返回的 loading 为 true，其余时间为 false
 *
 * @param asyncFunc 要绑定加载状态的异步函数
 */
export default function useLoading <R> (
    asyncFunc: (...args: any[]) => Promise<R>
): UseLoadingReture<R> {
    const loading = ref(false)

    const run = async (...args: any[]): Promise<R> => {
        try {
            loading.value = true
            const result = await asyncFunc(...args)
            loading.value = false
            return result
        }
        catch (e) {
            loading.value = false
            throw e
        }
    }

    return { loading, run }
}
