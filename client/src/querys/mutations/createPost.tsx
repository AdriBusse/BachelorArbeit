import { gql } from "@apollo/client";


export const CREATEPOST = gql`
 mutation CreatePost($sub:String!, $title:String!, $body:String!){
    createPost(sub: $sub, title: $title, body: $body){
      id
      identifier
      title
      slug
      body
      subName
      username
      commentCount
      voteScore
    }
  }
 `