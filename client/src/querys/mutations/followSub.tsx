import { gql } from "@apollo/client";

export const FOLLOWSUB = gql`
mutation Follow($name: String!){
    followSub(name: $name){
     name
     id
   }
 }
`