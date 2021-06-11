import axios from 'axios';
import router from './router';

/**
 * 设置请求中携带的用户 token
 */
export const setToken = (newToken: string | undefined) => {
    if (!newToken) delete axios.defaults.headers.common.authorization;
    else axios.defaults.headers.common.authorization = `Token ${newToken}`;
}

// 后端地址
axios.defaults.baseURL = 'https://conduit.productionready.io/api/';

axios.interceptors.response.use(
    resp => resp.data,
    error => {
        // 点击需要登录的操作后跳转到登录页
        if (error.response.status === 401) {
            router.push('/login');
            setToken(undefined);
            localStorage.removeItem('token');
        }
        // 未知请求就跳转回首页
        else if (error.response.status === 404) {
            router.push('/home');
        }

        throw error;
    }
);

export default axios;