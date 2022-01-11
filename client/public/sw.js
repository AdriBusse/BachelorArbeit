const QUERY_CACHE_KEY = 'GraphQLCache';

function fromNetwork(request) {
    return fetch(request);
}
const isGraphQL = request => {
    return (request.url.indexOf("/graphql") > -1);
};
const isGraphQLGet = request => {
    return (request.method === "GET");
};
const isNotRestrictedQuery = request => {
    const exclude = [/=ME&/];
    console.log(request.url);
    return !exclude.some(r => r.test(request.url));
};

async function getCache(request) {
    const cache = await caches.open(QUERY_CACHE_KEY);
    const matching = await cache.match(request);

    return matching;
}
async function setCache(request, response) {
    const cache = await caches.open(QUERY_CACHE_KEY);
    await cache.put(request, response);
}

const handleGraphQL = async (event) => {
    const cacheId = event.request.clone().url;
    // const networkResponse = fromNetwork(event.request);
    event.respondWith((async () => {
        const cachedResponse = await getCache(cacheId);
        if (cachedResponse) {
            return cachedResponse;
        }
        const networkResponse = await fromNetwork(event.request);
        if (networkResponse) {
            await setCache(event.request.url, networkResponse.clone());
        }
        return networkResponse;
    })());
}

try {

    // The install handler takes care of precaching the resources we always need.
    self.addEventListener("install", (event) => {
        console.log("installing sw");

    });
    // The activate handler takes care of cleaning up old caches.
    self.addEventListener("activate", (event) => {
        console.log("activate sw");
    });


    // The fetch handler serves responses for same-      	origin resources from a cache.
    // If no response is found, it populates the runtime cache with the response
    // from the network before returning it to the page.
    self.addEventListener("fetch", (event) => {
        if (isGraphQL(event.request) && isGraphQLGet(event.request) && isNotRestrictedQuery(event.request)) {
            handleGraphQL(event);
        }


    });
} catch (e) {
    console.log(e);
}