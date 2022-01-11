/**
 * @jest-environment jsdom
 */
import { InMemoryCache } from "@apollo/client";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MockedProvider } from '@apollo/client/testing';
import { waitForResponse } from "../../../../utils/testUtils/waiting";
import { createMockRouter } from "../../../../utils/testUtils/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context"
import { DELETEPOST } from "../../../../querys/mutations/deletePost";
import DeletePostButton from "../../../DeletePostButton";

const mock = [{
    request: {
        query: DELETEPOST,
        variables: {
            identifier: "Weh8Bet",
        }
    },
    result: {
        "data": {
            "deletePost": true
        }
    }
}
];

const cacheBeforeDelete = {
    "User:9": {
        "id": "9",
        "__typename": "User",
        "name": "null null",
        "email": "adri@busse.vn",
        "username": "AD__",
        "followedSubs": [
            {
                "__typename": "Sub",
                "name": "Streetfood",
                "imageUrl": "http://localhost:4000/images/subs/image/1639504418465communityIcon_lsu2rn3kcks61.png",
                "postCount": 3
            },
            {
                "__typename": "Sub",
                "name": "ReactJS",
                "imageUrl": "http://localhost:4000/images/subs/image/1638960018518communityIcon_fbblpo38vy941.png",
                "postCount": 1
            },
            {
                "__typename": "Sub",
                "name": "Data is nice",
                "imageUrl": "http://localhost:4000/images/subs/image/1633607862439splash.png",
                "postCount": 5
            },
            {
                "__typename": "Sub",
                "name": "typescript",
                "imageUrl": "http://localhost:4000/images/subs/image/1633607960179communityIcon_4w7vh6c21f871.png",
                "postCount": 6
            }
        ]
    },
    "ROOT_QUERY": {
        "__typename": "Query",
        "me": {
            "__ref": "User:9"
        },
        "getSub({\"name\":\"Streetfood\"})": {
            "__ref": "Sub:18"
        }
    },
    "Sub:18": {
        "id": "18",
        "__typename": "Sub",
        "imageUrl": "http://localhost:4000/images/subs/image/1639504418465communityIcon_lsu2rn3kcks61.png",
        "username": "AD__",
        "title": "Streetfood",
        "name": "Streetfood",
        "bannerUrl": null,
        "postCount": 3,
        "userFollows": 1,
        "followerCount": 1,
        "describtion": "Show us your Streetfood",
        "createdAt": "2021-10-09T11:36:00.290Z",
        "posts": [
            {
                "__ref": "Post:37"
            },
            {
                "__ref": "Post:38"
            },
            {
                "__ref": "Post:115"
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
    },
    "Post:115": {
        "id": "115",
        "__typename": "Post",
        "identifier": "Weh8Bet",
        "userVote": 0,
        "slug": "delete_me_post",
        "username": "AD__",
        "url": "/r/Streetfood/Weh8Bet/delete_me_post",
        "createdAt": "2021-12-15T09:10:54.661Z",
        "body": "some random text.",
        "voteScore": 0,
        "title": "Delete Me Post",
        "commentCount": 0,
        "subName": "Streetfood",
        "sub": {
            "__ref": "Sub:18"
        }
    }
}

const cacheAfterDelete = {
    "User:9": {
        "id": "9",
        "__typename": "User",
        "name": "null null",
        "email": "adri@busse.vn",
        "username": "AD__",
        "followedSubs": [
            {
                "__typename": "Sub",
                "name": "Streetfood",
                "imageUrl": "http://localhost:4000/images/subs/image/1639504418465communityIcon_lsu2rn3kcks61.png",
                "postCount": 3
            },
            {
                "__typename": "Sub",
                "name": "ReactJS",
                "imageUrl": "http://localhost:4000/images/subs/image/1638960018518communityIcon_fbblpo38vy941.png",
                "postCount": 1
            },
            {
                "__typename": "Sub",
                "name": "Data is nice",
                "imageUrl": "http://localhost:4000/images/subs/image/1633607862439splash.png",
                "postCount": 5
            },
            {
                "__typename": "Sub",
                "name": "typescript",
                "imageUrl": "http://localhost:4000/images/subs/image/1633607960179communityIcon_4w7vh6c21f871.png",
                "postCount": 6
            }
        ]
    },
    "ROOT_QUERY": {
        "__typename": "Query",
        "me": {
            "__ref": "User:9"
        },
        "getSub({\"name\":\"Streetfood\"})": {
            "__ref": "Sub:18"
        }
    },
    "Sub:18": {
        "id": "18",
        "__typename": "Sub",
        "imageUrl": "http://localhost:4000/images/subs/image/1639504418465communityIcon_lsu2rn3kcks61.png",
        "username": "AD__",
        "title": "Streetfood",
        "name": "Streetfood",
        "bannerUrl": null,
        "postCount": 3,
        "userFollows": 1,
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
    },
    "ROOT_MUTATION": {
        "__typename": "Mutation"
    }
}


describe('Delete Post', () => {
    it('gelöschter Post wird vom Cache entfernt (Post mit Mock)', async () => {
        window.confirm = jest.fn().mockImplementation(() => true)

        const cache = new InMemoryCache();

        cache.restore(cacheBeforeDelete) // Cache Seeden mit Daten vom eingeloggten User

        expect(cache.extract()).toEqual(cacheBeforeDelete) // Cache Inhalt überprüfen

        render(<RouterContext.Provider value={createMockRouter({ pathname: '/r/Streetfood/Weh8Bet/delete_me_post' })}><MockedProvider mocks={mock} cache={cache}>
            <DeletePostButton postId={"115"} postIdentifier={"Weh8Bet"} subId={"18"} />
        </MockedProvider></RouterContext.Provider>)
        await waitForResponse()


        const deleteButton = screen.getByTestId('deleteIcon')


        expect(deleteButton).toBeInTheDocument()
        fireEvent.click(deleteButton)
        await waitForResponse()

        expect(cache.extract()).toEqual(cacheAfterDelete); // gelöschter Post wird vom Cache entfernt (sowohl im Query als auch als Normalisierter Post)
        expect(window.confirm).toHaveBeenCalled()


    });

})