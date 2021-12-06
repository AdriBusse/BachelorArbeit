// ./apollo-client.js

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client'


const link = createHttpLink({
    uri: `http://localhost:4000/graphql`,
    credentials: 'include',
});
const client = new ApolloClient({


    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getPosts: {
                        // Don't cache separate results based on
                        // any of this field's arguments.
                        keyArgs: false,
                        // Concatenate the incoming list items with
                        // the existing list items.
                        merge(existing = [], incoming) {
                            return [...existing, ...incoming];
                        },
                    }
                }
            }
        }
    }),
    link: createUploadLink({
        uri: "http://localhost:4000/graphql",
        credentials: 'include',
        useGETForQueries: true


    }),

});

export default client;