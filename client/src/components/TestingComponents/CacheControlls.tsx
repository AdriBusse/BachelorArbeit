import { useApolloClient } from '@apollo/client';
import React, { useEffect } from 'react'
import client from '../../apollo-client';
import { GETTOPSUBS } from '../../querys/getTopSubs';
import { GETUSERCACHE } from '../../querys/testQueries/getUserCache';
import CacheData from "../../utils/testUtils/cacheData.json"


const CacheControlls = () => {

    useEffect(() => {
        const fetchQuery = async () => {
            return await client.query({ query: GETUSERCACHE, variables: { username: "JohnDoe" } }).then(data => {
                console.log(data);
            }).catch(err => {
                console.log(err);
            })
        }
        fetchQuery();

    }, [])
    const getCacheData = () => {
        console.log("click");

        // access through apollo client cache

        const serializedState = client.cache.extract();
        console.log(serializedState)
    }

    const seedCache = () => {
        console.log("click");
        client.restore(CacheData);
    }
    const clearCache = () => {
        console.log("clear");
        client.clearStore();
    }

    return (
        <div className="flex flex-col justify-center p-1 ">
            <h1 className="text-center">Cache Controlls:</h1>
            <div className="flex flex-row justify-center p-1 ">
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => getCacheData()}>Print Cache Data to Console</button>
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => seedCache()}>Seed Cache with data</button>
                <button className="py-1 mr-2 leading-4 md:block lg:w-32 blue button" onClick={() => clearCache()}>Clear Cache</button>
            </div>
        </div>
    )
}

export default CacheControlls