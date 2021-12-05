import { gql } from "@apollo/client";

export const GETALLSUBS = gql`query{
  getSubs{
    id
    name
    title
    describtion
    imageUrn
    bannerUrn
    username
    user{
      id
    }
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


