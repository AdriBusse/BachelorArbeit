import { gql } from "@apollo/client";

export const LISTQUERY = gql`query ListQuery {
    getSub(name: "typescript") {
      id
      title
      name
      createdAt
      imageUrl
      describtion
      postCount
      posts {
        title
        body
      }
    }
  }
`