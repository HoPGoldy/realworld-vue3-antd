import axios from '@/plugins/axios'
import { Comment, CommentId, Slug } from '@/types/services'

/** 获取指定文章的评论列表 */
export const fetchCommentList = async function (slug: Slug): Promise<Comment[]> {
    const data: { comments: Comment[] } = await axios.get(`/articles/${slug}/comments`)
    return data.comments
}

/** 给指定文章添加评论 */
export const addComment = async function (slug: Slug, body: string): Promise<Comment> {
    const data: { comment: Comment } = await axios.post(`/articles/${slug}/comments`, { comment: { body } })
    return data.comment
}

/** 删除指定文章的指定评论 */
export const deleteComment = async function (slug: Slug, id: CommentId): Promise<void> {
    return await axios.delete(`/articles/${slug}/comments/${id}`)
}
