import { gql } from "@apollo/client";

export const GETALLSUBS = gql`query GetSubs{
  getSubs{
    id
    name
    title
    describtion
    imageUrn
    bannerUrn
    username
    posts{
      id
      votes{
        id
      }
    }
    imageUrl
    bannerUrl
  }
}`


