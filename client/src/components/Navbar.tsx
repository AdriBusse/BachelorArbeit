import Link from 'next/link';
import { useAuthDispatch, useAuthState } from '../context/auth';
import React, { Fragment, useEffect, useState } from 'react';
import { Sub } from '../types';
import Image from 'next/image';
import router from 'next/router';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { LOGOUT } from '../querys/mutations/logout'
import { SEARCHSUBS } from '../querys/searchSub';
import RedditLogo from '../../public/reddit.svg'

export const Navbar: React.FC = () => {
    const [name, setName] = useState('');
    const [subs, setSubs] = useState<Sub[]>([]);
    const [timer, setTimer] = useState(null);
    const { authenticated, loading, user } = useAuthState();
    const dispatch = useAuthDispatch();

    //data = {data,loading, error}
    const [logoutMutation, logoutData] = useMutation(LOGOUT)
    const logout = () => {
        logoutMutation().then(() => {
            dispatch('LOGOUT');
            window.location.reload();
        }).catch((err) => console.log(err));

    };

    useEffect(() => {
        if (name.trim() === '') {
            setSubs([]);
            return;
        }
        searchSubs();
    }, [name]);

    const [searchQuery, { data, error }] = useLazyQuery(SEARCHSUBS, {
        variables: { name }, onCompleted: (data) => {
            setSubs(data.searchSub);
            console.log("search...", data.searchSub);

        }
    })
    const searchSubs = async () => {
        clearTimeout(timer);
        setTimer(
            setTimeout(async () => {
                try {
                    searchQuery()
                } catch (error) {
                    console.log(error);
                }
            }, 300)
        );
    };

    const goToSub = (subName: string) => {
        router.push(`/r/${subName}`);
        setName('');
    };

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-2 bg-white">
            <div className="flex items-center ">
                <Link href="/">
                    <a>
                        <Image src={RedditLogo} height={32} width={32} className="w-8 h-8 mr-2" />
                    </a>
                </Link>
                <span className="hidden text-2xl font-semibold lg:block">
                    <Link href="/">RedditClone</Link>
                </span>
            </div>
            <div className="max-w-full px-4 w-160">
                <div className="relative flex items-center border rounded bg-grey-100 hover:bg-white hover:border-blue-500">
                    <i className="pl-4 pr-3 fas fa-search text-grey-500"></i>
                    <input
                        type="text"
                        placeholder="Search"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="py-1 pr-3 bg-transparent rounded focus:outline-none"
                    ></input>
                    <div
                        className="absolute left-0 right-0 bg-white"
                        style={{ top: '100%' }}
                    >
                        {subs?.map((sub) => (
                            <div
                                key={sub.name}
                                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                                onClick={() => goToSub(sub.name)}
                            >
                                <Image
                                    className="rounded-full"
                                    src={sub.imageUrl}
                                    alt="Sub"
                                    height={(8 * 16) / 4}
                                    width={(8 * 16) / 4}
                                />
                                <div className="ml-3 text-sm">
                                    <p className="font-medium">{sub.name}</p>
                                    <p className="text-gray-600">{sub.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex">
                {!loading &&
                    (authenticated ? (
                        //show logout Buttons
                        <Fragment>
                            <button
                                onClick={() => logout()}
                                className="hidden w-20 py-1 m-2 mr-4 leading-4 md:block lg:w-32 hollow blue button"
                            >
                                Logout
                            </button>
                            <Link href={`/u/${user.username}`}>
                                <a className="flex flex-col items-center mt-1 hover:cursor-pointer">
                                    <Image
                                        className="overflow-hidden rounded-full "
                                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                        alt="User"
                                        width={26}
                                        height={26}
                                    />
                                    <p className="text-xs text-gray-500">Login as {user.username}</p>
                                </a>
                            </Link>
                        </Fragment>
                    ) : (
                        //show login Buttons
                        <Fragment>
                            <Link href="/login">
                                <a className="hidden w-20 py-1 mr-4 leading-4 md:block lg:w-32 hollow blue button">
                                    Login
                                </a>
                            </Link>
                            <Link href="/register">
                                <a className="hidden w-20 py-1 leading-4 md:block lg:w-32 blue button">
                                    Sign up
                                </a>
                            </Link>
                        </Fragment>
                    ))}
            </div>
        </div>
    );
};
