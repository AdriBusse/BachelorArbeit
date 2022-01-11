import { NextRouter } from "next/router";

export function createMockRouter(router: Partial<NextRouter>): NextRouter {
    return {
        basePath: "",
        pathname: "/",
        route: "/",
        query: {},
        asPath: "/",
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: (jest.fn()),
        events: {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn()
        },
        isFallback: false,
        isLocaleDomain: false,
        defaultLocale: "en",
        domainLocales: [],
        isReady: true,
        isPreview: false,
        reload: jest.fn(),
        back: jest.fn(),
        beforePopState: jest.fn(),
        ...router,

    }
}