import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';
import { useAuthState } from '../context/auth';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../querys/mutations/register';
import client from '../apollo-client';
import { GETPOSTS } from '../querys/getPosts';

export default function TestRunner() {


    useEffect(() => {
        const res = client.readQuery({
            query: GETPOSTS
        })
        console.log(res);

    })





    return (
        <div className="flex bg-white">
            <Head>
                <title>TestRunner</title>
            </Head>
            Testrunner
        </div>
    );
}
