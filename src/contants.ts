import { InjectionKey, Ref } from 'vue'
import { SelfUserInfo } from './types/services'

/** 设置新的用户信息 可以设置为空 */
export type SetLoginInfo = (newInfo: SelfUserInfo | undefined) => void

/** 全局的用户信息 InjectionKey */
export const loginInfoKey: InjectionKey<Ref<SelfUserInfo | undefined>> = Symbol('loginInfo')

/** 全局的设置用户信息方法 InjectionKey */
export const setLoginInfoKey: InjectionKey<SetLoginInfo> = Symbol('setLoginInfo')

/** 用户信息，为空时代表未登录 */
export interface LoginInfo {
    username: string
}
