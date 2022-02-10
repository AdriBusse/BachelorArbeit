import { gql } from "@apollo/client";

export const PERFQUERYFLAT = gql`query flatQuery{
  getUser(username: "MaxMuster"){
    id
    username
}
}
`