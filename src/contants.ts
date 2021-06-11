import { InjectionKey, Ref } from 'vue';
import { SelfUserInfo } from './api';

/** 设置新的用户信息 可以设置为空 */
export type SetUserInfo = (newInfo: SelfUserInfo | undefined) => void

/** 全局的用户信息 InjectionKey */
export const userInfoKey: InjectionKey<Ref<SelfUserInfo | undefined>> = Symbol();

/** 全局的设置用户信息方法 InjectionKey */
export const setUserInfoKey: InjectionKey<SetUserInfo> = Symbol();