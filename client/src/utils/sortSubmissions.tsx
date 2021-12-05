import { Post, Comment } from "../types";

export const sortSubmissions = (posts: Post[] = [], comments: Comment[] = []) => {
    let submissions: any[] = [];
    posts.forEach((p) => submissions.push({ type: 'Post', ...p }));
    comments.forEach((c) =>
        submissions.push({ type: 'Comment', ...c })
    );

    submissions.sort((a, b) => {
        if (b.createdAt > a.createdAt) return 1;
        if (b.createdAt < a.createdAt) return -1;
        return 0;
    });

    return submissions
}