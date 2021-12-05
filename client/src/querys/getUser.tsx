import { gql } from "@apollo/client";

export const GETUSER = gql`
query GetUser($username: String!){
  getUser(username: $username){
    id
    username
    firstName
    lastName
    email
    name
    createdAt
    userSubmissions{
      __typename
          ... on Post {
      title
            identifier
            userVote
            title
            body
            commentCount
            voteScore
            url
            subName
            createdAt
            sub{
              imageUrl
            }
            
    }
      ...on Comment{
        body
        identifier
        username
        post{
          url
        title
        subName
      }
        votes{
          value
        }
      }
    }
    createdAt
    updatedAt
  }
}
`