/** 文章索引 */
export type Slug = string

/** 文章内容 */
export interface ArticleContent {
    /** 标题 */
    title: string
    /** 简介 */
    description: string
    /** 正文 */
    body: string
    /** 标签列表 */
    tagList: string[]
}

/** 已创建文章详情 */
export type Article = {
    /** 索引 */
    slug: Slug
    /** 创建时间字符串 */
    createdAt: string
    /** 更新时间字符串 */
    updatedAt: string
    /** 自己是否喜欢 */
    favorited: boolean
    /** 有多少人喜欢 */
    favoritesCount: number
    /** 文章作者 */
    author: UserInfo
} & ArticleContent

/** 文章列表查询条件 */
export type ArticleParams = {
    /** 每页的文章 */
    limit: number
    /** 从第多少个文章开始获取 */
    offset: number
} & ArticleQuery

export interface ArticleQuery {
    /** 贴有该标签的文章 */
    tag?: string
    /** 用户名，文章列表的作者 */
    author?: string
    /** 用户名，获取他最喜欢的文章 */
    favorited?: string
}

/** 文章列表返回值 */
export interface ArticleList {
    articles: Article[]
    articlesCount: number
}

export type FetchArticleListFunc = (params: ArticleParams) => Promise<ArticleList>

/** 自己的用户信息 */
export interface SelfUserInfo {
    /** 邮箱 */
    email: string
    /** 登录验证令牌 */
    token: string
    /** 用户名 */
    username: string
    /** 简介 */
    bio: string
    /** 头像链接 */
    image: string
}

/** 登录信息 */
export interface LoginInfo {
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
}

/** 注册信息 */
export type RegisterInfo = LoginInfo & {
    /** 用户名 */
    username: string
}

/** 更新用户信息时需要上传的数据 */
export type UpdateSelfUserInfo = {
    /** 用户名 */
    username: string
    /** 简介 */
    bio?: string
    /** 头像链接 */
    image?: string
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
}

/** 用户信息 */
export interface UserInfo {
    /** 用户名 */
    username: string
    /** 用户简介 */
    bio: string
    /** 用户头像链接 */
    image: string
    /** 自己是否关注 */
    following: boolean
}

/** 评论索引 */
export type CommentId = number

/** 评论详情 */
export interface Comment {
    /** 索引 */
    id: CommentId
    /** 创建时间字符串 */
    createdAt: string
    /** 评论时间字符串 */
    updatedAt: string
    /** 评论正文 */
    body: string
    /** 评论人 */
    author: UserInfo
}