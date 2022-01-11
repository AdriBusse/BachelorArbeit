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
import { GETSUBFORCREATEPOST } from "../../../../querys/getSubForCreatePost";
import EditSub from "../../../../pageComponents/r/[sub]/[identifier]/EditSub";
import { UPDATESUB } from "../../../../querys/mutations/updateSub";

const mock = [{
    request: {
        query: GETSUBFORCREATEPOST,
        variables: {
            name: "Streetfood",
        }
    },
    result: {
        "data": {
            "getSub": {
                "id": "18",
                "name": "Streetfood",
                "describtion": "Show us your Streetfood",
                "createdAt": "2021-10-09T11:36:00.290Z",
                "userFollows": 0,
                "bannerUrl": null,
                "title": "Streetfood",
                "__typename": "Sub"
            }
        }
    }
},
{
    request: {
        query: UPDATESUB,
        variables: {
            name: "Streetfood",
            describtion: 'Show us your Streetfood. Share your experience.',
            title: "Streetfood Guide",
        }
    },
    result: {
        "data": {
            "updateSub": {
                "id": "18",
                "describtion": "Show us your Streetfood. Share your experience.",
                "title": "Streetfood Guide",
                "__typename": "Sub"
            }
        }
    }
}
];

const cacheBeforeUpdate = {
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
        "userFollows": 0,
        "bannerUrl": null,
        "title": "Streetfood"
    }
}

const cacheAfterUpdate = {
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
        "describtion": "Show us your Streetfood. Share your experience.",
        "createdAt": "2021-10-09T11:36:00.290Z",
        "userFollows": 0,
        "bannerUrl": null,
        "title": "Streetfood Guide"
    },
    "ROOT_MUTATION": {
        "__typename": "Mutation"
    }
}


describe('Update Sub', () => {
    it('geupdateter Sub ist im cache', async () => {
        // window.confirm = jest.fn().mockImplementation(() => true)

        const cache = new InMemoryCache();

        // cache.restore(cacheBeforeDelete) // Cache Seeden mit Daten vom eingeloggten User

        expect(cache.extract()).toEqual({}) // Cache Inhalt überprüfen

        render(<RouterContext.Provider value={createMockRouter({ pathname: '/r/Streetfood/edit', push: jest.fn(() => Promise.resolve(true)) })}><MockedProvider mocks={mock} cache={cache}>
            <EditSub subName="Streetfood" />
        </MockedProvider></RouterContext.Provider>)
        await waitForResponse()


        const titleInput = screen.getByTestId('titleInput')
        const describtionInput = screen.getByTestId('describtionInput')

        fireEvent.change(titleInput, { target: { value: 'Streetfood Guide' } })
        fireEvent.change(describtionInput, { target: { value: 'Show us your Streetfood. Share your experience.' } })

        const updateButton = screen.getByTestId('updateButton')
        expect(updateButton).toBeInTheDocument()
        fireEvent.click(updateButton)
        await waitForResponse()

        expect(cache.extract()).toEqual(cacheAfterUpdate) // Cache Inhalt wurde geupdated


        expect(titleInput).toBeInTheDocument()
        expect(describtionInput).toBeInTheDocument()


    });

})