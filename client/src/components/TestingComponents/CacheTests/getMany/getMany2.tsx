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
import { GETSUB } from "../../../../querys/getSub";
import SubPage from "../../../../pageComponents/r/[sub]/SubPage";
import { createMockRouter } from "../../../../utils/testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context"

const mock = {
    request: {
        query: GETSUB,
        variables: { name: "Streetfood" },
    },
    result: {
        "data": {
            "getSub": {
                "id": "18",
                "username": "AD__",
                "title": "Streetfood",
                "name": "Streetfood",
                "bannerUrl": null,
                "imageUrl": "http://localhost:4000/images/subs/image/16389599400374pmBlog.svg",
                "postCount": 2,
                "userFollows": 0,
                "followerCount": 1,
                "describtion": "Show us your Streetfood",
                "createdAt": "2021-10-09T11:36:00.290Z",
                "posts": [
                    {
                        "id": "37",
                        "identifier": "5ihzIe3",
                        "userVote": 0,
                        "slug": "you_need_to_try_saigonese_streetfood",
                        "username": "JohnDoe",
                        "url": "/r/Streetfood/5ihzIe3/you_need_to_try_saigonese_streetfood",
                        "createdAt": "2021-12-05T17:41:21.173Z",
                        "body": "",
                        "voteScore": 0,
                        "title": "You need to try Saigonese Streetfood",
                        "commentCount": 0,
                        "subName": "Streetfood",
                        "sub": {
                            "id": "18",
                            "imageUrl": "http://localhost:4000/images/subs/image/16389599400374pmBlog.svg",
                            "__typename": "Sub"
                        },
                        "__typename": "Post"
                    },
                    {
                        "id": "38",
                        "identifier": "URDck2G",
                        "userVote": 0,
                        "slug": "hottes_tacos_in_mexico",
                        "username": "JohnDoe",
                        "url": "/r/Streetfood/URDck2G/hottes_tacos_in_mexico",
                        "createdAt": "2021-12-05T17:48:01.381Z",
                        "body": "",
                        "voteScore": 0,
                        "title": "Hottes Tacos in Mexico",
                        "commentCount": 0,
                        "subName": "Streetfood",
                        "sub": {
                            "id": "18",
                            "imageUrl": "http://localhost:4000/images/subs/image/16389599400374pmBlog.svg",
                            "__typename": "Sub"
                        },
                        "__typename": "Post"
                    }
                ],
                "__typename": "Sub"
            }
        }
    }
};

const cachedDataResult = {
    "ROOT_QUERY": {
        "__typename": "Query",
        "getSub({\"name\":\"Streetfood\"})": {
            "__ref": "Sub:18"
        }
    },
    "Sub:18": {
        "id": "18",
        "__typename": "Sub",
        "imageUrl": "http://localhost:4000/images/subs/image/16389599400374pmBlog.svg",
        "username": "AD__",
        "title": "Streetfood",
        "name": "Streetfood",
        "bannerUrl": null,
        "postCount": 2,
        "userFollows": 0,
        "followerCount": 1,
        "describtion": "Show us your Streetfood",
        "createdAt": "2021-10-09T11:36:00.290Z",
        "posts": [
            {
                "__ref": "Post:37"
            },
            {
                "__ref": "Post:38"
            }
        ]
    },
    "Post:37": {
        "id": "37",
        "__typename": "Post",
        "identifier": "5ihzIe3",
        "userVote": 0,
        "slug": "you_need_to_try_saigonese_streetfood",
        "username": "JohnDoe",
        "url": "/r/Streetfood/5ihzIe3/you_need_to_try_saigonese_streetfood",
        "createdAt": "2021-12-05T17:41:21.173Z",
        "body": "",
        "voteScore": 0,
        "title": "You need to try Saigonese Streetfood",
        "commentCount": 0,
        "subName": "Streetfood",
        "sub": {
            "__ref": "Sub:18"
        }
    },
    "Post:38": {
        "id": "38",
        "__typename": "Post",
        "identifier": "URDck2G",
        "userVote": 0,
        "slug": "hottes_tacos_in_mexico",
        "username": "JohnDoe",
        "url": "/r/Streetfood/URDck2G/hottes_tacos_in_mexico",
        "createdAt": "2021-12-05T17:48:01.381Z",
        "body": "",
        "voteScore": 0,
        "title": "Hottes Tacos in Mexico",
        "commentCount": 0,
        "subName": "Streetfood",
        "sub": {
            "__ref": "Sub:18"
        }
    }
}



afterEach(() => {
    cleanup();
});

describe('FetchMany1', () => {


    it('Cache Seeden und Subseite aus dem Cache laden', async () => {

        cleanup();
        const cache = new InMemoryCache();

        expect(cache.extract()).toEqual({}); // empty cache

        //Seeden
        cache.restore(cachedDataResult);


        //first render. Response wrote to the cache
        render(<RouterContext.Provider value={createMockRouter({})}><MockedProvider cache={cache}>
            <SubPage subName="Streetfood" />
        </MockedProvider></RouterContext.Provider>)
        await waitForResponse()

        const headingPost = screen.getByRole('link', { name: "Hottes Tacos in Mexico" });
        expect(headingPost).toBeInTheDocument();
        //rendert Komponente Post
        const headingSub = screen.getByRole('heading', { name: "Streetfood" });
        expect(headingSub).toBeInTheDocument();
        expect(cache.extract()).toEqual(cachedDataResult);

        cleanup();




    });

})