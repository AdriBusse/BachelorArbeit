import { gql } from "@apollo/client";

export const SEARCHSUBS = gql`
query searchSub($name:String!){
    searchSub(name: $name){
      id
      name
      imageUrl
      title
    }
  }
`