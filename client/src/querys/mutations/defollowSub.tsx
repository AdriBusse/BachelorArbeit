import { gql } from "@apollo/client";

export const DEFOLLOWSUB = gql`
mutation Unfollow($name: String!){
    defollowSub(name:$name){
     name
   }
 }
`