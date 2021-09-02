import { ref } from 'vue'

export default function useLoading<T extends any[], R> (fn: (...args: T) => Promise<R>) {
    const loading = ref(true);

    const run = async (...args: T) => {
        loading.value = true;
        const result = await fn(...args);
        loading.value = false;
        return result;
    }

    return { loading, run }
}
