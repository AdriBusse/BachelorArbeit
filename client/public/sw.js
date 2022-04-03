
const QUERY_CACHE_KEY = 'GraphQLCache';
const HEADERKEY = "X-swCache-CacheStrategy";

function fromNetwork(request) {
    return fetch(request);
}

async function clearCache() {
    caches.keys().then(function (names) {
        for (let name of names)
            caches.delete(name);
    });
}
const isGraphQLRequest = request => {
    return (request.url.indexOf("/graphql") > -1);
};
const isGraphQLGetRequest = request => {
    return (request.method === "GET");
};

const includeCacheHeader = response => {
    return response.headers.get("Cache-Control") && response.headers.get("Cache-Control").indexOf("max-age=") !== -1
};
const includeNoCacheHeader = response => {
    return response.headers.get("Cache-Control") && response.headers.get("Cache-Control").includes("no-cache")
};

const isNetworkOnly = response => {
    return response.headers.get(HEADERKEY) && response.headers.get(HEADERKEY).includes("network-only");
};

const includeNoStoreHeader = response => {
    return response.headers.get("Cache-Control") && response.headers.get("Cache-Control").includes("no-store")
};
async function getMaxAgeTime(response) {
    try {
        const time = parseInt(response.headers.get("Cache-Control").split("max-age=")[1].split(",")[0], 10);
        return time;
    } catch (error) {
        console.log(error);
        return 0
    }
}
async function getCache(request) {
    const cache = await caches.open(QUERY_CACHE_KEY);
    const matching = await cache.match(request);

    return matching;
}
async function setCache(request, response) {
    if (response && !includeNoCacheHeader(response) && includeCacheHeader(response)) {
        const cache = await caches.open(QUERY_CACHE_KEY);
        //cacheable with max age value
        await cache.put(request, response);
        setTimer(request, await getMaxAgeTime(response));
        return 1
    }
}

async function setTimer(request, time) {
    console.log(time);
    setTimeout(async () => {
        const cache = await caches.open(QUERY_CACHE_KEY);
        await cache.delete(request)
        console.log("delete entry for " + request);
    }, time * 1000)
}

async function handleNetworkOnly(event) {
    console.log("Strategy: Network Only");
    event.respondWith((async () => {
        const res = await fromNetwork(event.request)

        return res
    })());
}
async function handleStaleWhileRevalidate(event) {
    console.log("Strategy: Stale While Revalidate");
    const cacheId = event.request.clone().url;

    let res = fromNetwork(event.request);
    const cached = getCache(cacheId);

    event.respondWith((async () => {

        const cachedResponse = await cached
        if (cachedResponse) {
            console.log("Request is in cache for " + cacheId);
            return cachedResponse;
        }
        console.log("not in Cache");

        await res

        return res

    })());
    event.waitUntil((async () => {
        // der code läuft nachdem responseWith gelaufen ist
        const newRes = await res
        try {
            if (newRes) {
                await setCache(event.request.url, newRes.clone());
            }
        } catch (error) {
            console.log(error);
        }
    })());
}
async function handleCacheFirst(event) {
    console.log("Strategy: Cache First");
    const cacheId = event.request.clone().url;
    event.respondWith((async () => {
        const cachedResponse = await getCache(cacheId);
        if (cachedResponse) {
            console.log("Request is in cache for " + cacheId);
            return cachedResponse;
        } else {
            console.log("not in Cache");
            const networkResponse = fromNetwork(event.request);

            const res = await networkResponse.then(res => res.clone());

            await setCache(event.request.url, res.clone());

            return res
        }


    })());
}

async function handleCacheOnly(event) {
    console.log("Strategy: Cache Only");
    const cacheId = event.request.clone().url;
    event.respondWith((async () => {
        const cachedResponse = await getCache(cacheId)
        if (cachedResponse) {
            console.log("Request is in cache for " + cacheId);
            cachedResponse.headers.set("usedCacheStrategy", "Cache-only");
            return cachedResponse
        } else {
            console.log("not in Cache");
            var init = { "status": 404, "statusText": "Request is not in Cache", "headers": { "usedCacheStrategy": "Cache-only" } };
            return new Response(null, init);
        }
    })());
}

const handleGraphQL = async (event) => {
    //console.log("GraphQL request");
    switch (event.request.clone().headers.get(HEADERKEY)) {
        case "network-only":
            // Request bearbeiten mit Network Only Strategie
            handleNetworkOnly(event);
            break;
        case "stale-while-revalidate":
            // Request bearbeiten mit Network First Strategie
            handleStaleWhileRevalidate(event);
            break;

        case "cache-first":
            // Request bearbeiten mit Cache First Strategie
            handleCacheFirst(event);
            break;

        case "cache-only":
            // Request bearbeiten mit Cache Only Strategie
            handleCacheOnly(event);
            break;
        case "error":
            // Error simulieren
            console.error("simulating a Error in SW")
            new Error("simulating Error in SW");
            break;


        default:
            // Request bearbeiten mit Network only Strategie
            handleNetworkOnly(event);
            break;

    }
}

try {

    // The install handler takes care of precaching the resources we always need.
    self.addEventListener("install", (event) => {
        console.log("installing sw");
        // Cache bereinigen wenn SW gestartet wird
        clearCache()
    });
    // The activate handler takes care of cleaning up old caches.
    self.addEventListener("activate", (event) => {
        console.log("activate sw");
    });


    self.addEventListener("fetch", (event) => {
        // filtert nicht GraphQL Requests und Requests die no-cache enthalten
        if (isGraphQLRequest(event.request.clone()) && isGraphQLGetRequest(event.request.clone()) && !includeNoCacheHeader(event.request.clone()) && !includeNoStoreHeader(event.request.clone())) {
            handleGraphQL(event);
        }


    });
} catch (e) {
    console.log(e);
}