import { gql } from "@apollo/client";


export const COMMENTONPOST = gql`
mutation CommentOnPost($body: String!, $slug:String!, $identifier: String!){
    commentOnPost(body: $body, slug: $slug, identifier: $identifier){
      id
      identifier
      body
      username
      voteScore
    }
  }

`