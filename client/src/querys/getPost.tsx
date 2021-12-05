import { gql } from "@apollo/client";


export const GETPOST = gql`
query getPost($slug: String!, $identifier: String!){
  getPost(slug: $slug, identifier: $identifier){
    id
    userVote
    identifier
    title
    voteScore
    username
    url
    createdAt
    body
    commentCount
    slug
    sub{
      imageUrl
    }
    comments{
      identifier
      userVote
      voteScore
      username
      createdAt
      body
    }
    sub{
      describtion
      createdAt
      name
    }
    
  }}
`