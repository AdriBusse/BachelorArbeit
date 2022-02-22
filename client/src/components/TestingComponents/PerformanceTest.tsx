import { ApolloClient, DocumentNode, NormalizedCacheObject, useLazyQuery } from '@apollo/client'
import React, { useState } from 'react'
// import client from '../../apollo-client'
import FileSaver from 'file-saver'
import PropTypes from 'prop-types';

interface Props {
    n: number;
    query: DocumentNode,
    title: string,
    fileName: string,
    withCache: boolean,
    variables?: any,
    client: ApolloClient<NormalizedCacheObject>
}
const PerformanceTest = ({ client, n, query, title, fileName, withCache, variables }: Props) => {
    const [canDownload, setCanDownload] = useState(false)

    function Sleep(milliseconds: number) {
        console.log("in sleep");
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    const download = async () => {
        const data = JSON.stringify(performance.getEntriesByType("measure"))
        const blob = new Blob([data], { type: "application/json" });
        FileSaver.saveAs(blob, fileName);
        performance.clearMarks();
    }

    const fetchQuery = async () => {
        setCanDownload(false)
        console.log("Start Performancetest");
        performance.clearMeasures()
        performance.mark("startPerformanceTest")

        for (let i = 0; i < n; i++) {

            const marker1 = performance.mark("start")
            await client.query({
                query, fetchPolicy: withCache ? "cache-first" : "no-cache", variables, context: {
                    headers: {
                        "X-swCache-CacheStrategy": "cache-first",
                    }
                }
            }).then(data => {
                console.log(data);
            })
            performance.mark("finnish")
            performance.measure(`Request Nr: ${i}`, "start", "finnish")
            performance.clearMarks("start")
            performance.clearMarks("finnish")
        }
        performance.mark("finnishPerformanceTest")
        performance.measure("Time for Performancetest", "startPerformanceTest", "finnishPerformanceTest")
        console.log(performance.getEntriesByType("measure"));
        setCanDownload(true)

    }

    return (
        <div className="flex flex-col p-1">
            <h1 className="text-center">{title}:</h1>
            <div className="flex flex-row justify-center p-1 ">
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => fetchQuery()}>Start</button>
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" disabled={!canDownload} onClick={() => download()}>Download JSOn</button>
            </div>
        </div>
    )
}

PerformanceTest.propTypes = {
    n: PropTypes.number.isRequired,
    query: PropTypes.object.isRequired,
    title: PropTypes.string,
    fileName: PropTypes.string,
    withCache: PropTypes.bool,
    variables: PropTypes.object,
    client: PropTypes.object.isRequired
}
PerformanceTest.defaultProps = {
    title: "Performance Test",
    fileName: "Performancetest.json",
    withCache: false,
    variables: {}
}
export default PerformanceTest

