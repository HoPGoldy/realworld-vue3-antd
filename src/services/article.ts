import axios from '@/plugins/axios'
import { ArticleParams, ArticleList, ArticleContent, Article, Slug } from '@/types/services'

/** 获取关注列表文章 */
export const fetchFeedArticleList = async function (params: ArticleParams): Promise<ArticleList> {
    return await axios.get('/articles/feed/', { params })
}

/** 获取全局文章列表 */
export const fetchGlobalArticleList = async function (params: ArticleParams): Promise<ArticleList> {
    return await axios.get('/articles', { params })
}

/** 获取热门标签列表 */
export const fetchTagList = async function (): Promise<string[]> {
    const data: { tags: string[] } = await axios.get('/tags')
    return data.tags
}

/** 创建新的文章 */
export const createArticle = async function (article: ArticleContent): Promise<Article> {
    const data: { article: Article } = await axios.post('/articles', { article })
    return data.article
}

/** 获取指定文章 */
export const fetchArticle = async function (slug: Slug): Promise<Article> {
    const data: { article: Article } = await axios.get(`/articles/${slug}`)
    return data.article
}

/** 更新指定文章 */
export const updateArticle = async function (slug: Slug, article: ArticleContent): Promise<Article> {
    const data: { article: Article } = await axios.put(`/articles/${slug}`, { article })
    return data.article
}

/** 删除指定文章 */
export const deleteArticle = async function (slug: Slug): Promise<void> {
    return await axios.delete(`/articles/${slug}`)
}

/** 喜欢文章 */
export const favoriteArticle = async function (slug: Slug): Promise<Article> {
    const data: { article: Article } = await axios.post(`/articles/${slug}/favorite`)
    return data.article
}

/** 取消喜欢文章 */
export const unfavoriteArticle = async function (slug: Slug): Promise<Article> {
    const data: { article: Article } = await axios.delete(`/articles/${slug}/favorite`)
    return data.article
}
