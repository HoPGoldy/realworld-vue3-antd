import axios from '@/plugins/axios'
import { LoginInfo, SelfUserInfo, RegisterInfo, UpdateSelfUserInfo } from '@/types/services'

/** 登录 */
export const login = async function (user: LoginInfo): Promise<SelfUserInfo> {
    const data: { user: SelfUserInfo } = await axios.post('/users/login', { user })
    return data.user
}

/** 注册 */
export const register = async function (user: RegisterInfo): Promise<SelfUserInfo> {
    const data: { user: SelfUserInfo } = await axios.post('/users', { user })
    return data.user
}

/** 获取自己的用户信息 */
export const fetchSelfUserInfo = async function (): Promise<SelfUserInfo> {
    const data: { user: SelfUserInfo } = await axios.get('/user')
    return data.user
}

/** 更新用户信息 */
export const updateSelfUserInfo = async function (user: UpdateSelfUserInfo): Promise<SelfUserInfo> {
    const data: { user: SelfUserInfo } = await axios.put('/user', { user })
    return data.user
}
