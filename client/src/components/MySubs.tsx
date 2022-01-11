import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { useAuthState } from '../context/auth';
import { Sub } from '../types';
import { useQuery } from '@apollo/client';
import { MESUBS } from '../querys/getUserFollowedSubs';

const MySubs = () => {
    const { authenticated, user } = useAuthState();
    let { loading, data: subs, error } = useQuery(MESUBS, { variables: { username: user.username }, skip: !user });
    console.log(subs);

    return (
        <div className="hidden mt-2 ml-6 w-80 lg:block">
            <div className="bg-white rounded">
                <div className="p-4 bg-red-200 border-b-2">
                    <p className="text-lg font-semibold text-center">
                        My Communities
                    </p>
                </div>
                <div>
                    {user && subs && subs.getUser.followedSubs.map((sub: Sub, i) => {
                        if (i > 5) { return null }

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
                <div className="p-4 border-t-2">
                    <Link prefetch={false} href={`/u/${user.username}/subs`}>
                        <a href="" className="w-full px-1 py-1 blue button">
                            View all my Comunities
                        </a>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default MySubs