import { gql } from "@apollo/client";

export const GETPOSTS = gql`
query GetPosts($postPerPage: Float, $currentPage: Float){
  getPosts(postsPerPage: $postPerPage, currentPage: $currentPage){
    id
    identifier
 title
    subName
    username
    voteScore
    url
    username
    commentCount
    voteScore
    userVote
    slug
    createdAt
    body
    url
    sub{
      imageUrl
    }
  }
}
`