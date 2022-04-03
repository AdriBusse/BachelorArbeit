import axios, { Axios } from 'axios';
import Head from 'next/head';
import { useEffect } from 'react';
import CacheControlls from '../components/TestingComponents/CacheControls';
import FetchQueryPerformance from '../components/TestingComponents/FetchQueryPerformance';
import PerformanceControlls from '../components/TestingComponents/PerformanceControls';
import PerformanceTest from '../components/TestingComponents/PerformanceTest';
import mocha from "mocha"
import { expect } from "chai"
import client from '../apollo-client';
import { LISTQUERY } from '../querys/PerformanceTestQueries/ListQuery';
import { TESTQUERY } from '../querys/QueryClientCacheAnforderung/testquery';
import sinon from 'sinon';

export default function TestRunner() {
    useEffect(() => {
        mocha.setup("bdd")

        task1()
        task2()
        task3()
        task4()
        task5()
        task6()
        //mocha.checkLeaks();
        mocha.run();
        // @ts-ignore
        mocha.cleanReferencesAfterRun(false);

        document.getElementById("mocha-stats").style.marginTop = "100px"

    }, [])



    const task1 = () => {
        describe("Anforderung: Lose Kopplung des Cache an den Client:", function () {
            beforeEach(async () => {
                await unregisterSW()

            })
            afterEach(async () => {
                clearCache()
            })
            it("Als User soll die Anwendung problemlos verwendet werden können während der Cache aktiv ist.", async function () {
                await registerSW()
                let res = await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })
                expect(res.data).to.be.an("object")

                clearCache()
                res = null
                res = await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "no-cache",
                        }
                    }
                })
                expect(res.data).to.be.an("object")
            });

            it("Als User soll die Anwendung problemlos verwendet werden können während der Cache nicht aktiv ist. ", async function () {
                let res = await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })
                expect(res.data).to.be.an("object")

                clearCache()
                res = null
                res = await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "no-cache",
                        }
                    }
                })
                expect(res.data).to.be.an("object")
            });
            it("Für den User soll die Anwendung nicht durch Fehler im Cachevorgang beeinflusst werden. ", async function () {

                // window = { ...window, caches: null }
                const res = await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "error",
                        }
                    }
                })
                expect(res.data).to.be.an("object")
            });
        })


    }

    const task2 = () => {
        describe("Anforderung: GraphQL-Requests identifizieren:", function () {
            beforeEach(async () => {
                await unregisterSW()

            })
            afterEach(async () => {
                clearCache()
            })
            it("Als User möchte ich, dass GraphQL-Abfragen vom Cache berücksichtigt werden.", async function () {
                await registerSW()
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })
                const cacheentries = await (await caches.open("GraphQLCache")).keys()
                //wait until cache entry is invalid and deleted
                expect(cacheentries.length).to.be.greaterThan(0)
                clearCache()
            });

            it("Als User möchte ich, dass Abfragen, die keine GraphQL-Abfragen sind, nicht vom Cache berücksichtigt werden.", async function () {
                // kein GraphQL Request starten
                const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1")
                const cacheentries = await (await caches.open("GraphQLCache")).keys()
                expect(cacheentries.length).to.be.equal(0)
            });
        })
    }

    const task3 = () => {
        describe("Anforderung: Cachekey erstellen:", function () {
            beforeEach(async () => {
                await unregisterSW()

            })
            afterEach(async () => {
                clearCache()
            })
            it("Als Cacheentwickler möchte ich jedes Query-Request unter einem eindeutigen Cachekey im Cache wiederfinden. ", async function () {
                await registerSW()
                //send first request
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })

                await clearCache()

                const cachekey1 = await (await caches.open("GraphQLCache")).keys()
                //send the same request again
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })
                const cachekey2 = await (await caches.open("GraphQLCache")).keys()

                // each key should be the same
                // eql for deeply equal(same values)
                expect(cachekey1).to.be.eql(cachekey2)
            });
        })
    }

    const task4 = () => {
        describe("Anforderung: Cache invalidieren:", function () {
            beforeEach(async () => {
                await unregisterSW()

            })
            afterEach(async () => {
                clearCache()
            })
            it("Als User möchte ich keine Daten aus dem Cache erhalten die nicht mehr „frisch“ sind.", async function (done) {
                await registerSW()



            });
        })
    }

    const task5 = () => {
        describe("Anforderung: Nicht Cachebare Requests/Responses identifizieren:", function () {
            beforeEach(async () => {
                await unregisterSW()

            })
            afterEach(async () => {
                clearCache()
            })
            it("Als Cacheentwickler soll der Cache nicht cachebare Requests/Responses entsprechend berücksichtigen. (ohne Cache Strategie)", async function () {
                await registerSW()
                //cache-control header besagt, dass das Request nicht gecached werden soll
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "Cache-Control": "no-store",
                        }
                    }
                })
                const cacheentries = await (await caches.open("GraphQLCache")).keys()
                expect(cacheentries.length).to.be.equal(0)
            });
            it("Als Cacheentwickler soll der Cache nicht cachebare Requests/Responses entsprechend berücksichtigen.(test Cache-Control no-store)", async function () {
                await registerSW()
                //cache-control header besagt, dass das Request nicht gecached werden soll
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "Cache-Control": "no-store",
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })
                const cacheentries = await (await caches.open("GraphQLCache")).keys()
                expect(cacheentries.length).to.be.equal(0)
            });
            it("Als Cacheentwickler soll der Cache nicht cachebare Requests/Responses entsprechend berücksichtigen. (test Cache-Control no-store)", async function () {
                await registerSW()
                //cache-control header besagt, dass das Request nicht gecached werden soll
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "Cache-Control": "no-store",
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })

                const cacheentries = await (await caches.open("GraphQLCache")).keys()
                expect(cacheentries.length).to.be.equal(0)
            });
        })

    }

    const task6 = () => {
        describe("Anforderung: Cache Strategien:", function () {
            beforeEach(async () => {
                await unregisterSW()

            })
            afterEach(async () => {
                clearCache()
            })
            it("Als User möchte ich Requests markieren, damit sie den Cache verwenden.", async function () {
                await registerSW()
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "cache-first",
                        }
                    }
                })
                const cacheentries = await (await caches.open("GraphQLCache")).keys()
                expect(cacheentries.length).to.be.equal(1)
            });

            it("Als User möchte ich Requests markieren. Damit sie den Cache nicht verwenden.", async function () {
                await registerSW()
                await client.query({
                    query: TESTQUERY,
                    fetchPolicy: "no-cache",
                    context: {
                        headers: {
                            "X-swCache-CacheStrategy": "network-only",
                        }
                    }
                })
                const cacheentries = await (await caches.open("GraphQLCache")).keys()
                expect(cacheentries.length).to.be.equal(0)
            });
        })
    }

    function Sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    async function clearCache() {
        caches.keys().then(function (names) {
            for (let name of names)
                caches.delete(name);
        });
    }
    const unregisterSW = async () => {
        const registrations = await navigator.serviceWorker.getRegistrations();

        const unregisterPromises = registrations.map((registration) => {
            return registration.unregister().then((bool) => { console.log(bool) });
        });

        return await Promise.all(unregisterPromises);
    }
    const registerSW = () => {
        return navigator.serviceWorker.register('/sw.js')
    }
    const __waitForSWState = (registration, desiredState) => {
        return new Promise((resolve, reject) => {
            let serviceWorker = registration.installing;

            if (!serviceWorker) {
                return reject(new Error('The service worker is not installing. ' +
                    'Is the test environment clean?'));
            }

            const stateListener = (evt) => {
                if (evt.target.state === desiredState) {
                    serviceWorker.removeEventListener('statechange', stateListener);
                    return resolve("Service worker is in state " + desiredState);
                }

                if (evt.target.state === 'redundant') {
                    serviceWorker.removeEventListener('statechange', stateListener);

                    return reject(new Error('Installing service worker became redundant'));
                }
            };

            serviceWorker.addEventListener('statechange', stateListener);
        });
    }
    return (
        <div className="bg-white ">
            <Head>
                <title>Test Runner</title>
                <link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />
            </Head>
            <div className="container flex flex-col justify-center">
                <h1 className="mb-3 text-2xl text-center">Test Environment</h1>
                <h1 className="mb-3 text-xl text-center">Service Worker Abnahme Kriterien</h1>
                <button onClick={() => window.location.reload()} className="w-20 ml-10 button blue">Restart tests</button>


                <div id="mocha"></div>
            </div>
        </div>
    );
}
