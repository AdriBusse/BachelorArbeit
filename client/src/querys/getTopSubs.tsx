import { gql } from "@apollo/client";

export const GETTOPSUBS = gql`query TOP{
  topSubs{ 
    id
    name
    title
    imageUrl
    postCount
  }
}
`