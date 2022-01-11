import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import CacheControlls from '../components/TestingComponents/CacheControlls';
import PerformanceTestButton from '../components/PerformanceTestButton';
import FetchQueryPerformance from '../components/TestingComponents/FetchQueryPerformance';
import PerformanceControlls from '../components/TestingComponents/PerformanceControlls';
import PerformanceTest from '../components/TestingComponents/PerformanceTest';

export default function TestRunner() {


    return (
        <div className="bg-white ">
            <Head>
                <title>TestRunner</title>
            </Head>
            <div className="container flex flex-col justify-center">
                <h1 className="mb-3 text-2xl text-center">Test Environment</h1>
                <CacheControlls />
                <PerformanceControlls />
                <FetchQueryPerformance />
                <PerformanceTest n={100} query={undefined} client={undefined} />
            </div>
        </div>
    );
}
