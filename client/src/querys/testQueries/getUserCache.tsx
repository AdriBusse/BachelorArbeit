import { gql } from "@apollo/client";

export const GETUSERCACHE = gql`
query GetUser($username: String!){
    getUser(username: $username){
        username
        id
        firstName
    }
  }
`



