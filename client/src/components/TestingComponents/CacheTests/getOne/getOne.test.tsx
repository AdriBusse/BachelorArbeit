/**
 * @jest-environment jsdom
 */
import { InMemoryCache } from "@apollo/client";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { MockedProvider } from '@apollo/client/testing';
import PostDetail from "../../../../pageComponents/r/[sub]/[identifier]/[slug]/PostDetail";
import { waitForResponse } from "../../../../utils/testUtils/waiting";
import { GETPOST } from "../../../../querys/getPost";

const mock = {
    request: {
        query: GETPOST,
        variables: { identifier: "URDck2G", slug: "hottes_tacos_in_mexico" },
    },
    result: {
        "data": {
            "getPost": {
                "id": "38",
                "userVote": 0,
                "identifier": "URDck2G",
                "title": "Hottes Tacos in Mexico",
                "voteScore": 0,
                "username": "JohnDoe",
                "url": "/r/Streetfood/URDck2G/hottes_tacos_in_mexico",
                "createdAt": "2021-12-05T17:48:01.381Z",
                "body": "",
                "commentCount": 0,
                "slug": "hottes_tacos_in_mexico",
                "sub": {
                    "id": "18",
                    "imageUrl": "http://localhost:4000/images/subs/image/16389599400374pmBlog.svg",
                    "__typename": "Sub",
                    "describtion": "Show us your Streetfood",
                    "createdAt": "2021-10-09T11:36:00.290Z",
                    "name": "Streetfood"
                },
                "comments": [],
                "__typename": "Post"
            }
        }
    },
};

const cachedDataResult = {
    "ROOT_QUERY": {
        "__typename": "Query",
        "getPost({\"identifier\":\"URDck2G\",\"slug\":\"hottes_tacos_in_mexico\"})": {
            "__ref": "Post:38"
        }
    },
    "Sub:18": {
        "id": "18",
        "__typename": "Sub",
        "imageUrl": "http://localhost:4000/images/subs/image/16389599400374pmBlog.svg",
        "describtion": "Show us your Streetfood",
        "createdAt": "2021-10-09T11:36:00.290Z",
        "name": "Streetfood"
    },
    "Post:38": {
        "id": "38",
        "__typename": "Post",
        "userVote": 0,
        "identifier": "URDck2G",
        "title": "Hottes Tacos in Mexico",
        "voteScore": 0,
        "username": "JohnDoe",
        "url": "/r/Streetfood/URDck2G/hottes_tacos_in_mexico",
        "createdAt": "2021-12-05T17:48:01.381Z",
        "body": "",
        "commentCount": 0,
        "slug": "hottes_tacos_in_mexico",
        "sub": {
            "__ref": "Sub:18"
        },
        "comments": []
    }
}


describe('FetchOne', () => {
    it('Wenn der Query im Cache ist, wird kein Request ausgefuert', async () => {
        const cache = new InMemoryCache();

        expect(cache.extract()).toEqual({}); // empty cache
        //Seeden
        cache.restore(cachedDataResult);

        //Daten sind im Cache
        render(<MockedProvider cache={cache}>
            <PostDetail sub="Streetfood" identifier="URDck2G" slug="hottes_tacos_in_mexico" />
        </MockedProvider>)
        await waitForResponse()

        //rendert Komponente
        const heading = screen.getByText("Hottes Tacos in Mexico");
        expect(heading).toBeInTheDocument();
        expect(cache.extract()).toEqual(cachedDataResult);



    });
    it('2x Query abfragen. Der 2. Query kommt aus dem Cache', async () => {
        const cache = new InMemoryCache();

        expect(cache.extract()).toEqual({}); // empty cache


        //first render. Response wrote to the cache
        render(<MockedProvider mocks={[mock]} cache={cache}>
            <PostDetail sub="Streetfood" identifier="URDck2G" slug="hottes_tacos_in_mexico" />
        </MockedProvider>)
        await waitForResponse()

        //rendert Komponente
        const heading = screen.getByText("Hottes Tacos in Mexico");
        expect(heading).toBeInTheDocument();
        expect(cache.extract()).toEqual(cachedDataResult);

        cleanup();

        //this response comes from the cache because we didnt provide the a mock
        render(<MockedProvider cache={cache}>
            <PostDetail sub="Streetfood" identifier="URDck2G" slug="hottes_tacos_in_mexico" />
        </MockedProvider>)
        await waitForResponse()

        const heading1 = screen.getByText("Hottes Tacos in Mexico");
        expect(heading1).toBeInTheDocument();

    });


})