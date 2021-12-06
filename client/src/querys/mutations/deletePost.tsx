import { gql } from "@apollo/client";

export const DELETEPOST = gql`
mutation DeletePost($identifier: String!){
    deletePost(identifier: $identifier){
      identifier
      id
    }
  }
`


