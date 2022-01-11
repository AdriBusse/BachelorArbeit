/**
 * @jest-environment jsdom
 */
import { GETPOST } from "../../../../../querys/getPost";
import { MockedProvider } from '@apollo/client/testing';
import PostDetail from "../../../../../pageComponents/r/[sub]/[identifier]/[slug]/PostDetail";
import { render, screen, cleanup, } from '@testing-library/react';
import { waitForResponse } from "../../../../../utils/testUtils/waiting";
import { InMemoryCache } from "@apollo/client";
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
                    "imageUrl": "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
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

afterEach(() => {
    cleanup();
});
describe('PostDetail', () => {
    it('should render Detailpage', async () => {


        render(
            <MockedProvider mocks={[mock]} >
                <PostDetail slug="hottes_tacos_in_mexico" identifier="URDck2G" sub="Streetfood" />
            </MockedProvider>,
        );

        await waitForResponse()

        const heading = screen.getByText('Hottes Tacos in Mexico');

        expect(heading).toBeDefined();
    });

})