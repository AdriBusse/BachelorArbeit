import dayjs from 'dayjs';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react'
import { useAuthState } from '../../../../context/auth';
import { Sub } from '../../../../types';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GETUSER } from '../../../../querys/getUser';
import { MESUBS } from '../../../../querys/getUserFollowedSubs';

interface Props {
    username: string;
}

const UserSubs = ({ username }: Props) => {
    const { authenticated, user } = useAuthState();
    let { loading, data, error } = useQuery(MESUBS, { variables: { username }, skip: !username });

    return (
        <div>

            <Head>
                <title>{'Followed Subs'}</title>
            </Head>
            {data && user && (

                <div className="container flex pt-5">
                    <div className="w-160">
                        {data.getUser.followedSubs.map((sub: Sub) => {
                            return (
                                <div
                                    key={sub.name}
                                    className="flex items-center px-4 py-2 text-xs border-b"
                                >
                                    <Link prefetch={false} href={`/r/${sub.name}`}>
                                        <a className=" hover:cursor-pointer">
                                            <Image
                                                className="overflow-hidden rounded-full "
                                                src={sub.imageUrl}
                                                alt="Sub"
                                                width={(7 * 16) / 4}
                                                height={(7 * 16) / 4}
                                            />
                                        </a>
                                    </Link>

                                    <Link prefetch={false} href={`/r/${sub.name}`}>
                                        <a className="ml-1 font-bold hover:cursor-pointer">
                                            /r/{sub.name}
                                        </a>
                                    </Link>
                                    <p className="ml-auto font-med">{sub.postCount}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="ml-6 w-80">
                        <div className="bg-white rounded ">
                            <div className="p-3 bg-blue-500 rounded-t ">
                                <img
                                    src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                    alt="user Profile"
                                    className="w-16 h-16 mx-auto border-2 rounded-full"
                                />
                            </div>
                            <div className="p-2 text-center">
                                <h1 className="mb-1 text-xl ">{user.username}</h1>
                                <hr />
                                <p className="mt-3">
                                    Joined {dayjs(user.createdAt).format('MMM YYYY')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default UserSubs