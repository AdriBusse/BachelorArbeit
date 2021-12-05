import { createUnionType } from "type-graphql";
import { Post } from "../Post";
import Comment from "../Comment";

export const UserSubmissionType = createUnionType({
    name: "UserSubmission", // the name of the GraphQL union
    types: () => [Post, Comment] as const, // function that returns tuple of object types classes
});