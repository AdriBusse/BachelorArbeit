import { gql } from "@apollo/client";

export const TranslateME = gql`
query { getUser(username: "MaxMuster"){ id username } }
`