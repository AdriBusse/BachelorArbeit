import { gql } from "@apollo/client";

export const UPDATESUB = gql`mutation UpdateSub($name: String!, $title: String!, $describtion: String!){
    updateSub(name: $name, title: $title, describtion: $describtion){
      id
      describtion
      title
    }
  }`