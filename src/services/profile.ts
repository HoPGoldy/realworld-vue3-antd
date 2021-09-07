import axios from '@/plugins/axios'
import { UserInfo } from '@/types/services'

/** 获取其他用户信息 */
export const fetchUserProfile = async function (username: string): Promise<UserInfo> {
    const data: { profile: UserInfo } = await axios.get(`/profiles/${username}`)
    return data.profile
}

/** 关注用户 */
export const followUser = async function (username: string): Promise<UserInfo> {
    const data: { profile: UserInfo } = await axios.post(`/profiles/${username}/follow`)
    return data.profile
}

/** 取消关注用户 */
export const unfollowUser = async function (username: string): Promise<UserInfo> {
    const data: { profile: UserInfo } = await axios.delete(`/profiles/${username}/follow`)
    return data.profile
}
