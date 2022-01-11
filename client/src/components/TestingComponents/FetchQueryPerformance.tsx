import { useLazyQuery } from '@apollo/client'
import React from 'react'
import client from '../../apollo-client'
import { GETALLSUBS } from '../../querys/getAllSubs'

const FetchQueryPerformance = () => {

    const [subDataFetch, { loading, error, data }] = useLazyQuery(GETALLSUBS, {
        onCompleted: (data) => {
            console.log("click");


        }
    })
    const fetchQuery = async () => {
        console.log("fetch");
        const marker1 = performance.mark("start")
        await client.query({ query: GETALLSUBS, fetchPolicy: "cache-first" }).then(data => {
            console.log(data);
        })
        performance.mark("finnish")

        performance.mark("start1")
        await client.query({ query: GETALLSUBS, fetchPolicy: "cache-first" })
        performance.mark("finnish1")


        var measure = performance.measure("Time for Request with log at end", "start", "finnish")
        console.log(measure);
        var measure1 = performance.measure("Time for Request", "start1", "finnish1")
        console.log(measure1);
        console.log(performance.getEntriesByType("measure"));

    }

    return (
        <div className="flex flex-col p-1">
            <h1 className="text-center">Fetch Query with SubData:</h1>
            <div className="flex flex-row justify-center p-1 ">
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => fetchQuery()}>Fetch</button>
            </div>
        </div>
    )
}

export default FetchQueryPerformance

