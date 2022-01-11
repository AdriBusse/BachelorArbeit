import type { AppWrapper, PageWrapper } from 'next-page-tester';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import { GETSUB } from '../../../querys/getSub';

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
export const cache = new InMemoryCache();

export const Page: PageWrapper = (Page) => (pageProps) => (
    <MockedProvider cache={cache}><Page {...pageProps} /></MockedProvider>
);