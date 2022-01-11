/**
 * @jest-environment jsdom
 */
import { InMemoryCache } from "@apollo/client";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MockedProvider } from '@apollo/client/testing';
import PostDetail from "../../../../pageComponents/r/[sub]/[identifier]/[slug]/PostDetail";
import { waitForResponse } from "../../../../utils/testUtils/waiting";
import { GETPOST } from "../../../../querys/getPost";
import { GETSUB } from "../../../../querys/getSub";
import SubPage from "../../../../pageComponents/r/[sub]/SubPage";
import { createMockRouter } from "../../../../utils/testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context"
import SubmitPost from "../../../../pageComponents/r/[sub]/[identifier]/SubmitPost";
import { CREATEPOST } from "../../../../querys/mutations/createPost";
import { GETSUBFORCREATEPOST } from "../../../../querys/getSubForCreatePost";

const mock = [{
    request: {
        query: CREATEPOST,
        variables: {
            body: "body",
            title: "TestPost",
            sub: "Streetfood"
        },
    },
    result: {
        "data": {
            "createPost": {
                "id": "105",
                "__typename": "Post",
                "identifier": "SbKJ3Sa",
                "title": "TestPost",
                "slug": "testpost",
                "body": "body",
                "subName": "Streetfood",
                "username": "AD__",
                "commentCount": 0,
                "voteScore": 0,
                "sub": {
                    "id": "18",
                    "__typename": "Sub"
                },
                "url": "/r/Streetfood/SbKJ3Sa/testpost",
                "createdAt": "2021-12-14T17:10:29.984Z",
                "userVote": 0
            }
        }
    }
},
{
    request: {
        query: GETSUBFORCREATEPOST,
        variables: {
            name: "Streetfood"
        }
    },
    result: {
        "data": {
            "getSub": {
                "id": "18",
                "name": "Streetfood",
                "describtion": "Show us your Streetfood",
                "createdAt": "2021-10-09T11:36:00.290Z",
                "userFollows": 1,
                "bannerUrl": null,
                "title": "Streetfood",
                "__typename": "Sub"
            }
        }
    }
}];

const cacheBeforeSubmit = {
    "ROOT_QUERY": {
        "__typename": "Query",
        "getSub({\"name\":\"Streetfood\"})": {
            "__ref": "Sub:18"
        }
    },
    "Sub:18": {
        "id": "18",
        "__typename": "Sub",
        "name": "Streetfood",
        "describtion": "Show us your Streetfood",
        "createdAt": "2021-10-09T11:36:00.290Z",
        "userFollows": 1,
        "bannerUrl": null,
        "title": "Streetfood"
    }
}

const cacheAfterSubmit = {
    "ROOT_QUERY": {
        "__typename": "Query",
    },
    "Sub:18": {
        "id": "18",
        "__typename": "Sub",
        "name": "Streetfood",
        "describtion": "Show us your Streetfood",
        "createdAt": "2021-10-09T11:36:00.290Z",
        "userFollows": 1,
        "bannerUrl": null,
        "title": "Streetfood"
    },
    "Post:105": {
        "id": "105",
        "__typename": "Post",
        "identifier": "SbKJ3Sa",
        "title": "TestPost",
        "slug": "testpost",
        "body": "body",
        "subName": "Streetfood",
        "username": "AD__",
        "commentCount": 0,
        "voteScore": 0,
        "sub": {
            "__ref": "Sub:18"
        },
        "url": "/r/Streetfood/SbKJ3Sa/testpost",
        "createdAt": "2021-12-14T17:10:29.984Z",
        "userVote": 0
    },
    "ROOT_MUTATION": {
        "__typename": "Mutation"
    }
}



describe('CreatePost', () => {
    it('create post from input', async () => {

        const cache = new InMemoryCache();

        expect(cache.extract()).toEqual({}); // empty cache


        //first render. Response wrote to the cache
        render(<RouterContext.Provider value={createMockRouter({ pathname: '/r/Streetfood/submit' })}><MockedProvider mocks={mock} cache={cache}>
            <SubmitPost subName="Streetfood" />
        </MockedProvider></RouterContext.Provider>)
        await waitForResponse()

        expect(cache.extract()).toEqual(cacheBeforeSubmit);


        const titleInput = screen.getByPlaceholderText('Title')
        const textInput = screen.getByPlaceholderText('Text (optional)')

        expect(titleInput).toBeInTheDocument()
        expect(textInput).toBeInTheDocument()

        //TODO Titel und Text dynamisch machen
        fireEvent.change(titleInput, { target: { value: 'TestPost' } })
        fireEvent.change(textInput, { target: { value: 'body' } })

        const submitButton = screen.getByText('Submit')

        expect(submitButton).toBeInTheDocument()

        fireEvent.click(submitButton)
        await waitForResponse()

        expect(cache.extract()).toEqual(cacheAfterSubmit);



    });

})