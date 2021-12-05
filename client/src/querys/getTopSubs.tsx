import { gql } from "@apollo/client";

export const GETTOPSUBS = gql`query TOP{
  topSubs{ 
    name
    title
    imageUrl
    postCount
  }
}
`