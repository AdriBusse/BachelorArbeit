import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation login($username: String!, $password: String!){
  login(
    username: $username,
    password: $password
  ) {
    id
    name
    email
    username
    followedSubs{
        name
        imageUrl
        postCount
      }
  }
}`