import { gql } from "@apollo/client";

export const UPLOADSUBIMAGE = gql`
mutation AddPicture($picture: Upload!, $location: String!, $name: String! ) {
    subUpload(location: $location, picture: $picture, name:$name)
  }
`