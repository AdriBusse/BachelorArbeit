import { useRouter } from 'next/router';
import React from 'react';
import SubPage from '../../pageComponents/r/[sub]/SubPage';


export default function sub() {
  //utils
  const router = useRouter();
  const { sub: subName } = router.query;

  if (subName) {
    return <SubPage subName={String(subName)} />
  } else {
    return <div>Loading...</div>
  }

}
