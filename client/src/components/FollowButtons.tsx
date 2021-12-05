import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { useAuthDispatch, useAuthState } from "../context/auth";
import { GETSUB } from "../querys/getSub";
import { FOLLOWSUB } from "../querys/mutations/followSub";
import { Sub } from "../types";
import { DEFOLLOWSUB } from "../querys/mutations/defollowSub"
import { ME } from "../querys/meQuery";

export default function FollowButtons({ sub }: { sub: Sub }) {

    const { authenticated } = useAuthState();
    const dispatch = useAuthDispatch();

    const router = useRouter();

    const [subscribe] = useMutation(FOLLOWSUB, { refetchQueries: [GETSUB, ME] })
    const [unSubscribe] = useMutation(DEFOLLOWSUB, { refetchQueries: [GETSUB, ME] })

    const handleFollow = async () => {
        if (!authenticated) {
            router.push('/login');
            return
        }
        try {
            await subscribe({ variables: { name: sub.name } })
            // await fetchME()
            router.reload()
        } catch (error) {
            console.log(error);

        }

    }
    const handleUnFollow = async () => {
        if (!authenticated) {
            router.push('/login');
            return
        }
        try {
            await unSubscribe({ variables: { name: sub.name } })
            // await fetchME()
            router.reload()
        } catch (error) {
            console.log(error);

        }

    }
    if (sub.userFollows) {
        return (
            <a onClick={handleUnFollow} className="w-full py-1 mb-2 text-sm cursor-pointer blue button">Unsubscribe</a>
        );
    } else {
        return (
            <a onClick={handleFollow} className="w-full py-1 mb-2 text-sm cursor-pointer blue button">Subscribe</a>
        );
    }

}
