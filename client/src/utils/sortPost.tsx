import { Post } from "../types";

export const sortPosts = (posts: Post[]) => {

    return [...posts].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
}