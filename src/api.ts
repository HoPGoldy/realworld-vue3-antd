import axios from './plugins/axios';

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
interface LoginInfo {
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
}

/** 注册信息 */
export type RegisterInfo = {
    /** 用户名 */
    username: string
} & LoginInfo

export class UserAPI {
    /** 登录 */
    static async login(user: LoginInfo) {
        const data: { user: SelfUserInfo } = await axios.post('/users/login', { user });
        return data.user;
    }

    /** 注册 */
    static async register(user: RegisterInfo) {
        const data: { user: SelfUserInfo } = await axios.post('/users', { user });
        return data.user;
    }

    /** 获取自己的用户信息 */
    static async getSelfUserInfo() {
        const data: { user: SelfUserInfo } = await axios.get('/user');
        return data.user;
    }

    /** 更新用户信息 */
    static async updateUser(user: SelfUserInfo) {
        const data: { user: SelfUserInfo } = await axios.put('/user', { user });
        return data.user;
    }
}

/** 用户信息 */
interface UserInfo {
    /** 用户名 */
    username: string
    /** 用户简介 */
    bio: string
    /** 用户头像链接 */
    image: string
    /** 自己是否关注 */
    following: boolean
}

export class ProfileAPI {
    /** 获取其他用户信息 */
    static async getUser(username: string) {
        const data: { profile: UserInfo } = await axios.get(`/profiles/${username}`);
        return data.profile;
    }

    /** 关注用户 */
    static async followUser(username: string) {
        const data: { profile: UserInfo } = await axios.post(`/profiles/${username}/follow`);
        return data.profile;
    }

    /** 取消关注用户 */
    static async unfollowUser(username: string) {
        const data: { profile: UserInfo } = await axios.delete(`/profiles/${username}/follow`);
        return data.profile;
    }
}

/** 文章索引 */
type Slug = string

/** 文章内容 */
interface ArticleContent {
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
type Article = {
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
interface ArticleParams {
    /** 贴有该标签的文章 */
    tag: string
    /** 每页的文章 */
    limit: number
    /** 从第多少个文章开始获取 */
    offset: number
    /** 用户名，文章列表的作者 */
    author: string
    /** 用户名，获取他最喜欢的文章 */
    favorited: string
}

/** 文章列表返回值 */
interface ArticleList {
    articles: Article[]
    articlesCount: number
}

export class ArticlesAPI {
    /** 获取关注列表文章 */
    static async getFeedList(params: ArticleParams): Promise<ArticleList> {
        return axios.get('/articles/feed/', { params });
    }

    /** 获取全局文章列表 */
    static async getGlobalList(params: ArticleParams): Promise<ArticleList> {
        return axios.get('/articles', { params });
    }

    /** 获取热门标签列表 */
    static async getTagList() {
        const data: { tags: string[] } = await axios.get('/tags');
        return data.tags;
    }

    /** 创建新的文章 */
    static async create(article: ArticleContent) {
        const data: { article: Article } = await axios.post('/articles', { article });
        return data.article;
    }

    /** 获取指定文章 */
    static async get(slug: Slug) {
        const data: { article: Article } = await axios.get(`/articles/${slug}`);
        return data.article;
    }

    /** 更新指定文章 */
    static async update(slug: Slug, article: ArticleContent) {
        const data: { article: Article } = await axios.put(`/articles/${slug}`, { article });
        return data.article;
    }

    /** 删除指定文章 */
    static async delete(slug: Slug): Promise<void> {
        return axios.delete(`/articles/${slug}`);
    }

    /** 喜欢文章 */
    static async favorite(slug: Slug) {
        const data: { article: Article } = await axios.post(`/articles/${slug}/favorite`);
        return data.article;
    }

    /** 取消喜欢文章 */
    static async unfavorite(slug: Slug) {
        const data: { article: Article } = await axios.delete(`/articles/${slug}/favorite`);
        return data.article;
    }
}

/** 评论索引 */
type CommentId = number

/** 评论详情 */
interface Comment {
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

export class CommentAPI {
    /** 获取指定文章的评论列表 */
    static async getList(slug: Slug) {
        const data: { comments: Comment[] } = await axios.get(`/articles/${slug}/comments`);
        return data.comments;
    }

    /** 给指定文章添加评论 */
    static async add(slug: Slug, body: string) {
        const data: { comment: Comment } = await axios.post(`/articles/${slug}/comments`, { comment: { body }});
        return data.comment;
    }

    /** 删除指定文章的指定评论 */
    static async delete(slug: Slug, id: CommentId): Promise<void> {
        return axios.delete(`/articles/${slug}/comments/${id}`);
    }
}

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