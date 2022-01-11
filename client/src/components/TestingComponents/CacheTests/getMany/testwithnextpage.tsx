/**
 * @jest-environment jsdom
 */
import { getPage } from 'next-page-tester';
import { MockedProvider } from '@apollo/client/testing';
import { screen } from '@testing-library/react';
import { waitForResponse } from '../../../../utils/testUtils/waiting';

describe('use @apollo/client', () => {
    test('as a user I can combine "@apollo/client" and "next-page-tester"', async () => {
        const { render } = await getPage({
            nextRoot: __dirname,
            route: '/r/Streetfood/URDck2G/hottes_tacos_in_mexico',
            wrappers: "../../../../utils/testUtils/wrapper/testNextWrapper.tsx",

        });
        render();
        await waitForResponse()


        await screen.findByText('Hottes Tacos in Mexico');
    });
});