import { gql } from "@apollo/client";

export const TESTQUERY = gql`query TestQuery {
    getSub(name: "typescript") {
      id
      title
      name
      createdAt
      imageUrl
      describtion
      postCount
      followerCount
      posts {
        title
        body
      }
    }
  }
`