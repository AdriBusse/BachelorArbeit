import { useLazyQuery } from '@apollo/client'
import React from 'react'
import client from '../../apollo-client'
import { GETALLSUBS } from '../../querys/getAllSubs'

const FetchQueryPerformance = () => {

    const [fetchSubQuery, { loading, error, data }] = useLazyQuery(GETALLSUBS, {
        context: {
            headers: {
                "X-CacheStrategy-sw": "stale-while-revalidate",
            }
        }
    })

    const fetchQuery = async () => {
        await fetchSubQuery()
    }




    return (
        <div className="flex flex-col p-1">
            <h1 className="text-center">Fetch Query with SubData:</h1>
            <div className="flex flex-row justify-center p-1 ">
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => {
                    fetchQuery();
                }}>Fetch</button>
            </div>
        </div>
    )
}

export default FetchQueryPerformance

