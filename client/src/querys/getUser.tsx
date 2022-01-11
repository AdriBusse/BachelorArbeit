import { gql } from "@apollo/client";

export const GETUSER = gql`
query GetUser($username: String!){
  getUser(username: $username){
    #Kommentardasda
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
            id
            title
            identifier
            userVote
            title
            body
            commentCount
            username
            voteScore
            url
            subName
            createdAt
            sub{
              imageUrl
            }
            
    }
      ...on Comment{
        id
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