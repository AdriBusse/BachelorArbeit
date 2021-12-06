import gql from "graphql-tag";

export const GETSUBFORCREATEPOST = gql`query getSubForCreate($name: String!){
    getSub(name: $name){
      id
      name
      describtion
      createdAt
      userFollows
  }
  }
  `