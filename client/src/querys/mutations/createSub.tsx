import { gql } from "@apollo/client";

export const CREATESUB = gql`
mutation CreateSub($describtion: String!, $title: String!, $name: String!){
    createSub(describtion: $describtion, title: $title, name: $name){
      id
      name
      title
      describtion
      imageUrn
      bannerUrn
      username
  
    }
  }
`