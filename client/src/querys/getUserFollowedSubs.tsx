
import { gql } from "@apollo/client";

export const MESUBS = gql`query GetUserForSubs($username: String!){
    getUser(username: $username){
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






