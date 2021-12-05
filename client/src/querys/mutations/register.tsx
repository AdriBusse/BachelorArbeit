import { gql } from "@apollo/client";

export const REGISTER = gql`mutation register($data: RegisterInput!){
  register(data: $data){
    id
    username
    firstName
    lastName
    email
  }
}`