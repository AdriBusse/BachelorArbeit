import { useRouter } from 'next/router';
import React from 'react';
import UserSubs from '../../../pageComponents/r/u/[username]/UserSubs';

export default function user() {
    const router = useRouter();
    const { username } = router.query;
    return (
        <div>
            <UserSubs username={String(username)} />
        </div>
    );
}
