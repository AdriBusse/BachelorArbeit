import { useMutation } from '@apollo/client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { LOGIN } from '../querys/mutations/login';

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const [loginMutation, { loading, data, error }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            dispatch('LOGIN', data.login);
            router.back();

        }

    })
    const dispatch = useAuthDispatch();

    const { authenticated } = useAuthState();
    const router = useRouter();

    if (authenticated) {
        router.push('/');
    }
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        try {
            loginMutation({
                variables: {
                    username, password
                }

            })



        } catch (error) {
            console.log(error);
            setErrors(error);
        }
    };

    return (
        <div className="flex bg-white">
            <Head>
                <title>Login</title>
            </Head>
            <div
                className="w-40 h-screen "
                style={{ backgroundImage: 'url("/images/mosaik.png")' }}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium">Login</h1>
                    <p className="mb-10 text-xs">
                        By continuing, you agree to our User Agreement and Privacy Police
                    </p>
                    <form onSubmit={submitForm}>
                        <InputGroup
                            className="mb-2"
                            value={username}
                            setValue={setUsername}
                            placeholder="Username"
                            error={errors.username}
                            type="text"
                        ></InputGroup>
                        <InputGroup
                            className="mb-4"
                            value={password}
                            setValue={setPassword}
                            placeholder="Password"
                            error={errors.password}
                            type="password"
                        ></InputGroup>

                        <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
                            Login
                        </button>
                    </form>
                    <small>
                        Allready a RedditorNew to Reddit?{' '}
                        <Link prefetch={false} href="/register">
                            <a className="ml-1 text-blue-500 uppercase">SignUp</a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent