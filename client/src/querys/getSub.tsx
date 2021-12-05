import { gql } from "@apollo/client";

export const GETSUB = gql`
query getSub($name: String!){
  getSub(name: $name){
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
        imageUrl
      }
    }
}
}
`