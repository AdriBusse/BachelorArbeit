import { gql } from "@apollo/client";

export const GETSUB = gql`
query getSub($name: String!){
  getSub(name: $name){
    id
    username
    title
    name
    bannerUrl
    imageUrl
    postCount
    userFollows
    followerCount
    describtion
    createdAt
    posts{
      id
      identifier
      userVote
      slug
      username
      url
      createdAt
      body
      voteScore
      title
      commentCount
      subName
      voteScore
      sub{
        id
        imageUrl
      }
    }
}
}
`