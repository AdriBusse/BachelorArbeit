import { gql } from "@apollo/client";

export const VOTE = gql`mutation Vote($value: Float!, $commentIdentifier: String, $slug: String!, $identifier: String!){
  vote(value: $value, commentIdentifier: $commentIdentifier, slug: $slug, identifier: $identifier){
    id

  }
}`