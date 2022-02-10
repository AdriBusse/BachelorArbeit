import { gql } from "@apollo/client";

export const PERFQUERYNESTED = gql`query NestedQuery{
    getUser(username: "MaxMuster"){
      id
      username
      followedSubs{
        title
        name
        imageUrl
        postCount
      }
    }
  }`
