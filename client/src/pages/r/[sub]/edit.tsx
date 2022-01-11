import { useRouter } from 'next/router';
import React from 'react'
import EditSub from '../../../pageComponents/r/[sub]/[identifier]/EditSub';

const edit = () => {
    //utils
    const router = useRouter();
    const { sub: subName } = router.query;
    if (subName) {
        return <EditSub subName={String(subName)} />
    } else {
        return <div>Loading...</div>
    }
    return (
        <div>

        </div>
    )
}

export default edit