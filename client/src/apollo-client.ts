// ./apollo-client.js

import { ApolloClient, createHttpLink, DefaultOptions, InMemoryCache } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client'
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import 'cross-fetch/polyfill';
import { sha256 } from 'crypto-hash';

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    },
}

const linkChain = createPersistedQueryLink({ sha256, useGETForHashedQueries: true }).concat(
    createUploadLink({
        uri: "http://localhost:4000/graphql",
        credentials: 'include',
        useGETForQueries: true


    })
)
const client = new ApolloClient({
    defaultOptions: defaultOptions,
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
    link: linkChain,

});
export const printCache = () => {
    const serializedState = client.cache.extract();
    console.log(serializedState)
}

export default client;